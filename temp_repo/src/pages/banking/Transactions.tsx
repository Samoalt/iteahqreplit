import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter, Download, Eye, Link, CheckCircle, XCircle, AlertCircle, Code } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [entityFilter, setEntityFilter] = useState("all")
  const [linkedFilter, setLinkedFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  const transactions = [
    {
      id: "TXN-001234",
      wallet: "KES",
      entity: "Premium Tea Co.",
      entityType: "buyer",
      amount: 450000,
      date: "2024-01-15",
      status: "completed",
      linkedGL: true,
      glCode: "ACC-4001",
      type: "incoming",
      reference: "BID-789",
      description: "Payment for Lot #456"
    },
    {
      id: "TXN-001235",
      wallet: "USD",
      entity: "Nandi Hills Factory",
      entityType: "factory",
      amount: 15000,
      date: "2024-01-14",
      status: "pending",
      linkedGL: false,
      glCode: "",
      type: "outgoing",
      reference: "SPLIT-123",
      description: "Split payment to factory"
    },
    {
      id: "TXN-001236",
      wallet: "KES",
      entity: "Highland Tea Ltd.",
      entityType: "buyer",
      amount: 280000,
      date: "2024-01-13",
      status: "completed",
      linkedGL: true,
      glCode: "ACC-4002",
      type: "incoming",
      reference: "BID-790",
      description: "Payment for multiple lots"
    },
    {
      id: "TXN-001237",
      wallet: "USD",
      entity: "Kencho Tea Factory",
      entityType: "factory",
      amount: 8500,
      date: "2024-01-12",
      status: "failed",
      linkedGL: false,
      glCode: "",
      type: "outgoing",
      reference: "SPLIT-124",
      description: "Failed factory payment"
    }
  ]

  const glCodes = [
    { value: "ACC-4001", label: "ACC-4001 - Tea Sales Revenue" },
    { value: "ACC-4002", label: "ACC-4002 - Auction Proceeds" },
    { value: "ACC-5001", label: "ACC-5001 - Factory Payments" },
    { value: "ACC-5002", label: "ACC-5002 - Commission Expenses" },
    { value: "ACC-1001", label: "ACC-1001 - Cash at Bank" },
    { value: "ACC-1002", label: "ACC-1002 - Trade Receivables" },
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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesEntity = entityFilter === "all" || transaction.entityType === entityFilter
    const matchesLinked = linkedFilter === "all" || 
                         (linkedFilter === "linked" && transaction.linkedGL) ||
                         (linkedFilter === "not-linked" && !transaction.linkedGL)
    
    return matchesSearch && matchesStatus && matchesEntity && matchesLinked
  })

  const handleGLCodeAssign = (transactionId: string, glCode: string) => {
    toast({
      title: "GL Code Assigned",
      description: `GL Code ${glCode} assigned to transaction ${transactionId}`,
    })
  }

  const handleLinkToGL = (transactionId: string) => {
    toast({
      title: "Linked to GL",
      description: `Transaction ${transactionId} has been linked to General Ledger`,
    })
  }

  const handleMarkVerified = (transactionId: string) => {
    toast({
      title: "Marked as Verified",
      description: `Transaction ${transactionId} has been marked as verified`,
    })
  }

  const handleDownloadReceipt = (transaction: any) => {
    console.log('Generating PDF receipt for:', transaction.id)
    
    const receiptData = {
      transactionId: transaction.id,
      date: new Date().toISOString(),
      amount: transaction.amount,
      currency: transaction.wallet,
      entity: transaction.entity,
      description: transaction.description
    }
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${transaction.id}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for transaction ${transaction.id} has been downloaded`,
    })
  }

  const handleExportTransactions = () => {
    const csvContent = [
      ['Transaction ID', 'Wallet', 'Entity', 'Amount', 'Date', 'Status', 'GL Code', 'Reference'],
      ...filteredTransactions.map(t => [
        t.id, t.wallet, t.entity, t.amount.toString(), t.date, t.status, t.glCode || '', t.reference
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all-transactions.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Export Complete",
      description: "All transaction data has been exported to CSV",
    })
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-secondary min-h-screen animate-fade-in">
      <div className="elastic-card border-0 elastic-shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold elastic-gradient-text mb-2">All Transactions</h1>
            <p className="text-lg font-semibold text-slate-700">Track and manage wallet transactions</p>
          </div>
          
          <Button onClick={handleExportTransactions} className="elastic-button-primary elastic-shadow-lg">
            <Download className="h-5 w-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="elastic-card border-0 elastic-shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="elastic-search">
            <Search className="search-icon h-5 w-5" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="elastic-input font-semibold"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="elastic-input font-semibold">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-slate-300 elastic-shadow z-50">
              <SelectItem value="all" className="font-semibold">All Status</SelectItem>
              <SelectItem value="completed" className="font-semibold">Completed</SelectItem>
              <SelectItem value="pending" className="font-semibold">Pending</SelectItem>
              <SelectItem value="failed" className="font-semibold">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="elastic-input font-semibold">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-slate-300 elastic-shadow z-50">
              <SelectItem value="all" className="font-semibold">All Entities</SelectItem>
              <SelectItem value="buyer" className="font-semibold">Buyers</SelectItem>
              <SelectItem value="factory" className="font-semibold">Factories</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={linkedFilter} onValueChange={setLinkedFilter}>
            <SelectTrigger className="elastic-input font-semibold">
              <SelectValue placeholder="GL Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-slate-300 elastic-shadow z-50">
              <SelectItem value="all" className="font-semibold">All GL Status</SelectItem>
              <SelectItem value="linked" className="font-semibold">Linked to GL</SelectItem>
              <SelectItem value="not-linked" className="font-semibold">Not Linked</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("all")
              setEntityFilter("all")
              setLinkedFilter("all")
            }}
            className="elastic-button-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="elastic-table">
        <div className="elastic-card-header border-b-2 border-slate-200 p-6">
          <h2 className="text-2xl font-display font-bold text-slate-900">
            Transactions ({filteredTransactions.length})
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-secondary hover:bg-gradient-secondary border-b-2 border-slate-200">
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4 px-6">Transaction ID</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4 px-6">Wallet</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4 px-6">Entity</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4 px-6">Amount</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4 px-6">Date</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4 px-6">Status</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4 px-6">GL Code</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide py-4 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-slate-50 border-b border-slate-200 transition-colors duration-200">
                <TableCell className="font-display font-bold text-blue-600 text-base py-4 px-6">
                  {transaction.id}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="elastic-badge elastic-badge-info">
                    {transaction.wallet}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div>
                    <div className="font-display font-bold text-slate-900 text-base">{transaction.entity}</div>
                    <div className="text-sm font-semibold text-slate-600 capitalize mt-1">{transaction.entityType}</div>
                  </div>
                </TableCell>
                <TableCell className="font-numeric font-bold py-4 px-6">
                  <span className={`font-mono font-bold text-base ${transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'incoming' ? '+' : '-'}
                    {formatCurrency(transaction.amount, transaction.wallet)}
                  </span>
                </TableCell>
                <TableCell className="text-slate-700 font-bold text-base py-4 px-6">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-4 px-6">
                  {getStatusBadge(transaction.status)}
                </TableCell>
                <TableCell className="py-4 px-6">
                  {transaction.linkedGL ? (
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded-full bg-green-100">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{transaction.glCode}</span>
                    </div>
                  ) : (
                    <Select onValueChange={(value) => handleGLCodeAssign(transaction.id, value)}>
                      <SelectTrigger className="w-40 h-10 text-sm font-semibold elastic-input">
                        <SelectValue placeholder="Assign GL Code" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-slate-300 elastic-shadow z-50">
                        {glCodes.map((code) => (
                          <SelectItem key={code.value} value={code.value} className="text-sm font-semibold">
                            {code.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {!transaction.linkedGL && (
                      <Button
                        size="sm"
                        onClick={() => handleLinkToGL(transaction.id)}
                        className="text-sm elastic-button-secondary"
                      >
                        <Link className="h-4 w-4 mr-1" />
                        Link GL
                      </Button>
                    )}
                    
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-sm elastic-button-secondary"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px] bg-white border-l-2 border-slate-300 elastic-shadow-lg">
                        <SheetHeader>
                          <SheetTitle className="text-2xl font-display font-bold text-slate-900">Transaction Details</SheetTitle>
                        </SheetHeader>
                        {selectedTransaction && (
                          <div className="space-y-6 mt-6">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-display font-bold text-slate-900 mb-3 text-lg">Transaction Meta</h3>
                                <div className="space-y-3 text-base">
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-semibold">ID:</span>
                                    <span className="font-bold text-slate-900">{selectedTransaction.id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-semibold">Reference:</span>
                                    <span className="font-bold text-slate-900">{selectedTransaction.reference}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-semibold">Date:</span>
                                    <span className="font-bold text-slate-900">{new Date(selectedTransaction.date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-display font-bold text-slate-900 mb-3 text-lg">Wallet Info</h3>
                                <div className="space-y-3 text-base">
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-semibold">Currency:</span>
                                    <span className="font-bold text-slate-900">{selectedTransaction.wallet}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-semibold">Amount:</span>
                                    <span className={`font-bold text-lg font-numeric ${selectedTransaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                                      {selectedTransaction.type === 'incoming' ? '+' : '-'}
                                      {formatCurrency(selectedTransaction.amount, selectedTransaction.wallet)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-display font-bold text-slate-900 mb-3 text-lg">Party Information</h3>
                                <div className="space-y-3 text-base">
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-semibold">Entity:</span>
                                    <span className="font-bold text-slate-900">{selectedTransaction.entity}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-semibold">Type:</span>
                                    <span className="font-bold text-slate-900 capitalize">{selectedTransaction.entityType}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-700 font-semibold">Description:</span>
                                    <span className="font-bold text-slate-900">{selectedTransaction.description}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 pt-4 border-t-2 border-slate-200">
                              <Button 
                                className="w-full elastic-button-primary" 
                                onClick={() => handleMarkVerified(selectedTransaction.id)}
                              >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Mark as Verified
                              </Button>
                              
                              {!selectedTransaction.linkedGL && (
                                <Button 
                                  className="w-full elastic-button-secondary"
                                  onClick={() => handleLinkToGL(selectedTransaction.id)}
                                >
                                  <Link className="h-5 w-5 mr-2" />
                                  Link to GL
                                </Button>
                              )}
                              
                              <Button 
                                className="w-full elastic-button-secondary"
                                onClick={() => handleDownloadReceipt(selectedTransaction)}
                              >
                                <Download className="h-5 w-5 mr-2" />
                                Download Receipt
                              </Button>
                            </div>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Transactions
