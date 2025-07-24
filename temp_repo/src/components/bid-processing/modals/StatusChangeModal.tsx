import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Bid } from "@/types/bid"
import { getNextAllowedStatuses } from "@/utils/workflowAutomation"

interface StatusChangeModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (newStatus: string, reason: string) => void
  currentStatus: string
  bidId: string
  allowedStatuses?: string[]
  loading?: boolean
}

const statusOptions = [
  { value: 'bid-intake', label: 'Bid Intake', icon: Clock },
  { value: 'e-slip-sent', label: 'E-Slip Sent', icon: CheckCircle },
  { value: 'payment-matching', label: 'Payment Matching', icon: Clock },
  { value: 'split-processing', label: 'Split Processing', icon: Clock },
  { value: 'payout-approval', label: 'Payout Approval', icon: AlertCircle },
  { value: 'tea-release', label: 'Tea Release', icon: CheckCircle }
]

export const StatusChangeModal = ({ 
  isOpen, 
  onOpenChange, 
  onStatusChange,
  currentStatus,
  bidId,
  allowedStatuses = [],
  loading = false
}: StatusChangeModalProps) => {
  const [newStatus, setNewStatus] = useState(currentStatus)
  const [reason, setReason] = useState("")

  const availableOptions = statusOptions.filter(option => 
    allowedStatuses.includes(option.value) || option.value === currentStatus
  )

  const handleSubmit = async () => {
    if (newStatus !== currentStatus && reason.trim()) {
      await onStatusChange(newStatus, reason)
      setReason("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Bid Status - {bidId}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentStatus">Current Status</Label>
            <div className="p-2 bg-slate-50 rounded-md text-sm font-medium text-slate-700">
              {statusOptions.find(s => s.value === currentStatus)?.label}
            </div>
          </div>

          <div>
            <Label htmlFor="newStatus">New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center space-x-2">
                      <status.icon className="w-4 h-4" />
                      <span>{status.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {allowedStatuses.length === 0 && (
              <p className="text-xs text-slate-500 mt-1">No status transitions available</p>
            )}
          </div>

          <div>
            <Label htmlFor="reason">Reason for Change</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for status change..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={newStatus === currentStatus || !reason.trim() || loading}
              className="flex-1"
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
