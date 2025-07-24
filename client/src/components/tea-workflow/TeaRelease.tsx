
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FileText, Download, Send, Truck, CheckCircle, Clock, Package, Filter, MapPin, Eye, ChevronDown, ChevronRight, Calendar } from "lucide-react"
import { useState } from "react"
import { DocumentManager } from "./DocumentManager"

interface TeaRelease {
  id: string
  bidId: string
  buyer: string
  warehouse: string
  lots: number
  totalKg: number
  grade: string
  factory: string
  releaseStatus: 'ready-for-release' | 'document-generated' | 'sent-to-buyer' | 'sent-to-warehouse' | 'delivered' | 'completed'
  documentUrl?: string
  sentToBuyerDate?: string
  sentToWarehouseDate?: string
  deliveryDate?: string
  trackingNumber?: string
  eta?: string
  buyerContact?: string
  auctionId?: string
}

const mockReleases: TeaRelease[] = [
  {
    id: "REL001",
    bidId: "BID001",
    buyer: "Global Tea Co.",
    warehouse: "Mombasa Tea Warehouse",
    lots: 45,
    totalKg: 21000,
    grade: "PEKOE",
    factory: "Kericho Tea Estate",
    releaseStatus: "ready-for-release",
    eta: "Jan 18",
    buyerContact: "john@globaltea.com",
    auctionId: "AUC-2024-001"
  },
  {
    id: "REL002",
    bidId: "BID002", 
    buyer: "Premium Tea Imports",
    warehouse: "Nairobi Storage Ltd",
    lots: 32,
    totalKg: 14400,
    grade: "FBOP",
    factory: "Nandi Hills Tea",
    releaseStatus: "document-generated",
    documentUrl: "/documents/rel002-release.pdf",
    buyerContact: "contact@premiumtea.com",
    auctionId: "AUC-2024-002"
  },
  {
    id: "REL003",
    bidId: "BID003",
    buyer: "Tea Traders Inc.", 
    warehouse: "Central Tea Storage",
    lots: 28,
    totalKg: 12640,
    grade: "OP1",
    factory: "Kericho Tea Estate",
    releaseStatus: "delivered",
    documentUrl: "/documents/rel003-release.pdf",
    sentToBuyerDate: "2024-01-16",
    sentToWarehouseDate: "2024-01-16",
    deliveryDate: "2024-01-17",
    trackingNumber: "TEA123456789",
    buyerContact: "info@teatraders.com",
    auctionId: "AUC-2024-003"
  }
]

