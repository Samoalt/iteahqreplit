
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Bid } from "@/types/bid"

interface BidTimelineProps {
  bid: Bid
}

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  user: string
  status: 'completed' | 'current' | 'pending' | 'overdue'
  type: 'action' | 'milestone' | 'alert'
}

export const BidTimeline = ({ bid }: BidTimelineProps) => {
  // Mock timeline data - in real app this would come from audit logs
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Bid Submitted',
      description: 'Initial bid received from buyer',
      date: bid.date,
      user: 'System',
      status: 'completed',
      type: 'milestone'
    },
    {
      id: '2',
      title: 'Bid Review',
      description: 'Bid reviewed and approved for processing',
      date: '2024-01-16',
      user: 'John Doe',
      status: 'completed',
      type: 'action'
    },
    {
      id: '3',
      title: 'E-Slip Generation',
      description: 'Electronic slip generated and sent to buyer',
      date: '2024-01-17',
      user: 'Jane Smith',
      status: bid.status === 'bid-intake' ? 'pending' : 'completed',
      type: 'action'
    },
    {
      id: '4',
      title: 'Payment Expected',
      description: 'Payment due from buyer',
      date: '2024-01-20',
      user: 'System',
      status: bid.status === 'payment-matching' ? 'current' : 
             new Date('2024-01-20') < new Date() ? 'overdue' : 'pending',
      type: 'milestone'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'current':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200'
      case 'current':
        return 'text-blue-700 bg-blue-50 border-blue-200'
      case 'overdue':
        return 'text-red-700 bg-red-50 border-red-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Timeline & Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {index !== timelineEvents.length - 1 && (
                <div className="absolute left-5 top-8 w-0.5 h-12 bg-slate-200" />
              )}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(event.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium text-slate-900">{event.title}</h5>
                    <Badge className={cn("text-xs", getStatusColor(event.status))}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                  <div className="flex items-center text-xs text-slate-500 space-x-3">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {event.user}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
