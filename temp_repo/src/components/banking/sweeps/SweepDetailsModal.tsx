
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, X, Download, ArrowRight } from "lucide-react"

interface SweepDetailsModalProps {
  sweep: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const SweepDetailsModal = ({ sweep, open, onOpenChange }: SweepDetailsModalProps) => {
  if (!sweep) return null

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    }
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-2xl border border-slate-200 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Sweep Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Sweep Reference</label>
              <p className="text-lg font-bold text-slate-900 font-mono">{sweep.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Status</label>
              <div className="mt-1">
                {getStatusBadge(sweep.status)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Date & Time</label>
              <p className="text-base font-medium text-slate-800 font-mono">
                {new Date(sweep.date).toLocaleDateString()} at {new Date(sweep.date).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Initiated By</label>
              <p className="text-base font-medium text-slate-800">{sweep.initiatedBy}</p>
            </div>
          </div>

          <Separator />

          {/* Wallet Information with Flow */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Wallet Transfer Details</h3>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Source Wallet */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Source Wallet</h4>
                <p className="text-sm font-medium text-slate-700 mb-3">{sweep.sourceWallet}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Before:</span>
                    <span className="text-sm font-bold font-mono text-slate-900">
                      {formatCurrency(sweep.balanceBefore.source, sweep.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">After:</span>
                    <span className="text-sm font-bold font-mono text-slate-900">
                      {formatCurrency(sweep.balanceAfter.source, sweep.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow and Amount */}
              <div className="flex flex-col items-center">
                <ArrowRight className="h-8 w-8 text-slate-400 mb-2" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 font-mono">
                    {formatCurrency(sweep.amount, sweep.currency)}
                  </p>
                  <p className="text-xs text-slate-500">Transfer Amount</p>
                </div>
              </div>

              {/* Destination Wallet */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Destination Wallet</h4>
                <p className="text-sm font-medium text-slate-700 mb-3">{sweep.destinationWallet}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Before:</span>
                    <span className="text-sm font-bold font-mono text-slate-900">
                      {formatCurrency(sweep.balanceBefore.destination, sweep.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">After:</span>
                    <span className="text-sm font-bold font-mono text-slate-900">
                      {formatCurrency(sweep.balanceAfter.destination, sweep.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reference Notes */}
          <div>
            <label className="text-sm font-medium text-slate-600">Justification/Reference Notes</label>
            <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-700">{sweep.reference}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4 mr-2" />
              Download Confirmation
            </Button>

            <div className="flex space-x-3">
              {sweep.status === 'pending' && (
                <>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                    <Check className="h-4 w-4 mr-2" />
                    Approve Sweep
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
