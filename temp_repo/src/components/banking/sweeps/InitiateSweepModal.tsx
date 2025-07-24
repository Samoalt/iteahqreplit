
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InitiateSweepModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const InitiateSweepModal = ({ open, onOpenChange }: InitiateSweepModalProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    sourceWallet: "",
    destinationWallet: "",
    amount: "",
    reference: "",
    requiresApproval: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate sweep initiation
    toast({
      title: "Sweep Initiated",
      description: "Your sweep request has been submitted for processing.",
    })
    
    onOpenChange(false)
    setFormData({
      sourceWallet: "",
      destinationWallet: "",
      amount: "",
      reference: "",
      requiresApproval: true
    })
  }

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount)
    if (isNaN(num)) return ""
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-2xl border border-slate-200 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Initiate Manual Sweep
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Wallet Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceWallet" className="text-slate-700 font-medium">Source Wallet</Label>
              <Select value={formData.sourceWallet} onValueChange={(value) => setFormData(prev => ({ ...prev, sourceWallet: value }))}>
                <SelectTrigger className="border-slate-300 text-slate-700">
                  <SelectValue placeholder="Select source wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer-global">Buyer Wallet - Global Tea (KES 3,200,000)</SelectItem>
                  <SelectItem value="buyer-premium">Buyer Wallet - Premium Tea Co (KES 1,800,000)</SelectItem>
                  <SelectItem value="tax-holding">Tax Holding Wallet (KES 450,000)</SelectItem>
                  <SelectItem value="operations">Operations Wallet (KES 2,100,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationWallet" className="text-slate-700 font-medium">Destination Wallet</Label>
              <Select value={formData.destinationWallet} onValueChange={(value) => setFormData(prev => ({ ...prev, destinationWallet: value }))}>
                <SelectTrigger className="border-slate-300 text-slate-700">
                  <SelectValue placeholder="Select destination wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="holding-itea">Holding Wallet - ITEA Ltd</SelectItem>
                  <SelectItem value="kra-settlement">KRA Settlement Wallet</SelectItem>
                  <SelectItem value="operations">Operations Wallet</SelectItem>
                  <SelectItem value="reserve">Reserve Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Visual Flow */}
          {formData.sourceWallet && formData.destinationWallet && (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex-1 text-center">
                <p className="text-sm font-medium text-slate-600 mb-1">From</p>
                <p className="font-bold text-slate-900">
                  {formData.sourceWallet.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-slate-400 mx-4" />
              <div className="flex-1 text-center">
                <p className="text-sm font-medium text-slate-600 mb-1">To</p>
                <p className="font-bold text-slate-900">
                  {formData.destinationWallet.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-700 font-medium">Amount (KES)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="border-slate-300 text-slate-700 font-mono"
              />
              {formData.amount && (
                <div className="mt-2 text-sm text-slate-600">
                  Amount: <span className="font-bold font-mono text-slate-900">{formatCurrency(formData.amount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-slate-700 font-medium">Reference/Justification</Label>
            <Textarea
              id="reference"
              placeholder="Enter reference notes or justification for this sweep..."
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              className="border-slate-300 text-slate-700 min-h-[100px]"
            />
          </div>

          {/* Warning Notice */}
          <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Important Notice</p>
              <p className="text-sm text-amber-700 mt-1">
                This sweep will require approval before execution. Ensure all details are correct before submitting.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white"
              disabled={!formData.sourceWallet || !formData.destinationWallet || !formData.amount || !formData.reference}
            >
              Submit for Approval
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
