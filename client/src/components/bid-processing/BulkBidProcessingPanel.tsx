
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, DollarSign, Package, Settings, X } from "lucide-react"
import { Bid } from "@/types/bid"

interface BulkBidProcessingPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedBids: Bid[]
  onSetupSplit: () => void
}

export const BulkBidProcessingPanel = ({
  open,
  onOpenChange,
  selectedBids,
  onSetupSplit
}: BulkBidProcessingPanelProps) => {
  // Group bids by buyer
  const bidsByBuyer = selectedBids.reduce((acc, bid) => {
    if (!acc[bid.buyerName]) {
      acc[bid.buyerName] = []
    }
    acc[bid.buyerName].push(bid)
    return acc
  }, {} as Record<string, Bid[]>)

  const totalValue = selectedBids.reduce((sum, bid) => sum + bid.amount, 0)
  const totalQuantity = selectedBids.reduce((sum, bid) => sum + bid.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[800px] sm:max-w-[800px] bg-white">
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-semibold text-slate-900">
              Bulk Bid Processing
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600">Total Bids</p>
                      <p className="text-2xl font-bold text-slate-900">{selectedBids.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-slate-600">Total Value</p>
                      <p className="text-2xl font-bold text-slate-900">LKR {totalValue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-slate-600">Buyers</p>
                      <p className="text-2xl font-bold text-slate-900">{Object.keys(bidsByBuyer).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Buyers and Their Bids */}
            <div className="space-y-6">
              {Object.entries(bidsByBuyer).map(([buyerName, bids]) => (
                <Card key={buyerName} className="bg-white border border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {buyerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{buyerName}</h3>
                          <p className="text-sm text-slate-600">
                            {bids.length} bid{bids.length !== 1 ? 's' : ''} • 
                            LKR {bids.reduce((sum, bid) => sum + bid.amount, 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="text-xs bg-slate-100 text-slate-800 border border-slate-200">
                        {bids.reduce((sum, bid) => sum + bid.quantity, 0)} kg total
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200">
                          <TableHead className="text-slate-700 font-medium">Lot ID</TableHead>
                          <TableHead className="text-slate-700 font-medium">Grade</TableHead>
                          <TableHead className="text-slate-700 font-medium">Quantity</TableHead>
                          <TableHead className="text-slate-700 font-medium">Price/kg</TableHead>
                          <TableHead className="text-slate-700 font-medium">Total Value</TableHead>
                          <TableHead className="text-slate-700 font-medium">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bids.map((bid) => (
                          <TableRow key={bid.id} className="border-slate-100">
                            <TableCell className="font-mono text-sm text-blue-600">{bid.lotId}</TableCell>
                            <TableCell className="font-medium text-slate-900">{bid.grade}</TableCell>
                            <TableCell className="font-mono text-slate-900">{bid.quantity} kg</TableCell>
                            <TableCell className="font-mono text-slate-900">LKR {bid.pricePerKg}</TableCell>
                            <TableCell className="font-mono font-semibold text-slate-900">LKR {bid.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  bid.status === 'bid-intake' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                                  bid.status === 'e-slip-sent' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                  bid.status === 'payment-matching' ? 'bg-green-100 text-green-800 border border-green-200' :
                                  bid.status === 'split-processing' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                  bid.status === 'payout-approval' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                  'bg-slate-100 text-slate-800 border border-slate-200'
                                }
                              >
                                {bid.status.replace('-', ' ')}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="px-6 border-slate-200 text-slate-600 hover:border-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={onSetupSplit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                <Settings className="h-4 w-4 mr-2" />
                Setup Splits
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
