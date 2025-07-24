import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Filter, Plus, Eye, CheckCircle, Clock, AlertTriangle, Package } from "lucide-react"

interface Bid {
  id: string
  lotId: string
  date: string
  buyerName: string
  factory: string
  grade: string
  quantity: number
  pricePerKg: number
  amount: number
  status: string
  priority?: string
}

const mockBids: Bid[] = [
  {
    id: "BID-2024001",
    lotId: "LOT-001",
    date: "2024-03-15",
    buyerName: "Kenya Tea Exports",
    factory: "KTDA Imenti",
    grade: "BP1",
    quantity: 5000,
    pricePerKg: 4.50,
    amount: 22500,
    status: "pending-review",
    priority: "high"
  },
  {
    id: "BID-2024002",
    lotId: "LOT-002",
    date: "2024-03-16",
    buyerName: "Global Tea Traders",
    factory: "Unilever Limuru",
    grade: "PF1",
    quantity: 3000,
    pricePerKg: 4.20,
    amount: 12600,
    status: "approved",
    priority: "medium"
  },
  {
    id: "BID-2024003",
    lotId: "LOT-003",
    date: "2024-03-17",
    buyerName: "Associated Tea Brokers",
    factory: "James Finlay Kericho",
    grade: "FBOP",
    quantity: 4000,
    pricePerKg: 4.80,
    amount: 19200,
    status: "requires-info",
    priority: "low"
  },
  {
    id: "BID-2024004",
    lotId: "LOT-004",
    date: "2024-03-18",
    buyerName: "East African Tea Inc.",
    factory: "Sasini Estates",
    grade: "BP1",
    quantity: 2500,
    pricePerKg: 5.00,
    amount: 12500,
    status: "draft",
    priority: "high"
  },
  {
    id: "BID-2024005",
    lotId: "LOT-005",
    date: "2024-03-19",
    buyerName: "Mombasa Tea Auction",
    factory: "Williamson Tea",
    grade: "PF1",
    quantity: 3500,
    pricePerKg: 4.30,
    amount: 15050,
    status: "approved",
    priority: "medium"
  }
]

export const BidIntake = () => {
  const [bids, setBids] = useState<Bid[]>(mockBids)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBids = bids.filter(bid => {
    const matchesSearch = bid.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bid.lotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bid.factory.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || bid.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending-review':
        return <Badge variant="info" className="bg-blue-100 text-blue-800">Pending Review</Badge>
      case 'approved':
        return <Badge variant="success" className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="error" className="bg-red-100 text-red-800">Rejected</Badge>
      case 'requires-info':
        return <Badge variant="warning" className="bg-orange-100 text-orange-800">Requires Info</Badge>
      case 'draft':
        return <Badge variant="draft" className="bg-gray-100 text-gray-800">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error">High</Badge>
      case 'medium':
        return <Badge variant="medium">Medium</Badge>
      case 'low':
        return <Badge variant="success">Low</Badge>
      default:
        return <Badge variant="draft">{priority}</Badge>
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Bid Intake</CardTitle>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Bid
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Search bids..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Search className="w-4 h-4 ml-2 text-gray-500" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending-review">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="requires-info">Requires Info</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="h-[450px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Factory</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price/Kg</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBids.map(bid => (
                <TableRow key={bid.id}>
                  <TableCell className="font-medium">{bid.lotId}</TableCell>
                  <TableCell>{bid.date}</TableCell>
                  <TableCell>{bid.buyerName}</TableCell>
                  <TableCell>{bid.factory}</TableCell>
                  <TableCell>{bid.grade}</TableCell>
                  <TableCell className="text-right">{bid.quantity}</TableCell>
                  <TableCell className="text-right">${bid.pricePerKg}</TableCell>
                  <TableCell className="text-right">${bid.amount}</TableCell>
                  <TableCell>{getStatusBadge(bid.status)}</TableCell>
                  <TableCell>{getPriorityBadge(bid.priority || 'medium')}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
