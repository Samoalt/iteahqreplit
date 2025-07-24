import { useState, useRef } from "react"
import { mockBids, statusStats } from "@/data/mockBids"
import { BidProcessingHeader } from "@/components/bid-processing/BidProcessingHeader"
import { BidStatsOverview } from "@/components/bid-processing/BidStatsOverview"
import { BidControls } from "@/components/bid-processing/BidControls"
import { BidProcessingViewToggle } from "@/components/bid-processing/BidProcessingViewToggle"
import { BidProcessingBuyerView } from "@/components/bid-processing/BidProcessingBuyerView"
import { BidProcessingBidView } from "@/components/bid-processing/BidProcessingBidView"
import { BidDetailsModal } from "@/components/bid-processing/BidDetailsModal"
import { KeyboardShortcuts } from "@/components/bid-processing/KeyboardShortcuts"
import { BulkActionsBar } from "@/components/bid-processing/BulkActionsBar"
import { BulkBidProcessingPanel } from "@/components/bid-processing/BulkBidProcessingPanel"
import { BulkSplitSetupModal } from "@/components/bid-processing/BulkSplitSetupModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, X, FileText, Clock, CheckCircle, AlertCircle, Package } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Bid } from "@/types/bid"
import { useToast } from "@/hooks/use-toast"

