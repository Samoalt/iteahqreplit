
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface LotItem {
  id: string
  lotId: string
  factory: string
  grade: string
  weight: number
  quantity: number
  pricePerKg: number
  totalValue: number
  batchNo: string
  garden: string
  packingDate: string
  warehouse: string
  broker: string
  status: 'draft' | 'ready' | 'openForBids' | 'bought' | 'invoiced' | 'settled' | 'released' | 'archived'
  addedBy: string
  timestamp: string
}

interface BidData {
  buyerName: string
  broker?: string
  bidPricePerKg: number
  quantity: number
  bidDate: Date | undefined
  status: string
  notes: string
}

interface ManualBidIntakeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lot: LotItem
  onSubmitBid: (bidData: BidData) => void
}

export const ManualBidIntakeModal = ({ open, onOpenChange, lot, onSubmitBid }: ManualBidIntakeModalProps) => {
  const [bidData, setBidData] = useState<BidData>({
    buyerName: '',
    broker: '',
    bidPricePerKg: 0,
    quantity: lot.quantity,
    bidDate: undefined,
    status: 'draft',
    notes: ''
  })

  const handleSubmit = () => {
    onSubmitBid(bidData)
    setBidData({
      buyerName: '',
      broker: '',
      bidPricePerKg: 0,
      quantity: lot.quantity,
      bidDate: undefined,
      status: 'draft',
      notes: ''
    })
    onOpenChange(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 font-semibold border border-gray-200">DRAFT</Badge>
      case 'ready':
        return <Badge className="bg-green-100 text-green-800 font-semibold border border-green-200">READY</Badge>
      case 'openForBids':
        return <Badge className="bg-blue-100 text-blue-800 font-semibold border border-blue-200">OPEN FOR BIDS</Badge>
      case 'bought':
        return <Badge className="bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">BOUGHT</Badge>
      case 'invoiced':
        return <Badge className="bg-orange-100 text-orange-800 font-semibold border border-orange-200">INVOICED</Badge>
      case 'settled':
        return <Badge className="bg-teal-100 text-teal-800 font-semibold border border-teal-200">SETTLED</Badge>
      case 'released':
        return <Badge className="bg-slate-100 text-slate-800 font-semibold border border-slate-200">RELEASED</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 font-semibold border border-gray-200">ARCHIVED</Badge>
      default:
        return <Badge variant="secondary" className="font-semibold">{status}</Badge>
    }
  }

  const totalBidValue = bidData.bidPricePerKg * lot.weight

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b pb-4 bg-white">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="bg-blue-600 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            Manual Bid Intake
            <span className="text-slate-600 font-normal">for Lot {lot.lotId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lot Details */}
            <Card className="bg-white">
              <CardHeader className="bg-white">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Lot Details
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">FACTORY</span>
                    <p className="text-lg font-semibold text-slate-900 mt-1">{lot.factory}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">GRADE</span>
                    <p className="text-lg font-semibold text-slate-900 mt-1">{lot.grade}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">WEIGHT</span>
                    <p className="text-lg font-semibold text-slate-900 mt-1">{lot.weight.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">QUANTITY</span>
                    <p className="text-lg font-semibold text-slate-900 mt-1">{lot.quantity} packages</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bid Form */}
            <div className="space-y-6 bg-white p-6 rounded-lg border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyerName" className="text-sm font-medium text-slate-700">
                    Buyer Name <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={bidData.buyerName}
                    onValueChange={(value) => setBidData({ ...bidData, buyerName: value })}
                  >
                    <SelectTrigger className="mt-1 bg-white">
                      <SelectValue placeholder="Select buyer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="buyer1">ABC Tea Company</SelectItem>
                      <SelectItem value="buyer2">Global Tea Trading</SelectItem>
                      <SelectItem value="buyer3">Premium Tea Exports</SelectItem>
                      <SelectItem value="buyer4">Sri Lanka Tea Board</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="broker" className="text-sm font-medium text-slate-700">
                    Broker (Optional)
                  </Label>
                  <Select
                    value={bidData.broker}
                    onValueChange={(value) => setBidData({ ...bidData, broker: value })}
                  >
                    <SelectTrigger className="mt-1 bg-white">
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="broker1">Tea Brokers Ltd</SelectItem>
                      <SelectItem value="broker2">Ceylon Tea Brokers</SelectItem>
                      <SelectItem value="broker3">Island Tea Brokers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bidPrice" className="text-sm font-medium text-slate-700">
                    Bid Price (per kg) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bidPrice"
                    type="number"
                    step="0.01"
                    value={bidData.bidPricePerKg}
                    onChange={(e) => setBidData({ ...bidData, bidPricePerKg: Number(e.target.value) })}
                    placeholder="0.00"
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                    Quantity (packages) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={bidData.quantity}
                    onChange={(e) => setBidData({ ...bidData, quantity: Number(e.target.value) })}
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="bidDate" className="text-sm font-medium text-slate-700">
                    Bid Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal bg-white",
                          !bidData.bidDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {bidData.bidDate ? format(bidData.bidDate, "PPP") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={bidData.bidDate}
                        onSelect={(date) => setBidData({ ...bidData, bidDate: date })}
                        initialFocus
                        className="p-3 pointer-events-auto bg-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium text-slate-700">Status</Label>
                <Select
                  value={bidData.status}
                  onValueChange={(value) => setBidData({ ...bidData, status: value })}
                >
                  <SelectTrigger className="mt-1 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-slate-700">Additional notes about this bid...</Label>
                <Textarea
                  id="notes"
                  value={bidData.notes}
                  onChange={(e) => setBidData({ ...bidData, notes: e.target.value })}
                  placeholder="Additional notes about this bid..."
                  rows={3}
                  className="mt-1 resize-none border-2 border-blue-200 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Summary Card - Right Side */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-slate-200 bg-white">
              <CardHeader className="pb-3 bg-white">
                <CardTitle className="text-base font-semibold">
                  Lot {lot.lotId} Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-white">
                <div>
                  <span className="text-sm font-medium text-slate-600">Grade:</span>
                  <span className="ml-2 font-semibold">{lot.grade}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Weight:</span>
                  <span className="ml-2 font-semibold">{lot.weight.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Value</span>
                  <div className="text-right">
                    <div className="text-sm text-slate-600">${lot.pricePerKg.toFixed(2)}/kg</div>
                    <div className="font-semibold text-lg">${totalBidValue.toLocaleString()}</div>
                  </div>
                </div>
                <div className="pt-2">
                  {getStatusBadge(lot.status)}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button 
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold"
                disabled={!bidData.buyerName || !bidData.bidPricePerKg || !bidData.bidDate}
              >
                Save Bid
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
