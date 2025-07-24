import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, CreditCard, AlertTriangle, CheckCircle, Clock, Upload, Download, Loader2 } from "lucide-react"
import { Bid } from "@/types/bid"
import { useToast } from "@/hooks/use-toast"
import { PaymentConfirmationModal } from "./modals/PaymentConfirmationModal"
import { FileUploadModal } from "./modals/FileUploadModal"

interface BidPaymentTabProps {
  bid: Bid
}

export const BidPaymentTab = ({ bid }: BidPaymentTabProps) => {
  const { toast } = useToast()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [loadingStates, setLoadingStates] = useState({
    sendReminder: false,
    reconciliation: false,
    downloadAttachment: false
  })
  
  const setLoading = (action: keyof typeof loadingStates, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [action]: loading }))
  }

  const isPaymentMatching = bid.status === 'payment-matching'
  const isPaymentReceived = ['split-processing', 'payout-approval', 'tea-release'].includes(bid.status)
  
  // Mock payment data with enhanced details
  const expectedAmount = bid.amount
  const receivedAmount = bid.paymentDetails?.receivedAmount || (isPaymentReceived ? bid.amount : (isPaymentMatching ? bid.amount * 0.7 : 0))
  const balanceRemaining = expectedAmount - receivedAmount
  const paymentProgress = (receivedAmount / expectedAmount) * 100
  const paymentStatus = bid.paymentDetails?.status || (isPaymentReceived ? 'paid' : isPaymentMatching ? 'partial' : 'pending')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case 'partial':
        return <Badge className="bg-orange-100 text-orange-800">Partial</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const handleMarkAsPaid = () => {
    setIsPaymentModalOpen(true)
  }

  const handleUploadProof = () => {
    setIsUploadModalOpen(true)
  }

  const handlePaymentConfirmation = async (paymentData: any) => {
    try {
      toast({
        title: "Payment Confirmed",
        description: `Payment of $${paymentData.receivedAmount.toLocaleString()} has been recorded`,
      })
      // In real app, this would update the bid state
    } catch (error) {
      toast({
        title: "Confirmation Failed",
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleFileUpload = async (file: File, category: string, description?: string) => {
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "File Uploaded",
        description: `Payment proof "${file.name}" has been uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSendReminder = async () => {
    setLoading('sendReminder', true)
    try {
      // Simulate sending reminder
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Reminder Sent",
        description: "Payment reminder has been sent to the buyer",
      })
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('sendReminder', false)
    }
  }

  const handleReconciliation = async () => {
    setLoading('reconciliation', true)
    try {
      // Simulate reconciliation process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast({
        title: "Reconciliation Complete",
        description: "Payment reconciliation process has been completed",
      })
    } catch (error) {
      toast({
        title: "Reconciliation Failed",
        description: "Failed to complete reconciliation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('reconciliation', false)
    }
  }

  const handleDownloadAttachment = async (filename: string) => {
    setLoading('downloadAttachment', true)
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create mock download
      const content = `Payment Proof Document for Bid ${bid.id}\nFile: ${filename}\nGenerated: ${new Date().toISOString()}`
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Download Started",
        description: `${filename} download has started`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('downloadAttachment', false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Payment Status
            </div>
            {getStatusBadge(paymentStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-slate-600">Payment Amount Expected</p>
              <p className="text-2xl font-bold text-slate-900">${expectedAmount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Amount Received</p>
              <p className="text-2xl font-bold text-green-600">${receivedAmount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Balance Remaining</p>
              <p className="text-2xl font-bold text-red-600">
                ${balanceRemaining.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span>{Math.round(paymentProgress)}%</span>
            </div>
            <Progress value={paymentProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select defaultValue={bid.paymentDetails?.paymentMethod || "bank"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="m-pesa">M-Pesa</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="referenceNumber">Payment Reference Number</Label>
                <Input 
                  id="referenceNumber" 
                  placeholder="Enter reference number"
                  defaultValue={bid.paymentDetails?.referenceNumber || ""}
                />
              </div>
              <div>
                <Label htmlFor="receivedDate">Received Date</Label>
                <Input 
                  id="receivedDate" 
                  type="date"
                  defaultValue={bid.paymentDetails?.receivedDate || ""}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Bank Details</h4>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Bank Name</span>
                  <span className="text-sm font-medium">Kenya Commercial Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Account Number</span>
                  <span className="text-sm font-medium">****-****-1234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Swift Code</span>
                  <span className="text-sm font-medium">KCBLKENX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Currency</span>
                  <span className="text-sm font-medium">USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Due Date</span>
                  <span className="text-sm font-medium">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {receivedAmount > 0 ? (
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-900">Payment Received</p>
                    <p className="text-sm text-green-700">
                      {bid.paymentDetails?.paymentMethod === 'm-pesa' ? 'M-Pesa' : 'Bank Transfer'} - {bid.paymentDetails?.receivedDate || new Date().toLocaleDateString()}
                    </p>
                    {bid.paymentDetails?.referenceNumber && (
                      <p className="text-xs text-green-600">Ref: {bid.paymentDetails.referenceNumber}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-900">${receivedAmount.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Confirmed</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No payments received yet</p>
              </div>
            )}

            {balanceRemaining > 0 && receivedAmount > 0 && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-900">Pending Balance</p>
                    <p className="text-sm text-yellow-700">Awaiting remaining payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-900">
                    ${balanceRemaining.toLocaleString()}
                  </p>
                  <p className="text-sm text-yellow-700">Due</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleMarkAsPaid}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Paid
            </Button>
            <Button variant="outline" onClick={handleUploadProof}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Proof of Payment
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSendReminder}
              disabled={loadingStates.sendReminder}
            >
              {loadingStates.sendReminder ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <AlertTriangle className="w-4 h-4 mr-2" />
              )}
              {loadingStates.sendReminder ? "Sending..." : "Send Reminder"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReconciliation}
              disabled={loadingStates.reconciliation}
            >
              {loadingStates.reconciliation ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              {loadingStates.reconciliation ? "Processing..." : "Payment Reconciliation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bid.paymentDetails?.proofOfPayment?.length ? (
              bid.paymentDetails.proofOfPayment.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-900">Payment Proof {index + 1}</p>
                      <p className="text-sm text-slate-600">Uploaded {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadAttachment(`payment-proof-${index + 1}.pdf`)}
                    disabled={loadingStates.downloadAttachment}
                  >
                    {loadingStates.downloadAttachment ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {loadingStates.downloadAttachment ? "Downloading..." : "Download"}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">No payment attachments yet</p>
                <Button variant="outline" className="mt-2" onClick={handleUploadProof}>
                  Upload Payment Proof
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PaymentConfirmationModal
        isOpen={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onConfirm={handlePaymentConfirmation}
        expectedAmount={expectedAmount}
        bidId={bid.id}
      />

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleFileUpload}
        bidId={bid.id}
      />
    </div>
  )
}
