import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Download } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface LotItem {
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

interface BulkImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (lots: Omit<LotItem, 'id'>[]) => void
}

export const BulkImportModal = ({ open, onOpenChange, onImportComplete }: BulkImportModalProps) => {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock imported data
      const importedLots: Omit<LotItem, 'id'>[] = [
        {
          lotId: "BULK001",
          factory: "IMPORTED TEA ESTATE",
          grade: "PEKOE",
          weight: 1500,
          quantity: 25,
          pricePerKg: 3.5,
          totalValue: 5250,
          batchNo: "BULK001",
          garden: "IMPORTED HIGHLANDS",
          packingDate: "2024-01-16",
          warehouse: "Import Warehouse",
          broker: "Bulk Import Broker",
          status: "draft",
          addedBy: "Bulk Import",
          timestamp: new Date().toLocaleString()
        },
        {
          lotId: "BULK002",
          factory: "IMPORTED TEA FACTORY",
          grade: "BP1",
          weight: 2200,
          quantity: 35,
          pricePerKg: 3.3,
          totalValue: 7260,
          batchNo: "BULK002",
          garden: "BULK ESTATE",
          packingDate: "2024-01-16",
          warehouse: "Central Import Hub",
          broker: "Bulk Import Broker",
          status: "ready",
          addedBy: "Bulk Import",
          timestamp: new Date().toLocaleString()
        }
      ]

      onImportComplete(importedLots)
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${importedLots.length} lots from ${file.name}`,
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error processing your file. Please check the format and try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && (file.type.includes('csv') || file.type.includes('excel') || file.type.includes('sheet'))) {
      handleFileUpload(file)
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive"
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `Lot ID,Factory,Grade,Weight (kg),Quantity,Price per kg,Batch No,Garden/Origin,Packing Date,Warehouse,Broker,Status
EXAMPLE001,EXAMPLE FACTORY,BP1,2000,30,3.40,B2024001,EXAMPLE ESTATE,2024-01-15,Example Warehouse,Example Broker,draft`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'lot-pool-template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to help you format your data",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="elastic-gradient-text">Bulk Import Lots</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-slate-600 mb-4">
              Upload a CSV or Excel file to import multiple lots at once
            </p>
            
            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="mb-4 elastic-button-secondary"
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-slate-300 bg-slate-50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-600">Processing your file...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-slate-900 mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-slate-500">
                    Supports CSV and Excel files up to 10MB
                  </p>
                </div>
                
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="elastic-button-secondary"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>
          
          <div className="text-xs text-slate-500 space-y-1">
            <p><strong>Required columns:</strong> Lot ID, Factory, Grade, Weight, Quantity, Price per kg</p>
            <p><strong>Optional columns:</strong> Batch No, Garden, Packing Date, Warehouse, Broker, Status</p>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
