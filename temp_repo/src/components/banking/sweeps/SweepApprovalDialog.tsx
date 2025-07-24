
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, X, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SweepApprovalDialogProps {
  sweep: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const SweepApprovalDialog = ({ sweep, open, onOpenChange }: SweepApprovalDialogProps) => {
  const { toast } = useToast()
  const [approvalNotes, setApprovalNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!sweep) return null

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleApprove = async () => {
    setIsProcessing(true)
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast({
      title: "Sweep Approved",
      description: `Sweep ${sweep.id} has been approved and will be processed shortly.`,
    })
    
    setIsProcessing(false)
    onOpenChange(false)
    setApprovalNotes("")
  }

  const handleReject = async () => {
    setIsProcessing(true)
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast({
      title: "Sweep Rejected",
      description: `Sweep ${sweep.id} has been rejected.`,
      variant: "destructive"
    })
    
    setIsProcessing(false)
    onOpenChange(false)
    setApprovalNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-2xl border border-slate-200 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Approve Sweep Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sweep Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Sweep ID</label>
                <p className="text-lg font-bold text-slate-900 font-mono">{sweep.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Amount</label>
                <p className="text-lg font-bold text-slate-900 font-mono">
                  {formatCurrency(sweep.amount, sweep.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">From</label>
                <p className="text-sm font-medium text-slate-800">{sweep.sourceWallet}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">To</label>
                <p className="text-sm font-medium text-slate-800">{sweep.destinationWallet}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Balance Impact */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Balance Impact Preview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-800 mb-2">Source Wallet</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Current:</span>
                    <span className="font-bold font-mono text-red-900">
                      {formatCurrency(sweep.balanceBefore.source, sweep.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">After:</span>
                    <span className="font-bold font-mono text-red-900">
                      {formatCurrency(sweep.balanceAfter.source, sweep.currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">Destination Wallet</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Current:</span>
                    <span className="font-bold font-mono text-green-900">
                      {formatCurrency(sweep.balanceBefore.destination, sweep.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">After:</span>
                    <span className="font-bold font-mono text-green-900">
                      {formatCurrency(sweep.balanceAfter.destination, sweep.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reference */}
          <div>
            <label className="text-sm font-medium text-slate-600">Reference/Justification</label>
            <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-700">{sweep.reference}</p>
            </div>
          </div>

          {/* Approval Notes */}
          <div className="space-y-2">
            <Label htmlFor="approvalNotes" className="text-slate-700 font-medium">Approval Notes (Optional)</Label>
            <Textarea
              id="approvalNotes"
              placeholder="Add any notes about this approval decision..."
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              className="border-slate-300 text-slate-700 min-h-[100px]"
            />
          </div>

          {/* Warning */}
          <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Important</p>
              <p className="text-sm text-amber-700 mt-1">
                This action cannot be undone. The sweep will be executed immediately upon approval.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Reject"}
            </Button>
            <Button
              type="button"
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Approve & Execute"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
