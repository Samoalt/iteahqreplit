import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, Users, PieChart, DollarSign, Edit, Upload, Download, FileSpreadsheet, Loader2 } from "lucide-react"
import { Bid } from "@/types/bid"
import { useBidState } from "@/contexts/BidStateContext"
import { SplitEditModal } from "./modals/SplitEditModal"
import { FileUploadModal } from "./modals/FileUploadModal"
import { generateSplitReportContent, createBlobDownload } from "@/utils/fileOperations"

interface BidSplitTabProps {
  bid: Bid
}

export const BidSplitTab = ({ bid }: BidSplitTabProps) => {
  const [isSplitEditModalOpen, setIsSplitEditModalOpen] = useState(false)
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false)
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const { updateBidData, uploadFile, generateReport, checkPermission, loading: contextLoading } = useBidState()

  const isSplitProcessing = bid.status === 'split-processing'
  const isSplitCompleted = ['payout-approval', 'tea-release'].includes(bid.status)
  
  // Enhanced split data with account numbers and status
  const totalAmount = bid.amount
  const splits = bid.splitDetails?.beneficiaries || [
    { name: `${bid.factory} Factory`, accountNumber: 'ACC-001-789', percentage: 85, fixedAmount: totalAmount * 0.85, status: 'ready' as const },
    { name: 'Broker Commission', accountNumber: 'ACC-002-456', percentage: 2, fixedAmount: totalAmount * 0.02, status: 'ready' as const },
    { name: 'Warehouse Fee', accountNumber: 'ACC-003-123', percentage: 3, fixedAmount: totalAmount * 0.03, status: 'ready' as const },
    { name: 'Platform Fee', accountNumber: 'ACC-004-890', percentage: 5, fixedAmount: totalAmount * 0.05, status: 'ready' as const },
    { name: 'Taxes & Duties', accountNumber: 'ACC-005-567', percentage: 5, fixedAmount: totalAmount * 0.05, status: 'ready' as const }
  ].filter(split => (split.fixedAmount || 0) > 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'adjusted': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const handleRecalculate = async () => {
    if (!checkPermission('approve_splits')) return
    
    setIsRecalculating(true)
    try {
      // Simulate recalculation
      await new Promise(resolve => setTimeout(resolve, 1500))
      await updateBidData(bid.id, {
        splitDetails: {
          ...bid.splitDetails,
          beneficiaries: splits.map(split => ({ ...split, status: 'ready' as const }))
        }
      })
    } catch (error) {
      console.error('Failed to recalculate split:', error)
    } finally {
      setIsRecalculating(false)
    }
  }

  const handleEditSplit = () => {
    if (!checkPermission('approve_splits')) return
    setIsSplitEditModalOpen(true)
  }

  const handleSplitSaved = async (beneficiaries: any[]) => {
    try {
      await updateBidData(bid.id, {
        splitDetails: {
          ...bid.splitDetails,
          beneficiaries
        }
      })
      setIsSplitEditModalOpen(false)
    } catch (error) {
      console.error('Failed to save split:', error)
    }
  }

  const handleProcessPayouts = async () => {
    if (!checkPermission('approve_splits')) return
    
    setIsProcessing(true)
    try {
      await generateReport(bid.id, 'split')
      // In real app, this would advance the bid status
    } catch (error) {
      console.error('Failed to process payouts:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUploadCSV = () => {
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

  const handleDownloadSplitPDF = async () => {
    setIsDownloading(true)
    try {
      const content = generateSplitReportContent(bid)
      createBlobDownload(content, `Split-Report_${bid.id}.txt`)
    } catch (error) {
      console.error('Failed to download split report:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleInitiateSplit = async () => {
    if (!checkPermission('approve_splits')) return
    
    setIsProcessing(true)
    try {
      await updateBidData(bid.id, { status: 'split-processing' })
    } catch (error) {
      console.error('Failed to initiate split:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Split Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Split Breakdown
            </div>
            <Badge variant={isSplitCompleted ? "default" : isSplitProcessing ? "secondary" : "outline"}>
              {isSplitCompleted ? "Approved" : isSplitProcessing ? "Processing" : "Pending"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-sm text-slate-600">Total Bid Amount</p>
            <p className="text-3xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
          </div>

          {/* Split Table */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-600 border-b pb-2">
              <div className="col-span-3">Beneficiary Name</div>
              <div className="col-span-3">Account Number</div>
              <div className="col-span-2">Percentage</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Status</div>
            </div>
            
            {splits.map((split, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center p-3 bg-slate-50 rounded-lg">
                <div className="col-span-3">
                  <p className="font-medium text-slate-900">{split.name}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-slate-600 font-mono">{split.accountNumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">{split.percentage}%</p>
                </div>
                <div className="col-span-2">
                  <p className="font-bold text-slate-900">${(split.fixedAmount || 0).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <Badge className={getStatusColor(split.status)}>{split.status}</Badge>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="bg-slate-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-900">Total Allocated</span>
              <span className="text-lg font-bold text-slate-900">
                ${splits.reduce((sum, split) => sum + (split.fixedAmount || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Split Management */}
      <Card>
        <CardHeader>
          <CardTitle>Split Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="adjustmentReason">Adjustment Reason</Label>
              <Input id="adjustmentReason" placeholder="Enter reason for split adjustment..." />
            </div>
            <div>
              <Label htmlFor="splitDate">Split Processing Date</Label>
              <Input id="splitDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleRecalculate}
              disabled={isRecalculating || contextLoading || !checkPermission('approve_splits')}
            >
              {isRecalculating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Recalculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Recalculate Split
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleEditSplit}
              disabled={contextLoading || !checkPermission('approve_splits')}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Split Structure
            </Button>
            <Button 
              variant="outline" 
              onClick={handleUploadCSV}
              disabled={contextLoading || !checkPermission('upload_files')}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV Splits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Beneficiaries Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Beneficiary Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {splits.filter(split => split.name.includes('Factory') || split.name.includes('Broker')).map((beneficiary, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{beneficiary.name}</p>
                  <p className="text-sm text-slate-600">Account: {beneficiary.accountNumber}</p>
                  <p className="text-xs text-slate-500">
                    {beneficiary.name.includes('Factory') ? 'Primary Producer' : 'Commission Agent'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${(beneficiary.fixedAmount || 0).toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Bank Transfer</p>
                  <Badge className={getStatusColor(beneficiary.status)}>
                    {beneficiary.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Split Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Split Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleInitiateSplit}
              disabled={isProcessing || contextLoading || !checkPermission('approve_splits')}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initiating...
                </>
              ) : (
                <>
                  <PieChart className="w-4 h-4 mr-2" />
                  Initiate Split Processing
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleProcessPayouts}
              disabled={isProcessing || contextLoading || !checkPermission('approve_splits')}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Process Payouts
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownloadSplitPDF}
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
                  Download Split Statement
                </>
              )}
            </Button>
            <Button variant="outline">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Split Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bid.splitDetails?.auditTrail?.length ? (
              bid.splitDetails.auditTrail.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{entry.action}</p>
                    <p className="text-xs text-slate-500">{entry.date} • {entry.user}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Split structure created</p>
                    <p className="text-xs text-slate-500">{new Date().toLocaleDateString()} • System</p>
                  </div>
                </div>
                {isSplitProcessing && (
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Split processing initiated</p>
                      <p className="text-xs text-slate-500">{new Date().toLocaleDateString()} • System</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <SplitEditModal
        isOpen={isSplitEditModalOpen}
        onOpenChange={setIsSplitEditModalOpen}
        onSave={handleSplitSaved}
        totalAmount={totalAmount}
        currentBeneficiaries={splits}
      />

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
