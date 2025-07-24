
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, Clock, DollarSign, User, Calendar, Filter, Receipt, AlertTriangle, Factory, Landmark } from "lucide-react"
import { useState } from "react"

interface PayoutRequest {
  id: string
  bidId: string
  buyer: string
  totalAmount: number
  factoryAmount: number
  taxAmount: number
  iteaFee: number
  status: 'pending-initiation' | 'pending-approval' | 'approved' | 'rejected'
  initiatedBy?: string
  initiatedDate?: string
  approvedBy?: string
  approvedDate?: string
  rejectionReason?: string
}

const mockPayouts: PayoutRequest[] = [
  {
    id: "PAY001",
    bidId: "BID001",
    buyer: "Global Tea Co.",
    totalAmount: 60750,
    factoryAmount: 48600,
    taxAmount: 9720,
    iteaFee: 2430,
    status: "pending-initiation"
  },
  {
    id: "PAY002", 
    bidId: "BID002",
    buyer: "Premium Tea Imports",
    totalAmount: 44064,
    factoryAmount: 35251,
    taxAmount: 7050,
    iteaFee: 1763,
    status: "pending-approval",
    initiatedBy: "John Smith",
    initiatedDate: "2024-01-16"
  },
  {
    id: "PAY003",
    bidId: "BID003", 
    buyer: "Tea Traders Inc.",
    totalAmount: 35280,
    factoryAmount: 28224,
    taxAmount: 5645,
    iteaFee: 1411,
    status: "approved",
    initiatedBy: "Sarah Johnson",
    initiatedDate: "2024-01-15",
    approvedBy: "Michael Brown",
    approvedDate: "2024-01-16"
  }
]

