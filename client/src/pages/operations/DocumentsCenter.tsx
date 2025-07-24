import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Upload, 
  Download, 
  FileText, 
  Receipt, 
  CreditCard, 
  CheckCircle,
  Clock,
  XCircle,
  Archive,
  Eye,
  MoreHorizontal,
  CalendarIcon,
  FileCheck,
  FileX,
  FileImage,
  FolderOpen
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type DocumentStatus = "approved" | "pending" | "draft" | "rejected" | "archived"
type DocumentType = "e-slip" | "payment-proof" | "payout-approval" | "release-certificate" | "invoice" | "other"

interface Document {
  id: string
  name: string
  type: DocumentType
  bidId: string
  factory: string
  buyer: string
  status: DocumentStatus
  uploadedBy: string
  dateUploaded: string
  fileSize: string
  selected?: boolean
}

const DocumentsCenter = () => {
  const { toast } = useToast()
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "E-Slip_BID-001.pdf",
      type: "e-slip",
      bidId: "BID-001",
      factory: "Kericho Tea Factory",
      buyer: "Global Tea Co.",
      status: "approved",
      uploadedBy: "John Doe",
      dateUploaded: "2024-01-15",
      fileSize: "2.3 MB"
    },
    {
      id: "2", 
      name: "Payment_Proof_BID-002.pdf",
      type: "payment-proof",
      bidId: "BID-002",
      factory: "Nandi Hills Estate",
      buyer: "Premium Tea Ltd",
      status: "pending",
      uploadedBy: "Jane Smith",
      dateUploaded: "2024-01-14",
      fileSize: "1.8 MB"
    },
    {
      id: "3",
      name: "Release_Certificate_BID-001.pdf", 
      type: "release-certificate",
      bidId: "BID-001",
      factory: "Kericho Tea Factory",
      buyer: "Global Tea Co.",
      status: "approved",
      uploadedBy: "Admin",
      dateUploaded: "2024-01-13",
      fileSize: "950 KB"
    },
    {
      id: "4",
      name: "Payout_Approval_BID-003.pdf",
      type: "payout-approval", 
      bidId: "BID-003",
      factory: "Limuru Tea Estate",
      buyer: "East Africa Tea",
      status: "draft",
      uploadedBy: "Mike Johnson",
      dateUploaded: "2024-01-12",
      fileSize: "1.2 MB"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const documentTypes = [
    { value: "all", label: "All Types" },
    { value: "e-slip", label: "E-Slips" },
    { value: "payment-proof", label: "Payment Proofs" },
    { value: "payout-approval", label: "Payout Approvals" },
    { value: "release-certificate", label: "Release Certificates" },
    { value: "invoice", label: "Invoices" },
    { value: "other", label: "Other" }
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending Review" },
    { value: "draft", label: "Draft" },
    { value: "rejected", label: "Rejected" },
    { value: "archived", label: "Archived" }
  ]

  const getStatusBadge = (status: DocumentStatus) => {
    const variants = {
      approved: "success",
      pending: "warning", 
      draft: "draft",
      rejected: "destructive",
      archived: "secondary"
    }
    
    return (
      <Badge variant={variants[status] as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTypeBadge = (type: DocumentType) => {
    const variants = {
      "e-slip": "info",
      "payment-proof": "success",
      "payout-approval": "warning",
      "release-certificate": "info",
      "invoice": "secondary",
      "other": "outline"
    }
    
    const labels = {
      "e-slip": "E-Slip",
      "payment-proof": "Payment Proof",
      "payout-approval": "Payout Approval", 
      "release-certificate": "Release Certificate",
      "invoice": "Invoice",
      "other": "Other"
    }
    
    return (
      <Badge variant={variants[type] as any}>
        {labels[type]}
      </Badge>
    )
  }

  const getTypeIcon = (type: DocumentType) => {
    const icons = {
      "e-slip": FileText,
      "payment-proof": CreditCard,
      "payout-approval": CheckCircle,
      "release-certificate": FileCheck,
      "invoice": Receipt,
      "other": FileImage
    }
    
    const Icon = icons[type] || FileText
    return <Icon className="h-4 w-4" />
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.bidId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.factory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.buyer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === "all" || doc.type === selectedType
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus
    const matchesTab = activeTab === "all" || doc.type === activeTab
    
    return matchesSearch && matchesType && matchesStatus && matchesTab
  })

  const handleSelectDocument = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id))
    }
  }

  const getTabCount = (type: string) => {
    if (type === "all") return documents.length
    return documents.filter(doc => doc.type === type).length
  }

  // Action handlers
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setViewModalOpen(true)
  }

  const handleDownloadDocument = (document: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${document.name}...`,
    })
    // Simulate download
    setTimeout(() => {
      const link = window.document.createElement('a')
      link.href = `data:application/pdf;base64,`
      link.download = document.name
      link.click()
    }, 1000)
  }

  const handleArchiveDocument = (document: Document) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === document.id 
        ? { ...doc, status: 'archived' as DocumentStatus }
        : doc
    ))
    toast({
      title: "Document Archived",
      description: `${document.name} has been archived`,
    })
  }

  const handleBulkDownload = () => {
    if (selectedDocuments.length === 0) return
    
    toast({
      title: "Bulk Download Started",
      description: `Downloading ${selectedDocuments.length} documents...`,
    })
    setSelectedDocuments([])
  }

  const handleBulkArchive = () => {
    if (selectedDocuments.length === 0) return
    
    setDocuments(prev => prev.map(doc => 
      selectedDocuments.includes(doc.id) 
        ? { ...doc, status: 'archived' as DocumentStatus }
        : doc
    ))
    
    toast({
      title: "Documents Archived",
      description: `${selectedDocuments.length} documents have been archived`,
    })
    setSelectedDocuments([])
  }

  const handleUploadDocument = () => {
    setUploadModalOpen(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: "other",
        bidId: "BID-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        factory: "Unknown Factory",
        buyer: "Unknown Buyer",
        status: "draft",
        uploadedBy: "Current User",
        dateUploaded: new Date().toISOString().split('T')[0],
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      }
      
      setDocuments(prev => [newDocument, ...prev])
      setUploadModalOpen(false)
      
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully`,
      })
    }
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen animate-fade-in">
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Documents Center</h1>
              <p className="text-lg text-slate-600">Manage all documents related to bids, transactions, and releases</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Document Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full bg-white border-slate-300 text-slate-900">
              <SelectValue placeholder="Document Type" className="text-slate-900" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-300">
              {documentTypes.map(type => (
                <SelectItem key={type.value} value={type.value} className="text-slate-900 hover:bg-slate-100">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full bg-white border-slate-300 text-slate-900">
              <SelectValue placeholder="Status" className="text-slate-900" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-300">
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value} className="text-slate-900 hover:bg-slate-100">
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date From */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white border-slate-300 text-slate-900",
                  !dateFrom && "text-slate-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-600" />
                {dateFrom ? format(dateFrom, "PPP") : <span className="text-slate-500">From date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Date To */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white border-slate-300 text-slate-900",
                  !dateTo && "text-slate-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-600" />
                {dateTo ? format(dateTo, "PPP") : <span className="text-slate-500">To date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Upload Button */}
          <Button onClick={handleUploadDocument} className="bg-primary hover:bg-primary/90 text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by Bid ID, Factory, or Buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
          />
        </div>
        </CardContent>
      </Card>

      {/* Batch Actions Panel */}
      {selectedDocuments.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-blue-900">
                  {selectedDocuments.length} document(s) selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleBulkDownload} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={handleBulkArchive} size="sm" variant="outline">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button size="sm" variant="outline">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Move to Folder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white border-slate-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-slate-200 p-6">
            <TabsList className="grid grid-cols-6 bg-slate-100 p-1 rounded-lg w-full">
              <TabsTrigger value="all" className="text-sm font-medium text-slate-700 data-[state=active]:text-slate-900">
                All Documents ({getTabCount("all")})
              </TabsTrigger>
              <TabsTrigger value="e-slip" className="text-sm font-medium text-slate-700 data-[state=active]:text-slate-900">
                E-Slips ({getTabCount("e-slip")})
              </TabsTrigger>
              <TabsTrigger value="release-certificate" className="text-sm font-medium text-slate-700 data-[state=active]:text-slate-900">
                Release Certs ({getTabCount("release-certificate")})
              </TabsTrigger>
              <TabsTrigger value="payment-proof" className="text-sm font-medium text-slate-700 data-[state=active]:text-slate-900">
                Payment Records ({getTabCount("payment-proof")})
              </TabsTrigger>
              <TabsTrigger value="payout-approval" className="text-sm font-medium text-slate-700 data-[state=active]:text-slate-900">
                Payout Records ({getTabCount("payout-approval")})
              </TabsTrigger>
              <TabsTrigger value="invoice" className="text-sm font-medium text-slate-700 data-[state=active]:text-slate-900">
                Audit Records ({getTabCount("invoice")})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200">
                    <TableHead className="w-12 py-4 px-6">
                      <Checkbox
                        checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Document Name</TableHead>
                    <TableHead className="font-semibold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Type</TableHead>
                    <TableHead className="font-semibold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Bid ID</TableHead>
                    <TableHead className="font-semibold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Factory</TableHead>
                    <TableHead className="font-semibold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Buyer</TableHead>
                    <TableHead className="font-semibold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Status</TableHead>
                    <TableHead className="font-semibold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Uploaded By</TableHead>
                    <TableHead className="font-semibold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Date</TableHead>
                    <TableHead className="font-semibold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-32">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <FileX className="h-12 w-12 mb-4 text-slate-300" />
                          <p className="text-lg font-medium">No documents found</p>
                          <p className="text-sm">Try adjusting your filters or search terms</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id} className="hover:bg-slate-50 border-b border-slate-100 transition-all duration-200">
                        <TableCell className="py-4 px-6">
                          <Checkbox
                            checked={selectedDocuments.includes(document.id)}
                            onCheckedChange={() => handleSelectDocument(document.id)}
                          />
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(document.type)}
                            <span className="font-medium text-slate-900">{document.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">{getTypeBadge(document.type)}</TableCell>
                        <TableCell className="py-4 px-6">
                          <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                            {document.bidId}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium text-slate-800 py-4 px-6">{document.factory}</TableCell>
                        <TableCell className="font-medium text-slate-800 py-4 px-6">{document.buyer}</TableCell>
                        <TableCell className="py-4 px-6">{getStatusBadge(document.status)}</TableCell>
                        <TableCell className="font-medium text-slate-700 py-4 px-6">{document.uploadedBy}</TableCell>
                        <TableCell className="font-medium text-slate-700 py-4 px-6">{document.dateUploaded}</TableCell>
                        <TableCell className="py-4 px-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-slate-300">
                              <DropdownMenuItem onClick={() => handleViewDocument(document)} className="text-slate-900 hover:bg-slate-100">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadDocument(document)} className="text-slate-900 hover:bg-slate-100">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-900 hover:bg-slate-100">
                                <FolderOpen className="h-4 w-4 mr-2" />
                                Move to Folder
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchiveDocument(document)} className="text-slate-900 hover:bg-slate-100">
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Document Viewer Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white border-slate-300">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Document Viewer</DialogTitle>
            <DialogDescription className="text-slate-600">
              {selectedDocument?.name} - {selectedDocument?.fileSize}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center h-96 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-center">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Document preview would be displayed here</p>
              <p className="text-sm text-slate-500 mt-2">
                {selectedDocument?.name}
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md bg-white border-slate-300">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Upload Document</DialogTitle>
            <DialogDescription className="text-slate-600">
              Select a file to upload to the documents center
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-500">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DocumentsCenter