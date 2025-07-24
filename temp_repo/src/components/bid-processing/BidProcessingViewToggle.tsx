
import { Button } from "@/components/ui/button"
import { Users, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface BidProcessingViewToggleProps {
  view: 'buyer' | 'bid'
  onViewChange: (view: 'buyer' | 'bid') => void
}

export const BidProcessingViewToggle = ({ view, onViewChange }: BidProcessingViewToggleProps) => {
  return (
    <div className="flex items-center bg-slate-100 rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('buyer')}
        className={cn(
          "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          view === 'buyer' 
            ? "bg-white text-slate-900 shadow-sm" 
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        )}
      >
        <Users className="h-4 w-4" />
        <span>Buyer View</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('bid')}
        className={cn(
          "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          view === 'bid' 
            ? "bg-white text-slate-900 shadow-sm" 
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        )}
      >
        <Package className="h-4 w-4" />
        <span>Bid View</span>
      </Button>
    </div>
  )
}
