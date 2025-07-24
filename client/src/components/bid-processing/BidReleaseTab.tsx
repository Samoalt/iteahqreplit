import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, MapPin, FileText, Send, CheckCircle, Clock, AlertCircle, Upload, Download, User, Loader2 } from "lucide-react"
import { Bid } from "@/types/bid"
import { useBidState } from "@/contexts/BidStateContext"
import { FileUploadModal } from "./modals/FileUploadModal"
import { generatePayoutReportContent, createBlobDownload } from "@/utils/fileOperations"

interface BidReleaseTabProps {
  bid: Bid
}

export const BidReleaseTab = ({ bid }: BidReleaseTabProps) => {
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false)
  const [isMarkingReleased, setIsMarkingReleased] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  
  const { updateBidStatus, updateBidData, uploadFile, generateReport, downloadFile, checkPermission, loading: contextLoading } = useBidState()

  const isReleaseEnabled = bid.status === 'tea-release'
  const releaseStatus = bid.releaseDetails?.status || (isReleaseEnabled ? 'not-released' : 'pending')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'released':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'not-released':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'withheld':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'released':
        return <Badge className="bg-green-100 text-green-800">Released</Badge>
      case 'not-released':
        return <Badge className="bg-orange-100 text-orange-800">Ready for Release</Badge>
      case 'withheld':
        return <Badge className="bg-red-100 text-red-800">Withheld</Badge>
      default:
        return <Badge variant="secondary">Pending Payout</Badge>
    }
  }

  const handleMarkAsReleased = async () => {
    if (!checkPermission('final_approval')) return
    
    setIsMarkingReleased(true)
    try {
      await updateBidData(bid.id, {
        releaseDetails: {
          ...bid.releaseDetails,
          status: 'released',
          releaseDate: new Date().toISOString().split('T')[0],
          releasingOfficer: 'Current User'
        }
      })
    } catch (error) {
      console.error('Failed to mark as released:', error)
    } finally {
      setIsMarkingReleased(false)
    }
  }

  const handleUploadDeliveryNote = () => {
    if (!checkPermission('upload_files')) return
    setIsFileUploadModalOpen(true)
  }

  const handleFileUpload = async (file: File, category: string) => {
    try {
      await uploadFile(bid.id, file, category)
      setIsFileUploadModalOpen(false)
    } catch (error) {
      console.error('Failed to upload file:', error)
    }
  }

  const handleGenerateAcknowledgment = async () => {
    setIsGenerating(true)
    try {
      const content = `
DELIVERY ACKNOWLEDGMENT
======================

Bid ID: ${bid.id}
Lot ID: ${bid.lotId}
Buyer: ${bid.buyerName}
Quantity: ${bid.quantity} packages (${bid.quantity * 50}kg)
Grade: ${bid.grade}

Release Date: ${new Date().toLocaleDateString()}
Released By: ${bid.releaseDetails?.releasingOfficer || 'Release Officer'}

This confirms that the above tea lot has been released for delivery.

Generated on: ${new Date().toLocaleString()}
      `
      createBlobDownload(content, `Delivery-Acknowledgment_${bid.id}.txt`)
    } catch (error) {
      console.error('Failed to generate acknowledgment:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateReleaseNotice = async () => {
    setIsGenerating(true)
    try {
      await generateReport(bid.id, 'summary')
    } catch (error) {
      console.error('Failed to generate release notice:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNotifyFactory = async () => {
    setIsSending(true)
    try {
      // Simulate sending notification
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Factory notified for release:', bid.id)
    } catch (error) {
      console.error('Failed to notify factory:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleNotifyWarehouse = async () => {
    setIsSending(true)
    try {
      // Simulate sending notification
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Warehouse notified for release:', bid.id)
    } catch (error) {
      console.error('Failed to notify warehouse:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleTrackRelease = () => {
    setIsTracking(true)
    try {
      // Simulate opening tracking interface
      console.log('Opening release tracking for:', bid.id)
      // In real app, this might open a tracking modal or navigate to tracking page
    } catch (error) {
      console.error('Failed to track release:', error)
    } finally {
      setIsTracking(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Release Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Tea Release Status
            </div>
            {getStatusBadge(releaseStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isReleaseEnabled ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Release Pending</p>
              <p className="text-sm text-slate-500">Complete payout processing to enable tea release</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-900">
                      {releaseStatus === 'released' ? 'Tea Released' : 'Ready for Release'}
                    </p>
                    <p className="text-sm text-green-700">
                      {releaseStatus === 'released' ? 'Release completed successfully' : 'All prerequisites completed'}
                    </p>
                  </div>
                  {getStatusIcon(releaseStatus)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lot Information */}
      <Card>
        <CardHeader>
          <CardTitle>Release Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-600">Lot ID</span>
              <p className="font-medium text-slate-900">{bid.lotId}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Quantity</span>
              <p className="font-medium text-slate-900">{bid.quantity} packages ({bid.quantity * 50}kg)</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Grade</span>
              <p className="font-medium text-slate-900">{bid.grade}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Factory</span>
              <p className="font-medium text-slate-900">{bid.factory}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Buyer</span>
              <p className="font-medium text-slate-900">{bid.buyerName}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Bid Amount</span>
              <p className="font-medium text-slate-900">${bid.amount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Release Details Form */}
      {isReleaseEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Release Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input 
                  id="releaseDate" 
                  type="date"
                  defaultValue={bid.releaseDetails?.releaseDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="releasingOfficer">Releasing Officer</Label>
                <Input 
                  id="releasingOfficer" 
                  placeholder="Enter officer name"
                  defaultValue={bid.releaseDetails?.releasingOfficer || ""}
                />
              </div>
              <div>
                <Label htmlFor="deliveryReference">Delivery Reference</Label>
                <Input 
                  id="deliveryReference" 
                  placeholder="Enter delivery reference"
                  defaultValue={bid.releaseDetails?.deliveryReference || ""}
                />
              </div>
              <div>
                <Label htmlFor="warehouse">Warehouse Location</Label>
                <Select defaultValue={bid.warehouseLocation || "warehouse-a"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse-a">Main Warehouse A</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B - Mombasa</SelectItem>
                    <SelectItem value="warehouse-c">Warehouse C - Nairobi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="releaseNotes">Release Notes</Label>
              <Textarea 
                id="releaseNotes"
                placeholder="Enter any special notes for the release..."
                className="min-h-[100px]"
                defaultValue={bid.releaseDetails?.notes || "Standard release procedure. Buyer to collect within 7 days of notice."}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warehouse Details */}
      {isReleaseEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Warehouse Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-slate-900">Warehouse Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Manager:</span>
                  <p className="font-medium">John Warehouse</p>
                </div>
                <div>
                  <span className="text-slate-600">Phone:</span>
                  <p className="font-medium">+254-XXX-XXXX</p>
                </div>
                <div>
                  <span className="text-slate-600">Email:</span>
                  <p className="font-medium">warehouse.a@itea.com</p>
                </div>
                <div>
                  <span className="text-slate-600">Location:</span>
                  <p className="font-medium">Main Warehouse A, Mombasa Road</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-blue-900 mb-2">Release Conditions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Payment fully received and confirmed
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Quality certificate available
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Buyer notification sent
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Warehouse staff notified
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Release Actions */}
      {isReleaseEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Release Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleMarkAsReleased} 
                className="bg-green-600 hover:bg-green-700"
                disabled={isMarkingReleased || contextLoading || !checkPermission('final_approval')}
              >
                {isMarkingReleased ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Marking Released...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Released
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGenerateReleaseNotice}
                disabled={isGenerating || contextLoading}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Release Notice
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleUploadDeliveryNote}
                disabled={contextLoading || !checkPermission('upload_files')}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Delivery Note
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGenerateAcknowledgment}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Delivery Acknowledgment
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNotifyFactory}
                disabled={isSending || contextLoading}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Notifying...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Notify Factory
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNotifyWarehouse}
                disabled={isSending || contextLoading}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Notifying...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Notify Warehouse
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTrackRelease}
                disabled={isTracking}
              >
                {isTracking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Opening...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 mr-2" />
                    Track Release
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Release Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Release Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bid.releaseDetails?.deliveryNote || bid.releaseDetails?.buyerConfirmation ? (
              <div className="space-y-3">
                {bid.releaseDetails.deliveryNote && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Delivery Note</p>
                        <p className="text-sm text-slate-600">Uploaded {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
                
                {bid.releaseDetails.buyerConfirmation && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-900">Buyer Confirmation</p>
                        <p className="text-sm text-green-700">Received {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">No release documents yet</p>
                <Button variant="outline" className="mt-2" onClick={handleUploadDeliveryNote}>
                  Upload Delivery Note
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Release Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Release Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon('not-released')}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Release Authorized</p>
                <p className="text-sm text-slate-600">All payment and processing requirements met</p>
                <p className="text-xs text-slate-500">{new Date().toLocaleDateString()} • System</p>
              </div>
            </div>
            
            {releaseStatus === 'released' && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-900">Tea Released</p>
                  <p className="text-sm text-green-700">Released by {bid.releaseDetails?.releasingOfficer || 'Officer'}</p>
                  <p className="text-xs text-green-500">{bid.releaseDetails?.releaseDate || new Date().toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isFileUploadModalOpen}
        onOpenChange={setIsFileUploadModalOpen}
        onUpload={handleFileUpload}
        bidId={bid.id}
        loading={contextLoading}
      />
    </div>
  )
}
