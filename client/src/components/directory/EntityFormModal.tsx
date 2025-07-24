
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

interface EntityFormModalProps {
  isOpen: boolean
  onClose: () => void
  entity?: any
  onSubmit?: (entityData: any) => void
}

export const EntityFormModal = ({ isOpen, onClose, entity, onSubmit }: EntityFormModalProps) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    bankName: '',
    accountNumber: '',
    preferredAccount: '',
    notes: ''
  })

  useEffect(() => {
    if (entity) {
      setFormData({
        type: entity.type,
        name: entity.name,
        contactPerson: entity.contactPerson,
        email: entity.email,
        phone: entity.phone || '',
        location: entity.location,
        bankName: entity.bankDetails?.split(' - ')[0] || '',
        accountNumber: entity.bankDetails?.split('A/C: ')[1] || '',
        preferredAccount: entity.preferredAccount || '',
        notes: ''
      })
    } else {
      setFormData({
        type: '',
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        location: '',
        bankName: '',
        accountNumber: '',
        preferredAccount: '',
        notes: ''
      })
    }
  }, [entity])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving entity:', formData)
    
    if (onSubmit) {
      onSubmit(formData)
    }
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {entity ? 'Edit Entity' : 'Add New Entity'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entity Type */}
            <div className="md:col-span-2">
              <Label htmlFor="type">Entity Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Basic Information */}
            <div>
              <Label htmlFor="name">Entity Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter entity name"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Contact person name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+254-xxx-xxxxxx"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, Country"
                required
              />
            </div>

            {/* Banking Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                placeholder="Bank name"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                placeholder="Account number"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="preferredAccount">Preferred Account Type</Label>
              <Select value={formData.preferredAccount} onValueChange={(value) => handleInputChange('preferredAccount', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES Account">KES Account</SelectItem>
                  <SelectItem value="USD Account">USD Account</SelectItem>
                  <SelectItem value="GBP Account">GBP Account</SelectItem>
                  <SelectItem value="EUR Account">EUR Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Notes */}
            <div className="md:col-span-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information..."
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="fintech-button-primary">
              {entity ? 'Update Entity' : 'Save Entity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
