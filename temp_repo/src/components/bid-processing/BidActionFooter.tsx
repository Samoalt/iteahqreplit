
import { Button } from "@/components/ui/button"
import { ArrowRight, Edit, Download, Flag, FileText, DollarSign } from "lucide-react"
import { Bid } from "@/types/bid"

interface BidActionFooterProps {
  bid: Bid
  onNextStage: () => void
  onEdit: () => void
  onDownload: () => void
  onFlag: () => void
}

const getNextStageAction = (status: Bid['status']) => {
  switch (status) {
    case 'bid-intake':
      return { label: 'Generate E-Slip', icon: FileText }
    case 'e-slip-sent':
      return { label: 'Match Payment', icon: DollarSign }
    case 'payment-matching':
      return { label: 'Process Split', icon: ArrowRight }
    case 'split-processing':
      return { label: 'Approve Payout', icon: ArrowRight }
    case 'payout-approval':
      return { label: 'Release Tea', icon: ArrowRight }
    case 'tea-release':
      return { label: 'Complete', icon: ArrowRight }
    default:
      return { label: 'Next Stage', icon: ArrowRight }
  }
}

export const BidActionFooter = ({ bid, onNextStage, onEdit, onDownload, onFlag }: BidActionFooterProps) => {
  const nextAction = getNextStageAction(bid.status)
  const NextIcon = nextAction.icon

  return (
    <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 space-y-3">
      <Button 
        onClick={onNextStage}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        size="lg"
      >
        <NextIcon className="w-4 h-4 mr-2" />
        {nextAction.label}
      </Button>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDownload} className="flex-1">
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={onFlag} className="flex-1">
          <Flag className="w-4 h-4 mr-1" />
          Flag
        </Button>
      </div>
    </div>
  )
}
