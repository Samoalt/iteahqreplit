import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, DollarSign } from "lucide-react"

interface MMFStatusProps {
  onManage: () => void
}

interface MMFData {
  status: string
  balance: number
  performance: number
}

const mockMMFData: MMFData = {
  status: 'active',
  balance: 125000,
  performance: 4.2
}

export const MMFStatus = ({ onManage }: MMFStatusProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'pending':
        return <Badge variant="info">Pending</Badge>
      case 'suspended':
        return <Badge variant="warning">Suspended</Badge>
      case 'closed':
        return <Badge variant="draft">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPerformanceBadge = (performance: number) => {
    if (performance > 5) {
      return <Badge variant="success" className="bg-green-100 text-green-800">Excellent</Badge>
    } else if (performance > 3) {
      return <Badge variant="info" className="bg-blue-100 text-blue-800">Good</Badge>
    } else if (performance > 0) {
      return <Badge variant="warning" className="bg-orange-100 text-orange-800">Average</Badge>
    } else {
      return <Badge variant="error" className="bg-red-100 text-red-800">Poor</Badge>
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Money Market Fund (MMF)
          {getStatusBadge(mockMMFData.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-slate-600">Balance:</span>
          <span className="text-xl font-semibold text-slate-900">${mockMMFData.balance.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-slate-600">Performance:</span>
          {getPerformanceBadge(mockMMFData.performance)}
        </div>
        <Button onClick={onManage} className="w-full">Manage MMF</Button>
      </CardContent>
    </Card>
  )
}
