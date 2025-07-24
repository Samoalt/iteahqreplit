
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Upload, Eye, Trash2, Search, Filter } from "lucide-react"
import { Bid } from "@/types/bid"

interface BidDocumentsTabProps {
  bid: Bid
}

export const BidDocumentsTab = ({ bid }: BidDocumentsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Mock documents data
  const documents = bid.documents || [
    {
      id: "doc-001",
      filename: "Bid_Contract_BID-015.pdf",
      type: "PDF",
      uploadedBy: "John Admin",
      uploadedDate: "2024-01-15",
      url: "/docs/bid-contract.pdf",
      category: "contract"
    },
    {
      id: "doc-002",
      filename: "Quality_Certificate.pdf",
      type: "PDF",
      uploadedBy: "Quality Team",
      uploadedDate: "2024-01-14",
      url: "/docs/quality-cert.pdf",
      category: "certificate"
    },
    {
      id: "doc-003",
      filename: "Payment_Confirmation.png",
      type: "Image",
      uploadedBy: "Finance Team",
      uploadedDate: "2024-01-12",
      url: "/docs/payment-conf.png",
      category: "payment"
    },
    {
      id: "doc-004",
      filename: "Compliance_Check.docx",
      type: "Word",
      uploadedBy: "Compliance Officer",
      uploadedDate: "2024-01-10",
      url: "/docs/compliance.docx",
      category: "compliance"
    },
    {
      id: "doc-005",
      filename: "Delivery_Instructions.xlsx",
      type: "Excel",
      uploadedBy: "Logistics Team",
      uploadedDate: "2024-01-08",
      url: "/docs/delivery-inst.xlsx",
      category: "delivery"
    }
  ]

  const categories = [
    { value: "all", label: "All Types" },
    { value: "contract", label: "Contracts" },
    { value: "compliance", label: "Compliance" },
    { value: "certificate", label: "Certificates" },
    { value: "delivery", label: "Delivery Notes" },
    { value: "payment", label: "Payment Slips" },
    { value: "other", label: "Other" }
  ]

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || doc.category === filterType
    return matchesSearch && matchesFilter
  })

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      contract: "bg-blue-100 text-blue-800",
      compliance: "bg-purple-100 text-purple-800",
      certificate: "bg-green-100 text-green-800",
      delivery: "bg-orange-100 text-orange-800",
      payment: "bg-yellow-100 text-yellow-800",
      other: "bg-slate-100 text-slate-800"
    }
    
    return (
      <Badge className={categoryColors[category as keyof typeof categoryColors] || categoryColors.other}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    )
  }

  const getFileIcon = (type: string) => {
    return <FileText className="w-4 h-4" />
  }

  const handleUploadDocument = () => {
    console.log('Upload document for bid:', bid.id)
  }

  const handleViewDocument = (docId: string) => {
    console.log('View document:', docId)
  }

  const handleDownloadDocument = (docId: string) => {
    console.log('Download document:', docId)
  }

  const handleDeleteDocument = (docId: string) => {
    console.log('Delete document:', docId)
  }

  return (
    <div className="space-y-6">
      {/* Document Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Document Management
            </div>
            <Button onClick={handleUploadDocument}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Document Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
              <p className="text-sm text-slate-600">Total Documents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {documents.filter(d => d.category === 'contract').length}
              </p>
              <p className="text-sm text-slate-600">Contracts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.category === 'certificate').length}
              </p>
              <p className="text-sm text-slate-600">Certificates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {documents.filter(d => d.category === 'payment').length}
              </p>
              <p className="text-sm text-slate-600">Payment Docs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Documents ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Uploaded by</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getFileIcon(doc.type)}
                        <span className="font-medium">{doc.filename}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(doc.category)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {doc.uploadedBy}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(doc.uploadedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(doc.id)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc.id)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">
                {searchTerm || filterType !== "all" 
                  ? "No documents match your search criteria" 
                  : "No documents uploaded yet"
                }
              </p>
              <Button variant="outline" onClick={handleUploadDocument}>
                <Upload className="w-4 h-4 mr-2" />
                Upload First Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Accepted File Types</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>• PDF documents (.pdf)</p>
                <p>• Microsoft Word (.doc, .docx)</p>
                <p>• Microsoft Excel (.xls, .xlsx)</p>
                <p>• Images (.jpg, .png, .gif)</p>
                <p>• Text files (.txt)</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">File Requirements</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>• Maximum file size: 10MB</p>
                <p>• Clear, readable quality</p>
                <p>• Descriptive file names</p>
                <p>• Proper document category</p>
                <p>• No password protection</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
