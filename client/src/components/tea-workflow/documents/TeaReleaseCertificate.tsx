
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Send, QrCode, Building2, User, Calendar } from "lucide-react"

interface ReleaseData {
  certificateNo: string
  dateIssued: string
  buyer: {
    name: string
    code?: string
  }
  payment: {
    refNo: string
    amount: number
    status: 'confirmed'
  }
  lots: Array<{
    lotNo: string
    factoryName: string
    grade: string
    quantity: number
    releaseStatus: 'released' | 'pending'
  }>
  warehouse: {
    name: string
    address: string
    contactPerson: string
    phone: string
  }
  signatures: {
    iteaAuthorized?: string
    warehouseManager?: string
    buyerRep?: string
    dateOfCollection?: string
  }
}

interface TeaReleaseCertificateProps {
  data: ReleaseData
  onDownload: () => void
  onResend: () => void
}

export const TeaReleaseCertificate = ({ data, onDownload, onResend }: TeaReleaseCertificateProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TEA RELEASE CERTIFICATE</h1>
            <p className="text-lg font-semibold text-aqua-600">Certificate No: {data.certificateNo}</p>
            <p className="text-gray-600">Date Issued: {data.dateIssued}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-aqua-600 mb-2">iTea HQ</div>
            <div className="flex items-center space-x-2">
              <QrCode className="h-12 w-12 text-gray-400" />
              <p className="text-xs text-gray-500">Scan for verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer & Payment Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <User className="h-5 w-5 mr-2 text-aqua-500" />
            Buyer & Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Buyer Name</p>
                <p className="font-semibold text-lg">{data.buyer.name}</p>
                {data.buyer.code && (
                  <p className="text-sm text-gray-500">Buyer Code: {data.buyer.code}</p>
                )}
              </div>
            </div>
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Payment Reference</p>
                <p className="font-semibold">{data.payment.refNo}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Payment Amount</p>
                <p className="font-semibold text-lg">${data.payment.amount.toLocaleString()}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Payment Status: {data.payment.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lot Release Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-aqua-500" />
            Lot Release Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot No.</TableHead>
                <TableHead>Factory Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Quantity (MT)</TableHead>
                <TableHead>Release Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.lots.map((lot, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{lot.lotNo}</TableCell>
                  <TableCell>{lot.factoryName}</TableCell>
                  <TableCell>{lot.grade}</TableCell>
                  <TableCell>{lot.quantity}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lot.releaseStatus)}>
                      {lot.releaseStatus.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Warehouse Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-aqua-500" />
            Warehouse Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Warehouse Name</p>
              <p className="font-semibold">{data.warehouse.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Person</p>
              <p className="font-semibold">{data.warehouse.contactPerson}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-semibold">{data.warehouse.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{data.warehouse.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signatory Block */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <User className="h-5 w-5 mr-2 text-aqua-500" />
            Authorized Signatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="border-b-2 border-gray-300 h-16 mb-2"></div>
              <p className="font-semibold">iTea HQ Authorized</p>
              <p className="text-sm text-gray-500">Signature & Date</p>
              {data.signatures.iteaAuthorized && (
                <p className="text-xs mt-1">{data.signatures.iteaAuthorized}</p>
              )}
            </div>
            <div className="text-center">
              <div className="border-b-2 border-gray-300 h-16 mb-2"></div>
              <p className="font-semibold">Warehouse Manager</p>
              <p className="text-sm text-gray-500">Signature & Date</p>
              {data.signatures.warehouseManager && (
                <p className="text-xs mt-1">{data.signatures.warehouseManager}</p>
              )}
            </div>
            <div className="text-center">
              <div className="border-b-2 border-gray-300 h-16 mb-2"></div>
              <p className="font-semibold">Buyer Representative</p>
              <p className="text-sm text-gray-500">Signature & Date</p>
              {data.signatures.buyerRep && (
                <p className="text-xs mt-1">{data.signatures.buyerRep}</p>
              )}
            </div>
          </div>
          {data.signatures.dateOfCollection && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Date of Collection</p>
              <p className="font-semibold">{data.signatures.dateOfCollection}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800 font-semibold text-center">
          IMPORTANT: Tea to be released only upon production of this certificate.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-6 text-center">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Digital Signature Verification</p>
            <p className="text-xs text-gray-500 font-mono">Hash: {data.certificateNo.replace('TRC-', 'HASH-')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">iTea HQ - Tea Release Certificate</p>
            <p className="text-xs text-gray-500">Generated on {data.dateIssued}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8 no-print">
        <Button onClick={onDownload} className="fintech-button-primary">
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
        <Button onClick={onResend} variant="outline">
          <Send className="h-4 w-4 mr-2" />
          Send to Warehouse
        </Button>
      </div>
    </div>
  )
}
