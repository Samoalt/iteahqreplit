
import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Upload, FileText, X } from "lucide-react"

interface UploadESlipModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UploadESlipModal = ({ open, onOpenChange }: UploadESlipModalProps) => {
  const [formData, setFormData] = useState({
    bidId: '',
    buyerName: '',
    uploadType: 'eslip'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const bidOptions = [
    { id: 'BID-001', buyer: 'Premium Tea Co.' },
    { id: 'BID-002', buyer: 'Highland Tea Ltd.' },
    { id: 'BID-003', buyer: 'Nandi Hills Tea' },
    { id: 'BID-004', buyer: 'Kencho Tea Factory' }
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file)
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or image file",
          variant: "destructive"
        })
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file)
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or image file",
          variant: "destructive"
        })
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !formData.bidId) {
      toast({
        title: "Error",
        description: "Please select a file and bid ID",
        variant: "destructive"
      })
      return
    }

    console.log('Uploading E-Slip:', { formData, file: selectedFile })
    
    toast({
      title: "E-Slip Uploaded",
      description: `Successfully uploaded ${selectedFile.name} for ${formData.bidId}`,
    })
    
    onOpenChange(false)
    setFormData({ bidId: '', buyerName: '', uploadType: 'eslip' })
    setSelectedFile(null)
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload E-Slip Document</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bidId" className="text-base font-medium text-slate-700">Select Bid *</Label>
            <Select 
              value={formData.bidId} 
              onValueChange={(value) => {
                const selectedBid = bidOptions.find(bid => bid.id === value)
                setFormData(prev => ({ 
                  ...prev, 
                  bidId: value,
                  buyerName: selectedBid?.buyer || ''
                }))
              }}
            >
              <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 text-slate-900">
                <SelectValue placeholder="Select bid to upload E-Slip for" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 z-50">
                {bidOptions.map((bid) => (
                  <SelectItem key={bid.id} value={bid.id} className="text-slate-900 hover:bg-slate-50">
                    {bid.id} - {bid.buyer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium text-slate-700">Upload Document *</Label>
            
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Drag and drop your E-Slip file here, or</p>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" className="border-slate-300">
                    Browse Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,image/*"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-xs text-slate-500 mt-2">PDF or image files only</p>
              </div>
            ) : (
              <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">{selectedFile.name}</p>
                      <p className="text-sm text-slate-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload E-Slip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
