
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign } from "lucide-react"
import { Bid } from "@/types/bid"

interface FinancialSummaryProps {
  bid: Bid
}

export const FinancialSummary = ({ bid }: FinancialSummaryProps) => {
  // This component is now simplified as the main financial summary is in BidOverviewTab
  // This can be used in other contexts like the detail panel
  
  const unitPrice = bid.pricePerKg
  const totalKgs = bid.quantity * 50 // Assuming 50kg per package
  const subtotal = totalKgs * unitPrice

  const handleSimulateSplit = () => {
    console.log('Simulate split breakdown for bid:', bid.id)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Quick Financial Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600">Unit Price</span>
            <p className="font-medium text-slate-900">${unitPrice.toFixed(2)}/kg</p>
          </div>
          <div>
            <span className="text-slate-600">Total Kgs</span>
            <p className="font-medium text-slate-900">{totalKgs.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-slate-600">Subtotal</span>
            <p className="font-medium text-slate-900">${subtotal.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-slate-600">Total Amount</span>
            <p className="text-xl font-bold text-slate-900">${bid.amount.toLocaleString()}</p>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleSimulateSplit}>
          <Calculator className="w-4 h-4 mr-2" />
          View Detailed Breakdown
        </Button>
      </CardContent>
    </Card>
  )
}
