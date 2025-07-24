import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Download, Send, Eye, Mail, Clock, CheckCircle, Printer, Loader2 } from "lucide-react"
import { Bid } from "@/types/bid"
import { useBidState } from "@/contexts/BidStateContext"
import { ESlipPreviewModal } from "./modals/ESlipPreviewModal"
import { EmailComposerModal } from "./modals/EmailComposerModal"
import { generateESlipContent, createBlobDownload, printDocument } from "@/utils/fileOperations"
import { useToast } from "@/hooks/use-toast"

interface BidESlipTabProps {
  bid: Bid
}

export const BidESlipTab = ({ bid }: BidESlipTabProps) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const { generateReport, checkPermission, loading: contextLoading } = useBidState()
  const { toast } = useToast()

  const isESlipEnabled = !['bid-intake'].includes(bid.status)
  const eSlipStatus = bid.eSlipDetails?.status || (isESlipEnabled ? 'generated' : 'not-generated')
  const generatedBy = bid.eSlipDetails?.generatedBy || 'System'
  const generatedDate = bid.eSlipDetails?.generatedDate || new Date().toISOString().split('T')[0]
  const sentToBuyer = bid.eSlipDetails?.sentToBuyer || false
  const sentDate = bid.eSlipDetails?.sentDate

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge className="bg-green-100 text-green-800">Generated</Badge>
      case 'not-generated':
        return <Badge variant="secondary">Not Generated</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleGenerateESlip = async () => {
    if (!checkPermission('generate_reports')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to generate E-Slips",
        variant: "destructive"
      })
      return
    }
    
    setIsGenerating(true)
    try {
      await generateReport(bid.id, 'eslip')
      toast({
        title: "E-Slip Generated",
        description: "E-Slip has been generated successfully",
      })
    } catch (error) {
      console.error('Failed to generate E-Slip:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate E-Slip. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadESlip = async () => {
    setIsDownloading(true)
    try {
      const content = generateESlipContent(bid)
      createBlobDownload(content, `E-Slip_${bid.id}.txt`)
      toast({
        title: "Download Started",
        description: "E-Slip download has started",
      })
    } catch (error) {
      console.error('Failed to download E-Slip:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download E-Slip. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSendToBuyer = () => {
    if (!checkPermission('send_communications')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to send communications",
        variant: "destructive"
      })
      return
    }
    setIsEmailModalOpen(true)
  }

  const handlePreviewESlip = () => {
    setIsPreviewModalOpen(true)
  }

  const handlePrintESlip = () => {
    setIsPrinting(true)
    try {
      const content = generateESlipContent(bid)
      printDocument(content, `E-Slip for Bid ${bid.id}`)
      toast({
        title: "Print Started",
        description: "E-Slip print job has been sent",
      })
    } catch (error) {
      console.error('Failed to print E-Slip:', error)
      toast({
        title: "Print Failed",
        description: "Failed to print E-Slip. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsPrinting(false)
    }
  }

  const handleEmailSent = async () => {
    setIsSending(true)
    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsEmailModalOpen(false)
      toast({
        title: "Email Sent",
        description: "E-Slip has been sent to the buyer successfully",
      })
    } catch (error) {
      console.error('Failed to send email:', error)
      toast({
        title: "Send Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* E-Slip Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              E-Slip Status
            </div>
            {getStatusBadge(eSlipStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isESlipEnabled ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">E-Slip Generation Pending</p>
              <p className="text-sm text-slate-500">Complete bid intake to enable E-slip generation</p>
            </div>
          ) : eSlipStatus === 'generated' ? (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-green-900">E-Slip Generated</p>
                    <p className="text-sm text-green-700">Ready for download and distribution</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-sm text-green-700">
                  <p>Generated by: {generatedBy}</p>
                  <p>Generated on: {new Date(generatedDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Email Status */}
              <div className={`rounded-lg p-4 ${sentToBuyer ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                <div className="flex items-center space-x-2">
                  <Mail className={`w-5 h-5 ${sentToBuyer ? 'text-blue-500' : 'text-yellow-500'}`} />
                  <p className={`font-medium ${sentToBuyer ? 'text-blue-900' : 'text-yellow-900'}`}>
                    {sentToBuyer ? 'E-Slip Sent to Buyer' : 'E-Slip Not Sent Yet'}
                  </p>
                </div>
                {sentToBuyer && sentDate && (
                  <p className="text-sm text-blue-700 mt-1">Sent on: {new Date(sentDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">E-Slip not generated yet</p>
              <Button 
                onClick={handleGenerateESlip}
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
                    Generate E-Slip
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* E-Slip Preview */}
      {eSlipStatus === 'generated' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              E-Slip Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-6 border-2 border-dashed border-slate-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">iTEA PLATFORM</h3>
                <p className="text-sm text-slate-600">Electronic Sale Slip</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Bid Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-600">Bid ID:</span> {bid.id}</p>
                    <p><span className="text-slate-600">Date:</span> {new Date(bid.date).toLocaleDateString()}</p>
                    <p><span className="text-slate-600">Lot ID:</span> {bid.lotId}</p>
                    <p><span className="text-slate-600">Grade:</span> {bid.grade}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Transaction Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-600">Buyer:</span> {bid.buyerName}</p>
                    <p><span className="text-slate-600">Factory:</span> {bid.factory}</p>
                    <p><span className="text-slate-600">Quantity:</span> {bid.quantity} packages</p>
                    <p><span className="text-slate-600">Amount:</span> ${bid.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center text-xs text-slate-500">
                <p>Generated on {new Date(generatedDate).toLocaleDateString()} by iTea Platform</p>
                <p>This is an electronically generated document and does not require signature.</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={handlePreviewESlip}>
                <Eye className="w-4 h-4 mr-2" />
                Full Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* E-Slip Actions */}
      {eSlipStatus === 'generated' && (
        <Card>
          <CardHeader>
            <CardTitle>E-Slip Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleDownloadESlip}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download E-Slip PDF
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSendToBuyer}
                disabled={isSending || !checkPermission('send_communications')}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to Buyer
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handlePrintESlip}
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
                    Print E-Slip
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGenerateESlip}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Regenerate E-Slip
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Configuration */}
      {eSlipStatus === 'generated' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email to Buyer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerEmail">Buyer Email</Label>
                <Input 
                  id="buyerEmail" 
                  type="email"
                  placeholder="buyer@company.com"
                  defaultValue="contact@globalteaco.com"
                />
              </div>
              <div>
                <Label htmlFor="ccEmail">CC Email (Optional)</Label>
                <Input 
                  id="ccEmail" 
                  type="email"
                  placeholder="manager@company.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="emailSubject">Email Subject</Label>
              <Input 
                id="emailSubject" 
                defaultValue={`E-Slip for Bid ${bid.id} - Tea Purchase`}
              />
            </div>
            
            <div>
              <Label htmlFor="emailMessage">Email Message</Label>
              <Textarea 
                id="emailMessage"
                className="min-h-[120px]"
                defaultValue={`Dear ${bid.buyerName},

Please find attached the E-Slip for your tea purchase bid ${bid.id}.

Bid Details:
- Lot ID: ${bid.lotId}
- Grade: ${bid.grade}
- Quantity: ${bid.quantity} packages
- Amount: $${bid.amount.toLocaleString()}

Please review the attached E-Slip and proceed with payment as per the terms.

Best regards,
iTea Platform Team`}
              />
            </div>
            
            <div className="flex space-x-3">
              <Button onClick={handleSendToBuyer}>
                <Send className="w-4 h-4 mr-2" />
                Send E-Slip Email
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview Email
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* E-Slip Information */}
      <Card>
        <CardHeader>
          <CardTitle>E-Slip Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Purpose</h4>
              <p className="text-sm text-slate-600">
                The E-Slip serves as an electronic sale confirmation document that provides 
                official record of the tea purchase transaction between the buyer and seller.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Contents Include</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Bid and transaction details</li>
                <li>• Buyer and seller information</li>
                <li>• Tea lot specifications</li>
                <li>• Payment terms and amount</li>
                <li>• Digital signatures and timestamps</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>E-Slip Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eSlipStatus === 'generated' ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">E-Slip_{bid.id}.pdf</p>
                    <p className="text-sm text-slate-600">Generated {new Date(generatedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePreviewESlip}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadESlip}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">No E-Slip generated yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ESlipPreviewModal
        isOpen={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
        bid={bid}
        onDownload={handleDownloadESlip}
        onPrint={handlePrintESlip}
        onSend={handleSendToBuyer}
      />

      <EmailComposerModal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        recipientName={bid.buyerName}
        recipientEmail="contact@globalteaco.com"
        bidId={bid.id}
        loading={isSending}
      />
    </div>
  )
}
