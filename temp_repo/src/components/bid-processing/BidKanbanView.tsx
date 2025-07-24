
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Bid, StatusStat } from "@/types/bid"
import { useNavigate } from "react-router-dom"

interface BidKanbanViewProps {
  bids: Bid[]
  onBidClick: (bid: Bid) => void
  statusStats: StatusStat[]
}

const statusLabels = {
  'bid-intake': 'New Bids',
  'e-slip-sent': 'E-Slip Generated',
  'payment-matching': 'Payment Confirmed',
  'split-processing': 'Split Processing',
  'payout-approval': 'Payout Approval',
  'tea-release': 'Tea Release'
}

const statusDescriptions = {
  'bid-intake': 'All recently uploaded lots or manually created bids',
  'e-slip-sent': 'E-slip created and shared with the buyer',
  'payment-matching': 'Payment matched to bid',
  'split-processing': 'Allocating payments to Factory, Tax, Warehouse, iTea HQ',
  'payout-approval': 'Ready for final approval and payout',
  'tea-release': 'Tea released to buyer'
}

const columnColors = {
  'bid-intake': 'border-l-4 border-l-slate-400',
  'e-slip-sent': 'border-l-4 border-l-blue-400',
  'payment-matching': 'border-l-4 border-l-green-400',
  'split-processing': 'border-l-4 border-l-purple-400',
  'payout-approval': 'border-l-4 border-l-orange-400',
  'tea-release': 'border-l-4 border-l-emerald-400'
}

const statusBadgeColors = {
  'bid-intake': 'bg-slate-100 text-slate-800 border-slate-200',
  'e-slip-sent': 'bg-blue-100 text-blue-800 border-blue-200',
  'payment-matching': 'bg-green-100 text-green-800 border-green-200',
  'split-processing': 'bg-purple-100 text-purple-800 border-purple-200',
  'payout-approval': 'bg-orange-100 text-orange-800 border-orange-200',
  'tea-release': 'bg-emerald-100 text-emerald-800 border-emerald-200'
}

export const BidKanbanView = ({ bids, onBidClick, statusStats }: BidKanbanViewProps) => {
  const navigate = useNavigate()

  const handleBidClick = (bid: Bid) => {
    navigate(`/app/operations/bid-processing/${bid.id}`)
  }

  const getBidsByStatus = (status: string) => {
    return bids.filter(bid => bid.status === status)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {statusStats.map((statusStat) => {
        const statusBids = getBidsByStatus(statusStat.status)
        
        return (
          <div key={statusStat.status} className="space-y-4">
            {/* Column Header */}
            <Card className={cn("shadow-sm", columnColors[statusStat.status])}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    {statusLabels[statusStat.status]}
                  </CardTitle>
                  <Badge className="bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                    {statusStat.count}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {statusDescriptions[statusStat.status]}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-2 h-2 rounded-full", statusStat.color.replace('bg-', 'bg-'))} />
                    <span className="text-sm font-semibold text-green-600">
                      LKR {(statusStat.value / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-500">
                    <span className="text-sm">{statusBids.reduce((acc, bid) => acc + bid.quantity, 0)} kg</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Bid Cards */}
            <div className="space-y-3">
              {statusBids.map((bid) => (
                <Card 
                  key={bid.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border-slate-200 hover:border-slate-300 group bg-white"
                  onClick={() => handleBidClick(bid)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-slate-200 rounded text-xs flex items-center justify-center font-medium text-slate-700">
                            📄
                          </div>
                          <span className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                            {bid.id}
                          </span>
                        </div>
                        <Badge className={cn("text-xs border", statusBadgeColors[bid.status])}>
                          {bid.status === 'payment-matching' ? 'matched' :
                           bid.status === 'e-slip-sent' ? 'verified' :
                           bid.status === 'payout-approval' ? 'approved' :
                           bid.status === 'split-processing' ? 'processing' :
                           'pending'}
                        </Badge>
                      </div>

                      {/* Buyer Info */}
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {bid.buyerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{bid.buyerName}</p>
                          <div className="flex items-center space-x-1 text-slate-500">
                            <Phone className="w-3 h-3" />
                            <span className="text-xs">+94 {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 9000000 + 1000000)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-bold text-green-600">
                            LKR {bid.amount.toLocaleString()}
                          </span>
                          <span className="text-sm font-medium text-slate-700">
                            {bid.quantity} kg
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {bid.quantity} kg @ LKR {bid.pricePerKg}/kg
                        </p>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Tea:</span>
                          <span className="text-slate-700 font-medium">{bid.grade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Lot:</span>
                          <span className="text-slate-700 font-medium">{bid.lotId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Factory:</span>
                          <span className="text-slate-700 font-medium truncate max-w-24">{bid.factory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Date:</span>
                          <span className="text-slate-700 font-medium">{formatDate(bid.date)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-700"
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
                            className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle document action
                            }}
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1 h-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBidClick(bid)
                          }}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
