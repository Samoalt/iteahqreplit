
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, Download, Eye, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface EntityDocumentsTabProps {
  entity: any
}

export const EntityDocumentsTab = ({ entity }: EntityDocumentsTabProps) => {
  const [documents] = useState([
    {
      id: "1",
      name: "Trading Agreement 2024",
      type: "Contract",
      uploadDate: "2024-01-15",
      fileSize: "2.4 MB",
      status: "active",
      downloadUrl: "#"
    },
    {
      id: "2", 
      name: "Business License",
      type: "License",
      uploadDate: "2024-01-10",
      fileSize: "856 KB",
      status: "active",
      downloadUrl: "#"
    },
    {
      id: "3",
      name: "Tax Certificate",
      type: "Certificate",
      uploadDate: "2023-12-20",
      fileSize: "1.2 MB", 
      status: "expired",
      downloadUrl: "#"
    }
  ])

  const handleUpload = () => {
    toast({
      title: "Upload Document",
      description: "Document upload functionality would be implemented here"
    })
  }

  const handleDownload = (doc: any) => {
    toast({
      title: "Downloading",
      description: `Downloading ${doc.name}...`
    })
  }

  const handlePreview = (doc: any) => {
    toast({
      title: "Preview Document", 
      description: `Opening preview for ${doc.name}`
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "success" as const, label: "Active" },
      expired: { variant: "destructive" as const, label: "Expired" },
      pending: { variant: "warning" as const, label: "Pending Review" }
    }
    return variants[status as keyof typeof variants] || { variant: "secondary" as const, label: "Unknown" }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Management</CardTitle>
            <Button onClick={handleUpload} className="elastic-button-primary">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600 mb-2">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-slate-500">Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span className="text-sm">{doc.uploadDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{doc.fileSize}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(doc.status).variant}>
                        {getStatusBadge(doc.status).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePreview(doc)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload contracts, licenses, and other important documents</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
