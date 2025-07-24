import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowUpDown, Download, Filter, Search, Calendar as CalendarIcon, TrendingUp, TrendingDown, Eye, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface EnhancedWalletTransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  walletId: string
}

interface Transaction {
  id: string
  date: string
  type: string
  description: string
  amount: number
  status: string
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    date: "2024-03-15",
    type: "deposit",
    description: "Deposit from external account",
    amount: 5000,
    status: "completed",
  },
  {
    id: "TXN-002",
    date: "2024-03-10",
    type: "withdrawal",
    description: "Withdrawal to bank account",
    amount: -2500,
    status: "completed",
  },
  {
    id: "TXN-003",
    date: "2024-03-05",
    type: "transfer",
    description: "Transfer to savings account",
    amount: -1000,
    status: "pending",
  },
  {
    id: "TXN-004",
    date: "2024-02-28",
    type: "fee",
    description: "Monthly maintenance fee",
    amount: -50,
    status: "completed",
  },
  {
    id: "TXN-005",
    date: "2024-02-20",
    type: "deposit",
    description: "Salary deposit",
    amount: 6000,
    status: "completed",
  },
  {
    id: "TXN-006",
    date: "2024-02-15",
    type: "withdrawal",
    description: "Online purchase",
    amount: -300,
    status: "failed",
  },
  {
    id: "TXN-007",
    date: "2024-02-10",
    type: "transfer",
    description: "Transfer to investment account",
    amount: -2000,
    status: "completed",
  },
  {
    id: "TXN-008",
    date: "2024-02-05",
    type: "fee",
    description: "ATM withdrawal fee",
    amount: -2,
    status: "completed",
  },
  {
    id: "TXN-009",
    date: "2024-01-31",
    type: "deposit",
    description: "Interest earned",
    amount: 120,
    status: "completed",
  },
  {
    id: "TXN-010",
    date: "2024-01-25",
    type: "withdrawal",
    description: "Bill payment",
    amount: -800,
    status: "processing",
  },
]

export const EnhancedWalletTransactionsModal = ({ open, onOpenChange, walletId }: EnhancedWalletTransactionsModalProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<Date | undefined>()

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType ? transaction.type === filterType : true
    const matchesStatus = filterStatus ? transaction.status === filterStatus : true

    const matchesDate = dateRange
      ? new Date(transaction.date) <= dateRange
      : true

    return matchesSearch && matchesType && matchesStatus && matchesDate
  })

  const handleDownload = () => {
    alert("Download initiated for transactions.")
  }

  const handleTypeFilter = (type: string | null) => {
    setFilterType(type)
  }

  const handleStatusFilter = (status: string | null) => {
    setFilterStatus(status)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setDateRange(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'pending':
        return <Badge variant="info">Pending</Badge>
      case 'failed':
        return <Badge variant="error">Failed</Badge>
      case 'processing':
        return <Badge variant="processing">Processing</Badge>
      default:
        return <Badge variant="draft">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Badge variant="success" className="bg-green-100 text-green-800">Deposit</Badge>
      case 'withdrawal':
        return <Badge variant="warning" className="bg-orange-100 text-orange-800">Withdrawal</Badge>
      case 'transfer':
        return <Badge variant="info" className="bg-blue-100 text-blue-800">Transfer</Badge>
      case 'fee':
        return <Badge variant="draft" className="bg-gray-100 text-gray-800">Fee</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-white border border-slate-200">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold text-slate-900">
            Wallet Transactions - {walletId}
          </DialogTitle>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-full">
          {/* Filters & Actions */}
          <div className="w-72 border-r border-slate-200 p-4">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>

              {/* Filters */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">Filter by Type</h4>
                <Select onValueChange={handleTypeFilter}>
                  <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="fee">Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">Filter by Status</h4>
                <Select onValueChange={handleStatusFilter}>
                  <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">Filter by Date</h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500",
                        !dateRange && "text-slate-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange ? format(dateRange, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Actions */}
              <Button variant="secondary" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>

          {/* Transactions Table */}
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                    <TableCell className="text-right font-mono">{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
