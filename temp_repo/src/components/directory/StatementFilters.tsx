
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Filter, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export const StatementFilters = () => {
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([])

  const transactionStatuses = [
    { id: "paid", label: "Paid" },
    { id: "pending", label: "Pending" },
    { id: "overdue", label: "Overdue" },
    { id: "cancelled", label: "Cancelled" }
  ]

  const transactionTypes = [
    { id: "purchase", label: "Tea Purchase" },
    { id: "payment", label: "Payment" },
    { id: "advance", label: "Advance Payment" },
    { id: "deduction", label: "Deduction" },
    { id: "bonus", label: "Bonus Payment" }
  ]

  const handleStatusChange = (statusId: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, statusId])
    } else {
      setSelectedStatuses(selectedStatuses.filter(id => id !== statusId))
    }
  }

  const handleTransactionTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactionTypes([...selectedTransactionTypes, typeId])
    } else {
      setSelectedTransactionTypes(selectedTransactionTypes.filter(id => id !== typeId))
    }
  }

  const handleReset = () => {
    setFromDate(undefined)
    setToDate(undefined)
    setMinAmount("")
    setMaxAmount("")
    setSelectedStatuses([])
    setSelectedTransactionTypes([])
  }

  return (
    <Card className="elastic-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span className="font-display font-bold text-slate-900">Advanced Filters</span>
          </div>
          <Button onClick={handleReset} className="elastic-button-outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-display font-bold text-slate-800 uppercase tracking-wider">From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "elastic-input h-12 justify-start text-left font-normal",
                    !fromDate && "text-slate-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-display font-bold text-slate-800 uppercase tracking-wider">To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "elastic-input h-12 justify-start text-left font-normal",
                    !toDate && "text-slate-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Amount Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-display font-bold text-slate-800 uppercase tracking-wider">Min Amount (KES)</Label>
            <Input
              type="number"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="elastic-input h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-display font-bold text-slate-800 uppercase tracking-wider">Max Amount (KES)</Label>
            <Input
              type="number"
              placeholder="No limit"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="elastic-input h-12"
            />
          </div>
        </div>

        {/* Transaction Status */}
        <div className="space-y-3">
          <Label className="text-sm font-display font-bold text-slate-800 uppercase tracking-wider">Transaction Status</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {transactionStatuses.map((status) => (
              <div key={status.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status.id}`}
                  checked={selectedStatuses.includes(status.id)}
                  onCheckedChange={(checked) => handleStatusChange(status.id, checked as boolean)}
                />
                <Label
                  htmlFor={`status-${status.id}`}
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                >
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Types */}
        <div className="space-y-3">
          <Label className="text-sm font-display font-bold text-slate-800 uppercase tracking-wider">Transaction Types</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactionTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.id}`}
                  checked={selectedTransactionTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleTransactionTypeChange(type.id, checked as boolean)}
                />
                <Label
                  htmlFor={`type-${type.id}`}
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Button className="elastic-button-primary">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
