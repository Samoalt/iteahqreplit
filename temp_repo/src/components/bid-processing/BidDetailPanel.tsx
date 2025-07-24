
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { X, ChevronDown, Eye, FileText, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Bid } from "@/types/bid"
import { BidProgressTracker } from "./BidProgressTracker"
import { BuyerProfileCard } from "./BuyerProfileCard"
import { FinancialSummary } from "./FinancialSummary"
import { BidTimeline } from "./BidTimeline"
import { BidActionFooter } from "./BidActionFooter"
import { useState } from "react"

interface BidDetailPanelProps {
  bid: Bid
  onClose: () => void
}

const statusLabels = {
  'bid-intake': 'Bid Intake',
  'e-slip-sent': 'E-Slip Sent',
  'payment-matching': 'Payment Matching',
  'split-processing': 'Split Processing',
  'payout-approval': 'Payout Approval',
  'tea-release': 'Tea Release'
}

const statusColors = {
  'bid-intake': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'e-slip-sent': 'bg-orange-100 text-orange-800 border-orange-200',
  'payment-matching': 'bg-blue-100 text-blue-800 border-blue-200',
  'split-processing': 'bg-purple-100 text-purple-800 border-purple-200',
  'payout-approval': 'bg-green-100 text-green-800 border-green-200',
  'tea-release': 'bg-emerald-100 text-emerald-800 border-emerald-200'
}

export const BidDetailPanel = ({ bid, onClose }: BidDetailPanelProps) => {
  const [openSections, setOpenSections] = useState({
    overview: true,
    buyer: true,
    financial: false,
    lots: false,
    documents: false,
    timeline: false
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleNextStage = () => {
    console.log('Moving to next stage for bid:', bid.id)
    // Implement next stage logic
  }

  const handleEdit = () => {
    console.log('Edit bid:', bid.id)
    // Implement edit logic
  }

  const handleDownload = () => {
    console.log('Download documents for bid:', bid.id)
    // Implement download logic
  }

  const handleFlag = () => {
    console.log('Flag bid for review:', bid.id)
    // Implement flag logic
  }

  return (
    <div className="h-full flex flex-col border-slate-200 shadow-lg bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-bold text-slate-900">{bid.id}</h2>
              <Badge className={cn("text-sm", statusColors[bid.status])}>
                {statusLabels[bid.status]}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{bid.buyerName} • {bid.factory}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <BidProgressTracker currentStatus={bid.status} />

        {/* Overview Section */}
        <Collapsible open={openSections.overview} onOpenChange={() => toggleSection('overview')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <h3 className="font-semibold text-slate-900">Overview</h3>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.overview && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-slate-600">Bid Date</span>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(bid.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Total Amount</span>
                  <p className="text-lg font-bold text-slate-900">
                    ${bid.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Grade</span>
                  <p className="text-sm font-medium text-slate-900">{bid.grade}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Lot ID</span>
                  <p className="text-sm font-medium text-slate-900">{bid.lotId}</p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Buyer Information Section */}
        <Collapsible open={openSections.buyer} onOpenChange={() => toggleSection('buyer')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <h3 className="font-semibold text-slate-900">Buyer Information</h3>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.buyer && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <BuyerProfileCard bid={bid} />
          </CollapsibleContent>
        </Collapsible>

        {/* Financial Summary Section */}
        <Collapsible open={openSections.financial} onOpenChange={() => toggleSection('financial')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <h3 className="font-semibold text-slate-900">Financial Summary</h3>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.financial && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <FinancialSummary bid={bid} />
          </CollapsibleContent>
        </Collapsible>

        {/* Lots & Products Section */}
        <Collapsible open={openSections.lots} onOpenChange={() => toggleSection('lots')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <h3 className="font-semibold text-slate-900">Lots & Products</h3>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.lots && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Lot ID</span>
                    <span className="text-sm font-medium text-slate-900">{bid.lotId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Grade</span>
                    <span className="text-sm font-medium text-slate-900">{bid.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Quantity</span>
                    <span className="text-sm font-medium text-slate-900">{bid.quantity} packages</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Warehouse</span>
                    <span className="text-sm font-medium text-slate-900">Main Warehouse A</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Documents Section */}
        <Collapsible open={openSections.documents} onOpenChange={() => toggleSection('documents')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <h3 className="font-semibold text-slate-900">Documents</h3>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.documents && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">E-Slip Documents</h4>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate E-Slip
                  </Button>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Bid Confirmation</p>
                        <p className="text-xs text-slate-500">Generated on {new Date(bid.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Timeline Section */}
        <Collapsible open={openSections.timeline} onOpenChange={() => toggleSection('timeline')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <h3 className="font-semibold text-slate-900">Timeline & Status</h3>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openSections.timeline && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <BidTimeline bid={bid} />
          </CollapsibleContent>
        </Collapsible>

        {bid.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-700">{bid.notes}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sticky Action Footer */}
      <BidActionFooter
        bid={bid}
        onNextStage={handleNextStage}
        onEdit={handleEdit}
        onDownload={handleDownload}
        onFlag={handleFlag}
      />
    </div>
  )
}
