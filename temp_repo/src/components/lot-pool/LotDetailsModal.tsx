

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Package, MapPin, Calendar, Weight, Star, Eye, Edit, FileText, X } from "lucide-react"

interface LotDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lot: any // Replace 'any' with the actual type of your lot object
  onUpdateLot?: (updatedLot: any) => void
}

// Mock data for demonstration
const mockLot = {
  id: "LOT-2024-001",
  name: "Premium Tea Lot",
  factory: "IMENTI",
  grade: "BP1",
  quantity: 5000, // kg
  location: "Miritini Warehouse",
  harvestDate: "2024-03-15",
  status: "available", // available, reserved, sold, draft, withdrawn
  qualityScore: 92,
  description: "Exceptional quality tea from the highlands.",
  certifications: ["Organic", "Fair Trade"],
  images: ["/images/tea-lot-1.jpg", "/images/tea-lot-2.jpg"]
}

export const LotDetailsModal = ({ open, onOpenChange, lot, onUpdateLot }: LotDetailsModalProps) => {
  const [tab, setTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border border-green-200">Available</Badge>
      case 'reserved':
        return <Badge className="bg-orange-100 text-orange-800 border border-orange-200">Reserved</Badge>
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Sold</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Draft</Badge>
      case 'withdrawn':
        return <Badge className="bg-red-100 text-red-800 border border-red-200">Withdrawn</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getQualityBadge = (grade: string) => {
    switch (grade) {
      case 'BP1':
      case 'FBOP':
        return <Badge className="bg-green-100 text-green-800 border border-green-200">Premium</Badge>
      case 'PF1':
      case 'PEKOE':
        return <Badge className="bg-teal-100 text-teal-800 border border-teal-200">Standard</Badge>
      case 'BOP':
      case 'OP':
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Good</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">{grade}</Badge>
    }
  }

  const handleEditLot = () => {
    // For now, just close the modal. In a real implementation, this would open an edit form
    if (onUpdateLot && lot) {
      // This would typically be called after successful edit
      onUpdateLot(lot)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-white border border-slate-200">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-2xl font-semibold text-slate-900">Lot Details</DialogTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-500">
              Lot ID: <span className="font-mono font-semibold text-blue-600">{lot?.id || mockLot.id}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex gap-6 h-full">
          {/* Main Content */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 py-4">
              {/* Lot Overview */}
              <Card className="shadow-none border border-slate-200">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-xl font-semibold text-slate-900 flex items-center justify-between">
                    {lot?.name || mockLot.name}
                    {getStatusBadge(lot?.status || mockLot.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Package className="h-4 w-4" />
                      <span>Factory: {lot?.factory || mockLot.factory}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Star className="h-4 w-4" />
                      <span>Grade: {lot?.grade || mockLot.grade} ({getQualityBadge(lot?.grade || mockLot.grade).props.children})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Weight className="h-4 w-4" />
                      <span>Quantity: {lot?.quantity || mockLot.quantity} kg</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <MapPin className="h-4 w-4" />
                      <span>Location: {lot?.location || mockLot.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Calendar className="h-4 w-4" />
                      <span>Harvest Date: {lot?.harvestDate || mockLot.harvestDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <FileText className="h-4 w-4" />
                      <span>Description: {lot?.description || mockLot.description}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Additional Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card className="shadow-none border border-slate-200">
                    <CardContent>
                      <p className="text-sm text-slate-700">
                        Certifications: {lot?.certifications?.join(', ') || mockLot.certifications.join(', ')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

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
                  onClick={handleEditLot}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Lot
                </Button>
              </div>
            </div>
          </ScrollArea>

          {/* Sidebar */}
          <div className="w-80 border-l border-slate-200 pl-6">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Quick Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Location
                  </Button>
                </div>
              </div>

              {/* Lot Images */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Lot Images</h4>
                <div className="grid grid-cols-1 gap-3">
                  {lot?.images?.map((image: string, index: number) => (
                    <img key={index} src={image} alt={`Lot Image ${index + 1}`} className="rounded-lg border border-slate-200" />
                  )) || mockLot.images.map((image: string, index: number) => (
                    <img key={index} src={image} alt={`Lot Image ${index + 1}`} className="rounded-lg border border-slate-200" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

