
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Check, Download, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SweepDetailsModal } from "./SweepDetailsModal"
import { SweepApprovalDialog } from "./SweepApprovalDialog"

export const SweepsTable = () => {
  const [selectedSweep, setSelectedSweep] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [approvalOpen, setApprovalOpen] = useState(false)

  const sweeps = [
    {
      id: "SWP-001",
      date: "2024-01-05 14:30:00",
      sourceWallet: "Buyer Wallet - Global Tea",
      destinationWallet: "Holding Wallet - ITEA Ltd",
      amount: 2450000,
      currency: "KES",
      status: "pending",
      initiatedBy: "John Doe",
      reference: "Weekly buyer sweep - Auto triggered",
      balanceBefore: { source: 3200000, destination: 8500000 },
      balanceAfter: { source: 750000, destination: 10950000 }
    },
    {
      id: "SWP-002",
      date: "2024-01-04 23:59:00",
      sourceWallet: "Tax Holding Wallet",
      destinationWallet: "KRA Settlement Wallet",
      amount: 156000,
      currency: "KES",
      status: "completed",
      initiatedBy: "System Auto",
      reference: "Daily tax sweep - EOD processing",
      balanceBefore: { source: 156000, destination: 2400000 },
      balanceAfter: { source: 0, destination: 2556000 }
    },
    {
      id: "SWP-003",
      date: "2024-01-03 16:15:00",
      sourceWallet: "Buyer Wallet - Premium Tea Co",
      destinationWallet: "Operations Wallet",
      amount: 875000,
      currency: "KES",
      status: "failed",
      initiatedBy: "Mary Smith",
      reference: "Manual sweep - Insufficient balance",
      balanceBefore: { source: 500000, destination: 1200000 },
      balanceAfter: { source: 500000, destination: 1200000 }
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
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    }
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  const handleViewDetails = (sweep: any) => {
    setSelectedSweep(sweep)
    setDetailsOpen(true)
  }

  const handleApprove = (sweep: any) => {
    setSelectedSweep(sweep)
    setApprovalOpen(true)
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b-2 border-slate-200">
              <TableHead className="font-bold text-slate-800 text-sm uppercase tracking-wider">Sweep ID</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm uppercase tracking-wider">Date</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm uppercase tracking-wider">Source Wallet</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm uppercase tracking-wider">Destination Wallet</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm uppercase tracking-wider">Amount</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm uppercase tracking-wider">Initiated By</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sweeps.map((sweep) => (
              <TableRow key={sweep.id} className="hover:bg-slate-50 border-b border-slate-100 transition-all duration-200">
                <TableCell className="font-bold text-slate-900 font-mono">{sweep.id}</TableCell>
                <TableCell className="font-mono text-slate-800">
                  {new Date(sweep.date).toLocaleDateString()} {new Date(sweep.date).toLocaleTimeString()}
                </TableCell>
                <TableCell className="font-medium text-slate-800">{sweep.sourceWallet}</TableCell>
                <TableCell className="font-medium text-slate-800">{sweep.destinationWallet}</TableCell>
                <TableCell className="font-mono font-bold text-slate-900">
                  {formatCurrency(sweep.amount, sweep.currency)}
                </TableCell>
                <TableCell>{getStatusBadge(sweep.status)}</TableCell>
                <TableCell className="font-medium text-slate-700">{sweep.initiatedBy}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(sweep)}
                      className="h-8 border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {sweep.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(sweep)}
                        className="h-8 bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Slip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SweepDetailsModal
        sweep={selectedSweep}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <SweepApprovalDialog
        sweep={selectedSweep}
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
      />
    </>
  )
}