const BidProcessing = () => {
  const [bids, setBids] = useState<Bid[]>(mockBids)
  const [viewMode, setViewMode] = useState<'buyer' | 'bid'>('bid')
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [newBidModalOpen, setNewBidModalOpen] = useState(false)
  
  // Bulk processing state
  const [selectedBidIds, setSelectedBidIds] = useState<string[]>([])
  const [bulkProcessingPanelOpen, setBulkProcessingPanelOpen] = useState(false)
  const [bulkSplitModalOpen, setBulkSplitModalOpen] = useState(false)

  const [newBidData, setNewBidData] = useState({
    buyerName: '',
    amount: '',
    factory: '',
    grade: '',
    quantity: '',
    pricePerKg: '',
    broker: '',
    batchNo: '',
    garden: '',
    packingDate: undefined as Date | undefined,
    warehouse: '',
    paymentTerms: 'cash',
    approvedBy: '',
    status: 'bid-intake'
  })
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Mock data for dropdowns
  const factories = [
    { id: "1", name: "IMENTI", location: "Meru" },
    { id: "2", name: "CHEBUT", location: "Kericho" },
    { id: "3", name: "KIPKEBE", location: "Kericho" },
    { id: "4", name: "THURURU", location: "Kiambu" }
  ]

  const grades = [
    { code: "BP1", description: "Broken Pekoe 1" },
    { code: "PF1", description: "Pekoe Fannings 1" },
    { code: "FBOP", description: "Flowery Broken Orange Pekoe" },
    { code: "PEKOE", description: "Pekoe" },
    { code: "OP", description: "Orange Pekoe" },
    { code: "BOP", description: "Broken Orange Pekoe" }
  ]

  const gardens = [
    "CTCL KTDA",
    "KTDA Factories",
    "Unilever Tea Kenya",
    "James Finlay Kenya",
    "Eastern Produce Kenya"
  ]

  const warehouses = [
    { id: "1", name: "Miritini Annex 2", sloc: "SLOC-1002", location: "Mombasa" },
    { id: "2", name: "Miritini Annex 1", sloc: "SLOC-1001", location: "Mombasa" },
    { id: "3", name: "Nairobi Warehouse", sloc: "SLOC-2001", location: "Nairobi" },
    { id: "4", name: "Kericho Storage", sloc: "SLOC-3001", location: "Kericho" }
  ]

  const brokers = [
    { id: "1", name: "ITEA Limited", company: "ITEA Ltd", status: "Active" },
    { id: "2", name: "East Africa Tea Brokers", company: "EATB Ltd", status: "Active" },
    { id: "3", name: "Kenya Tea Auctioneers", company: "KTA Ltd", status: "Active" }
  ]

  const statusOptions = [
    { value: "bid-intake", label: "Bid Intake", description: "Initial bid submission and validation" },
    { value: "under-review", label: "Under Review", description: "Bid is being evaluated" },
    { value: "approved", label: "Approved", description: "Bid has been approved" },
    { value: "rejected", label: "Rejected", description: "Bid has been rejected" }
  ]

  const paymentTermsOptions = [
    { value: "cash", label: "Cash" },
    { value: "credit", label: "Credit" },
    { value: "on-account", label: "On Account" }
  ]

  const filteredBids = bids.filter(bid => {
    const matchesSearch = bid.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bid.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bid.factory.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || bid.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selectedBids = bids.filter(bid => selectedBidIds.includes(bid.id))

  // Bulk selection handlers
  const handleBidSelect = (bidId: string, selected: boolean) => {
    setSelectedBidIds(prev => 
      selected 
        ? [...prev, bidId]
        : prev.filter(id => id !== bidId)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedBidIds(selected ? filteredBids.map(bid => bid.id) : [])
  }

  const handleClearSelection = () => {
    setSelectedBidIds([])
  }

  const handleProcessSelected = () => {
    setBulkProcessingPanelOpen(true)
  }

  const handleSetupSplit = () => {
    setBulkSplitModalOpen(true)
    setBulkProcessingPanelOpen(false)
  }

  const handleGenerateReport = () => {
    toast({
      title: "Report Generation",
      description: `Generating combined report for ${selectedBids.length} bids`,
    })
  }

  const handleMarkAsPaid = () => {
    setBids(prev => prev.map(bid => 
      selectedBidIds.includes(bid.id) 
        ? { ...bid, status: 'tea-release' as any }
        : bid
    ))
    setSelectedBidIds([])
    toast({
      title: "Bids Updated",
      description: `Marked ${selectedBids.length} bids as paid`,
    })
  }

  const handleRevertStage = () => {
    setBids(prev => prev.map(bid => 
      selectedBidIds.includes(bid.id) 
        ? { ...bid, status: 'bid-intake' as any }
        : bid
    ))
    setSelectedBidIds([])
    toast({
      title: "Bids Reverted",
      description: `Reverted ${selectedBids.length} bids to bid intake stage`,
    })
  }

  const handleProcessBids = (splitRules: any[], settings: any) => {
    console.log('Processing bids with splits:', { splitRules, settings, selectedBids })
    
    setBids(prev => prev.map(bid => 
      selectedBidIds.includes(bid.id) 
        ? { ...bid, status: 'split-processing' as any }
        : bid
    ))
    
    setSelectedBidIds([])
    setBulkSplitModalOpen(false)
    
    toast({
      title: "Bulk Processing Complete",
      description: `Successfully processed ${selectedBids.length} bids with configured splits`,
    })
  }

  const handleNewBid = () => {
    setNewBidModalOpen(true)
  }

  const handleCreateBid = () => {
    if (!newBidData.buyerName || !newBidData.amount || !newBidData.factory) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const bidId = `BID-${Date.now().toString().slice(-8)}`
    const amount = parseFloat(newBidData.amount)
    const quantity = parseFloat(newBidData.quantity) || 25
    const pricePerKg = parseFloat(newBidData.pricePerKg) || 4.0

    const newBid: Bid = {
      id: bidId,
      buyerName: newBidData.buyerName,
      amount: amount,
      status: newBidData.status as any,
      date: new Date().toISOString().split('T')[0],
      factory: newBidData.factory,
      grade: newBidData.grade || 'BP1',
      lotId: `LOT-${Date.now()}`,
      quantity: quantity,
      pricePerKg: pricePerKg,
      broker: newBidData.broker || 'Default Broker'
    }
    
    setBids(prev => [newBid, ...prev])
    setNewBidModalOpen(false)
    setNewBidData({
      buyerName: '',
      amount: '',
      factory: '',
      grade: '',
      quantity: '',
      pricePerKg: '',
      broker: '',
      batchNo: '',
      garden: '',
      packingDate: undefined,
      warehouse: '',
      paymentTerms: 'cash',
      approvedBy: '',
      status: 'bid-intake'
    })
    
    toast({
      title: "Bid Created",
      description: `New bid ${bidId} has been created successfully`,
    })
  }

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setNewBidData(prev => ({ ...prev, [field]: value }))
  }

  const getStatusSteps = () => [
    { key: "bid-intake", label: "Bid Intake", icon: Package, active: true },
    { key: "under-review", label: "Under Review", icon: Clock, active: false },
    { key: "approved", label: "Approved", icon: CheckCircle, active: false },
    { key: "invoiced", label: "Invoiced", icon: FileText, active: false }
  ]

  const handleFocusSearch = () => {
    searchInputRef.current?.focus()
  }

  const handleBidClick = (bid: Bid) => {
    setSelectedBid(bid)
    setDetailsModalOpen(true)
  }

  const handleUpdateBid = (updatedBid: Bid) => {
    setBids(prev => prev.map(bid => bid.id === updatedBid.id ? updatedBid : bid))
    setDetailsModalOpen(false)
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      <KeyboardShortcuts
        onNewBid={handleNewBid}
        onSearch={handleFocusSearch}
        onNextBid={() => console.log('Next bid')}
        onPrevBid={() => console.log('Previous bid')}
      />
      
      <BidProcessingHeader />
      
      <BidStatsOverview statusStats={statusStats} />

      <div className="flex items-center justify-between">
        <BidControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchInputRef={searchInputRef}
          onNewBid={handleNewBid}
        />
        
        <BidProcessingViewToggle
          view={viewMode}
          onViewChange={setViewMode}
        />
      </div>

      <div className="elastic-slide-up">
        {viewMode === 'buyer' ? (
          <BidProcessingBuyerView 
            bids={filteredBids} 
            selectedBids={selectedBidIds}
            onBidSelect={handleBidSelect}
            onSelectAll={handleSelectAll}
          />
        ) : (
          <BidProcessingBidView 
            bids={filteredBids} 
            selectedBids={selectedBidIds}
            onBidSelect={handleBidSelect}
            onSelectAll={handleSelectAll}
          />
        )}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedBids={selectedBids}
        onProcessSelected={handleProcessSelected}
        onSetupSplit={handleSetupSplit}
        onGenerateReport={handleGenerateReport}
        onMarkAsPaid={handleMarkAsPaid}
        onRevertStage={handleRevertStage}
        onClearSelection={handleClearSelection}
      />

      {/* Bulk Processing Panel */}
      <BulkBidProcessingPanel
        open={bulkProcessingPanelOpen}
        onOpenChange={setBulkProcessingPanelOpen}
        selectedBids={selectedBids}
        onSetupSplit={handleSetupSplit}
      />

      {/* Bulk Split Setup Modal */}
      <BulkSplitSetupModal
        open={bulkSplitModalOpen}
        onOpenChange={setBulkSplitModalOpen}
        selectedBids={selectedBids}
        onProcessBids={handleProcessBids}
      />

      <Dialog open={newBidModalOpen} onOpenChange={setNewBidModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border border-slate-200">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-blue-600" />
              <DialogTitle className="text-2xl font-semibold text-slate-900">Create New Bid</DialogTitle>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-500">
                Bid ID: <span className="font-mono font-semibold text-blue-600">BID-{Date.now().toString().slice(-8)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNewBidModalOpen(false)}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex gap-6 h-full max-h-[75vh]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Buyer & Bid Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-name" className="text-sm font-medium text-slate-700">
                        Buyer Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="buyer-name"
                        value={newBidData.buyerName}
                        onChange={(e) => handleInputChange('buyerName', e.target.value)}
                        placeholder="Enter buyer name"
                        className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
                        Bid Amount ($) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newBidData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="Enter bid amount"
                        className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                        Quantity (kg) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newBidData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        placeholder="Enter quantity"
                        className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price-per-kg" className="text-sm font-medium text-slate-700">
                        Price per Kg ($) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price-per-kg"
                        type="number"
                        step="0.01"
                        value={newBidData.pricePerKg}
                        onChange={(e) => handleInputChange('pricePerKg', e.target.value)}
                        placeholder="Enter price per kg"
                        className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {newBidData.quantity && newBidData.pricePerKg && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        <strong>Total Bid Value:</strong> ${(parseFloat(newBidData.quantity) * parseFloat(newBidData.pricePerKg)).toLocaleString() || '0'}
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Lot Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="factory" className="text-sm font-medium text-slate-700">
                        Factory <span className="text-red-500">*</span>
                      </Label>
                      <Select value={newBidData.factory} onValueChange={(value) => handleInputChange('factory', value)}>
                        <SelectTrigger className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select factory" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                          {factories.map((factory) => (
                            <SelectItem key={factory.id} value={factory.name} className="hover:bg-slate-50">
                              {factory.name} - {factory.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="grade" className="text-sm font-medium text-slate-700">
                        Grade <span className="text-red-500">*</span>
                      </Label>
                      <Select value={newBidData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                        <SelectTrigger className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                          {grades.map((grade) => (
                            <SelectItem key={grade.code} value={grade.code} className="hover:bg-slate-50">
                              {grade.code} - {grade.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="garden" className="text-sm font-medium text-slate-700">
                        Garden/Origin
                      </Label>
                      <Select value={newBidData.garden} onValueChange={(value) => handleInputChange('garden', value)}>
                        <SelectTrigger className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select garden" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                          {gardens.map((garden) => (
                            <SelectItem key={garden} value={garden} className="hover:bg-slate-50">
                              {garden}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warehouse" className="text-sm font-medium text-slate-700">
                        Warehouse/SLOC
                      </Label>
                      <Select value={newBidData.warehouse} onValueChange={(value) => handleInputChange('warehouse', value)}>
                        <SelectTrigger className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                          {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.name} className="hover:bg-slate-50">
                              {warehouse.name} - {warehouse.sloc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">Business Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="broker" className="text-sm font-medium text-slate-700">
                        Broker
                      </Label>
                      <Select value={newBidData.broker} onValueChange={(value) => handleInputChange('broker', value)}>
                        <SelectTrigger className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select broker" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                          {brokers.map((broker) => (
                            <SelectItem key={broker.id} value={broker.name} className="hover:bg-slate-50">
                              {broker.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-terms" className="text-sm font-medium text-slate-700">
                        Payment Terms
                      </Label>
                      <Select value={newBidData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                        <SelectTrigger className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                          {paymentTermsOptions.map((term) => (
                            <SelectItem key={term.value} value={term.value} className="hover:bg-slate-50">
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Packing Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-10 justify-start text-left font-normal bg-white border-slate-300 hover:border-blue-500",
                              !newBidData.packingDate && "text-slate-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newBidData.packingDate ? format(newBidData.packingDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={newBidData.packingDate}
                            onSelect={(date) => handleInputChange('packingDate', date)}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium text-slate-700">
                        Status
                      </Label>
                      <Select value={newBidData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value} className="hover:bg-slate-50">
                              <div className="flex flex-col">
                                <span className="font-medium">{status.label}</span>
                                <span className="text-xs text-slate-500">{status.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewBidModalOpen(false)}
                    className="px-6 py-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateBid}
                    className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Create Bid
                  </Button>
                </div>
              </div>
            </ScrollArea>

            <div className="w-72 border-l border-slate-200 pl-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Status History</h4>
                  <div className="space-y-3">
                    {getStatusSteps().map((step, index) => {
                      const Icon = step.icon
                      return (
                        <div key={step.key} className="flex items-center space-x-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            step.active ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm font-medium",
                              step.active ? "text-slate-900" : "text-slate-500"
                            )}>
                              {step.label}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Documents</h4>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">No documents uploaded yet</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Validation</h4>
                  <div className="space-y-2">
                    {!newBidData.buyerName && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Buyer name is required</span>
                      </div>
                    )}
                    {!newBidData.amount && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Bid amount is required</span>
                      </div>
                    )}
                    {!newBidData.factory && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Factory selection is required</span>
                      </div>
                    )}
                    {newBidData.buyerName && newBidData.amount && newBidData.factory && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Ready to create bid</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedBid && (
        <BidDetailsModal
          bid={selectedBid}
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          onUpdateBid={handleUpdateBid}
        />
      )}

      <div className="fixed bottom-4 right-4 bg-white border border-slate-200 rounded-lg p-3 shadow-sm text-xs text-slate-600 max-w-48">
        <div className="font-medium mb-2">Keyboard Shortcuts</div>
        <div className="space-y-1">
          <div><kbd className="bg-slate-100 px-1 rounded">N</kbd> New Bid</div>
          <div><kbd className="bg-slate-100 px-1 rounded">/</kbd> Search</div>
        </div>
      </div>
    </div>
  )
}

export default BidProcessing
