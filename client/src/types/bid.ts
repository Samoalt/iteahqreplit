
export interface Bid {
  id: string
  buyerName: string
  amount: number
  factory: string
  status: 'bid-intake' | 'e-slip-sent' | 'payment-matching' | 'split-processing' | 'payout-approval' | 'tea-release'
  date: string
  lotId: string
  quantity: number
  grade: string
  pricePerKg: number
  broker?: string
  notes?: string
  
  // Enhanced Lot Details
  teaType?: string
  originFactory?: string
  packagingType?: string
  auctionDate?: string
  warehouseLocation?: string
  qualityDetails?: {
    moistureLevel?: string
    colorAroma?: string
    tastingNotes?: string
    inspectionReport?: string
  }
  
  // Payment Details
  paymentDetails?: {
    status: 'pending' | 'partial' | 'paid'
    expectedAmount: number
    receivedAmount: number
    paymentMethod?: 'bank' | 'm-pesa' | 'wallet'
    referenceNumber?: string
    receivedDate?: string
    proofOfPayment?: string[]
  }
  
  // E-Slip Details
  eSlipDetails?: {
    status: 'generated' | 'not-generated'
    generatedBy?: string
    generatedDate?: string
    pdfUrl?: string
    sentToBuyer?: boolean
    sentDate?: string
  }
  
  // Split Details
  splitDetails?: {
    beneficiaries: Array<{
      name: string
      accountNumber: string
      percentage?: number
      fixedAmount?: number
      status: 'ready' | 'adjusted' | 'error'
    }>
    splitPdfUrl?: string
    auditTrail?: Array<{
      action: string
      user: string
      date: string
    }>
  }
  
  // Payout Details
  payoutDetails?: {
    status: 'pending' | 'under-review' | 'approved' | 'rejected'
    reviewedBy?: string
    reviewedDate?: string
    approvedBy?: string
    approvedDate?: string
    payoutInstructionPdf?: string
    payoutSummaryExcel?: string
  }
  
  // Release Details
  releaseDetails?: {
    status: 'not-released' | 'released' | 'withheld'
    releaseDate?: string
    releasingOfficer?: string
    deliveryReference?: string
    notes?: string
    deliveryNote?: string
    buyerConfirmation?: string
  }
  
  // Documents
  documents?: Array<{
    id: string
    filename: string
    type: string
    uploadedBy: string
    uploadedDate: string
    url: string
    category: 'contract' | 'compliance' | 'certificate' | 'delivery' | 'payment' | 'other'
  }>
}

export interface StatusStat {
  stage: string
  count: number
  value: number
  status: string
  color: string
}
