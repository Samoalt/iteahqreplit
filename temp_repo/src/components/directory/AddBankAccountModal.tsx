
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"

interface AddBankAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entity: any
}

export const AddBankAccountModal = ({ open, onOpenChange, entity }: AddBankAccountModalProps) => {
  const [formData, setFormData] = useState({
    bankName: '',
    branch: '',
    accountName: entity?.name || '',
    accountNumber: '',
    currency: '',
    accountType: '',
    transactionTypes: [] as string[],
    isPrimary: false
  })

  const banks = [
    "Equity Bank Kenya",
    "KCB Bank",
    "Standard Chartered",
    "Cooperative Bank",
    "NCBA Bank",
    "Absa Bank",
    "Diamond Trust Bank"
  ]

  const currencies = [
    { value: 'KES', label: 'Kenyan Shilling (KES)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' }
  ]

  const accountTypes = [
    "Business Current",
    "Business Savings", 
    "Foreign Currency",
    "Call Account",
    "Fixed Deposit"
  ]

  const handleTransactionTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      transactionTypes: checked 
        ? [...prev.transactionTypes, type]
        : prev.transactionTypes.filter(t => t !== type)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.bankName || !formData.accountNumber || !formData.currency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    console.log('Adding bank account:', formData)
    
    toast({
      title: "Bank Account Added",
      description: `Successfully added ${formData.bankName} account for ${entity.name}`,
    })
    
    onOpenChange(false)
    setFormData({
      bankName: '',
      branch: '',
      accountName: entity?.name || '',
      accountNumber: '',
      currency: '',
      accountType: '',
      transactionTypes: [],
      isPrimary: false
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Bank Account for {entity?.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Select value={formData.bankName} onValueChange={(value) => setFormData(prev => ({ ...prev, bankName: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={formData.branch}
                onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                placeholder="Enter branch name"
              />
            </div>

            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                placeholder="Account holder name"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="Enter account number"
                required
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select value={formData.accountType} onValueChange={(value) => setFormData(prev => ({ ...prev, accountType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Transaction Types</Label>
              <div className="flex space-x-6 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="incoming"
                    checked={formData.transactionTypes.includes('Incoming')}
                    onCheckedChange={(checked) => handleTransactionTypeChange('Incoming', !!checked)}
                  />
                  <Label htmlFor="incoming">Incoming Payments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payout"
                    checked={formData.transactionTypes.includes('Payout')}
                    onCheckedChange={(checked) => handleTransactionTypeChange('Payout', !!checked)}
                  />
                  <Label htmlFor="payout">Payouts</Label>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrimary: !!checked }))}
                />
                <Label htmlFor="isPrimary">Set as primary account</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="elastic-button-primary">
              Add Bank Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
