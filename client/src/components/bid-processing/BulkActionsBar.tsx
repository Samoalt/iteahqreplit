
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, Settings, FileText, CheckSquare, RotateCcw, X } from "lucide-react"
import { Bid } from "@/types/bid"

interface BulkActionsBarProps {
  selectedBids: Bid[]
  onProcessSelected: () => void
  onSetupSplit: () => void
  onGenerateReport: () => void
  onMarkAsPaid: () => void
  onRevertStage: () => void
  onClearSelection: () => void
}

export const BulkActionsBar = ({
  selectedBids,
  onProcessSelected,
  onSetupSplit,
  onGenerateReport,
  onMarkAsPaid,
  onRevertStage,
  onClearSelection
}: BulkActionsBarProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const totalValue = selectedBids.reduce((sum, bid) => sum + bid.amount, 0)
  const buyerCount = new Set(selectedBids.map(bid => bid.buyerName)).size

  if (selectedBids.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                {selectedBids.length} selected
              </Badge>
              <div className="text-sm text-slate-600">
                {buyerCount} buyer{buyerCount !== 1 ? 's' : ''} • Total: LKR {totalValue.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="text-slate-600 hover:text-slate-800 border-slate-200 hover:border-slate-300"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Bulk Actions
                  <ChevronUp className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg">
                <DropdownMenuItem onClick={onProcessSelected} className="hover:bg-slate-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Process Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSetupSplit} className="hover:bg-slate-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Setup Split
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onGenerateReport} className="hover:bg-slate-50">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Combined Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onMarkAsPaid} className="hover:bg-slate-50">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Mark as Paid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRevertStage} className="hover:bg-slate-50">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Revert Stage
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
