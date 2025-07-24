
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Settings, CheckCircle, Clock, AlertTriangle, DollarSign, Users } from "lucide-react"

interface SplitProcessingProps {
  // Define any props here
}

interface SplitData {
  id: string
  name: string
  type: 'percentage' | 'fixed' | 'tiered'
  value: number
  status: 'calculated' | 'approved' | 'processing' | 'completed' | 'disputed' | 'pending-review'
  progress: number
  beneficiaries: number
}

const mockSplits: SplitData[] = [
  {
    id: 'split-1',
    name: 'Factory Share',
    type: 'percentage',
    value: 60,
    status: 'calculated',
    progress: 75,
    beneficiaries: 1
  },
  {
    id: 'split-2',
    name: 'Broker Commission',
    type: 'fixed',
    value: 5,
    status: 'approved',
    progress: 100,
    beneficiaries: 1
  },
  {
    id: 'split-3',
    name: 'Farmer Payment',
    type: 'percentage',
    value: 35,
    status: 'processing',
    progress: 25,
    beneficiaries: 150
  },
  {
    id: 'split-4',
    name: 'Sustainability Fund',
    type: 'percentage',
    value: 2,
    status: 'completed',
    progress: 100,
    beneficiaries: 1
  },
  {
    id: 'split-5',
    name: 'Dispute Resolution',
    type: 'fixed',
    value: 10,
    status: 'disputed',
    progress: 0,
    beneficiaries: 2
  },
  {
    id: 'split-6',
    name: 'Pending Review Split',
    type: 'percentage',
    value: 3,
    status: 'pending-review',
    progress: 50,
    beneficiaries: 5
  }
]

export const SplitProcessing = () => {
  const [splits, setSplits] = useState<SplitData[]>(mockSplits)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredSplits = splits.filter(split => {
    const matchesSearch = split.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || split.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalBeneficiaries = splits.reduce((sum, split) => sum + split.beneficiaries, 0)
  const totalValue = splits.reduce((sum, split) => sum + split.value, 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'calculated':
        return <Badge variant="info" className="bg-blue-100 text-blue-800">Calculated</Badge>
      case 'approved':
        return <Badge variant="success" className="bg-green-100 text-green-800">Approved</Badge>
      case 'processing':
        return <Badge variant="processing" className="bg-purple-100 text-purple-800">Processing</Badge>
      case 'completed':
        return <Badge variant="success" className="bg-green-100 text-green-800">Completed</Badge>
      case 'disputed':
        return <Badge variant="error" className="bg-red-100 text-red-800">Disputed</Badge>
      case 'pending-review':
        return <Badge variant="warning" className="bg-orange-100 text-orange-800">Pending Review</Badge>
      default:
        return <Badge variant="draft">{status}</Badge>
    }
  }

  const getSplitTypeBadge = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Badge variant="info">Percentage</Badge>
      case 'fixed':
        return <Badge variant="medium">Fixed Amount</Badge>
      case 'tiered':
        return <Badge variant="warning">Tiered</Badge>
      default:
        return <Badge variant="draft">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">Total Beneficiaries</p>
                <p className="text-2xl font-bold text-slate-900">{totalBeneficiaries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">Total Value</p>
                <p className="text-2xl font-bold text-slate-900">{totalValue}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">Splits</p>
                <p className="text-2xl font-bold text-slate-900">{splits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search splits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="calculated">Calculated</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
              <SelectItem value="pending-review">Pending Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Manage Splits
        </Button>
      </div>

      <Separator />

      {/* Split Table */}
      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Beneficiaries</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSplits.map((split) => (
              <TableRow key={split.id}>
                <TableCell className="font-medium">{split.name}</TableCell>
                <TableCell>{getSplitTypeBadge(split.type)}</TableCell>
                <TableCell>{split.value}%</TableCell>
                <TableCell>{getStatusBadge(split.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={split.progress} className="w-24" />
                    <span>{split.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{split.beneficiaries}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
