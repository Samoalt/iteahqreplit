
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface WithdrawModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const WithdrawModal = ({ open, onOpenChange }: WithdrawModalProps) => {
  const [formData, setFormData] = useState({
    wallet: '',
    amount: '',
    destination: '',
    accountNumber: '',
    reference: ''
  })

  const wallets = [
    { id: 'kes', name: 'KES Wallet', balance: '2,450,000 KES' },
    { id: 'usd', name: 'USD Wallet', balance: '85,000 USD' },
    { id: 'eur', name: 'EUR Wallet', balance: '12,500 EUR' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.wallet || !formData.amount || !formData.destination) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    console.log('Withdrawing from wallet:', formData)
    
    toast({
      title: "Withdrawal Initiated",
      description: `Successfully initiated withdrawal of ${formData.amount} from ${formData.wallet}`,
    })
    
    onOpenChange(false)
    setFormData({ wallet: '', amount: '', destination: '', accountNumber: '', reference: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Withdraw Funds</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet" className="text-base font-medium text-slate-700">Select Wallet *</Label>
            <Select value={formData.wallet} onValueChange={(value) => setFormData(prev => ({ ...prev, wallet: value }))}>
              <SelectTrigger className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900">
                <SelectValue placeholder="Choose wallet to withdraw from" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 z-50">
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.name} className="text-slate-900 hover:bg-slate-50">
                    <div className="flex flex-col">
                      <span>{wallet.name}</span>
                      <span className="text-sm text-slate-500">{wallet.balance}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium text-slate-700">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter amount to withdraw"
              className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-base font-medium text-slate-700">Destination *</Label>
            <Select value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}>
              <SelectTrigger className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 z-50">
                <SelectItem value="bank-account" className="text-slate-900 hover:bg-slate-50">Bank Account</SelectItem>
                <SelectItem value="mobile-money" className="text-slate-900 hover:bg-slate-50">Mobile Money</SelectItem>
                <SelectItem value="check" className="text-slate-900 hover:bg-slate-50">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="text-base font-medium text-slate-700">Account Number</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="Destination account number"
              className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-base font-medium text-slate-700">Reference</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Withdrawal reference (optional)"
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
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Withdraw Funds
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
