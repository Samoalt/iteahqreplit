
export interface PaymentInflow {
  id: string
  amount: number
  payer: string
  reference: string
  bankRef: string
  date: string
  status: 'matched' | 'unmatched' | 'pending'
}

export interface OutstandingBid {
  id: string
  buyer: string
  amount: number
  eslipRef: string
}

export const autoMatchPayments = (inflows: PaymentInflow[], bids: OutstandingBid[]) => {
  const matches: Array<{ inflowId: string; bidId: string; confidence: number }> = []
  
  inflows.forEach(inflow => {
    if (inflow.status !== 'unmatched') return
    
    bids.forEach(bid => {
      let confidence = 0
      
      // Exact amount match
      if (Math.abs(inflow.amount - bid.amount) < 0.01) confidence += 40
      
      // Payer name similarity
      if (inflow.payer.toLowerCase().includes(bid.buyer.toLowerCase()) || 
          bid.buyer.toLowerCase().includes(inflow.payer.toLowerCase())) {
        confidence += 30
      }
      
      // Reference match
      if (inflow.reference === bid.eslipRef || inflow.bankRef.includes(bid.eslipRef)) {
        confidence += 50
      }
      
      // Partial amount match (within 5%)
      const amountDiff = Math.abs(inflow.amount - bid.amount) / bid.amount
      if (amountDiff < 0.05) confidence += 20
      
      if (confidence >= 70) {
        matches.push({ inflowId: inflow.id, bidId: bid.id, confidence })
      }
    })
  })
  
  return matches.sort((a, b) => b.confidence - a.confidence)
}

export const manualMatch = (inflowId: string, reference: string) => {
  console.log(`Manually matching payment ${inflowId} with reference ${reference}`)
  return { success: true, message: `Payment ${inflowId} matched successfully` }
}
