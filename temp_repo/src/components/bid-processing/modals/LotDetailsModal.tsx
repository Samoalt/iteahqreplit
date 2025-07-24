
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, MapPin, Scale, Award, Download, Printer, ExternalLink } from "lucide-react"
import { Bid } from "@/types/bid"

interface LotDetailsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bid: Bid
}

export const LotDetailsModal = ({ isOpen, onOpenChange, bid }: LotDetailsModalProps) => {
  const handleDownloadLotSheet = () => {
    console.log('Download lot sheet for:', bid.lotId)
  }

  const handlePrintLabel = () => {
    console.log('Print lot label for:', bid.lotId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Lot Details - {bid.lotId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Basic Information</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-slate-600">Lot ID</span>
                  <p className="font-semibold">{bid.lotId}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Grade</span>
                  <Badge variant="outline" className="ml-2">
                    <Award className="w-3 h-3 mr-1" />
                    {bid.grade}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Tea Type</span>
                  <p className="font-medium">{bid.teaType || 'Black Tea'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Quantity & Packaging</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-slate-600">Total Weight</span>
                  <p className="font-semibold">{bid.quantity * 50} kg</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Packages</span>
                  <p className="font-medium">{bid.quantity}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Package Type</span>
                  <p className="font-medium flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    {bid.packagingType || '50kg bags'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Location & Storage</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-slate-600">Origin Factory</span>
                  <p className="font-medium">{bid.originFactory || bid.factory}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Warehouse</span>
                  <p className="font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {bid.warehouseLocation || 'Main Warehouse A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Auction Date</span>
                  <p className="font-medium">{bid.auctionDate || bid.date}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quality Details */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Quality Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">Quality Metrics</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Moisture Level</span>
                      <span className="text-sm font-medium">{bid.qualityDetails?.moistureLevel || '12.5%'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Color / Aroma</span>
                      <span className="text-sm font-medium">{bid.qualityDetails?.colorAroma || 'Premium'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Leaf Size</span>
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Astringency</span>
                      <span className="text-sm font-medium">High</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">Tasting Notes</h5>
                  <p className="text-sm text-slate-700">
                    {bid.qualityDetails?.tastingNotes || 'Rich, full-bodied flavor with bright copper color. Well-balanced with good astringency and brisk character. Notes of malt and citrus with a clean finish.'}
                  </p>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">Inspection Status</h5>
                  <p className="text-sm text-slate-700">
                    {bid.qualityDetails?.inspectionReport || 'Quality inspection completed. Meets export standards.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleDownloadLotSheet}>
              <Download className="w-4 h-4 mr-2" />
              Download Lot Sheet
            </Button>
            <Button variant="outline" onClick={handlePrintLabel}>
              <Printer className="w-4 h-4 mr-2" />
              Print Lot Label
            </Button>
            <Button variant="outline">
              <Scale className="w-4 h-4 mr-2" />
              Weighing Records
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
