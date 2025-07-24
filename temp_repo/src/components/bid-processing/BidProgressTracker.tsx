
import { Check, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Bid } from "@/types/bid"

interface BidProgressTrackerProps {
  currentStatus: Bid['status']
}

const stages = [
  { key: 'bid-intake', label: 'Bid Intake', color: 'bg-yellow-500' },
  { key: 'e-slip-sent', label: 'E-Slip Sent', color: 'bg-orange-500' },
  { key: 'payment-matching', label: 'Payment Matching', color: 'bg-blue-500' },
  { key: 'split-processing', label: 'Split Processing', color: 'bg-purple-500' },
  { key: 'payout-approval', label: 'Payout Approval', color: 'bg-green-500' },
  { key: 'tea-release', label: 'Tea Release', color: 'bg-emerald-500' }
]

export const BidProgressTracker = ({ currentStatus }: BidProgressTrackerProps) => {
  const currentIndex = stages.findIndex(stage => stage.key === currentStatus)

  return (
    <div className="mb-6 p-6 bg-white rounded-lg border border-slate-200">
      <h4 className="text-sm font-medium text-slate-600 mb-4">Processing Stage</h4>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex
          
          return (
            <div key={stage.key} className="flex flex-col items-center flex-1 relative">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all border-2",
                isCompleted && "bg-green-500 text-white border-green-500",
                isCurrent && `${stage.color} text-white border-transparent`,
                isUpcoming && "bg-white text-slate-400 border-slate-200"
              )}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-xs text-center mt-2 max-w-16">
                <span className={cn(
                  "font-medium",
                  isCurrent && "text-slate-900",
                  !isCurrent && "text-slate-500"
                )}>
                  {stage.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div className={cn(
                  "absolute top-4 left-8 h-0.5 w-16 transition-all",
                  index < currentIndex ? "bg-green-500" : "bg-slate-200"
                )} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