export const PayoutApproval = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>(mockPayouts)
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [buyerFilter, setBuyerFilter] = useState<string>("")

  const handleInitiate = (payoutId: string) => {
    setPayouts(prev => prev.map(payout => 
      payout.id === payoutId 
        ? { 
            ...payout, 
            status: 'pending-approval' as const,
            initiatedBy: "Current User",
            initiatedDate: new Date().toISOString().split('T')[0]
          }
        : payout
    ))
    console.log(`Payout ${payoutId} initiated`)
  }

  const handleApprove = (payoutId: string) => {
    setPayouts(prev => prev.map(payout => 
      payout.id === payoutId 
        ? { 
            ...payout, 
            status: 'approved' as const,
            approvedBy: "Approver User",
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : payout
    ))
    console.log(`Payout ${payoutId} approved`)
  }

  const handleReject = (payoutId: string) => {
    setPayouts(prev => prev.map(payout => 
      payout.id === payoutId 
        ? { 
            ...payout, 
            status: 'rejected' as const,
            rejectionReason: "Insufficient documentation"
          }
        : payout
    ))
    console.log(`Payout ${payoutId} rejected`)
  }

  const handleBulkApprove = () => {
    setPayouts(prev => prev.map(payout => 
      selectedPayouts.includes(payout.id) && payout.status === 'pending-approval'
        ? { 
            ...payout, 
            status: 'approved' as const,
            approvedBy: "Bulk Approver",
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : payout
    ))
    setSelectedPayouts([])
    console.log('Bulk approved payouts:', selectedPayouts)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending-initiation': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'pending-approval': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'approved': return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending-initiation': return <Clock className="h-4 w-4" />
      case 'pending-approval': return <AlertTriangle className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredPayouts = payouts.filter(payout => {
    const statusMatch = statusFilter === "all" || payout.status === statusFilter
    const buyerMatch = buyerFilter === "" || payout.buyer.toLowerCase().includes(buyerFilter.toLowerCase())
    return statusMatch && buyerMatch
  })

  const pendingApprovalCount = payouts.filter(p => p.status === 'pending-approval').length

  return (
    <TooltipProvider>
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-blue-600" />
              🧾 Payout Approval Queue
              {pendingApprovalCount > 0 && (
                <Badge className="ml-3 bg-blue-100 text-blue-800">
                  {pendingApprovalCount} Pending
                </Badge>
              )}
            </CardTitle>
            {selectedPayouts.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Bulk Approve ({selectedPayouts.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Bulk Approval</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve {selectedPayouts.length} payouts? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkApprove}>
                      Confirm Approval
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending-initiation">Pending Initiation</SelectItem>
                  <SelectItem value="pending-approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Filter by buyer..."
              value={buyerFilter}
              onChange={(e) => setBuyerFilter(e.target.value)}
              className="w-48"
            />
          </div>

          {/* Bulk Selection Controls */}
          {filteredPayouts.length > 0 && (
            <div className="flex items-center space-x-4 mt-4 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedPayouts.length === filteredPayouts.length && filteredPayouts.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPayouts(filteredPayouts.map(p => p.id))
                    } else {
                      setSelectedPayouts([])
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({filteredPayouts.length} items)
                </span>
              </div>
              {selectedPayouts.length > 0 && (
                <span className="text-sm text-blue-600 font-medium">
                  {selectedPayouts.length} selected
                </span>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredPayouts.map((payout) => (
              <Card key={payout.id} className="border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 bg-white">
                <CardContent className="p-6">
                  {/* Main Payout Info Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* Left Column: Buyer & Amount */}
                    <div className="lg:col-span-1 space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedPayouts.includes(payout.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPayouts([...selectedPayouts, payout.id])
                            } else {
                              setSelectedPayouts(selectedPayouts.filter(id => id !== payout.id))
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <div className="text-sm text-gray-500">#{payout.id}</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{payout.buyer}</h3>
                        <div className="flex items-center mt-2">
                          <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                          <span className="text-2xl font-bold text-gray-900">
                            ${payout.totalAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Bid ID: {payout.bidId}</div>
                      </div>
                    </div>

                    {/* Center-Left: Split Breakdown */}
                    <div className="lg:col-span-1">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Breakdown</h4>
                      <div className="space-y-3">
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-help">
                              <div className="flex items-center">
                                <Factory className="h-4 w-4 text-blue-600 mr-2" />
                                <span className="text-sm text-blue-900">Factory</span>
                              </div>
                              <span className="font-semibold text-blue-900">
                                ${payout.factoryAmount.toLocaleString()}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Factory Payment: {((payout.factoryAmount/payout.totalAmount)*100).toFixed(1)}% of total</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200 cursor-help">
                              <div className="flex items-center">
                                <Receipt className="h-4 w-4 text-orange-600 mr-2" />
                                <span className="text-sm text-orange-900">Tax</span>
                              </div>
                              <span className="font-semibold text-orange-900">
                                ${payout.taxAmount.toLocaleString()}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tax Withholding: {((payout.taxAmount/payout.totalAmount)*100).toFixed(1)}% of total</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200 cursor-help">
                              <div className="flex items-center">
                                <Landmark className="h-4 w-4 text-purple-600 mr-2" />
                                <span className="text-sm text-purple-900">iTea Fee</span>
                              </div>
                              <span className="font-semibold text-purple-900">
                                ${payout.iteaFee.toLocaleString()}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>iTea Platform Fee: {((payout.iteaFee/payout.totalAmount)*100).toFixed(1)}% of total</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Center-Right: Status & Workflow Timeline */}
                    <div className="lg:col-span-1 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                        <Badge className={`${getStatusColor(payout.status)} px-3 py-2 text-sm font-medium border`}>
                          {getStatusIcon(payout.status)}
                          <span className="ml-2">{payout.status.replace('-', ' ').toUpperCase()}</span>
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Workflow Timeline</h4>
                        <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          {payout.initiatedBy ? (
                            <div className="flex items-center text-sm">
                              <User className="h-3 w-3 mr-2 text-blue-600" />
                              <span className="text-gray-700">
                                Initiated by <span className="font-medium">{payout.initiatedBy}</span>
                              </span>
                              {payout.initiatedDate && (
                                <span className="text-gray-500 ml-1">on {payout.initiatedDate}</span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-2" />
                              <span>Awaiting initiation</span>
                            </div>
                          )}

                          {payout.approvedBy && (
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                              <span className="text-gray-700">
                                Approved by <span className="font-medium text-green-700">{payout.approvedBy}</span>
                              </span>
                              {payout.approvedDate && (
                                <span className="text-gray-500 ml-1">on {payout.approvedDate}</span>
                              )}
                            </div>
                          )}

                          {payout.status === 'rejected' && payout.rejectionReason && (
                            <div className="flex items-center text-sm">
                              <XCircle className="h-3 w-3 mr-2 text-red-600" />
                              <span className="text-red-700">
                                Rejected: {payout.rejectionReason}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="lg:col-span-1 flex flex-col justify-start space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Actions</h4>
                      <div className="flex flex-col space-y-2">
                        {payout.status === 'pending-initiation' && (
                          <Button 
                            onClick={() => handleInitiate(payout.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-center"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Initiate
                          </Button>
                        )}
                        
                        {payout.status === 'pending-approval' && (
                          <>
                            <Button 
                              onClick={() => handleApprove(payout.id)}
                              className="bg-green-600 hover:bg-green-700 text-white w-full justify-center"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleReject(payout.id)}
                              className="w-full justify-center"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {payout.status === 'approved' && (
                          <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-green-800 font-medium">Completed</span>
                          </div>
                        )}

                        {payout.status === 'rejected' && (
                          <div className="flex items-center justify-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            <span className="text-red-800 font-medium">Rejected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPayouts.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payouts found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
