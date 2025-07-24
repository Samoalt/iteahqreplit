
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, MapPin, Scale, Award, Download, Printer, ExternalLink, FileText, Eye, Loader2 } from "lucide-react"
import { Bid } from "@/types/bid"
import { useBidState } from "@/contexts/BidStateContext"
import { LotDetailsModal } from "./modals/LotDetailsModal"
import { useToast } from "@/hooks/use-toast"

interface BidLotsTabProps {
  bid: Bid
}

export const BidLotsTab = ({ bid }: BidLotsTabProps) => {
  const [isLotDetailsModalOpen, setIsLotDetailsModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  
  const { downloadFile, generateReport, checkPermission, loading: contextLoading } = useBidState()
  const { toast } = useToast()

  const handleDownloadLotSheet = async () => {
    setIsDownloading(true)
    try {
      await generateReport(bid.id, 'compliance')
      // Simulate download
      await downloadFile(bid.id, `lot-sheet-${bid.lotId}`)
      toast({
        title: "Download Started",
        description: "Lot sheet download has started",
      })
    } catch (error) {
      console.error('Failed to download lot sheet:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download lot sheet. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrintLabel = () => {
    setIsPrinting(true)
    try {
      // Generate print content
      const printContent = `
LOT LABEL
=========

Lot ID: ${bid.lotId}
Grade: ${bid.grade}
Factory: ${bid.factory}
Quantity: ${bid.quantity} packages (${bid.quantity * 50}kg)
Date: ${new Date(bid.date).toLocaleDateString()}

Warehouse: ${bid.warehouseLocation || 'Main Warehouse A'}
Tea Type: ${bid.teaType || 'Black Tea'}
      `
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Lot Label - ${bid.lotId}</title>
              <style>
                body { font-family: monospace; margin: 20px; }
                pre { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <pre>${printContent}</pre>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
      
      toast({
        title: "Print Started",
        description: "Lot label print job has been sent",
      })
    } catch (error) {
      console.error('Failed to print label:', error)
      toast({
        title: "Print Failed",
        description: "Failed to print label. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsPrinting(false)
    }
  }

  const handleViewFullDetails = () => {
    setIsLotDetailsModalOpen(true)
  }

  const handleDownloadInspectionReport = async () => {
    setIsDownloading(true)
    try {
      await downloadFile(bid.id, `inspection-report-${bid.lotId}`)
      toast({
        title: "Download Started",
        description: "Inspection report download has started",
      })
    } catch (error) {
      console.error('Failed to download inspection report:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download inspection report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleViewLocation = () => {
    // Simulate opening a map or location view
    window.open(`https://maps.google.com/?q=${encodeURIComponent(bid.warehouseLocation || 'Main Warehouse A')}`, '_blank')
  }

  const handleWeighingRecords = async () => {
    setIsDownloading(true)
    try {
      await generateReport(bid.id, 'compliance')
      toast({
        title: "Records Generated",
        description: "Weighing records have been generated",
      })
    } catch (error) {
      console.error('Failed to get weighing records:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate weighing records. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Lot Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Lot Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-slate-600">Lot ID</span>
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-lg text-blue-600 hover:text-blue-800"
                  onClick={handleViewFullDetails}
                >
                  {bid.lotId} <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div>
                <span className="text-sm text-slate-600">Tea Type / Grade</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="mt-1">
                    <Award className="w-3 h-3 mr-1" />
                    {bid.grade}
                  </Badge>
                  {bid.teaType && (
                    <Badge variant="secondary">{bid.teaType}</Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-600">Origin Factory</span>
                <p className="text-sm font-medium text-slate-900">{bid.originFactory || bid.factory}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-slate-600">Quantity</span>
                <p className="text-lg font-semibold text-slate-900">{bid.quantity * 50} kg</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Number of Packages</span>
                <p className="text-lg font-semibold text-slate-900">{bid.quantity}</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Packaging Type</span>
                <p className="text-sm font-medium text-slate-900 flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  {bid.packagingType || '50kg bags'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-slate-600">Auction Date</span>
                <p className="text-sm font-medium text-slate-900">{bid.auctionDate || bid.date}</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Warehouse Location</span>
                <p className="text-sm font-medium text-slate-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {bid.warehouseLocation || 'Main Warehouse A'}
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Weight per Package</span>
                <p className="text-sm font-medium text-slate-900 flex items-center">
                  <Scale className="w-4 h-4 mr-1" />
                  50kg
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Details */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Quality Metrics</h4>
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
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Tasting Notes</h4>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-700">
                  {bid.qualityDetails?.tastingNotes || 'Rich, full-bodied flavor with bright copper color. Well-balanced with good astringency and brisk character.'}
                </p>
              </div>
              
              {bid.qualityDetails?.inspectionReport && (
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadInspectionReport}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Download Inspection Report
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Lot Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleDownloadLotSheet}
              disabled={isDownloading || contextLoading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Lot Sheet
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrintLabel}
              disabled={isPrinting}
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Printing...
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Lot Label
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleViewFullDetails}>
              <Eye className="w-4 h-4 mr-2" />
              View Full Lot Details
            </Button>
            <Button variant="outline" onClick={handleViewLocation}>
              <MapPin className="w-4 h-4 mr-2" />
              View Location
            </Button>
            <Button 
              variant="outline" 
              onClick={handleWeighingRecords}
              disabled={isDownloading || contextLoading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4 mr-2" />
                  Weighing Records
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lot Details Modal */}
      <LotDetailsModal
        isOpen={isLotDetailsModalOpen}
        onOpenChange={setIsLotDetailsModalOpen}
        bid={bid}
      />
    </div>
  )
}
