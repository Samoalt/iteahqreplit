
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, DollarSign } from "lucide-react"

interface PaymentConfirmationModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (paymentData: PaymentConfirmationData) => void
  expectedAmount: number
  bidId: string
}

interface PaymentConfirmationData {
  receivedAmount: number
  paymentMethod: string
  referenceNumber: string
  receivedDate: string
  notes: string
}

export const PaymentConfirmationModal = ({ 
  isOpen, 
  onOpenChange, 
  onConfirm,
  expectedAmount,
  bidId
}: PaymentConfirmationModalProps) => {
  const [formData, setFormData] = useState<PaymentConfirmationData>({
    receivedAmount: expectedAmount,
    paymentMethod: "bank",
    referenceNumber: "",
    receivedDate: new Date().toISOString().split('T')[0],
    notes: ""
  })

  const handleConfirm = () => {
    onConfirm(formData)
    onOpenChange(false)
  }

  const paymentStatus = formData.receivedAmount >= expectedAmount ? 'paid' : 'partial'
  const remainingAmount = expectedAmount - formData.receivedAmount

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Mark Payment as Received
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Bid ID</span>
              <span className="font-medium">{bidId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Expected Amount</span>
              <span className="font-bold">${expectedAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Status</span>
              <Badge className={paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                {paymentStatus === 'paid' ? 'Fully Paid' : 'Partial Payment'}
              </Badge>
            </div>
          </div>

          {/* Amount Received */}
          <div>
            <Label htmlFor="receivedAmount">Amount Received</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="receivedAmount"
                type="number"
                value={formData.receivedAmount}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  receivedAmount: parseFloat(e.target.value) || 0 
                }))}
                className="pl-9"
                placeholder="0.00"
              />
            </div>
            {remainingAmount > 0 && (
              <p className="text-sm text-orange-600 mt-1">
                Remaining: ${remainingAmount.toLocaleString()}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="m-pesa">M-Pesa</SelectItem>
                <SelectItem value="wallet">Digital Wallet</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reference Number */}
          <div>
            <Label htmlFor="referenceNumber">Payment Reference Number</Label>
            <Input
              id="referenceNumber"
              value={formData.referenceNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
              placeholder="Enter reference number"
            />
          </div>

          {/* Received Date */}
          <div>
            <Label htmlFor="receivedDate">Received Date</Label>
            <Input
              id="receivedDate"
              type="date"
              value={formData.receivedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, receivedDate: e.target.value }))}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this payment..."
              className="min-h-[60px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleConfirm}
              disabled={!formData.receivedAmount || !formData.referenceNumber}
              className="flex-1"
            >
              Confirm Payment
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
