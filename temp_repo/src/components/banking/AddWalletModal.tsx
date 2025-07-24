
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface AddWalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AddWalletModal = ({ open, onOpenChange }: AddWalletModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    currency: '',
    initialBalance: '',
    description: ''
  })

  const currencies = [
    { value: 'KES', label: 'Kenyan Shilling (KES)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.currency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    console.log('Adding new wallet:', formData)
    
    toast({
      title: "Wallet Added",
      description: `Successfully created ${formData.name} wallet`,
    })
    
    onOpenChange(false)
    setFormData({ name: '', currency: '', initialBalance: '', description: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Add New Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium text-slate-700">Wallet Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter wallet name"
              className="bg-white border-slate-300 focus:border-blue-500 text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-base font-medium text-slate-700">Currency *</Label>
            <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
              <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 text-slate-900">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 z-50">
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value} className="text-slate-900 hover:bg-slate-50">
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initialBalance" className="text-base font-medium text-slate-700">Initial Balance</Label>
            <Input
              id="initialBalance"
              type="number"
              value={formData.initialBalance}
              onChange={(e) => setFormData(prev => ({ ...prev, initialBalance: e.target.value }))}
              placeholder="Enter initial balance (optional)"
              className="bg-white border-slate-300 focus:border-blue-500 text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium text-slate-700">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Wallet description (optional)"
              className="bg-white border-slate-300 focus:border-blue-500 text-slate-900"
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Add Wallet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
