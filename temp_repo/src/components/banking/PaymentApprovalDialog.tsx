import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle, Clock, XCircle, User, DollarSign, Calendar, FileText } from "lucide-react"

interface PaymentApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: any
  onApprove?: (paymentId: string, notes: string) => void
  onReject?: (paymentId: string, notes: string) => void
}

export const PaymentApprovalDialog = ({ open, onOpenChange, payment, onApprove, onReject }: PaymentApprovalDialogProps) => {
  const [approvalNotes, setApprovalNotes] = useState("")

  const handleApprove = () => {
    if (onApprove && payment) {
      onApprove(payment.id, approvalNotes)
    }
    onOpenChange(false)
  }

  const handleReject = () => {
    if (onReject && payment) {
      onReject(payment.id, approvalNotes)
    }
    onOpenChange(false)
  }

  if (!payment) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="info" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending Approval
          </Badge>
        )
      case 'approved':
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="error" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="draft">{status}</Badge>
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge variant="success">Low Risk</Badge>
      case 'medium':
        return <Badge variant="medium">Medium Risk</Badge>
      case 'high':
        return <Badge variant="warning">High Risk</Badge>
      default:
        return <Badge variant="draft">{risk}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold">Payment Approval</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <div>
            <Label>Payment ID</Label>
            <div className="font-mono text-sm text-blue-600">{payment.id}</div>
          </div>
          <div>
            <Label>Status</Label>
            {getStatusBadge(payment.status)}
          </div>
          <div>
            <Label>Amount</Label>
            <div className="font-mono text-xl font-semibold">${payment.amount.toLocaleString()}</div>
          </div>
          <div>
            <Label>Risk</Label>
            {getRiskBadge(payment.risk)}
          </div>
          <div>
            <Label>Account</Label>
            <div>{payment.account}</div>
          </div>
          <div>
            <Label>Date</Label>
            <div>{payment.date}</div>
          </div>
        </div>

        <Separator />

        <div className="py-4">
          <Label>Description</Label>
          <div>{payment.description}</div>
        </div>

        <Separator />

        <div className="py-4">
          <Label>Submitted By</Label>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-slate-500" />
            <span>{payment.submittedBy}</span>
          </div>
          <div className="text-sm text-slate-500">Submitted on {payment.submittedDate}</div>
        </div>

        <Separator />

        <div className="py-4">
          <Label>Attachments</Label>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>{payment.attachments.length} files</span>
          </div>
        </div>

        <Separator />

        <div className="py-4">
          <Label htmlFor="approval-notes">Approval Notes</Label>
          <Textarea
            id="approval-notes"
            placeholder="Add any notes for approval or rejection"
            className="mt-2"
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
          />
        </div>

        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove}>
            Approve
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleReject}>
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
