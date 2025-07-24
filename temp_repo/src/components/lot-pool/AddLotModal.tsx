
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface LotItem {
  id: string
  lotId: string
  factory: string
  grade: string
  weight: number
  quantity: number
  pricePerKg: number
  totalValue: number
  batchNo: string
  garden: string
  packingDate: string
  warehouse: string
  broker: string
  status: 'draft' | 'ready' | 'openForBids' | 'bought' | 'invoiced' | 'settled' | 'released' | 'archived'
  addedBy: string
  timestamp: string
}

interface AddLotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddLot: (lot: Omit<LotItem, 'id'>) => void
}

// Mock data for dropdowns - in real app these would come from the directories
const factories = [
  { id: "1", name: "IMENTI", location: "Meru" },
  { id: "2", name: "CHEBUT", location: "Kericho" },
  { id: "3", name: "KIPKEBE", location: "Kericho" },
  { id: "4", name: "THURURU", location: "Kiambu" }
]

const grades = [
  { code: "BP1", description: "Broken Pekoe 1" },
  { code: "PF1", description: "Pekoe Fannings 1" },
  { code: "FBOP", description: "Flowery Broken Orange Pekoe" },
  { code: "PEKOE", description: "Pekoe" },
  { code: "OP", description: "Orange Pekoe" },
  { code: "BOP", description: "Broken Orange Pekoe" }
]

const gardens = [
  "CTCL KTDA",
  "KTDA Factories",
  "Unilever Tea Kenya",
  "James Finlay Kenya",
  "Eastern Produce Kenya"
]

const warehouses = [
  { id: "1", name: "Miritini Annex 2", sloc: "SLOC-1002", location: "Mombasa" },
  { id: "2", name: "Miritini Annex 1", sloc: "SLOC-1001", location: "Mombasa" },
  { id: "3", name: "Nairobi Warehouse", sloc: "SLOC-2001", location: "Nairobi" },
  { id: "4", name: "Kericho Storage", sloc: "SLOC-3001", location: "Kericho" }
]

const brokers = [
  { id: "1", name: "ITEA Limited", company: "ITEA Ltd", status: "Active" },
  { id: "2", name: "East Africa Tea Brokers", company: "EATB Ltd", status: "Active" },
  { id: "3", name: "Kenya Tea Auctioneers", company: "KTA Ltd", status: "Active" }
]

const statusOptions = [
  { value: "draft", label: "Draft", description: "Just created, incomplete data. Editable." },
  { value: "ready", label: "Ready", description: "Complete and valid. Awaiting auction or bid intake." },
  { value: "openForBids", label: "Open For Bids", description: "Available in live bidding (auto or manual)." },
  { value: "bought", label: "Bought", description: "A buyer has committed. Bid accepted." },
  { value: "invoiced", label: "Invoiced", description: "An invoice has been raised for the buyer." },
  { value: "settled", label: "Settled", description: "Payment confirmed." },
  { value: "released", label: "Released", description: "Physical release instruction has been issued." },
  { value: "archived", label: "Archived", description: "Historical / no further changes permitted." }
]

