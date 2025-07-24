
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (file: File, category: string, description?: string) => Promise<void>
  bidId: string
  loading?: boolean
}

export const FileUploadModal = ({ 
  isOpen, 
  onOpenChange, 
  onUpload,
  bidId,
  loading = false
}: FileUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [category, setCategory] = useState<string>("")
  const [description, setDescription] = useState("")
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !category) {
      toast({
        title: "Missing Information",
        description: "Please select a file and category",
        variant: "destructive"
      })
      return
    }

    try {
      await onUpload(selectedFile, category, description)
      setSelectedFile(null)
      setCategory("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Document
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx"
            />
            {selectedFile && (
              <div className="flex items-center mt-2 p-2 bg-slate-50 rounded">
                <FileText className="w-4 h-4 mr-2 text-slate-600" />
                <span className="text-sm">{selectedFile.name}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select document category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="delivery">Delivery Note</SelectItem>
                <SelectItem value="payment">Payment Proof</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this document..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
            <p className="text-sm text-blue-800">
              Maximum file size: 10MB. Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, XLS, XLSX
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !category || loading}
              className="flex-1"
            >
              {loading ? "Uploading..." : "Upload Document"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
