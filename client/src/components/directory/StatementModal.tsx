
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

interface StatementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entity: {
    id: string
    name: string
    type: string
  }
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
    id: 'TXN-001',
    date: '2024-01-15',
    type: 'payment',
    description: 'Invoice #INV-2023-12-001',
    amount: 5000,
    status: 'finalized'
  },
  {
    id: 'TXN-002',
    date: '2024-01-20',
    type: 'invoice',
    description: 'Service Fee',
    amount: 250,
    status: 'draft'
  },
  {
    id: 'TXN-003',
    date: '2024-01-25',
    type: 'adjustment',
    description: 'Account Adjustment',
    amount: 100,
    status: 'pending'
  },
  {
    id: 'TXN-004',
    date: '2024-01-30',
    type: 'refund',
    description: 'Refund for Overpayment',
    amount: -50,
    status: 'reviewed'
  },
  {
    id: 'TXN-005',
    date: '2024-02-05',
    type: 'payment',
    description: 'Invoice #INV-2024-01-002',
    amount: 7500,
    status: 'disputed'
  },
  {
    id: 'TXN-006',
    date: '2024-02-10',
    type: 'invoice',
    description: 'Consulting Services',
    amount: 1200,
    status: 'finalized'
  },
  {
    id: 'TXN-007',
    date: '2024-02-15',
    type: 'adjustment',
    description: 'Late Fee',
    amount: 25,
    status: 'draft'
  },
  {
    id: 'TXN-008',
    date: '2024-02-20',
    type: 'refund',
    description: 'Partial Refund',
    amount: -25,
    status: 'pending'
  },
  {
    id: 'TXN-009',
    date: '2024-02-25',
    type: 'payment',
    description: 'Invoice #INV-2024-02-001',
    amount: 6000,
    status: 'reviewed'
  },
  {
    id: 'TXN-010',
    date: '2024-03-01',
    type: 'invoice',
    description: 'Monthly Retainer',
    amount: 1000,
    status: 'disputed'
  }
]

export const StatementModal = ({ open, onOpenChange, entity }: StatementModalProps) => {
  const [transactions] = useState(mockTransactions)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finalized':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Finalized</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pending</Badge>
      case 'reviewed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Reviewed</Badge>
      case 'disputed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Disputed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'payment':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Payment</Badge>
      case 'invoice':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Invoice</Badge>
      case 'adjustment':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Adjustment</Badge>
      case 'refund':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Refund</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border border-slate-200">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <DialogTitle className="text-2xl font-semibold text-slate-900">
                {entity?.name || 'Entity'} Statement
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Financial statement for {entity?.type || 'entity'} - January 1, 2024 to March 31, 2024
              </DialogDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0 hover:bg-slate-100"
          >
            <Download className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="space-y-6 py-4">
            {/* Summary Section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-slate-900">Entity Details</h4>
                <div className="text-sm text-slate-600">
                  <p>
                    <strong>Name:</strong> {entity?.name || 'N/A'}
                  </p>
                  <p>
                    <strong>Type:</strong> {entity?.type || 'N/A'}
                  </p>
                  <p>
                    <strong>ID:</strong> {entity?.id || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-slate-900">Statement Period</h4>
                <div className="text-sm text-slate-600">
                  <p>
                    <strong>Start Date:</strong> January 1, 2024
                  </p>
                  <p>
                    <strong>End Date:</strong> March 31, 2024
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Transactions Table */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">Transactions</h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-slate-700 font-medium">Date</TableHead>
                      <TableHead className="text-slate-700 font-medium">Type</TableHead>
                      <TableHead className="text-slate-700 font-medium">Description</TableHead>
                      <TableHead className="text-slate-700 font-medium">Amount</TableHead>
                      <TableHead className="text-slate-700 font-medium">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-slate-100">
                        <TableCell className="font-mono text-sm text-slate-900">{transaction.date}</TableCell>
                        <TableCell>{getTransactionTypeBadge(transaction.type)}</TableCell>
                        <TableCell className="text-sm text-slate-900">{transaction.description}</TableCell>
                        <TableCell className="font-mono text-slate-900">${transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">Totals</h4>
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-white border border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-slate-600">Total Income</p>
                        <p className="text-2xl font-bold text-slate-900">
                          ${totalIncome.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm text-slate-600">Total Expenses</p>
                        <p className="text-2xl font-bold text-slate-900">
                          ${totalExpenses.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
