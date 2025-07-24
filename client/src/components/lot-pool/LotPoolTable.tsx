import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, Edit, Trash2, Search, Download, Upload, Plus } from "lucide-react"
import { AddLotModal } from "./AddLotModal"
import { BulkImportModal } from "./BulkImportModal"
import { LotDetailsModal } from "./LotDetailsModal"
import { ManualBidIntakeModal } from "./ManualBidIntakeModal"
import { toast } from "@/hooks/use-toast"

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

export const LotPoolTable = () => {
  const [lots, setLots] = useState<LotItem[]>([
    {
      id: "1",
      lotId: "IM24252673",
      factory: "IMENTI",
      grade: "BP1",
      weight: 2480,
      quantity: 40,
      pricePerKg: 3.42,
      totalValue: 8481.6,
      batchNo: "B2024001",
      garden: "CTCL KTDA",
      packingDate: "2024-01-15",
      warehouse: "Miritini Annex 2",
      broker: "ITEA Limited",
      status: "ready",
      addedBy: "John Doe",
      timestamp: "2024-01-15 10:30:00"
    }
  ])
  
  const [searchTerm, setSearchTerm] = useState("")
  const [addLotModalOpen, setAddLotModalOpen] = useState(false)
  const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false)
  const [selectedLot, setSelectedLot] = useState<LotItem | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [bidIntakeModalOpen, setBidIntakeModalOpen] = useState(false)

  const filteredLots = lots.filter(lot =>
    lot.lotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.factory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.grade.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddLot = (newLot: Omit<LotItem, 'id'>) => {
    const lot: LotItem = {
      ...newLot,
      id: `lot_${Date.now()}`
    }
    setLots(prev => [...prev, lot])
    setAddLotModalOpen(false)
    toast({ title: "Success", description: "Lot added successfully" })
  }

  const handleBulkImport = (importedLots: Omit<LotItem, 'id'>[]) => {
    const newLots: LotItem[] = importedLots.map((lot, index) => ({
      ...lot,
      id: `bulk_${Date.now()}_${index}`
    }))
    setLots(prev => [...prev, ...newLots])
    setBulkImportModalOpen(false)
    toast({ title: "Success", description: `Imported ${newLots.length} lots successfully` })
  }

  const handleUpdateLot = (updatedLot: LotItem) => {
    setLots(prev => prev.map(lot => lot.id === updatedLot.id ? updatedLot : lot))
    setDetailsModalOpen(false)
    toast({ title: "Success", description: "Lot updated successfully" })
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Lot ID', 'Factory', 'Grade', 'Weight', 'Quantity', 'Price/kg', 'Total Value', 'Status'],
      ...filteredLots.map(lot => [
        lot.lotId, lot.factory, lot.grade, lot.weight, lot.quantity, lot.pricePerKg, lot.totalValue, lot.status
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lot-pool-export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({ title: "Success", description: "CSV exported successfully" })
  }

  const handleViewLot = (lot: LotItem) => {
    setSelectedLot(lot)
    setDetailsModalOpen(true)
  }

  const handleEditLot = (lot: LotItem) => {
    setSelectedLot(lot)
    setDetailsModalOpen(true)
  }

  const handleBidIntake = (lot: LotItem) => {
    setSelectedLot(lot)
    setBidIntakeModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 font-semibold border border-gray-200">DRAFT</Badge>
      case 'ready':
        return <Badge className="bg-blue-100 text-blue-800 font-semibold border border-blue-200">READY</Badge>
      case 'openForBids':
        return <Badge className="bg-purple-100 text-purple-800 font-semibold border border-purple-200">OPEN FOR BIDS</Badge>
      case 'bought':
        return <Badge className="bg-green-100 text-green-800 font-semibold border border-green-200">BOUGHT</Badge>
      case 'invoiced':
        return <Badge className="bg-orange-100 text-orange-800 font-semibold border border-orange-200">INVOICED</Badge>
      case 'settled':
        return <Badge className="bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">SETTLED</Badge>
      case 'released':
        return <Badge className="bg-gray-100 text-gray-800 font-semibold border border-gray-200">RELEASED</Badge>
      case 'archived':
        return <Badge className="bg-slate-100 text-slate-800 font-semibold border border-slate-200">ARCHIVED</Badge>
      default:
        return <Badge variant="secondary" className="font-semibold">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
          <Input
            placeholder="Search lots by ID, factory, or grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-500"
          />
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={handleExportCSV} 
            variant="outline"
            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            onClick={() => setBulkImportModalOpen(true)} 
            variant="outline"
            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 font-medium"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button 
            onClick={() => setAddLotModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Lot
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-b border-slate-200">
              <TableHead className="font-semibold text-slate-700 text-sm">Lot ID</TableHead>
              <TableHead className="font-semibold text-slate-700 text-sm">Factory</TableHead>
              <TableHead className="font-semibold text-slate-700 text-sm">Grade</TableHead>
              <TableHead className="font-semibold text-slate-700 text-sm">Weight (kg)</TableHead>
              <TableHead className="font-semibold text-slate-700 text-sm">Quantity</TableHead>
              <TableHead className="font-semibold text-slate-700 text-sm">Price/kg</TableHead>
              <TableHead className="font-semibold text-slate-700 text-sm">Total Value</TableHead>
              <TableHead className="font-semibold text-slate-700 text-sm">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLots.map((lot) => (
              <TableRow key={lot.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                <TableCell className="font-semibold text-blue-600 text-sm">{lot.lotId}</TableCell>
                <TableCell className="text-slate-900 font-medium text-sm">{lot.factory}</TableCell>
                <TableCell className="text-slate-900 font-medium text-sm">{lot.grade}</TableCell>
                <TableCell className="text-slate-900 font-mono text-sm">{lot.weight.toLocaleString()}</TableCell>
                <TableCell className="text-slate-900 font-mono text-sm">{lot.quantity}</TableCell>
                <TableCell className="text-slate-900 font-mono text-sm">${lot.pricePerKg}</TableCell>
                <TableCell className="text-slate-900 font-mono text-sm">${lot.totalValue.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(lot.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewLot(lot)}
                      className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditLot(lot)}
                      className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBidIntake(lot)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      Bid
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddLotModal
        open={addLotModalOpen}
        onOpenChange={setAddLotModalOpen}
        onAddLot={handleAddLot}
      />
      
      <BulkImportModal
        open={bulkImportModalOpen}
        onOpenChange={setBulkImportModalOpen}
        onImportComplete={handleBulkImport}
      />
      
      {selectedLot && (
        <>
          <LotDetailsModal
            lot={selectedLot}
            open={detailsModalOpen}
            onOpenChange={setDetailsModalOpen}
            onUpdateLot={handleUpdateLot}
          />
          
          <ManualBidIntakeModal
            open={bidIntakeModalOpen}
            onOpenChange={setBidIntakeModalOpen}
            lot={selectedLot}
            onSubmitBid={(bidData) => {
              console.log('Bid submitted:', bidData)
              setBidIntakeModalOpen(false)
              toast({ title: "Success", description: "Bid submitted successfully" })
            }}
          />
        </>
      )}
    </div>
  )
}
