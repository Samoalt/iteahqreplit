import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, UserPlus, FileText, CheckCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockBids } from "@/data/mockBids"
import { Bid } from "@/types/bid"
import { useToast } from "@/hooks/use-toast"
import { BidProgressTracker } from "@/components/bid-processing/BidProgressTracker"
import { BidOverviewTab } from "@/components/bid-processing/BidOverviewTab"
import { BidLotsTab } from "@/components/bid-processing/BidLotsTab"
import { BidESlipTab } from "@/components/bid-processing/BidESlipTab"
import { BidPaymentTab } from "@/components/bid-processing/BidPaymentTab"
import { BidSplitTab } from "@/components/bid-processing/BidSplitTab"
import { BidPayoutTab } from "@/components/bid-processing/BidPayoutTab"
import { BidReleaseTab } from "@/components/bid-processing/BidReleaseTab"
import { BidDocumentsTab } from "@/components/bid-processing/BidDocumentsTab"
import { BidAuditLogTab } from "@/components/bid-processing/BidAuditLogTab"
import { StatusChangeModal } from "@/components/bid-processing/modals/StatusChangeModal"
import { AssignOwnerModal } from "@/components/bid-processing/modals/AssignOwnerModal"
import { AddNoteModal } from "@/components/bid-processing/modals/AddNoteModal"
import { BidStateProvider, useBidState } from "@/contexts/BidStateContext"
import { validateStatusTransition, getNextAllowedStatuses } from "@/utils/workflowAutomation"
import { 
  generateESlipContent, 
  generatePaymentReportContent, 
  generateSplitReportContent,
  generatePayoutReportContent,
  generateComplianceReportContent,
  createBlobDownload,
  printDocument
} from "@/utils/fileOperations"

const statusLabels = {
  'bid-intake': 'Bid Intake',
  'e-slip-sent': 'E-Slip Sent',
  'payment-matching': 'Payment Matching',
  'split-processing': 'Split Processing',
  'payout-approval': 'Payout Approval',
  'tea-release': 'Tea Release'
}

const statusColors = {
  'bid-intake': 'bg-yellow-100 text-yellow-800',
  'e-slip-sent': 'bg-orange-100 text-orange-800',
  'payment-matching': 'bg-blue-100 text-blue-800',
  'split-processing': 'bg-purple-100 text-purple-800',
  'payout-approval': 'bg-green-100 text-green-800',
  'tea-release': 'bg-emerald-100 text-emerald-800'
}

