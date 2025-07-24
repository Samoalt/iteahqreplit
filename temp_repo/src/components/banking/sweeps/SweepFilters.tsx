
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Filter, X } from "lucide-react"

export const SweepFilters = () => {
  const [filters, setFilters] = useState({
    status: "",
    sourceWallet: "",
    destinationWallet: "",
    dateRange: ""
  })

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const clearFilters = () => {
    setFilters({
      status: "",
      sourceWallet: "",
      destinationWallet: "",
      dateRange: ""
    })
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">Filters:</span>
      </div>

      <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
        <SelectTrigger className="w-32 border-slate-300 text-slate-700 h-10">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sourceWallet} onValueChange={(value) => setFilters(prev => ({ ...prev, sourceWallet: value }))}>
        <SelectTrigger className="w-48 border-slate-300 text-slate-700 h-10">
          <SelectValue placeholder="Source Wallet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="buyer-global">Buyer Wallet - Global Tea</SelectItem>
          <SelectItem value="buyer-premium">Buyer Wallet - Premium Tea Co</SelectItem>
          <SelectItem value="tax-holding">Tax Holding Wallet</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.destinationWallet} onValueChange={(value) => setFilters(prev => ({ ...prev, destinationWallet: value }))}>
        <SelectTrigger className="w-48 border-slate-300 text-slate-700 h-10">
          <SelectValue placeholder="Destination Wallet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="holding-itea">Holding Wallet - ITEA Ltd</SelectItem>
          <SelectItem value="kra-settlement">KRA Settlement Wallet</SelectItem>
          <SelectItem value="operations">Operations Wallet</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 h-10">
        <CalendarDays className="h-4 w-4 mr-2" />
        Date Range
      </Button>

      {activeFiltersCount > 0 && (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 w-8 p-0 hover:bg-slate-100 text-slate-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
