
import { Bid } from "@/types/bid"

export interface WorkflowRule {
  id: string
  name: string
  condition: (bid: Bid) => boolean
  action: (bid: Bid) => Promise<void>
  priority: number
  enabled: boolean
}

export interface StatusTransition {
  from: Bid['status']
  to: Bid['status']
  requiredPermissions: string[]
  validationRules: ((bid: Bid) => { valid: boolean; message?: string })[]
  autoTriggers?: string[]
}

export const statusTransitions: StatusTransition[] = [
  {
    from: 'bid-intake',
    to: 'e-slip-sent',
    requiredPermissions: ['update_status'],
    validationRules: [
      (bid) => ({
        valid: !!bid.buyerName && !!bid.amount,
        message: 'Buyer name and amount are required'
      }),
      (bid) => ({
        valid: bid.amount > 0,
        message: 'Amount must be greater than zero'
      })
    ],
    autoTriggers: ['eslip_generated']
  },
  {
    from: 'e-slip-sent',
    to: 'payment-matching',
    requiredPermissions: ['update_status', 'review_payments'],
    validationRules: [
      (bid) => ({
        valid: !!bid.eSlipDetails?.status && bid.eSlipDetails.status === 'generated',
        message: 'E-slip must be generated first'
      })
    ],
    autoTriggers: ['payment_received']
  },
  {
    from: 'payment-matching',
    to: 'split-processing',
    requiredPermissions: ['update_status', 'approve_splits'],
    validationRules: [
      (bid) => ({
        valid: bid.paymentDetails?.status === 'paid',
        message: 'Payment must be fully received'
      })
    ]
  },
  {
    from: 'split-processing',
    to: 'payout-approval',
    requiredPermissions: ['update_status', 'approve_payouts'],
    validationRules: [
      (bid) => ({
        valid: !!bid.splitDetails?.beneficiaries?.length,
        message: 'Split beneficiaries must be defined'
      }),
      (bid) => ({
        valid: bid.splitDetails?.beneficiaries?.every(b => b.status === 'ready') || false,
        message: 'All split beneficiaries must be ready'
      })
    ]
  },
  {
    from: 'payout-approval',
    to: 'tea-release',
    requiredPermissions: ['final_approval'],
    validationRules: [
      (bid) => ({
        valid: bid.payoutDetails?.status === 'approved',
        message: 'Payout must be approved first'
      })
    ]
  }
]

export const validateStatusTransition = (
  bid: Bid, 
  newStatus: Bid['status'], 
  userPermissions: string[]
): { valid: boolean; message?: string } => {
  const transition = statusTransitions.find(
    t => t.from === bid.status && t.to === newStatus
  )

  if (!transition) {
    return { valid: false, message: 'Invalid status transition' }
  }

  // Check permissions
  const hasPermissions = transition.requiredPermissions.every(
    permission => userPermissions.includes(permission) || userPermissions.includes('*')
  )

  if (!hasPermissions) {
    return { valid: false, message: 'Insufficient permissions for this transition' }
  }

  // Check validation rules
  for (const rule of transition.validationRules) {
    const result = rule(bid)
    if (!result.valid) {
      return result
    }
  }

  return { valid: true }
}

export const getNextAllowedStatuses = (
  bid: Bid, 
  userPermissions: string[]
): Bid['status'][] => {
  return statusTransitions
    .filter(t => t.from === bid.status)
    .filter(t => t.requiredPermissions.every(
      permission => userPermissions.includes(permission) || userPermissions.includes('*')
    ))
    .map(t => t.to)
}

export const getWorkflowProgress = (status: Bid['status']): number => {
  const statusOrder: Bid['status'][] = [
    'bid-intake',
    'e-slip-sent',
    'payment-matching',
    'split-processing',
    'payout-approval',
    'tea-release'
  ]

  const currentIndex = statusOrder.indexOf(status)
  return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0
}

export const createWorkflowRule = (
  name: string,
  condition: (bid: Bid) => boolean,
  action: (bid: Bid) => Promise<void>,
  priority: number = 0
): WorkflowRule => {
  return {
    id: `rule-${Date.now()}`,
    name,
    condition,
    action,
    priority,
    enabled: true
  }
}

// Predefined workflow rules
export const defaultWorkflowRules: WorkflowRule[] = [
  createWorkflowRule(
    'Auto-generate E-slip on bid intake completion',
    (bid) => bid.status === 'bid-intake' && !!bid.buyerName && bid.amount > 0,
    async (bid) => {
      console.log('Auto-generating E-slip for bid:', bid.id)
      // This would trigger E-slip generation
    },
    1
  ),
  createWorkflowRule(
    'Auto-match payment on receipt',
    (bid) => bid.status === 'e-slip-sent' && 
             bid.paymentDetails?.receivedAmount === bid.paymentDetails?.expectedAmount,
    async (bid) => {
      console.log('Auto-matching payment for bid:', bid.id)
      // This would trigger payment matching
    },
    2
  ),
  createWorkflowRule(
    'Alert on overdue payment',
    (bid) => {
      const daysSinceESlip = bid.eSlipDetails?.generatedDate ? 
        (Date.now() - new Date(bid.eSlipDetails.generatedDate).getTime()) / (1000 * 60 * 60 * 24) : 0
      return bid.status === 'e-slip-sent' && daysSinceESlip > 7
    },
    async (bid) => {
      console.log('Payment overdue alert for bid:', bid.id)
      // This would send notifications
    },
    3
  )
]

export const executeWorkflowRules = async (bid: Bid, rules: WorkflowRule[] = defaultWorkflowRules) => {
  const applicableRules = rules
    .filter(rule => rule.enabled && rule.condition(bid))
    .sort((a, b) => b.priority - a.priority)

  for (const rule of applicableRules) {
    try {
      await rule.action(bid)
      console.log('Executed workflow rule:', rule.name, 'for bid:', bid.id)
    } catch (error) {
      console.error('Failed to execute workflow rule:', rule.name, error)
    }
  }
}
