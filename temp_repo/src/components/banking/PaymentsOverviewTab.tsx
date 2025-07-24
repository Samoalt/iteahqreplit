import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Search, 
  Filter, 
  Download, 
  Send, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar as CalendarIcon,
  Eye,
  MoreHorizontal
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface PaymentsOverviewTabProps {
  wallets: any[]
}

interface Payment {
  id: string
  type: 'sent' | 'received' | 'scheduled' | 'failed' | 'pending'
  amount: number
  currency: string
  beneficiary: string
  purpose: string
  status: string
  date: string
  walletId: string
  lotReference?: string
  buyerReference?: string
  releaseReference?: string
}

export const PaymentsOverviewTab = ({ wallets }: PaymentsOverviewTabProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState<Date | undefined>()

  const mockPayments: Payment[] = [
    {
      id: "PAY-001",
      type: "sent",
      amount: 450000,
      currency: "KES",
      beneficiary: "Nandi Hills Factory",
      purpose: "Lot Payout",
      status: "completed",
      date: "2024-01-15",
      walletId: "1",
      lotReference: "LOT-782",
      buyerReference: "Premium Tea Co."
    },
    {
      id: "PAY-002", 
      type: "received",
      amount: 280000,
      currency: "KES",
      beneficiary: "Highland Tea Ltd.",
      purpose: "Bid Payment",
      status: "completed", 
      date: "2024-01-14",
      walletId: "1",
      lotReference: "LOT-783",
      releaseReference: "REL-456"
    },
    {
      id: "PAY-003",
      type: "scheduled",
      amount: 15000,
      currency: "USD",
      beneficiary: "Export Logistics Co",
      purpose: "Service Fee",
      status: "scheduled",
      date: "2024-01-16",
      walletId: "2"
    },
    {
      id: "PAY-004",
      type: "failed",
      amount: 125000,
      currency: "KES", 
      beneficiary: "Global Tea Co.",
      purpose: "Refund",
      status: "failed",
      date: "2024-01-13",
      walletId: "1"
    },
    {
      id: "PAY-005",
      type: "pending",
      amount: 25000,
      currency: "USD",
      beneficiary: "Quality Packaging Ltd",
      purpose: "Invoice Payment",
      status: "pending_approval",
      date: "2024-01-15",
      walletId: "2"
    }
  ]

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.purpose.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || payment.type === filterType
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" className="text-xs font-medium">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      case 'pending_approval':
        return <Badge variant="warning" className="text-xs font-medium">
          <Clock className="h-3 w-3 mr-1" />
          Pending Approval
        </Badge>
      case 'scheduled':
        return <Badge variant="info" className="text-xs font-medium">
          <Clock className="h-3 w-3 mr-1" />
          Scheduled
        </Badge>
      case 'failed':
        return <Badge variant="error" className="text-xs font-medium">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      default:
        return <Badge variant="outline" className="text-xs font-medium">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sent':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'received':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Send className="h-4 w-4 text-slate-500" />
    }
  }

  // Calculate summary stats
  const totalSent = mockPayments
    .filter(p => p.type === 'sent' && p.status === 'completed')
    .reduce((sum, p) => sum + (p.currency === 'KES' ? p.amount : p.amount * 134), 0) // Convert USD to KES for totals

  const totalReceived = mockPayments
    .filter(p => p.type === 'received' && p.status === 'completed')
    .reduce((sum, p) => sum + (p.currency === 'KES' ? p.amount : p.amount * 134), 0)

  const pendingCount = mockPayments.filter(p => p.status === 'pending_approval' || p.status === 'scheduled').length
  const failedCount = mockPayments.filter(p => p.status === 'failed').length

  return (
    <div className="space-y-6">
      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="elastic-card border-0 elastic-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-green-100">
                <ArrowDownRight className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Received</p>
                <p className="text-2xl font-bold text-green-600 font-numeric">
                  {formatCurrency(totalReceived, 'KES')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="elastic-card border-0 elastic-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-red-100">
                <ArrowUpRight className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Sent</p>
                <p className="text-2xl font-bold text-red-600 font-numeric">
                  {formatCurrency(totalSent, 'KES')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="elastic-card border-0 elastic-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600 font-numeric">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="elastic-card border-0 elastic-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Failed</p>
                <p className="text-2xl font-bold text-red-600 font-numeric">{failedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="elastic-card border-0 elastic-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search payments by ID, beneficiary, or purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-300 text-sm"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-white border-slate-300 text-sm">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-white border-slate-300 text-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="shrink-0 text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="elastic-card border-0 elastic-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-semibold text-slate-900">
            <span>Payment Transactions</span>
            <Badge variant="outline" className="font-medium text-sm">
              {filteredPayments.length} payments
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-600 py-3">Payment ID</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-600 py-3">Type</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-600 py-3">Beneficiary</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-600 py-3">Amount</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-600 py-3">Purpose</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-600 py-3">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-600 py-3">Date</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-600 py-3">Links</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-slate-600 py-3 w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-slate-50 border-b border-slate-100">
                  <TableCell className="font-mono text-sm font-semibold text-blue-600 py-4">
                    {payment.id}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(payment.type)}
                      <span className="capitalize text-sm font-medium text-slate-900">{payment.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-slate-900 py-4">{payment.beneficiary}</TableCell>
                  <TableCell className="font-mono text-sm font-bold py-4">
                    <span className={payment.type === 'sent' ? 'text-red-600' : 'text-green-600'}>
                      {payment.type === 'sent' ? '-' : '+'}
                      {formatCurrency(payment.amount, payment.currency)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-700 py-4">{payment.purpose}</TableCell>
                  <TableCell className="py-4">{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-sm text-slate-600 py-4">
                    {format(new Date(payment.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {payment.lotReference && (
                        <Badge variant="outline" className="text-xs font-medium">
                          {payment.lotReference}
                        </Badge>
                      )}
                      {payment.buyerReference && (
                        <Badge variant="outline" className="text-xs font-medium">
                          {payment.buyerReference}
                        </Badge>
                      )}
                      {payment.releaseReference && (
                        <Badge variant="outline" className="text-xs font-medium">
                          {payment.releaseReference}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-semibold">No payments found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
