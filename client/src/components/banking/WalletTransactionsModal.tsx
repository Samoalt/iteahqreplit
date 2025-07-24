import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Download, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface WalletTransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: any
}

export const WalletTransactionsModal = ({ open, onOpenChange, wallet }: WalletTransactionsModalProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  const transactions = [
    {
      id: "TXN-001234",
      entity: "Premium Tea Co.",
      amount: 450000,
      date: "2024-01-15",
      status: "completed",
      type: "incoming",
      reference: "BID-789",
      description: "Payment for Lot #456"
    },
    {
      id: "TXN-001235",
      entity: "Nandi Hills Factory",
      amount: 15000,
      date: "2024-01-14",
      status: "pending",
      type: "outgoing",
      reference: "SPLIT-123",
      description: "Split payment to factory"
    },
    {
      id: "TXN-001236",
      entity: "Highland Tea Ltd.",
      amount: 280000,
      date: "2024-01-13",
      status: "completed",
      type: "incoming",
      reference: "BID-790",
      description: "Payment for multiple lots"
    }
  ]

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
        return (
          <span className="elastic-badge elastic-badge-success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        )
      case 'pending':
        return (
          <span className="elastic-badge elastic-badge-warning">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </span>
        )
      case 'failed':
        return (
          <span className="elastic-badge elastic-badge-error">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </span>
        )
      default:
        return <span className="elastic-badge elastic-badge-info">{status}</span>
    }
  }

  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExportCSV = () => {
    const csvContent = [
      ['Transaction ID', 'Entity', 'Amount', 'Date', 'Status', 'Type', 'Reference'],
      ...filteredTransactions.map(t => [
        t.id, t.entity, t.amount.toString(), t.date, t.status, t.type, t.reference
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${wallet?.name || 'wallet'}-transactions.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Export Complete",
      description: "Transaction data has been exported to CSV",
    })
  }

  const totalIncoming = transactions
    .filter(t => t.type === 'incoming' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOutgoing = transactions
    .filter(t => t.type === 'outgoing' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  if (!wallet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col bg-white elastic-shadow-xl border-2 border-slate-300">
        <DialogHeader className="border-b-2 border-slate-200 pb-6">
          <DialogTitle className="text-3xl font-display font-bold text-slate-900 flex items-center space-x-4">
            <div className="w-12 h-12 elastic-gradient-primary rounded-2xl flex items-center justify-center elastic-shadow-lg">
              <span className="text-white font-bold text-lg">{wallet.currency}</span>
            </div>
            <div>
              <span className="elastic-gradient-text">
                {wallet.name} Transactions
              </span>
              <p className="text-lg font-semibold text-slate-700 mt-1">
                Balance: <span className="text-green-600 font-numeric">{formatCurrency(wallet.balance, wallet.currency)}</span>
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          <div className="elastic-metric-card bg-gradient-to-br from-green-50 to-green-100 border-green-200 elastic-hover-lift">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl status-success elastic-shadow-lg">
                <ArrowDownRight className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="metric-label text-green-700 uppercase tracking-wide">Total Incoming</p>
                <p className="metric-value text-green-900 font-numeric">
                  {formatCurrency(totalIncoming, wallet.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="elastic-metric-card bg-gradient-to-br from-red-50 to-red-100 border-red-200 elastic-hover-lift">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl status-error elastic-shadow-lg">
                <ArrowUpRight className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="metric-label text-red-700 uppercase tracking-wide">Total Outgoing</p>
                <p className="metric-value text-red-900 font-numeric">
                  {formatCurrency(totalOutgoing, wallet.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="elastic-metric-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 elastic-hover-lift">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl status-info elastic-shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="metric-label text-blue-700 uppercase tracking-wide">Net Position</p>
                <p className="metric-value text-blue-900 font-numeric">
                  {formatCurrency(totalIncoming - totalOutgoing, wallet.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between elastic-card border-0 elastic-shadow mb-6">
          <div className="elastic-search flex-1 max-w-lg">
            <Search className="search-icon h-5 w-5" />
            <Input
              placeholder="Search transactions by ID, entity, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="elastic-input h-12 text-base font-medium"
            />
          </div>
          <Button onClick={handleExportCSV} className="elastic-button-secondary h-12 px-6 ml-6">
            <Download className="h-5 w-5 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="flex-1 overflow-auto elastic-table">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-secondary hover:bg-gradient-secondary border-b-2 border-slate-200">
                <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4">Transaction ID</TableHead>
                <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4">Entity</TableHead>
                <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4">Amount</TableHead>
                <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4">Date</TableHead>
                <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4">Status</TableHead>
                <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4">Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-slate-50 border-b border-slate-200 transition-colors duration-200">
                  <TableCell className="font-display font-bold text-blue-600 text-base py-4">
                    {transaction.id}
                  </TableCell>
                  <TableCell className="py-4">
                    <div>
                      <div className="font-display font-bold text-slate-900 text-base">{transaction.entity}</div>
                      <div className="text-sm font-medium text-slate-600 mt-1">{transaction.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-numeric font-bold py-4">
                    <div className={`flex items-center space-x-2 text-base ${
                      transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'incoming' ? (
                        <ArrowDownRight className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                      <span className="font-mono font-bold">
                        {transaction.type === 'incoming' ? '+' : '-'}
                        {formatCurrency(transaction.amount, wallet.currency)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700 font-semibold text-base py-4">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="py-4">
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  <TableCell className="text-slate-700 font-mono font-semibold text-base py-4">
                    {transaction.reference}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <p className="text-slate-600 text-xl font-semibold">No transactions found</p>
              <p className="text-slate-500 text-base mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-6 border-t-2 border-slate-200">
          <div className="text-base font-semibold text-slate-700">
            Showing <span className="text-blue-600 font-numeric">{filteredTransactions.length}</span> of <span className="text-blue-600 font-numeric">{transactions.length}</span> transactions
          </div>
          <Button onClick={() => onOpenChange(false)} className="elastic-button-secondary h-12 px-8">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
