
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface NewPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NewPaymentModal = ({ open, onOpenChange }: NewPaymentModalProps) => {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    type: '',
    reference: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.recipient || !formData.amount || !formData.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    console.log('Creating new payment:', formData)
    
    toast({
      title: "Payment Created",
      description: `Payment of $${formData.amount} to ${formData.recipient} has been queued for approval`,
    })
    
    onOpenChange(false)
    setFormData({ recipient: '', amount: '', type: '', reference: '', description: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Create New Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-base font-medium text-slate-700">Recipient *</Label>
            <Input
              id="recipient"
              value={formData.recipient}
              onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
              placeholder="Enter recipient name"
              className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium text-slate-700">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="text-base font-medium text-slate-700">Payment Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 z-50">
                <SelectItem value="bank_transfer" className="text-slate-900 hover:bg-slate-50">Bank Transfer</SelectItem>
                <SelectItem value="wire_transfer" className="text-slate-900 hover:bg-slate-50">Wire Transfer</SelectItem>
                <SelectItem value="ach" className="text-slate-900 hover:bg-slate-50">ACH</SelectItem>
                <SelectItem value="check" className="text-slate-900 hover:bg-slate-50">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-base font-medium text-slate-700">Reference</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Invoice or reference number"
              className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium text-slate-700">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Payment description"
              className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
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
              className="bg-elastic-navy-600 hover:bg-elastic-navy-700 text-white font-semibold"
            >
              Create Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
