import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Clock, CheckCircle, AlertCircle, Search, Plus, Eye, Download } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { NewPaymentModal } from "@/components/banking/NewPaymentModal"
import { PaymentApprovalDialog } from "@/components/banking/PaymentApprovalDialog"

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [selectedPaymentForApproval, setSelectedPaymentForApproval] = useState<any>(null)

  const payments = [
    { 
      id: "PAY001", 
      recipient: "Mountain Tea Suppliers", 
      amount: "$25,400", 
      status: "pending_approval", 
      date: "2024-01-15", 
      type: "Bank Transfer",
      approver: "Finance Manager",
      reference: "INV-2024-001",
      initiator: {
        name: "Sarah Johnson",
        role: "Accounts Payable Clerk",
        date: "2024-01-15 09:30",
        comments: "Payment for tea supplies as per purchase order PO-2024-001. All documentation verified."
      }
    },
    { 
      id: "PAY002", 
      recipient: "Quality Packaging Ltd", 
      amount: "$8,950", 
      status: "initiated", 
      date: "2024-01-15", 
      type: "ACH",
      approver: "Approved",
      reference: "INV-2024-002",
      initiator: {
        name: "Mike Chen",
        role: "Procurement Officer", 
        date: "2024-01-14 14:20",
        comments: "Payment for packaging materials delivered and inspected."
      },
      authorizer: {
        name: "John Smith",
        role: "Finance Manager",
        date: "2024-01-15 10:15",
        comments: "Approved after reviewing supporting documents. Payment authorized for processing.",
        decision: 'approved' as const
      }
    },
    { 
      id: "PAY003", 
      recipient: "Export Logistics Co", 
      amount: "$12,600", 
      status: "confirmed", 
      date: "2024-01-14", 
      type: "Wire Transfer",
      approver: "Completed",
      reference: "INV-2024-003"
    },
    { 
      id: "PAY004", 
      recipient: "Transport Partners", 
      amount: "$3,200", 
      status: "failed", 
      date: "2024-01-14", 
      type: "Bank Transfer",
      approver: "Failed - Insufficient Funds",
      reference: "INV-2024-004"
    },
    { 
      id: "PAY005", 
      recipient: "Tea Growers Coop", 
      amount: "$45,800", 
      status: "pending_approval", 
      date: "2024-01-14", 
      type: "Wire Transfer",
      approver: "Operations Manager",
      reference: "INV-2024-005"
    },
  ]

  const filteredPayments = payments.filter(payment => 
    payment.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.reference.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApprove = (paymentId: string) => {
    toast({
      title: "Payment Approved",
      description: `Payment ${paymentId} has been approved and will be processed`,
    })
  }

  const handleReject = (paymentId: string) => {
    toast({
      title: "Payment Rejected",
      description: `Payment ${paymentId} has been rejected`,
      variant: "destructive"
    })
  }

  const handleBulkApprove = () => {
    if (selectedPayments.length === 0) {
      toast({
        title: "No Payments Selected",
        description: "Please select payments to approve",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Bulk Approval",
      description: `${selectedPayments.length} payments approved for processing`,
    })
    setSelectedPayments([])
  }

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    )
  }

  const handleViewDetails = (payment: any) => {
    setSelectedPaymentForApproval(payment)
    setShowApprovalDialog(true)
  }

  const handleExport = () => {
    // Generate CSV export of all payments
    const csvData = payments.map(payment => ({
      ID: payment.id,
      Recipient: payment.recipient,
      Amount: payment.amount,
      Status: payment.status,
      Date: payment.date,
      Type: payment.type,
      Reference: payment.reference,
      Initiator: payment.initiator?.name || '',
      'Initiator Role': payment.initiator?.role || '',
      'Initiation Date': payment.initiator?.date || '',
      Comments: payment.initiator?.comments || ''
    }))
    
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `payments-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Export Complete",
      description: "Payments data has been exported to CSV",
    })
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="elastic-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold elastic-gradient-text mb-2">Payments</h1>
            <p className="text-slate-600 text-lg">Payment processing and approval workflow</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExport} className="elastic-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="elastic-button-primary" onClick={() => setShowNewPaymentModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Payment
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 elastic-slide-up">
        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Approval</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">2</p>
              <p className="text-xs text-slate-500">$71,200 total</p>
            </div>
            <Clock className="h-8 w-8 text-amber-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Processing</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">1</p>
              <p className="text-xs text-slate-500">$8,950 total</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">1</p>
              <p className="text-xs text-slate-500">$12,600 total</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Failed</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">1</p>
              <p className="text-xs text-slate-500">$3,200 total</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      <Card className="elastic-card elastic-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="elastic-gradient-text">Payment Queue</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="elastic-search">
                <Search className="search-icon" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              {selectedPayments.length > 0 && (
                <Button onClick={handleBulkApprove} className="elastic-button-primary">
                  Approve Selected ({selectedPayments.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:bg-slate-50 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {payment.status === 'pending_approval' && (
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={() => togglePaymentSelection(payment.id)}
                        className="rounded border-slate-300 text-elastic-navy-600 focus:ring-elastic-navy-500"
                      />
                    )}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-slate-50">
                      <CreditCard className="h-5 w-5 text-elastic-navy-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 font-numeric">{payment.amount}</p>
                      <p className="text-sm text-slate-600">to {payment.recipient}</p>
                      <p className="text-xs text-slate-400">Ref: {payment.reference}</p>
                      <p className="text-xs text-slate-400">{payment.type}</p>
                      {payment.initiator && (
                        <p className="text-xs text-elastic-teal-600 font-medium">Initiated by: {payment.initiator.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`elastic-badge ${
                        payment.status === 'confirmed' ? 'elastic-badge-success' :
                        payment.status === 'failed' ? 'elastic-badge-error' :
                        payment.status === 'initiated' ? 'elastic-badge-info' :
                        'elastic-badge-warning'
                      }`}>
                        {payment.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">{payment.date}</p>
                      <p className="text-xs text-slate-400">{payment.approver}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(payment)} className="elastic-button-secondary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.status === 'pending_approval' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReject(payment.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApprove(payment.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Approve
                          </Button>
                        </>
                      )}
                      {payment.status === 'failed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleApprove(payment.id)}
                          className="elastic-button-secondary"
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <NewPaymentModal 
        open={showNewPaymentModal} 
        onOpenChange={setShowNewPaymentModal}
      />

      <PaymentApprovalDialog
        open={showApprovalDialog}
        onOpenChange={setShowApprovalDialog}
        payment={selectedPaymentForApproval}
      />
    </div>
  )
}

export default Payments
