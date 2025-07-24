
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileText, AlertCircle } from "lucide-react"
import { useState } from "react"

interface BulkImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const BulkImportModal = ({ isOpen, onClose }: BulkImportModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return

    setImportStatus('uploading')
    
    // Simulate file processing
    setTimeout(() => {
      setImportStatus('processing')
      setTimeout(() => {
        setImportStatus('success')
        setTimeout(() => {
          onClose()
          setImportStatus('idle')
          setSelectedFile(null)
        }, 2000)
      }, 2000)
    }, 1000)
  }

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = `Entity Type,Entity Name,Contact Person,Email,Phone,Location,Bank Name,Account Number,Preferred Account
buyer,Example Tea Co.,John Doe,john@example.com,+254-700-123456,"Nairobi, Kenya",KCB Bank,1234567890,USD Account
producer,Example Gardens,Jane Smith,jane@example.com,+254-701-234567,"Kericho, Kenya",Equity Bank,0987654321,KES Account
warehouse,Example Storage,Bob Johnson,bob@example.com,+254-702-345678,"Mombasa, Kenya",Co-op Bank,1122334455,KES Account`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'entity_import_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusMessage = () => {
    switch (importStatus) {
      case 'uploading':
        return 'Uploading file...'
      case 'processing':
        return 'Processing entities...'
      case 'success':
        return 'Import completed successfully!'
      case 'error':
        return 'Import failed. Please check your file format.'
      default:
        return ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Import Entities</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Import Instructions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Download the CSV template below</li>
                  <li>Fill in your entity data</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review and confirm the import</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Download Template */}
          <div>
            <Label>Step 1: Download Template</Label>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full mt-2 flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download CSV Template</span>
            </Button>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="file-upload">Step 2: Upload Your CSV File</Label>
            <div className="mt-2">
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={importStatus !== 'idle'}
              />
              {selectedFile && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                  <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          {importStatus !== 'idle' && (
            <div className={`p-3 rounded-lg ${
              importStatus === 'success' ? 'bg-green-50 text-green-800' :
              importStatus === 'error' ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              <div className="flex items-center space-x-2">
                {importStatus === 'success' ? (
                  <div className="h-4 w-4 bg-green-600 rounded-full" />
                ) : importStatus === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <div className="h-4 w-4 bg-blue-600 rounded-full animate-pulse" />
                )}
                <span className="font-medium">{getStatusMessage()}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={importStatus === 'uploading' || importStatus === 'processing'}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importStatus !== 'idle'}
              className="fintech-button-primary flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Import Entities</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
