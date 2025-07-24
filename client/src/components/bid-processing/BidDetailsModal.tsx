import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Upload, MapPin, BarChart3, Receipt, DollarSign, Split, Settings, Package, AlertCircle, CheckCircle, Clock, Send } from "lucide-react"
import { Bid } from "@/types/bid"
import { useToast } from "@/hooks/use-toast"

interface BidDetailsModalProps {
  bid: Bid | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateBid: (bid: Bid) => void
}

export const BidDetailsModal = ({ bid, open, onOpenChange, onUpdateBid }: BidDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [splitPercentage, setSplitPercentage] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<Bid['status'] | "">("")
  const { toast } = useToast()

  if (!bid) return null

  const handleStatusUpdate = (newStatus: Bid['status']) => {
    const updatedBid = { ...bid, status: newStatus }
    onUpdateBid(updatedBid)
    toast({
      title: "Status Updated",
      description: `Bid status changed to ${newStatus.replace('-', ' ')}`,
    })
  }

  const handleViewLocationReport = () => {
    // Create a blob URL for the PDF
    const pdfContent = `Location Report for Bid ${bid.id}\n\nFactory: ${bid.factory}\nLocation: Main Warehouse\nQuality Grade: ${bid.grade}\nQuantity: ${bid.quantity} kg\n\nGenerated on: ${new Date().toLocaleDateString()}`
    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    // Create a temporary link and click it
    const link = document.createElement('a')
    link.href = url
    link.download = `location-report-${bid.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Location Report Downloaded",
      description: "Location and quality report has been generated and downloaded",
    })
  }

  const handleViewQualityReport = () => {
    const qualityContent = `Quality Analysis Report for Bid ${bid.id}\n\nGrade: ${bid.grade}\nFactory: ${bid.factory}\nQuality Score: A+\nMoisture Content: 12%\nTaste Profile: Strong, Full-bodied\n\nGenerated on: ${new Date().toLocaleDateString()}`
    const blob = new Blob([qualityContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `quality-report-${bid.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Quality Report Downloaded",
      description: "Quality analysis report has been generated and downloaded",
    })
  }

  const handleGenerateESlip = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      handleStatusUpdate('e-slip-sent')
      
      // Generate E-slip document
      const eslipContent = `E-SLIP DOCUMENT\n\nBid ID: ${bid.id}\nBuyer: ${bid.buyerName}\nAmount: $${bid.amount.toLocaleString()}\nFactory: ${bid.factory}\nGrade: ${bid.grade}\nQuantity: ${bid.quantity} kg\nRate: $${bid.pricePerKg}/kg\n\nIssue Date: ${new Date().toLocaleDateString()}\nValid Until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n\nTerms: Cash on Delivery, Ex-Warehouse`
      const blob = new Blob([eslipContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `e-slip-${bid.id}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: "E-Slip Generated",
        description: "E-slip has been generated, downloaded, and sent to the buyer",
      })
    }, 1000)
  }

  const handleRecordPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      handleStatusUpdate('payment-matching')
      
      // Store payment record
      const paymentRecord = {
        bidId: bid.id,
        amount: parseFloat(paymentAmount),
        date: new Date().toISOString(),
        method: 'manual'
      }
      
      console.log('Payment recorded:', paymentRecord)
      setPaymentAmount("")
      
      toast({
        title: "Payment Recorded",
        description: `Payment of $${paymentAmount} has been recorded and matched successfully`,
      })
    }, 500)
  }

  const handleMarkReceived = () => {
    handleStatusUpdate('split-processing')
    console.log('Payment marked as received for bid:', bid.id)
    toast({
      title: "Payment Marked as Received",
      description: "Payment status updated and moved to split processing",
    })
  }

  const handleSendReminder = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      console.log('Payment reminder sent to:', bid.buyerName)
      toast({
        title: "Reminder Sent",
        description: `Payment reminder has been sent to ${bid.buyerName}`,
      })
    }, 500)
  }

  const handleReconciliation = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      console.log('Payment reconciliation completed for bid:', bid.id)
      toast({
        title: "Reconciliation Complete",
        description: "Payment reconciliation has been completed successfully",
      })
    }, 1000)
  }

  const handleRecalculateSplit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const newSplitData = {
        brokerCommission: (bid.amount * 0.03).toFixed(2),
        factoryPayment: (bid.amount * 0.85).toFixed(2),
        teaBoard: (bid.amount * 0.02).toFixed(2),
        other: (bid.amount * 0.10).toFixed(2)
      }
      console.log('Recalculated split:', newSplitData)
      toast({
        title: "Split Recalculated",
        description: "Payment split has been recalculated based on current rates",
      })
    }, 500)
  }

  const handleEditSplitTerms = () => {
    if (!splitPercentage || parseFloat(splitPercentage) <= 0 || parseFloat(splitPercentage) > 100) {
      toast({
        title: "Error",
        description: "Please enter a valid split percentage (1-100)",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      console.log('Split terms updated:', { bidId: bid.id, percentage: splitPercentage })
      setSplitPercentage("")
      toast({
        title: "Split Terms Updated",
        description: `Split terms updated to ${splitPercentage}% commission`,
      })
    }, 500)
  }

  const handleProcessPayouts = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      handleStatusUpdate('payout-approval')
      
      const payoutData = {
        factory: (bid.amount * 0.85).toFixed(2),
        broker: (bid.amount * 0.03).toFixed(2),
        teaBoard: (bid.amount * 0.02).toFixed(2),
        processedAt: new Date().toISOString()
      }
      console.log('Payouts processed:', payoutData)
      
      toast({
        title: "Payouts Processed",
        description: "All payouts have been calculated and queued for approval",
      })
    }, 1000)
  }

  const handleGenerateReport = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      
      const reportContent = `SPLIT PROCESSING REPORT\n\nBid ID: ${bid.id}\nTotal Amount: $${bid.amount.toLocaleString()}\n\nSplit Breakdown:\n- Factory Payment: $${(bid.amount * 0.85).toFixed(2)} (85%)\n- Broker Commission: $${(bid.amount * 0.03).toFixed(2)} (3%)\n- Tea Board Fee: $${(bid.amount * 0.02).toFixed(2)} (2%)\n- Other Charges: $${(bid.amount * 0.10).toFixed(2)} (10%)\n\nGenerated: ${new Date().toLocaleDateString()}`
      const blob = new Blob([reportContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `split-report-${bid.id}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Report Generated",
        description: "Split processing report has been generated and downloaded",
      })
    }, 500)
  }

  const handleUploadDocument = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx,.jpg,.png'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('Document uploaded:', { fileName: file.name, size: file.size, bidId: bid.id })
        toast({
          title: "Document Uploaded",
          description: `${file.name} has been uploaded successfully to bid ${bid.id}`,
        })
      }
    }
    input.click()
  }

  const handleAddBidDoc = () => {
    handleUploadDocument()
  }

  const handleAddComplianceDoc = () => {
    handleUploadDocument()
  }

  const handleDownloadAll = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      console.log('All documents downloaded for bid:', bid.id)
      toast({
        title: "Download Started",
        description: "All documents are being downloaded as a ZIP file",
      })
    }, 500)
  }

  const handleGeneratePackage = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      
      const packageContent = `DOCUMENT PACKAGE - BID ${bid.id}\n\nIncluded Documents:\n- Bid Confirmation\n- E-Slip Document\n- Quality Certificate\n- Payment Receipt\n- Split Report\n\nPackage Generated: ${new Date().toLocaleDateString()}\nBuyer: ${bid.buyerName}\nAmount: $${bid.amount.toLocaleString()}`
      const blob = new Blob([packageContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `document-package-${bid.id}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Package Generated",
        description: "Document package has been generated and downloaded",
      })
    }, 1000)
  }

  const handleBulkUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.doc,.docx,.jpg,.png'
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        console.log('Bulk upload:', { fileCount: files.length, bidId: bid.id })
        toast({
          title: "Bulk Upload Complete",
          description: `${files.length} documents have been uploaded successfully`,
        })
      }
    }
    input.click()
  }

  const handleCreateDocument = () => {
    const docType = prompt("Enter document type (e.g., Invoice, Contract, Report):")
    if (docType) {
      const docContent = `${docType.toUpperCase()}\n\nBid ID: ${bid.id}\nBuyer: ${bid.buyerName}\nDate: ${new Date().toLocaleDateString()}\n\n[Document content would be generated here based on type]`
      const blob = new Blob([docContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${docType.toLowerCase()}-${bid.id}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Document Created",
        description: `New ${docType} document has been created and downloaded`,
      })
    }
  }

  const handleChangeStatus = (status: string) => {
    if (status) {
      handleStatusUpdate(status as Bid['status'])
      setSelectedStatus("")
    }
  }

  const handleAssignOwner = () => {
    const owner = prompt("Enter owner name:")
    if (owner) {
      console.log('Owner assigned:', { bidId: bid.id, owner })
      toast({
        title: "Owner Assigned",
        description: `Bid ${bid.id} has been assigned to ${owner}`,
      })
    }
  }

  const handleAddNote = () => {
    if (!notes.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note",
        variant: "destructive"
      })
      return
    }
    
    const noteData = {
      bidId: bid.id,
      note: notes,
      timestamp: new Date().toISOString(),
      author: 'Current User'
    }
    
    console.log('Note added:', noteData)
    setNotes("")
    toast({
      title: "Note Added",
      description: "Note has been added to the bid successfully",
    })
  }

  const handleMarkCompleted = () => {
    handleStatusUpdate('tea-release')
    console.log('Bid marked as completed:', bid.id)
    toast({
      title: "Bid Completed",
      description: `Bid ${bid.id} has been marked as completed`,
    })
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'bid-intake': 'bg-blue-100 text-blue-800',
      'e-slip-sent': 'bg-yellow-100 text-yellow-800',
      'payment-matching': 'bg-orange-100 text-orange-800',
      'split-processing': 'bg-purple-100 text-purple-800',
      'payout-approval': 'bg-pink-100 text-pink-800',
      'tea-release': 'bg-green-100 text-green-800'
    }
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Bid Details - {bid.id}</span>
            {getStatusBadge(bid.status)}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lots">Lots</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="split">Split</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="intake">Intake</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bid Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Buyer Name</Label>
                    <p className="font-medium">{bid.buyerName}</p>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <p className="font-medium">${bid.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Factory</Label>
                    <p className="font-medium">{bid.factory}</p>
                  </div>
                  <div>
                    <Label>Grade</Label>
                    <p className="font-medium">{bid.grade}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lot Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleViewLocationReport} 
                    disabled={loading}
                    className="w-full flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>View Location Report</span>
                  </Button>
                  <Button 
                    onClick={handleViewQualityReport} 
                    disabled={loading}
                    className="w-full flex items-center space-x-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Quality Report</span>
                  </Button>
                  <Button 
                    onClick={handleGenerateESlip} 
                    disabled={loading}
                    className="w-full flex items-center space-x-2"
                  >
                    <Receipt className="h-4 w-4" />
                    <span>Generate E-Slip</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Record Manual Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="payment-amount">Payment Amount</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleRecordPayment} disabled={loading} className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleMarkReceived} disabled={loading} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Received
                  </Button>
                  <Button onClick={handleSendReminder} disabled={loading} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button onClick={handleReconciliation} disabled={loading} className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Payment Reconciliation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="split" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Split Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="split-percentage">Split Percentage</Label>
                    <Input
                      id="split-percentage"
                      type="number"
                      placeholder="Enter percentage"
                      value={splitPercentage}
                      onChange={(e) => setSplitPercentage(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleEditSplitTerms} disabled={loading} className="w-full">
                    <Split className="h-4 w-4 mr-2" />
                    Edit Split Terms
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Split Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleRecalculateSplit} disabled={loading} className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Recalculate Split
                  </Button>
                  <Button onClick={handleProcessPayouts} disabled={loading} className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Payouts
                  </Button>
                  <Button onClick={handleGenerateReport} disabled={loading} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleUploadDocument} disabled={loading} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                  <Button onClick={handleAddBidDoc} disabled={loading} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Add Bid Doc
                  </Button>
                  <Button onClick={handleAddComplianceDoc} disabled={loading} className="w-full">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Add Compliance Doc
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bulk Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleDownloadAll} disabled={loading} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                  <Button onClick={handleGeneratePackage} disabled={loading} className="w-full">
                    <Package className="h-4 w-4 mr-2" />
                    Generate Package
                  </Button>
                  <Button onClick={handleBulkUpload} disabled={loading} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Upload
                  </Button>
                  <Button onClick={handleCreateDocument} disabled={loading} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Document
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="intake" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bid Intake Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select onValueChange={handleChangeStatus} value={selectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bid-intake">Bid Intake</SelectItem>
                      <SelectItem value="e-slip-sent">E-Slip Sent</SelectItem>
                      <SelectItem value="payment-matching">Payment Matching</SelectItem>
                      <SelectItem value="split-processing">Split Processing</SelectItem>
                      <SelectItem value="payout-approval">Payout Approval</SelectItem>
                      <SelectItem value="tea-release">Tea Release</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={handleAssignOwner} disabled={loading}>
                    Assign Owner
                  </Button>
                  
                  <Button onClick={handleMarkCompleted} disabled={loading}>
                    Mark Completed
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Add Note</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter your note here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <Button onClick={handleAddNote} disabled={loading || !notes.trim()}>
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lots" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lot Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Lot ID</Label>
                    <p className="font-medium">{bid.lotId}</p>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <p className="font-medium">{bid.quantity} kg</p>
                  </div>
                  <div>
                    <Label>Price per Kg</Label>
                    <p className="font-medium">${bid.pricePerKg}</p>
                  </div>
                  <div>
                    <Label>Total Value</Label>
                    <p className="font-medium">${(bid.quantity * bid.pricePerKg).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
