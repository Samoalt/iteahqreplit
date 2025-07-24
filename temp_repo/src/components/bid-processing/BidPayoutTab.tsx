
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, CreditCard, Upload, CheckCircle, AlertCircle, Clock, UserCheck, FileText, Download, Loader2 } from "lucide-react"
import { Bid } from "@/types/bid"
import { useToast } from "@/hooks/use-toast"
import { createBlobDownload } from "@/utils/fileOperations"

interface BidPayoutTabProps {
  bid: Bid
}

export const BidPayoutTab = ({ bid }: BidPayoutTabProps) => {
  const { toast } = useToast()
  const [reviewNotes, setReviewNotes] = useState("")
  const [payoutMethod, setPayoutMethod] = useState("bank-transfer")
  const [loadingStates, setLoadingStates] = useState({
    review: false,
    approve: false,
    reject: false,
    downloadInstruction: false,
    downloadSummary: false,
    downloadReceipt: false
  })

  const setLoading = (action: keyof typeof loadingStates, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [action]: loading }))
  }

  const isPayoutEnabled = ['split-processing', 'payout-approval', 'tea-release'].includes(bid.status)
  const isPayoutCompleted = ['tea-release'].includes(bid.status)
  
  // Mock payout data with maker-checker workflow
  const totalAmount = bid.amount
  const factoryPayout = totalAmount * 0.85
  const platformFee = totalAmount * 0.15

  const payoutStatus = bid.payoutDetails?.status || (isPayoutCompleted ? 'approved' : isPayoutEnabled ? 'pending' : 'pending')
  const reviewedBy = bid.payoutDetails?.reviewedBy
  const reviewedDate = bid.payoutDetails?.reviewedDate
  const approvedBy = bid.payoutDetails?.approvedBy
  const approvedDate = bid.payoutDetails?.approvedDate

  // Mock user role - in real app this would come from auth context
  type UserRole = 'reviewer' | 'approver' | 'user'
  const userRole: UserRole = 'reviewer' as UserRole
  const canReview = userRole === 'reviewer' && payoutStatus === 'pending'
  const canApprove = userRole === 'approver' && payoutStatus === 'under-review'

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'under-review':
        return <UserCheck className="w-5 h-5 text-blue-500" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'under-review':
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const handleReviewPayout = async () => {
    if (!reviewNotes.trim()) {
      toast({
        title: "Review Notes Required",
        description: "Please add notes for the review",
        variant: "destructive"
      })
      return
    }

    setLoading('review', true)
    try {
      // Simulate review process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Payout Reviewed",
        description: `Payout for ${bid.id} has been reviewed and sent for approval`,
      })
      
      setReviewNotes("")
    } catch (error) {
      toast({
        title: "Review Failed",
        description: "Failed to review payout. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('review', false)
    }
  }

  const handleApprovePayout = async () => {
    setLoading('approve', true)
    try {
      // Simulate approval process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Payout Approved",
        description: `Payout for ${bid.id} has been approved and is ready for disbursement`,
      })
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve payout. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('approve', false)
    }
  }

  const handleRejectPayout = async () => {
    if (!reviewNotes.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please add notes explaining the rejection",
        variant: "destructive"
      })
      return
    }

    setLoading('reject', true)
    try {
      // Simulate rejection process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Payout Rejected",
        description: `Payout for ${bid.id} has been rejected`,
        variant: "destructive"
      })
      
      setReviewNotes("")
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject payout. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('reject', false)
    }
  }

  const handleDownloadInstruction = async () => {
    setLoading('downloadInstruction', true)
    try {
      const instructionContent = `
PAYOUT INSTRUCTION - ${bid.id}
================================

Recipient: ${bid.factory} Factory
Amount: $${factoryPayout.toLocaleString()}
Method: ${payoutMethod.replace('-', ' ').toUpperCase()}

Bank Details:
- Bank: Kenya Commercial Bank
- Account: ACC-001-789
- Swift: KCBLKENX

Processing Date: ${new Date().toISOString()}
      `.trim()

      createBlobDownload(instructionContent, `payout-instruction-${bid.id}.txt`)
      
      toast({
        title: "Instruction Downloaded",
        description: "Payout instruction has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download instruction. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('downloadInstruction', false)
    }
  }

  const handleDownloadSummary = async () => {
    setLoading('downloadSummary', true)
    try {
      // Simulate Excel generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const summaryContent = `
Bid ID,Factory,Amount,Status,Reviewed By,Approved By
${bid.id},${bid.factory},$${factoryPayout.toLocaleString()},${payoutStatus},${reviewedBy || 'N/A'},${approvedBy || 'N/A'}
      `.trim()

      createBlobDownload(summaryContent, `payout-summary-${bid.id}.csv`)
      
      toast({
        title: "Summary Downloaded",
        description: "Payout summary Excel has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download summary. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('downloadSummary', false)
    }
  }

  const handleDownloadReceipt = async () => {
    setLoading('downloadReceipt', true)
    try {
      const receiptContent = `
PAYOUT RECEIPT - ${bid.id}
===========================

Factory: ${bid.factory} Factory
Amount Paid: $${factoryPayout.toLocaleString()}
Date: ${new Date().toLocaleDateString()}
Method: ${payoutMethod.replace('-', ' ').toUpperCase()}
Status: Processed
      `.trim()

      createBlobDownload(receiptContent, `payout-receipt-${bid.id}.txt`)
      
      toast({
        title: "Receipt Downloaded",
        description: "Payout receipt has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download receipt. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('downloadReceipt', false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Payout Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Payout Status
            </div>
            {getStatusBadge(payoutStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isPayoutEnabled ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Payout Pending</p>
              <p className="text-sm text-slate-500">Complete split processing to enable payout</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">Total Payout Amount</span>
                  <span className="text-2xl font-bold text-slate-900">${factoryPayout.toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-600">To be paid to {bid.factory} Factory</p>
              </div>

              {/* Maker-Checker Workflow Status */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Approval Workflow</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${reviewedBy ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span className="text-sm font-medium">Step 1: Review (Maker)</span>
                    </div>
                    {reviewedBy ? (
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">Reviewed by: {reviewedBy}</p>
                        <p className="text-xs text-green-500">{reviewedDate}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">Pending</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${approvedBy ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span className="text-sm font-medium">Step 2: Approval (Checker)</span>
                    </div>
                    {approvedBy ? (
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">Approved by: {approvedBy}</p>
                        <p className="text-xs text-green-500">{approvedDate}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Breakdown */}
      {isPayoutEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Payout Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Factory Payout</p>
                  <p className="text-sm text-green-700">{bid.factory}</p>
                  <p className="text-xs text-green-600">Account: ACC-001-789</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-900">${factoryPayout.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Bank Transfer</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Platform Fee</p>
                  <p className="text-sm text-blue-700">iTea Platform</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-900">${platformFee.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Retained</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total Allocated</span>
              <span className="text-xl font-bold">${totalAmount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Review/Approval */}
      {isPayoutEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Payout Review & Approval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="reviewNotes">Review/Approval Notes</Label>
                <Textarea 
                  id="reviewNotes"
                  placeholder="Add notes for review or approval..."
                  className="min-h-[80px]"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="payoutMethod">Payout Method</Label>
                <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="mobile-money">Mobile Money</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">Bank Details Verification</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p><span className="font-medium">Bank:</span> Kenya Commercial Bank</p>
                <p><span className="font-medium">Account:</span> ****-****-1234</p>
                <p><span className="font-medium">Account Name:</span> {bid.factory} Factory Ltd</p>
                <p><span className="font-medium">Swift Code:</span> KCBLKENX</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Actions */}
      {isPayoutEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Payout Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {canReview && (
                <Button 
                  onClick={handleReviewPayout} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loadingStates.review}
                >
                  {loadingStates.review ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4 mr-2" />
                  )}
                  {loadingStates.review ? "Reviewing..." : "Review Payout"}
                </Button>
              )}
              
              {canApprove && (
                <>
                  <Button 
                    onClick={handleApprovePayout} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loadingStates.approve}
                  >
                    {loadingStates.approve ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {loadingStates.approve ? "Approving..." : "Approve Payout"}
                  </Button>
                  <Button 
                    onClick={handleRejectPayout} 
                    variant="destructive"
                    disabled={loadingStates.reject}
                  >
                    {loadingStates.reject ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    {loadingStates.reject ? "Rejecting..." : "Reject Payout"}
                  </Button>
                </>
              )}
              
              <Button 
                variant="outline" 
                onClick={handleDownloadInstruction}
                disabled={loadingStates.downloadInstruction}
              >
                {loadingStates.downloadInstruction ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                {loadingStates.downloadInstruction ? "Generating..." : "Download Payout Instruction"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownloadSummary}
                disabled={loadingStates.downloadSummary}
              >
                {loadingStates.downloadSummary ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {loadingStates.downloadSummary ? "Generating..." : "Download Summary Excel"}
              </Button>
              
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                View Payout History
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Table */}
      {isPayoutEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Payout Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-slate-600 border-b pb-2">
                <div>Recipient Name</div>
                <div>Amount</div>
                <div>Payment Method</div>
                <div>Account</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              <div className="grid grid-cols-6 gap-4 items-center p-3 bg-slate-50 rounded-lg">
                <div className="font-medium text-slate-900">{bid.factory} Factory</div>
                <div className="font-bold text-green-600">${factoryPayout.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Bank Transfer</div>
                <div className="text-sm text-slate-600 font-mono">ACC-001-789</div>
                <div>
                  <Badge className={payoutStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                    {payoutStatus === 'approved' ? 'Ready' : 'Pending'}
                  </Badge>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadReceipt}
                    disabled={loadingStates.downloadReceipt}
                  >
                    {loadingStates.downloadReceipt ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3 mr-1" />
                    )}
                    {loadingStates.downloadReceipt ? "..." : "Receipt"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Trail */}
      {isPayoutEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Payout Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(payoutStatus)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {payoutStatus === 'approved' ? 'Payout Approved' : 'Payout Initiated'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {payoutStatus === 'approved' ? 'Ready for disbursement' : 'Awaiting review and approval'}
                  </p>
                  <p className="text-xs text-slate-500">{new Date().toLocaleDateString()} • System</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${factoryPayout.toLocaleString()}</p>
                </div>
              </div>
              
              {reviewedBy && (
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <UserCheck className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Payout Reviewed</p>
                    <p className="text-sm text-blue-700">Reviewed by {reviewedBy}</p>
                    <p className="text-xs text-blue-500">{reviewedDate}</p>
                  </div>
                </div>
              )}
              
              {approvedBy && (
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Payout Approved</p>
                    <p className="text-sm text-green-700">Approved by {approvedBy}</p>
                    <p className="text-xs text-green-500">{approvedDate}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
