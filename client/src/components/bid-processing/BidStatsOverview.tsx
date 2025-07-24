
import { StatusStat } from "@/types/bid"

interface BidStatsOverviewProps {
  statusStats: StatusStat[]
}

export const BidStatsOverview = ({ statusStats }: BidStatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 elastic-slide-up">
      {statusStats.map((stat, index) => (
        <div key={index} className="elastic-metric-card group">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
            <span className="text-xs font-medium text-slate-500">{stat.count} bids</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1 font-numeric">
            ${(stat.value / 1000).toFixed(0)}K
          </div>
          <p className="text-sm font-medium text-slate-700">{stat.stage}</p>
        </div>
      ))}
    </div>
  )
}
