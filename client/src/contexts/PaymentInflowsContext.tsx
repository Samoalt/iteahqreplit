
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { toast } from '@/hooks/use-toast'

export interface PaymentInflow {
  id: string
  amount: number
  payer: string
  reference: string
  bankRef: string
  date: string
  status: 'matched' | 'unmatched' | 'pending'
}

interface Invoice {
  id: string
  buyer: string
  amount: number
  reference: string
  status: 'unpaid' | 'paid'
  dueDate: string
}

interface PaymentInflowsContextType {
  inflows: PaymentInflow[]
  updateInflowStatus: (inflowId: string, status: PaymentInflow['status']) => void
  matchPayment: (inflowId: string, invoice: Invoice) => void
  getInflowById: (id: string) => PaymentInflow | undefined
  getUnmatchedInflows: () => PaymentInflow[]
}

const PaymentInflowsContext = createContext<PaymentInflowsContextType | undefined>(undefined)

export const usePaymentInflows = () => {
  const context = useContext(PaymentInflowsContext)
  if (!context) {
    throw new Error('usePaymentInflows must be used within a PaymentInflowsProvider')
  }
  return context
}

interface PaymentInflowsProviderProps {
  children: ReactNode
}

export const PaymentInflowsProvider = ({ children }: PaymentInflowsProviderProps) => {
  const [inflows, setInflows] = useState<PaymentInflow[]>([
    { id: "INF001", amount: 45200, payer: "Global Tea Co.", date: "2024-01-15", status: "matched", reference: "ESL-2024-001", bankRef: "WIRE123456" },
    { id: "INF002", amount: 28950, payer: "Premium Buyers Ltd", date: "2024-01-15", status: "unmatched", reference: "PAY-789456", bankRef: "ACH987654" },
    { id: "INF003", amount: 67100, payer: "Tea Traders Inc.", date: "2024-01-14", status: "matched", reference: "ESL-2024-002", bankRef: "SWIFT456789" },
    { id: "INF004", amount: 19800, payer: "Export Partners", date: "2024-01-14", status: "pending", reference: "BANK-123456", bankRef: "CHK789123" },
    { id: "INF005", amount: 34500, payer: "Mountain Coffee Co.", date: "2024-01-14", status: "unmatched", reference: "", bankRef: "WIRE555444" },
  ])

  const updateInflowStatus = (inflowId: string, status: PaymentInflow['status']) => {
    setInflows(prev => prev.map(inflow => 
      inflow.id === inflowId ? { ...inflow, status } : inflow
    ))
  }

  const matchPayment = (inflowId: string, invoice: Invoice) => {
    setInflows(prev => prev.map(inflow => 
      inflow.id === inflowId 
        ? { ...inflow, status: 'matched' as const, reference: invoice.reference }
        : inflow
    ))
    
    toast({
      title: "Payment Matched Successfully",
      description: `Payment ${inflowId} matched with invoice ${invoice.reference}`,
    })
  }

  const getInflowById = (id: string) => {
    return inflows.find(inflow => inflow.id === id)
  }

  const getUnmatchedInflows = () => {
    return inflows.filter(inflow => inflow.status === 'unmatched')
  }

  const value = {
    inflows,
    updateInflowStatus,
    matchPayment,
    getInflowById,
    getUnmatchedInflows
  }

  return (
    <PaymentInflowsContext.Provider value={value}>
      {children}
    </PaymentInflowsContext.Provider>
  )
}
