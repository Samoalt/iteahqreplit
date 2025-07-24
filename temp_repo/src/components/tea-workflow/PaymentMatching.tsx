import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, CheckCircle, Clock, AlertTriangle, DollarSign, Link, Unlink } from "lucide-react"

interface PaymentMatchingProps {
  // Define any props here
}

interface Payment {
  id: string
  invoiceId: string
  amount: number
  currency: string
  date: string
  status: string
  confidence: number
  matchedInvoices: string[]
}

const mockPayments: Payment[] = [
  {
    id: "PMT-2024001",
    invoiceId: "INV-2023105",
    amount: 12500,
    currency: "USD",
    date: "2024-01-15",
    status: "matched",
    confidence: 95,
    matchedInvoices: ["INV-2023105"]
  },
  {
    id: "PMT-2024002",
    invoiceId: "INV-2023112",
    amount: 8750,
    currency: "USD",
    date: "2024-01-18",
    status: "partial",
    confidence: 75,
    matchedInvoices: ["INV-2023112", "INV-2023113"]
  },
  {
    id: "PMT-2024003",
    invoiceId: "INV-2023120",
    amount: 22000,
    currency: "USD",
    date: "2024-01-22",
    status: "unmatched",
    confidence: 40,
    matchedInvoices: []
  },
  {
    id: "PMT-2024004",
    invoiceId: "INV-2024005",
    amount: 5400,
    currency: "USD",
    date: "2024-01-25",
    status: "disputed",
    confidence: 80,
    matchedInvoices: ["INV-2024005"]
  },
  {
    id: "PMT-2024005",
    invoiceId: "INV-2024010",
    amount: 15000,
    currency: "USD",
    date: "2024-01-29",
    status: "processing",
    confidence: 60,
    matchedInvoices: ["INV-2024010", "INV-2024011"]
  }
]

export const PaymentMatching = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPayments = payments.filter(payment =>
    payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMatchStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return <Badge variant="success" className="bg-green-100 text-green-800">Matched</Badge>
      case 'partial':
        return <Badge variant="warning" className="bg-orange-100 text-orange-800">Partial Match</Badge>
      case 'unmatched':
        return <Badge variant="info" className="bg-blue-100 text-blue-800">Unmatched</Badge>
      case 'disputed':
        return <Badge variant="error" className="bg-red-100 text-red-800">Disputed</Badge>
      case 'processing':
        return <Badge variant="processing" className="bg-purple-100 text-purple-800">Processing</Badge>
      default:
        return <Badge variant="draft">{status}</Badge>
    }
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge variant="success">High ({confidence}%)</Badge>
    } else if (confidence >= 70) {
      return <Badge variant="medium">Medium ({confidence}%)</Badge>
    } else if (confidence >= 50) {
      return <Badge variant="warning">Low ({confidence}%)</Badge>
    } else {
      return <Badge variant="error">Very Low ({confidence}%)</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Payment Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by Invoice ID or Payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            </div>

            <ScrollArea className="h-[calc(100vh-250px)] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.invoiceId}</TableCell>
                      <TableCell>${payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{getMatchStatusBadge(payment.status)}</TableCell>
                      <TableCell>{getConfidenceBadge(payment.confidence)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Link className="w-4 h-4 mr-2" />
                          Match
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Unlink className="w-4 h-4 mr-2" />
                          Unlink
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
