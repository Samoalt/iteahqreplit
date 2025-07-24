
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Package, Calendar, DollarSign } from "lucide-react"

interface NewLotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NewLotModal = ({ open, onOpenChange }: NewLotModalProps) => {
  const [formData, setFormData] = useState({
    lotNumber: '',
    factory: '',
    teaType: '',
    grade: '',
    quantity: '',
    reservePrice: '',
    auctionDate: '',
    description: ''
  })

  const factories = [
    'Nandi Hills Factory',
    'Highland Tea Ltd.',
    'Kencho Tea Factory',
    'Lihunda Tea',
    'Motsata Tea'
  ]

  const teaTypes = [
    'Black Tea',
    'Green Tea',
    'White Tea',
    'Oolong Tea'
  ]

  const grades = [
    'PEKOE',
    'FBOP',
    'OP',
    'BOP',
    'BOPF',
    'Fannings',
    'Dust'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.lotNumber || !formData.factory || !formData.teaType || !formData.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    console.log('Creating new lot:', formData)
    
    toast({
      title: "Lot Created",
      description: `Successfully created lot ${formData.lotNumber}`,
    })
    
    onOpenChange(false)
    setFormData({
      lotNumber: '',
      factory: '',
      teaType: '',
      grade: '',
      quantity: '',
      reservePrice: '',
      auctionDate: '',
      description: ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white border-slate-300 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Create New Lot</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lotNumber" className="text-base font-medium text-slate-700">Lot Number *</Label>
              <Input
                id="lotNumber"
                value={formData.lotNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, lotNumber: e.target.value }))}
                placeholder="Enter lot number"
                className="bg-white border-slate-300 focus:border-blue-500 text-slate-900"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="factory" className="text-base font-medium text-slate-700">Factory *</Label>
              <Select value={formData.factory} onValueChange={(value) => setFormData(prev => ({ ...prev, factory: value }))}>
                <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 text-slate-900">
                  <SelectValue placeholder="Select factory" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300 z-50">
                  {factories.map((factory) => (
                    <SelectItem key={factory} value={factory} className="text-slate-900 hover:bg-slate-50">
                      {factory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teaType" className="text-base font-medium text-slate-700">Tea Type *</Label>
              <Select value={formData.teaType} onValueChange={(value) => setFormData(prev => ({ ...prev, teaType: value }))}>
                <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 text-slate-900">
                  <SelectValue placeholder="Select tea type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300 z-50">
                  {teaTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-slate-900 hover:bg-slate-50">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade" className="text-base font-medium text-slate-700">Grade</Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
                <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 text-slate-900">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300 z-50">
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade} className="text-slate-900 hover:bg-slate-50">
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-base font-medium text-slate-700">Quantity (kg) *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity in kg"
                className="bg-white border-slate-300 focus:border-blue-500 text-slate-900"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reservePrice" className="text-base font-medium text-slate-700">Reserve Price (KES)</Label>
              <Input
                id="reservePrice"
                type="number"
                value={formData.reservePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, reservePrice: e.target.value }))}
                placeholder="Enter reserve price"
                className="bg-white border-slate-300 focus:border-blue-500 text-slate-900"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="auctionDate" className="text-base font-medium text-slate-700">Auction Date</Label>
            <Input
              id="auctionDate"
              type="date"
              value={formData.auctionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, auctionDate: e.target.value }))}
              className="bg-white border-slate-300 focus:border-blue-500 text-slate-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium text-slate-700">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter lot description (optional)"
              className="bg-white border-slate-300 focus:border-blue-500 text-slate-900 min-h-20"
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
              <Package className="h-4 w-4 mr-2" />
              Create Lot
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