export const TeaRelease = () => {
  const [releases, setReleases] = useState<TeaRelease[]>(mockReleases)
  const [selectedReleases, setSelectedReleases] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [buyerFilter, setBuyerFilter] = useState<string>("")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("")
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [viewedDocuments, setViewedDocuments] = useState<string[]>([])

  const handleGenerateDocument = (releaseId: string) => {
    setReleases(prev => prev.map(release => 
      release.id === releaseId 
        ? { 
            ...release, 
            releaseStatus: 'document-generated' as const,
            documentUrl: `/documents/${releaseId.toLowerCase()}-release.pdf`
          }
        : release
    ))
    console.log(`PDF document generated for release ${releaseId}`)
  }

  const handleSendToBuyer = (releaseId: string) => {
    setReleases(prev => prev.map(release => 
      release.id === releaseId 
        ? { 
            ...release, 
            releaseStatus: 'sent-to-buyer' as const,
            sentToBuyerDate: new Date().toISOString().split('T')[0]
          }
        : release
    ))
    console.log(`Release document sent to buyer for ${releaseId}`)
  }

  const handleSendToWarehouse = (releaseId: string) => {
    setReleases(prev => prev.map(release => 
      release.id === releaseId 
        ? { 
            ...release, 
            releaseStatus: 'sent-to-warehouse' as const,
            sentToWarehouseDate: new Date().toISOString().split('T')[0],
            trackingNumber: `TEA${Math.random().toString().substr(2, 9)}`
          }
        : release
    ))
    console.log(`Release document sent to warehouse for ${releaseId}`)
  }

  const handleMarkDelivered = (releaseId: string) => {
    setReleases(prev => prev.map(release => 
      release.id === releaseId 
        ? { 
            ...release, 
            releaseStatus: 'delivered' as const,
            deliveryDate: new Date().toISOString().split('T')[0]
          }
        : release
    ))
    console.log(`Release marked as delivered for ${releaseId}`)
  }

  const handleBulkGenerate = () => {
    setReleases(prev => prev.map(release => 
      selectedReleases.includes(release.id) && release.releaseStatus === 'ready-for-release'
        ? { 
            ...release, 
            releaseStatus: 'document-generated' as const,
            documentUrl: `/documents/${release.id.toLowerCase()}-release.pdf`
          }
        : release
    ))
    setSelectedReleases([])
    console.log('Bulk generated documents for releases:', selectedReleases)
  }

  const handleViewDocument = (releaseId: string) => {
    setViewedDocuments(prev => [...prev, releaseId])
    console.log(`Viewing document for release ${releaseId}`)
  }

  const toggleRowExpansion = (releaseId: string) => {
    setExpandedRows(prev => 
      prev.includes(releaseId) 
        ? prev.filter(id => id !== releaseId)
        : [...prev, releaseId]
    )
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ready-for-release': 
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-300', 
          icon: <Package className="h-3 w-3" />,
          label: 'READY FOR RELEASE',
          tooltip: 'Tea is ready to be released and documents need to be generated'
        }
      case 'document-generated': 
        return { 
          color: 'bg-purple-100 text-purple-800 border-purple-300', 
          icon: <FileText className="h-3 w-3" />,
          label: 'DOCUMENT GENERATED',
          tooltip: 'Release documents have been generated and are ready to be sent'
        }
      case 'sent-to-buyer': 
        return { 
          color: 'bg-orange-100 text-orange-800 border-orange-300', 
          icon: <Send className="h-3 w-3" />,
          label: 'SENT TO BUYER',
          tooltip: 'Documents have been sent to the buyer for confirmation'
        }
      case 'sent-to-warehouse': 
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
          icon: <Truck className="h-3 w-3" />,
          label: 'SENT TO WAREHOUSE',
          tooltip: 'Release notice has been sent to warehouse for pickup preparation'
        }
      case 'delivered': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-300', 
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'DELIVERED',
          tooltip: 'Tea has been successfully delivered to the buyer'
        }
      case 'completed': 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-300', 
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'COMPLETED',
          tooltip: 'Release process has been completed successfully'
        }
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-300', 
          icon: <Clock className="h-3 w-3" />,
          label: 'UNKNOWN',
          tooltip: 'Status unknown'
        }
    }
  }

  const getTrackingStatus = (release: TeaRelease) => {
    if (release.deliveryDate) {
      return { label: `Delivered ${release.deliveryDate}`, color: 'text-green-600', icon: <CheckCircle className="h-3 w-3" /> }
    }
    if (release.trackingNumber) {
      return { label: 'In Transit', color: 'text-blue-600', icon: <Truck className="h-3 w-3" /> }
    }
    if (release.eta) {
      return { label: `ETA: ${release.eta}`, color: 'text-gray-600', icon: <Calendar className="h-3 w-3" /> }
    }
    return { label: '--', color: 'text-gray-400', icon: null }
  }

  const filteredReleases = releases.filter(release => {
    const statusMatch = statusFilter === "all" || release.releaseStatus === statusFilter
    const buyerMatch = buyerFilter === "" || release.buyer.toLowerCase().includes(buyerFilter.toLowerCase())
    const warehouseMatch = warehouseFilter === "" || release.warehouse.toLowerCase().includes(warehouseFilter.toLowerCase())
    return statusMatch && buyerMatch && warehouseMatch
  })

  const readyCount = releases.filter(r => r.releaseStatus === 'ready-for-release').length

  return (
    <TooltipProvider>
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-green-600" />
              📦 Tea Release Management
              {readyCount > 0 && (
                <Badge className="ml-3 bg-yellow-100 text-yellow-800">
                  {readyCount} Ready
                </Badge>
              )}
            </CardTitle>
            {selectedReleases.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Bulk Generate ({selectedReleases.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Bulk Document Generation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to generate release documents for {selectedReleases.length} releases?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkGenerate}>
                      Generate Documents
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ready-for-release">Ready for Release</SelectItem>
                  <SelectItem value="document-generated">Document Generated</SelectItem>
                  <SelectItem value="sent-to-buyer">Sent to Buyer</SelectItem>
                  <SelectItem value="sent-to-warehouse">Sent to Warehouse</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Filter by buyer..."
              value={buyerFilter}
              onChange={(e) => setBuyerFilter(e.target.value)}
              className="w-48"
            />
            <Input
              placeholder="Filter by warehouse..."
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="w-48"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                  <TableHead className="w-12 font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedReleases.length === filteredReleases.length && filteredReleases.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReleases(filteredReleases.map(r => r.id))
                        } else {
                          setSelectedReleases([])
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">Release ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Buyer</TableHead>
                  <TableHead className="font-semibold text-gray-700">Tea Details</TableHead>
                  <TableHead className="font-semibold text-gray-700">Warehouse</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Tracking</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  <TableHead className="font-semibold text-gray-700">Documents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReleases.map((release) => {
                  const statusConfig = getStatusConfig(release.releaseStatus)
                  const trackingStatus = getTrackingStatus(release)
                  const isExpanded = expandedRows.includes(release.id)
                  const hasViewedDoc = viewedDocuments.includes(release.id)
                  
                  return (
                    <>
                      <TableRow key={release.id} className="hover:bg-gray-50 border-b border-gray-100">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedReleases.includes(release.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedReleases([...selectedReleases, release.id])
                                } else {
                                  setSelectedReleases(selectedReleases.filter(id => id !== release.id))
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRowExpansion(release.id)}
                              className="p-0 h-6 w-6"
                            >
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-blue-600">{release.id}</TableCell>
                        <TableCell className="font-medium">{release.buyer}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold text-sm">{release.grade}</div>
                            <div className="text-xs text-gray-600">{release.totalKg.toLocaleString()} kg ({release.lots} lots)</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                            {release.warehouse}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge className={`${statusConfig.color} border px-3 py-1 font-medium`}>
                                {statusConfig.icon}
                                <span className="ml-1">{statusConfig.label}</span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{statusConfig.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center text-sm ${trackingStatus.color}`}>
                            {trackingStatus.icon}
                            <span className="ml-1">{trackingStatus.label}</span>
                          </div>
                          {release.trackingNumber && (
                            <div className="text-xs text-gray-500 font-mono mt-1">
                              #{release.trackingNumber}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {release.releaseStatus === 'ready-for-release' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleGenerateDocument(release.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-7"
                              >
                                <Package className="h-3 w-3 mr-1" />
                                Release Now
                              </Button>
                            )}
                            
                            {release.releaseStatus === 'document-generated' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleSendToBuyer(release.id)}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 h-7"
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Send to Buyer
                              </Button>
                            )}
                            
                            {release.releaseStatus === 'sent-to-buyer' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleSendToWarehouse(release.id)}
                                className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1 h-7"
                              >
                                <Truck className="h-3 w-3 mr-1" />
                                Send to Warehouse
                              </Button>
                            )}
                            
                            {release.releaseStatus === 'sent-to-warehouse' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleMarkDelivered(release.id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-7"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark Delivered
                              </Button>
                            )}
                            
                            {release.releaseStatus === 'delivered' && (
                              <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {release.documentUrl && (
                              <>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleViewDocument(release.id)}
                                      className={`text-xs px-2 py-1 h-7 ${hasViewedDoc ? 'border-green-300 bg-green-50' : ''}`}
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                      {hasViewedDoc && <CheckCircle className="h-3 w-3 ml-1 text-green-600" />}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Quick preview document</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(release.documentUrl, '_blank')}
                                  className="text-xs px-2 py-1 h-7"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </>
                            )}
                            <DocumentManager 
                              bidId={release.bidId}
                              buyerName={release.buyer}
                              trigger={
                                <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-7">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Manage
                                </Button>
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expandable Row Content */}
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-gray-50 border-b border-gray-200">
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-gray-700">Detailed Information</h4>
                                  <div className="text-xs space-y-1">
                                    <div><strong>Factory:</strong> {release.factory}</div>
                                    <div><strong>Grade:</strong> {release.grade}</div>
                                    <div><strong>Total Weight:</strong> {release.totalKg.toLocaleString()} kg</div>
                                    <div><strong>Average per Lot:</strong> {(release.totalKg / release.lots).toFixed(0)} kg</div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-gray-700">Linked Information</h4>
                                  <div className="text-xs space-y-1">
                                    <div><strong>Auction ID:</strong> {release.auctionId}</div>
                                    <div><strong>Bid ID:</strong> {release.bidId}</div>
                                    {release.buyerContact && (
                                      <div><strong>Buyer Contact:</strong> {release.buyerContact}</div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-gray-700">Timeline</h4>
                                  <div className="text-xs space-y-1">
                                    {release.sentToBuyerDate && (
                                      <div className="text-purple-600">📧 Sent to Buyer: {release.sentToBuyerDate}</div>
                                    )}
                                    {release.sentToWarehouseDate && (
                                      <div className="text-orange-600">🏭 Sent to Warehouse: {release.sentToWarehouseDate}</div>
                                    )}
                                    {release.deliveryDate && (
                                      <div className="text-green-600">✅ Delivered: {release.deliveryDate}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
