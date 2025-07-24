
import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { Bid } from "@/types/bid"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  role: 'admin' | 'processor' | 'reviewer' | 'approver' | 'viewer'
  permissions: string[]
}

interface BidStateContextType {
  currentUser: User
  updateBidStatus: (bidId: string, newStatus: Bid['status'], reason: string) => Promise<void>
  updateBidData: (bidId: string, updates: Partial<Bid>) => Promise<void>
  assignBidOwner: (bidId: string, userId: string, notes: string) => Promise<void>
  addBidNote: (bidId: string, note: string, priority: string, category: string) => Promise<void>
  uploadFile: (bidId: string, file: File, category: string) => Promise<string>
  downloadFile: (bidId: string, fileId: string) => Promise<void>
  generateReport: (bidId: string, reportType: string) => Promise<string>
  checkPermission: (action: string, bidStatus?: Bid['status']) => boolean
  loading: boolean
}

const BidStateContext = createContext<BidStateContextType | null>(null)

// Mock current user - in real app, this would come from auth context
const mockUser: User = {
  id: 'user-123',
  name: 'John Doe',
  role: 'processor',
  permissions: ['view_bids', 'update_status', 'upload_files', 'generate_reports']
}

export const BidStateProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const checkPermission = useCallback((action: string, bidStatus?: Bid['status']) => {
    // Role-based permission checking
    const rolePermissions = {
      'admin': ['*'], // All permissions
      'processor': ['view_bids', 'update_status', 'upload_files', 'assign_owner'],
      'reviewer': ['view_bids', 'review_payments', 'approve_splits'],
      'approver': ['view_bids', 'approve_payouts', 'final_approval'],
      'viewer': ['view_bids']
    }

    const userPermissions = rolePermissions[mockUser.role] || []
    
    if (userPermissions.includes('*')) return true
    if (userPermissions.includes(action)) return true

    // Status-based permissions
    if (bidStatus) {
      const statusPermissions = {
        'bid-intake': ['update_status', 'assign_owner', 'upload_files'],
        'e-slip-sent': ['update_status', 'upload_files'],
        'payment-matching': ['update_status', 'review_payments'],
        'split-processing': ['update_status', 'approve_splits'],
        'payout-approval': ['approve_payouts'],
        'tea-release': ['final_approval']
      }

      const allowedActions = statusPermissions[bidStatus] || []
      return allowedActions.includes(action)
    }

    return false
  }, [])

  const updateBidStatus = useCallback(async (bidId: string, newStatus: Bid['status'], reason: string) => {
    if (!checkPermission('update_status', newStatus)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to update this bid status",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Status updated:', { bidId, newStatus, reason, updatedBy: mockUser.id })
      
      toast({
        title: "Status Updated",
        description: `Bid status changed to ${newStatus.replace('-', ' ')}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bid status",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [checkPermission, toast])

  const updateBidData = useCallback(async (bidId: string, updates: Partial<Bid>) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Bid data updated:', { bidId, updates, updatedBy: mockUser.id })
      
      toast({
        title: "Data Updated",
        description: "Bid information has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bid data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const assignBidOwner = useCallback(async (bidId: string, userId: string, notes: string) => {
    if (!checkPermission('assign_owner')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to assign bid owners",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      console.log('Owner assigned:', { bidId, userId, notes, assignedBy: mockUser.id })
      
      toast({
        title: "Owner Assigned",
        description: "Bid has been assigned successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign bid owner",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [checkPermission, toast])

  const addBidNote = useCallback(async (bidId: string, note: string, priority: string, category: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      console.log('Note added:', { bidId, note, priority, category, addedBy: mockUser.id })
      
      toast({
        title: "Note Added",
        description: "Your note has been saved to the bid",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const uploadFile = useCallback(async (bidId: string, file: File, category: string): Promise<string> => {
    if (!checkPermission('upload_files')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to upload files",
        variant: "destructive"
      })
      throw new Error("Permission denied")
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const fileId = `file-${Date.now()}`
      console.log('File uploaded:', { bidId, fileName: file.name, category, fileId, uploadedBy: mockUser.id })
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully`,
      })
      
      return fileId
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file",
        variant: "destructive"
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [checkPermission, toast])

  const downloadFile = useCallback(async (bidId: string, fileId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('File downloaded:', { bidId, fileId, downloadedBy: mockUser.id })
      
      toast({
        title: "Download Started",
        description: "File download has been initiated",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download file",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const generateReport = useCallback(async (bidId: string, reportType: string): Promise<string> => {
    if (!checkPermission('generate_reports')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to generate reports",
        variant: "destructive"
      })
      throw new Error("Permission denied")
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      const reportId = `report-${Date.now()}`
      console.log('Report generated:', { bidId, reportType, reportId, generatedBy: mockUser.id })
      
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated and is ready for download`,
      })
      
      return reportId
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report",
        variant: "destructive"
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [checkPermission, toast])

  const value = {
    currentUser: mockUser,
    updateBidStatus,
    updateBidData,
    assignBidOwner,
    addBidNote,
    uploadFile,
    downloadFile,
    generateReport,
    checkPermission,
    loading
  }

  return (
    <BidStateContext.Provider value={value}>
      {children}
    </BidStateContext.Provider>
  )
}

export const useBidState = () => {
  const context = useContext(BidStateContext)
  if (!context) {
    throw new Error('useBidState must be used within a BidStateProvider')
  }
  return context
}
