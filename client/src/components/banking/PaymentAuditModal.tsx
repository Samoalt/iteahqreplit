
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  FileText, 
  DollarSign,
  ArrowRight,
  Eye,
  Download,
  ExternalLink
} from "lucide-react"
import { format } from "date-fns"

interface PaymentAuditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentId: string
}

interface AuditEvent {
  id: string
  timestamp: string
  action: string
  status: 'completed' | 'pending' | 'failed' | 'info'
  user: string
  userRole: string
  details: string
  metadata?: {
    amount?: string
    currency?: string
    reference?: string
    notes?: string
  }
}

export const PaymentAuditModal = ({ open, onOpenChange, paymentId }: PaymentAuditModalProps) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'documents'>('timeline')

  // Mock audit trail data
  const auditEvents: AuditEvent[] = [
    {
      id: "1",
      timestamp: "2024-01-15T14:30:00Z",
      action: "Payment Initiated",
      status: "completed",
      user: "John Kamau",
      userRole: "Trading Manager",
      details: "Payment request created for lot payout",
      metadata: {
        amount: "450,000",
        currency: "KES",
        reference: "LOT-782"
      }
    },
    {
      id: "2",
      timestamp: "2024-01-15T14:35:00Z",
      action: "Compliance Check",
      status: "completed",
      user: "System",
      userRole: "Automated",
      details: "AML and sanctions screening passed"
    },
    {
      id: "3",
      timestamp: "2024-01-15T14:40:00Z",
      action: "Manager Approval",
      status: "completed",
      user: "Sarah Wanjiku",
      userRole: "Operations Manager",
      details: "Payment approved for processing",
      metadata: {
        notes: "Verified against lot delivery documentation"
      }
    },
    {
      id: "4",
      timestamp: "2024-01-15T15:00:00Z",
      action: "Bank Processing",
      status: "completed",
      user: "KCB Gateway",
      userRole: "Banking Partner",
      details: "Payment submitted to banking network"
    },
    {
      id: "5",
      timestamp: "2024-01-15T15:45:00Z",
      action: "Payment Completed",
      status: "completed",
      user: "System",
      userRole: "Automated",
      details: "Payment successfully delivered to beneficiary",
      metadata: {
        reference: "TXN-KCB-789456123"
      }
    }
  ]

  const paymentDetails = {
    id: "PAY-001",
    amount: "KES 450,000",
    beneficiary: "Nandi Hills Factory",
    purpose: "Lot Payout",
    lotReference: "LOT-782",
    buyerReference: "Premium Tea Co.",
    initiator: "John Kamau",
    approver: "Sarah Wanjiku",
    bankReference: "TXN-KCB-789456123",
    createdAt: "2024-01-15T14:30:00Z",
    completedAt: "2024-01-15T15:45:00Z"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'info':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">Completed</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'info':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">Info</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Payment Audit Trail - {paymentId}
          </DialogTitle>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
            <span className="text-sm text-slate-600">
              Completed on {format(new Date(paymentDetails.completedAt), 'PPP p')}
            </span>
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          <Button
            variant={activeTab === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('timeline')}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant={activeTab === 'details' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('details')}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button
            variant={activeTab === 'documents' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('documents')}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Documents
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-lg">Audit Timeline</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                
                <div className="space-y-6">
                  {auditEvents.map((event, index) => (
                    <div key={event.id} className="relative flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-slate-200 rounded-full">
                        {getStatusIcon(event.status)}
                      </div>
                      
                      {/* Event content */}
                      <div className="flex-1 min-w-0">
                        <Card className="border-slate-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-slate-900">{event.action}</h4>
                              {getStatusBadge(event.status)}
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-3">{event.details}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">
                                  {event.user} ({event.userRole})
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">
                                  {format(new Date(event.timestamp), 'PPP p')}
                                </span>
                              </div>
                            </div>
                            
                            {event.metadata && (
                              <div className="mt-3 pt-3 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  {event.metadata.amount && (
                                    <div>
                                      <span className="text-slate-500">Amount:</span>
                                      <span className="ml-1 font-semibold">{event.metadata.currency} {event.metadata.amount}</span>
                                    </div>
                                  )}
                                  {event.metadata.reference && (
                                    <div>
                                      <span className="text-slate-500">Reference:</span>
                                      <span className="ml-1 font-mono">{event.metadata.reference}</span>
                                    </div>
                                  )}
                                  {event.metadata.notes && (
                                    <div className="col-span-2">
                                      <span className="text-slate-500">Notes:</span>
                                      <span className="ml-1">{event.metadata.notes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-slate-900 text-lg">Payment Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Transaction Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Payment ID:</span>
                      <span className="font-mono font-semibold">{paymentDetails.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Amount:</span>
                      <span className="font-bold text-green-600">{paymentDetails.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bank Reference:</span>
                      <span className="font-mono">{paymentDetails.bankReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Purpose:</span>
                      <span className="font-semibold">{paymentDetails.purpose}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Parties Involved</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Beneficiary:</span>
                      <span className="font-semibold">{paymentDetails.beneficiary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Initiated by:</span>
                      <span className="font-semibold">{paymentDetails.initiator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Approved by:</span>
                      <span className="font-semibold">{paymentDetails.approver}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Related References</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Lot:</span>
                        <span className="font-mono">{paymentDetails.lotReference}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Buyer:</span>
                        <span>{paymentDetails.buyerReference}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-slate-900 text-lg">Related Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Payment Authorization", type: "PDF", size: "245 KB", date: "Jan 15, 2024" },
                  { name: "Lot Delivery Receipt", type: "PDF", size: "189 KB", date: "Jan 14, 2024" },
                  { name: "Bank Confirmation", type: "PDF", size: "156 KB", date: "Jan 15, 2024" },
                  { name: "Compliance Report", type: "PDF", size: "298 KB", date: "Jan 15, 2024" }
                ].map((doc, index) => (
                  <Card key={index} className="hover:bg-slate-50 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-red-500" />
                          <div>
                            <p className="font-semibold text-slate-900">{doc.name}</p>
                            <p className="text-sm text-slate-600">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="bg-elastic-navy-600 hover:bg-elastic-navy-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Audit Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
