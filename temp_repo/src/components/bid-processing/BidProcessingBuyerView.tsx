
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, Eye, FileText, CreditCard, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Bid } from "@/types/bid"

interface BidProcessingBuyerViewProps {
  bids: Bid[]
  selectedBids: string[]
  onBidSelect: (bidId: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
}

const statusColors = {
  'bid-intake': 'bg-slate-100 text-slate-800 border-slate-200',
  'e-slip-sent': 'bg-blue-100 text-blue-800 border-blue-200',
  'payment-matching': 'bg-green-100 text-green-800 border-green-200',
  'split-processing': 'bg-purple-100 text-purple-800 border-purple-200',
  'payout-approval': 'bg-orange-100 text-orange-800 border-orange-200',
  'tea-release': 'bg-emerald-100 text-emerald-800 border-emerald-200'
}

const statusLabels = {
  'bid-intake': 'E-slip Pending',
  'e-slip-sent': 'E-slip Sent',
  'payment-matching': 'Paid',
  'split-processing': 'Split Processed',
  'payout-approval': 'Payout Approval',
  'tea-release': 'Released'
}

export const BidProcessingBuyerView = ({
  bids,
  selectedBids,
  onBidSelect,
  onSelectAll
}: BidProcessingBuyerViewProps) => {
  const navigate = useNavigate()
  const [expandedBuyers, setExpandedBuyers] = useState<string[]>([])

  // Group bids by buyer
  const bidsByBuyer = bids.reduce((acc, bid) => {
    if (!acc[bid.buyerName]) {
      acc[bid.buyerName] = []
    }
    acc[bid.buyerName].push(bid)
    return acc
  }, {} as Record<string, Bid[]>)

  const toggleBuyerExpansion = (buyerName: string) => {
    setExpandedBuyers(prev => 
      prev.includes(buyerName) 
        ? prev.filter(name => name !== buyerName)
        : [...prev, buyerName]
    )
  }

  const handleBidClick = (bid: Bid) => {
    navigate(`/app/operations/bid-processing/${bid.id}`)
  }

  const handleGenerateESlip = (bid: Bid, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Generate E-Slip for bid:', bid.id)
  }

  const handleMatchPayment = (bid: Bid, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Match payment for bid:', bid.id)
  }

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50">
              <TableHead className="w-12 px-4 py-3">
                <Checkbox 
                  checked={selectedBids.length === bids.length && bids.length > 0}
                  onCheckedChange={onSelectAll}
                  className="border-slate-300"
                />
              </TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Buyer</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Total Bids</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Total Value</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Status Overview</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(bidsByBuyer).map(([buyerName, buyerBids]) => {
              const isExpanded = expandedBuyers.includes(buyerName)
              const totalValue = buyerBids.reduce((sum, bid) => sum + bid.amount, 0)
              const statusCounts = buyerBids.reduce((acc, bid) => {
                acc[bid.status] = (acc[bid.status] || 0) + 1
                return acc
              }, {} as Record<string, number>)

              return (
                <>
                  {/* Buyer Row */}
                  <TableRow 
                    key={buyerName}
                    className="border-slate-200 hover:bg-slate-50 cursor-pointer"
                    onClick={() => toggleBuyerExpansion(buyerName)}
                  >
                    <TableCell className="px-4 py-4">
                      <Checkbox 
                        checked={buyerBids.every(bid => selectedBids.includes(bid.id))}
                        onCheckedChange={(checked) => {
                          buyerBids.forEach(bid => onBidSelect(bid.id, checked as boolean))
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="border-slate-300"
                      />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {buyerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{buyerName}</p>
                          <p className="text-sm text-slate-500">
                            <Users className="w-3 h-3 inline mr-1" />
                            Active buyer
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="text-center">
                        <p className="font-semibold text-slate-900">{buyerBids.length}</p>
                        <p className="text-xs text-slate-500">bids</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div>
                        <p className="font-bold text-slate-900">LKR {totalValue.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">
                          {buyerBids.reduce((sum, bid) => sum + bid.quantity, 0)} kg total
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(statusCounts).map(([status, count]) => (
                          <Badge key={status} className={cn("text-xs", statusColors[status as keyof typeof statusColors])}>
                            {count} {statusLabels[status as keyof typeof statusLabels]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Bids */}
                  {isExpanded && buyerBids.map((bid) => (
                    <TableRow 
                      key={bid.id}
                      className="border-slate-200 bg-slate-25 hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleBidClick(bid)}
                    >
                      <TableCell className="px-4 py-3 pl-8">
                        <Checkbox 
                          checked={selectedBids.includes(bid.id)}
                          onCheckedChange={(checked) => onBidSelect(bid.id, checked as boolean)}
                          onClick={(e) => e.stopPropagation()}
                          className="border-slate-300"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 pl-12">
                        <div className="text-sm">
                          <p className="font-medium text-slate-900">{bid.id}</p>
                          <p className="text-xs text-slate-500">Lot: {bid.lotId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="text-sm">
                          <p className="font-medium text-slate-900">{bid.factory}</p>
                          <p className="text-xs text-slate-500">{bid.grade}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-slate-900">LKR {bid.amount.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">{bid.quantity} kg</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge className={cn("text-xs", statusColors[bid.status])}>
                          {statusLabels[bid.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBidClick(bid)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-slate-600 hover:text-green-600 hover:bg-green-50"
                            onClick={(e) => handleGenerateESlip(bid, e)}
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50"
                            onClick={(e) => handleMatchPayment(bid, e)}
                          >
                            <CreditCard className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )
            })}
          </TableBody>
        </Table>
        {bids.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No bids found.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
