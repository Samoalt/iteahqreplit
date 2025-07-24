
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Send, QrCode } from "lucide-react"

interface ESlipData {
  eslipNo: string
  dateIssued: string
  status: 'pending' | 'paid' | 'overdue'
  buyer: {
    name: string
    company: string
    email: string
    phone: string
    code?: string
  }
  auction: {
    date: string
    id: string
    lotsWon: number
    totalWeight: number
    totalAmount: number
  }
  lots: Array<{
    lotNo: string
    factoryName: string
    quantity: number
    pricePerMT: number
    total: number
  }>
  paymentInstructions: {
    payableTo: string
    bankName: string
    accountNumber: string
    swiftCode: string
  }
  dueDate: string
}

interface ESlipDocumentProps {
  data: ESlipData
  onDownload: () => void
  onResend: () => void
}

export const ESlipDocument = ({ data, onDownload, onResend }: ESlipDocumentProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">E-SLIP INVOICE</h1>
            <p className="text-lg font-semibold text-aqua-600">E-Slip No: {data.eslipNo}</p>
            <p className="text-gray-600">Date of Issue: {data.dateIssued}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-aqua-600 mb-2">iTea HQ</div>
            <Badge className={getStatusColor(data.status)}>
              {data.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Buyer Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Buyer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">{data.buyer.name}</p>
              <p className="text-gray-600">{data.buyer.company}</p>
              {data.buyer.code && <p className="text-sm text-gray-500">Buyer Code: {data.buyer.code}</p>}
            </div>
            <div>
              <p className="text-gray-600">{data.buyer.email}</p>
              <p className="text-gray-600">{data.buyer.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auction Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Auction Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Auction Date</p>
              <p className="font-semibold">{data.auction.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Auction ID</p>
              <p className="font-semibold">{data.auction.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lots Won</p>
              <p className="font-semibold">{data.auction.lotsWon}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Weight</p>
              <p className="font-semibold">{data.auction.totalWeight} MT</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-aqua-50 rounded-lg">
            <p className="text-lg font-bold text-aqua-800">
              Total Payable Amount: ${data.auction.totalAmount.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lot Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Lot Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot No.</TableHead>
                <TableHead>Factory Name</TableHead>
                <TableHead>Quantity (MT)</TableHead>
                <TableHead>Price/MT</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.lots.map((lot, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{lot.lotNo}</TableCell>
                  <TableCell>{lot.factoryName}</TableCell>
                  <TableCell>{lot.quantity}</TableCell>
                  <TableCell>${lot.pricePerMT.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold">${lot.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Payment Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Payable To</p>
              <p className="font-semibold">{data.paymentInstructions.payableTo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bank Name</p>
              <p className="font-semibold">{data.paymentInstructions.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Number</p>
              <p className="font-semibold">{data.paymentInstructions.accountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Swift Code</p>
              <p className="font-semibold">{data.paymentInstructions.swiftCode}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Reference Note:</strong> Use E-Slip No. {data.eslipNo} as payment reference.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Due Date */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-lg font-bold text-red-800">
              Payment Due By: {data.dueDate}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-6 text-center">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">iTea HQ Contact Info</p>
            <p className="text-sm text-gray-600">Email: support@iteahq.com | Phone: +254-XXX-XXXX</p>
          </div>
          <div className="flex items-center space-x-2">
            <QrCode className="h-16 w-16 text-gray-400" />
            <p className="text-xs text-gray-500">Scan for verification</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8 no-print">
        <Button onClick={onDownload} className="fintech-button-primary">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={onResend} variant="outline">
          <Send className="h-4 w-4 mr-2" />
          Resend E-Slip
        </Button>
      </div>
    </div>
  )
}
