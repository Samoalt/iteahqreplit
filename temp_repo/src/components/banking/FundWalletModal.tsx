
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface FundWalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const FundWalletModal = ({ open, onOpenChange }: FundWalletModalProps) => {
  const [formData, setFormData] = useState({
    wallet: '',
    amount: '',
    source: '',
    reference: ''
  })

  const wallets = [
    { id: 'kes', name: 'KES Wallet', balance: '2,450,000 KES' },
    { id: 'usd', name: 'USD Wallet', balance: '85,000 USD' },
    { id: 'eur', name: 'EUR Wallet', balance: '12,500 EUR' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.wallet || !formData.amount || !formData.source) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    console.log('Funding wallet:', formData)
    
    toast({
      title: "Wallet Funded",
      description: `Successfully initiated funding of ${formData.amount} to ${formData.wallet}`,
    })
    
    onOpenChange(false)
    setFormData({ wallet: '', amount: '', source: '', reference: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Fund Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet" className="text-base font-medium text-slate-700">Select Wallet *</Label>
            <Select value={formData.wallet} onValueChange={(value) => setFormData(prev => ({ ...prev, wallet: value }))}>
              <SelectTrigger className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900">
                <SelectValue placeholder="Choose wallet to fund" />
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
              placeholder="Enter amount to fund"
              className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="source" className="text-base font-medium text-slate-700">Funding Source *</Label>
            <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
              <SelectTrigger className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900">
                <SelectValue placeholder="Select funding source" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 z-50">
                <SelectItem value="bank-transfer" className="text-slate-900 hover:bg-slate-50">Bank Transfer</SelectItem>
                <SelectItem value="wire-transfer" className="text-slate-900 hover:bg-slate-50">Wire Transfer</SelectItem>
                <SelectItem value="check" className="text-slate-900 hover:bg-slate-50">Check Deposit</SelectItem>
                <SelectItem value="cash" className="text-slate-900 hover:bg-slate-50">Cash Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-base font-medium text-slate-700">Reference Number</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Transaction reference (optional)"
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
              Fund Wallet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