export const AddLotModal = ({ open, onOpenChange, onAddLot }: AddLotModalProps) => {
  const [formData, setFormData] = useState({
    lotId: '',
    factory: '',
    grade: '',
    weight: '',
    quantity: '',
    pricePerKg: '',
    batchNo: '',
    garden: '',
    packingDate: undefined as Date | undefined,
    warehouse: '',
    broker: '',
    status: 'draft' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const weight = parseFloat(formData.weight)
    const quantity = parseInt(formData.quantity)
    const pricePerKg = parseFloat(formData.pricePerKg)
    
    if (!formData.lotId || !formData.factory || !formData.grade || !weight || !quantity || !pricePerKg) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const newLot = {
      ...formData,
      weight,
      quantity,
      pricePerKg,
      totalValue: weight * pricePerKg,
      packingDate: formData.packingDate ? format(formData.packingDate, "yyyy-MM-dd") : '',
      addedBy: "Current User",
      timestamp: new Date().toLocaleString()
    }

    onAddLot(newLot)
    
    // Reset form
    setFormData({
      lotId: '',
      factory: '',
      grade: '',
      weight: '',
      quantity: '',
      pricePerKg: '',
      batchNo: '',
      garden: '',
      packingDate: undefined,
      warehouse: '',
      broker: '',
      status: 'draft'
    })

    toast({
      title: "Lot Added",
      description: `Lot ${newLot.lotId} has been added successfully`,
    })
  }

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-semibold text-slate-900">Add New Lot</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Lot ID and Factory */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lotId" className="text-base font-medium text-slate-700">
                Lot ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lotId"
                value={formData.lotId}
                onChange={(e) => handleInputChange('lotId', e.target.value)}
                placeholder="IM24252673"
                className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="factory" className="text-base font-medium text-slate-700">
                Factory <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.factory} onValueChange={(value) => handleInputChange('factory', value)}>
                <SelectTrigger className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="IMENTI" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                  {factories.map((factory) => (
                    <SelectItem key={factory.id} value={factory.name} className="hover:bg-slate-50">
                      {factory.name} - {factory.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Grade and Weight */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="grade" className="text-base font-medium text-slate-700">
                Grade <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                <SelectTrigger className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="BP1" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                  {grades.map((grade) => (
                    <SelectItem key={grade.code} value={grade.code} className="hover:bg-slate-50">
                      {grade.code} - {grade.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-base font-medium text-slate-700">
                Weight (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="2,480"
                className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Row 3: Quantity and Price per kg */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-base font-medium text-slate-700">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="e.g. 40"
                className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pricePerKg" className="text-base font-medium text-slate-700">
                Price per kg ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pricePerKg"
                type="number"
                step="0.01"
                value={formData.pricePerKg}
                onChange={(e) => handleInputChange('pricePerKg', e.target.value)}
                placeholder="3.42"
                className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Row 4: Batch Number and Garden/Origin */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="batchNo" className="text-base font-medium text-slate-700">
                Batch Number
              </Label>
              <Input
                id="batchNo"
                value={formData.batchNo}
                onChange={(e) => handleInputChange('batchNo', e.target.value)}
                placeholder="B2024001"
                className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="garden" className="text-base font-medium text-slate-700">
                Garden/Origin
              </Label>
              <Select value={formData.garden} onValueChange={(value) => handleInputChange('garden', value)}>
                <SelectTrigger className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="CTCL KTDA" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                  {gardens.map((garden) => (
                    <SelectItem key={garden} value={garden} className="hover:bg-slate-50">
                      {garden}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 5: Packing Date and Warehouse/SLOC */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-medium text-slate-700">
                Packing Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal bg-white border-slate-300 hover:border-blue-500",
                      !formData.packingDate && "text-slate-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.packingDate ? format(formData.packingDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.packingDate}
                    onSelect={(date) => handleInputChange('packingDate', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="warehouse" className="text-base font-medium text-slate-700">
                Warehouse/SLOC
              </Label>
              <Select value={formData.warehouse} onValueChange={(value) => handleInputChange('warehouse', value)}>
                <SelectTrigger className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Miritini Annex 2" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.name} className="hover:bg-slate-50">
                      {warehouse.name} - {warehouse.sloc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 6: Broker and Status */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="broker" className="text-base font-medium text-slate-700">
                Broker
              </Label>
              <Select value={formData.broker} onValueChange={(value) => handleInputChange('broker', value)}>
                <SelectTrigger className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select broker" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                  {brokers.map((broker) => (
                    <SelectItem key={broker.id} value={broker.name} className="hover:bg-slate-50">
                      {broker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-base font-medium text-slate-700">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                <SelectTrigger className="h-12 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Draft" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="hover:bg-slate-50">
                      <div className="flex flex-col">
                        <span className="font-medium">{status.label}</span>
                        <span className="text-xs text-slate-500">{status.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Calculated Total Value Display */}
          {formData.weight && formData.pricePerKg && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">
                <strong>Calculated Total Value:</strong> ${(parseFloat(formData.weight) * parseFloat(formData.pricePerKg)).toLocaleString() || '0'}
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 py-2.5 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Add Lot
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