// Mock users for owner display
const mockUsers = [
  { id: '1', name: 'John Smith', email: 'john@example.com', role: 'Bid Processor' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Senior Processor' },
  { id: '3', name: 'Mike Chen', email: 'mike@example.com', role: 'Operations Manager' },
  { id: '4', name: 'Lisa Williams', email: 'lisa@example.com', role: 'Quality Controller' }
]

const BidDetailsContent = () => {
  const { bidId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [currentOwner, setCurrentOwner] = useState<string | undefined>(undefined)
  
  // Modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  
  const { 
    updateBidStatus, 
    assignBidOwner, 
    addBidNote, 
    uploadFile, 
    downloadFile, 
    generateReport,
    checkPermission,
    loading: bidStateLoading,
    currentUser
  } = useBidState()

  const bid = mockBids.find(b => b.id === bidId)
  
  if (!bid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Bid Not Found</h2>
          <Button onClick={() => navigate('/app/operations/bid-processing')}>
            Back to Bid Processing
          </Button>
        </div>
      </div>
    )
  }

  // Workflow dependency logic
  const isPaymentUnlocked = !['bid-intake'].includes(bid.status)
  const isSplitUnlocked = ['payment-matching', 'split-processing', 'payout-approval', 'tea-release'].includes(bid.status)
  const isPayoutUnlocked = ['split-processing', 'payout-approval', 'tea-release'].includes(bid.status)
  const isReleaseUnlocked = bid.status === 'tea-release'

  const getTabClassName = (isUnlocked: boolean, isActive: boolean) => {
    const baseClass = "data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border data-[state=active]:border-blue-200"
    
    if (!isUnlocked) {
      return `${baseClass} text-slate-400 cursor-not-allowed opacity-50`
    }
    
    return `${baseClass} text-slate-600 hover:text-slate-900`
  }

  const handleTabChange = (value: string) => {
    // Prevent navigation to locked tabs
    const tabUnlockMap: Record<string, boolean> = {
      'overview': true,
      'lots': true,
      'eslip': isPaymentUnlocked,
      'payment': isPaymentUnlocked,
      'split': isSplitUnlocked,
      'payout': isPayoutUnlocked,
      'release': isReleaseUnlocked,
      'documents': true,
      'audit': true
    }

    if (tabUnlockMap[value]) {
      setActiveTab(value)
    } else {
      toast({
        title: "Tab Locked",
        description: "Complete previous workflow steps to unlock this tab",
        variant: "destructive"
      })
    }
  }

  // Enhanced Action Handlers with proper state management
  const handleStatusChange = async (newStatus: string, reason: string) => {
    const validation = validateStatusTransition(bid, newStatus as Bid['status'], currentUser.permissions)
    
    if (!validation.valid) {
      toast({
        title: "Invalid Transition",
        description: validation.message,
        variant: "destructive"
      })
      return
    }

    try {
      await updateBidStatus(bid.id, newStatus as Bid['status'], reason)
      toast({
        title: "Status Updated",
        description: `Bid status changed to ${statusLabels[newStatus as keyof typeof statusLabels]}`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update bid status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDownload = async () => {
    if (!checkPermission('generate_reports')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to download reports",
        variant: "destructive"
      })
      return
    }

    try {
      const reportId = await generateReport(bid.id, 'summary')
      
      // Generate comprehensive summary report
      const summaryContent = `
BID SUMMARY REPORT
==================

${generateESlipContent(bid)}

${generatePaymentReportContent(bid)}

${generateSplitReportContent(bid)}

${generatePayoutReportContent(bid)}

${generateComplianceReportContent(bid)}
      `.trim()

      createBlobDownload(summaryContent, `bid-summary-${bid.id}.txt`)
      
      toast({
        title: "Download Complete",
        description: "Bid summary report has been downloaded",
      })
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: "Download Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleAssignOwner = async (userId: string, notes: string) => {
    try {
      await assignBidOwner(bid.id, userId, notes)
      setCurrentOwner(userId)
      toast({
        title: "Owner Assigned",
        description: `Bid has been assigned to ${mockUsers.find(u => u.id === userId)?.name}`,
      })
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign owner. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleAddNote = async (note: string, priority: string, category: string) => {
    try {
      await addBidNote(bid.id, note, priority, category)
      toast({
        title: "Note Added",
        description: "Your note has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Note Failed",
        description: "Failed to add note. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleMarkCompleted = async () => {
    if (!checkPermission('final_approval', bid.status)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to mark bids as completed",
        variant: "destructive"
      })
      return
    }

    try {
      await updateBidStatus(bid.id, 'tea-release', 'Bid processing completed')
      toast({
        title: "Bid Completed",
        description: "Bid has been marked as completed successfully",
      })
    } catch (error) {
      toast({
        title: "Completion Failed",
        description: "Failed to mark bid as completed. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handlePrintDocument = (content: string, title: string) => {
    printDocument(content, title)
  }

  const handleFileUpload = async (file: File, category: string) => {
    try {
      await uploadFile(bid.id, file, category)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const isLoading = bidStateLoading
  const allowedNextStatuses = getNextAllowedStatuses(bid, currentUser.permissions)
  const assignedUser = mockUsers.find(u => u.id === currentOwner)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/app/operations/bid-processing')}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Bid List
              </Button>
              
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-semibold text-slate-900">{bid.id}</h1>
                <Badge className={cn("text-sm font-medium", statusColors[bid.status])}>
                  {statusLabels[bid.status]}
                </Badge>
                {assignedUser && (
                  <Badge variant="outline" className="text-sm font-medium bg-blue-50 text-blue-700 border-blue-200">
                    <User className="w-3 h-3 mr-1" />
                    {assignedUser.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsStatusModalOpen(true)}
                disabled={isLoading || allowedNextStatuses.length === 0}
                className="text-slate-700 border-slate-300 hover:bg-slate-50 disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Change Status"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                disabled={isLoading}
                className="text-slate-700 border-slate-300 hover:bg-slate-50 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-1" />
                {isLoading ? "Generating..." : "Download"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAssignModalOpen(true)}
                disabled={isLoading || !checkPermission('assign_owner')}
                className="text-slate-700 border-slate-300 hover:bg-slate-50 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {currentOwner ? "Reassign" : "Assign Owner"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsNoteModalOpen(true)}
                disabled={isLoading}
                className="text-slate-700 border-slate-300 hover:bg-slate-50 disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-1" />
                Add Note
              </Button>
              <Button 
                size="sm" 
                onClick={handleMarkCompleted}
                disabled={isLoading || !checkPermission('final_approval', bid.status) || bid.status === 'tea-release'}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {bid.status === 'tea-release' ? 'Completed' : 'Mark Completed'}
              </Button>
            </div>
          </div>

          {/* Owner Information Row */}
          {assignedUser && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Assigned to: {assignedUser.name}</p>
                    <p className="text-xs text-blue-700">{assignedUser.role} • {assignedUser.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAssignModalOpen(true)}
                  className="text-blue-700 hover:bg-blue-100"
                >
                  Change
                </Button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <BidProgressTracker currentStatus={bid.status} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-9 bg-white border border-slate-200 p-1 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className={getTabClassName(true, activeTab === "overview")}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="lots" 
              className={getTabClassName(true, activeTab === "lots")}
            >
              Lots
            </TabsTrigger>
            <TabsTrigger 
              value="eslip" 
              className={getTabClassName(isPaymentUnlocked, activeTab === "eslip")}
            >
              E-Slip
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className={getTabClassName(isPaymentUnlocked, activeTab === "payment")}
            >
              Payment
            </TabsTrigger>
            <TabsTrigger 
              value="split" 
              className={getTabClassName(isSplitUnlocked, activeTab === "split")}
            >
              Split
            </TabsTrigger>
            <TabsTrigger 
              value="payout" 
              className={getTabClassName(isPayoutUnlocked, activeTab === "payout")}
            >
              Payout
            </TabsTrigger>
            <TabsTrigger 
              value="release" 
              className={getTabClassName(isReleaseUnlocked, activeTab === "release")}
            >
              Release
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className={getTabClassName(true, activeTab === "documents")}
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="audit" 
              className={getTabClassName(true, activeTab === "audit")}
            >
              Audit Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <BidOverviewTab bid={bid} />
          </TabsContent>

          <TabsContent value="lots" className="mt-0">
            <BidLotsTab bid={bid} />
          </TabsContent>

          <TabsContent value="eslip" className="mt-0">
            <BidESlipTab bid={bid} />
          </TabsContent>

          <TabsContent value="payment" className="mt-0">
            <BidPaymentTab bid={bid} />
          </TabsContent>

          <TabsContent value="split" className="mt-0">
            <BidSplitTab bid={bid} />
          </TabsContent>

          <TabsContent value="payout" className="mt-0">
            <BidPayoutTab bid={bid} />
          </TabsContent>

          <TabsContent value="release" className="mt-0">
            <BidReleaseTab bid={bid} />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <BidDocumentsTab bid={bid} />
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <BidAuditLogTab bid={bid} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Modals with proper integration */}
      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        onStatusChange={handleStatusChange}
        currentStatus={bid.status}
        bidId={bid.id}
        allowedStatuses={allowedNextStatuses}
        loading={isLoading}
      />

      <AssignOwnerModal
        isOpen={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        onAssignOwner={handleAssignOwner}
        bidId={bid.id}
        currentOwner={currentOwner}
        loading={isLoading}
      />

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onOpenChange={setIsNoteModalOpen}
        onAddNote={handleAddNote}
        bidId={bid.id}
        loading={isLoading}
      />
    </div>
  )
}

const BidDetails = () => {
  return (
    <BidStateProvider>
      <BidDetailsContent />
    </BidStateProvider>
  )
}

export default BidDetails
