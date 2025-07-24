
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, Plus, Trash2 } from "lucide-react"

interface SplitBeneficiary {
  name: string
  accountNumber: string
  percentage?: number
  fixedAmount?: number
  status: 'ready' | 'adjusted' | 'error'
}

interface SplitEditModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (beneficiaries: SplitBeneficiary[]) => void
  totalAmount: number
  currentBeneficiaries: SplitBeneficiary[]
}

export const SplitEditModal = ({ 
  isOpen, 
  onOpenChange, 
  onSave,
  totalAmount,
  currentBeneficiaries
}: SplitEditModalProps) => {
  const [beneficiaries, setBeneficiaries] = useState<SplitBeneficiary[]>(currentBeneficiaries)

  const addBeneficiary = () => {
    setBeneficiaries(prev => [...prev, {
      name: "",
      accountNumber: "",
      percentage: 0,
      fixedAmount: 0,
      status: 'ready'
    }])
  }

  const removeBeneficiary = (index: number) => {
    setBeneficiaries(prev => prev.filter((_, i) => i !== index))
  }

  const updateBeneficiary = (index: number, field: keyof SplitBeneficiary, value: any) => {
    setBeneficiaries(prev => prev.map((beneficiary, i) => {
      if (i === index) {
        const updated = { ...beneficiary, [field]: value }
        
        // Auto-calculate based on percentage or fixed amount
        if (field === 'percentage') {
          updated.fixedAmount = (totalAmount * (value / 100))
        } else if (field === 'fixedAmount') {
          updated.percentage = (value / totalAmount) * 100
        }
        
        return updated
      }
      return beneficiary
    }))
  }

  const recalculateSplit = () => {
    const totalPercentage = beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0)
    if (totalPercentage !== 100) {
      // Auto-adjust percentages to sum to 100%
      setBeneficiaries(prev => prev.map(beneficiary => ({
        ...beneficiary,
        percentage: (beneficiary.percentage || 0) * (100 / totalPercentage),
        fixedAmount: totalAmount * ((beneficiary.percentage || 0) * (100 / totalPercentage) / 100)
      })))
    }
  }

  const totalAllocated = beneficiaries.reduce((sum, b) => sum + (b.fixedAmount || 0), 0)
  const isBalanced = Math.abs(totalAllocated - totalAmount) < 0.01

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Edit Split Structure
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount: ${totalAmount.toLocaleString()}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Allocated: ${totalAllocated.toLocaleString()}
                </span>
                <Badge className={isBalanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {isBalanced ? 'Balanced' : 'Unbalanced'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Beneficiaries Table */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-600 border-b pb-2">
              <div className="col-span-3">Beneficiary Name</div>
              <div className="col-span-3">Account Number</div>
              <div className="col-span-2">Percentage</div>
              <div className="col-span-2">Fixed Amount</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Actions</div>
            </div>
            
            {beneficiaries.map((beneficiary, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center p-3 border border-slate-200 rounded-lg">
                <div className="col-span-3">
                  <Input
                    value={beneficiary.name}
                    onChange={(e) => updateBeneficiary(index, 'name', e.target.value)}
                    placeholder="Beneficiary name"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    value={beneficiary.accountNumber}
                    onChange={(e) => updateBeneficiary(index, 'accountNumber', e.target.value)}
                    placeholder="Account number"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={beneficiary.percentage}
                    onChange={(e) => updateBeneficiary(index, 'percentage', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={beneficiary.fixedAmount}
                    onChange={(e) => updateBeneficiary(index, 'fixedAmount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="col-span-1">
                  <Badge variant="secondary">{beneficiary.status}</Badge>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBeneficiary(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Beneficiary */}
          <Button variant="outline" onClick={addBeneficiary} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Beneficiary
          </Button>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={recalculateSplit} variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Auto-Balance
            </Button>
            <div className="flex-1" />
            <Button
              onClick={() => onSave(beneficiaries)}
              disabled={!isBalanced || beneficiaries.some(b => !b.name || !b.accountNumber)}
            >
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
