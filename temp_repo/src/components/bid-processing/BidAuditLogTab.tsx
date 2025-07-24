
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, AlertCircle, User, Settings, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Bid } from "@/types/bid"
import { useState } from "react"

interface BidAuditLogTabProps {
  bid: Bid
}

interface AuditEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  user: string
  userType: 'user' | 'system'
  status: 'completed' | 'current' | 'pending' | 'overdue' | 'warning'
  type: 'action' | 'milestone' | 'alert' | 'system'
  metadata?: Record<string, any>
}

export const BidAuditLogTab = ({ bid }: BidAuditLogTabProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  // Comprehensive audit events - in real app this would come from audit service
  const auditEvents: AuditEvent[] = [
    {
      id: '1',
      title: 'Bid Submitted',
      description: 'Initial bid received from buyer via auction platform',
      date: bid.date,
      time: '09:15 AM',
      user: 'System',
      userType: 'system',
      status: 'completed',
      type: 'milestone',
      metadata: { amount: bid.amount, source: 'auction' }
    },
    {
      id: '2',
      title: 'Bid Validation',
      description: 'Automatic validation of bid parameters and buyer credentials',
      date: bid.date,
      time: '09:16 AM',
      user: 'System',
      userType: 'system',
      status: 'completed',
      type: 'system'
    },
    {
      id: '3',
      title: 'Bid Review Started',
      description: 'Manual review process initiated for bid approval',
      date: '2024-01-16',
      time: '10:30 AM',
      user: 'John Doe',
      userType: 'user',
      status: 'completed',
      type: 'action',
      metadata: { reviewer: 'John Doe', department: 'Operations' }
    },
    {
      id: '4',
      title: 'Bid Approved',
      description: 'Bid reviewed and approved for processing pipeline',
      date: '2024-01-16',
      time: '11:45 AM',
      user: 'John Doe',
      userType: 'user',
      status: 'completed',
      type: 'milestone'
    },
    {
      id: '5',
      title: 'E-Slip Generation',
      description: 'Electronic slip generated and prepared for buyer delivery',
      date: '2024-01-17',
      time: '02:15 PM',
      user: 'Jane Smith',
      userType: 'user',
      status: bid.status === 'bid-intake' ? 'pending' : 'completed',
      type: 'action',
      metadata: { eslipNumber: `ES-${bid.id}` }
    },
    {
      id: '6',
      title: 'E-Slip Sent to Buyer',
      description: 'E-slip delivered to buyer via email and SMS notification',
      date: '2024-01-17',
      time: '02:20 PM',
      user: 'System',
      userType: 'system',
      status: bid.status === 'bid-intake' ? 'pending' : 'completed',
      type: 'system',
      metadata: { email: 'buyer@example.com', method: 'email_sms' }
    },
    {
      id: '7',
      title: 'Payment Monitoring Started',
      description: 'Automated payment monitoring activated for incoming transactions',
      date: '2024-01-17',
      time: '02:21 PM',
      user: 'System',
      userType: 'system',
      status: bid.status === 'payment-matching' ? 'current' : 
             ['split-processing', 'payout-approval', 'tea-release'].includes(bid.status) ? 'completed' : 'pending',
      type: 'system'
    },
    {
      id: '8',
      title: 'Payment Received',
      description: 'Payment successfully received and matched to bid',
      date: '2024-01-20',
      time: '09:30 AM',
      user: 'System',
      userType: 'system',
      status: ['split-processing', 'payout-approval', 'tea-release'].includes(bid.status) ? 'completed' : 'pending',
      type: 'milestone',
      metadata: { amount: bid.amount, method: 'bank_transfer' }
    },
    {
      id: '9',
      title: 'Split Processing Initiated',
      description: 'Fund allocation process started for factory and platform fees',
      date: '2024-01-20',
      time: '10:15 AM',
      user: 'Mike Johnson',
      userType: 'user',
      status: bid.status === 'split-processing' ? 'current' : 
             ['payout-approval', 'tea-release'].includes(bid.status) ? 'completed' : 'pending',
      type: 'action'
    },
    {
      id: '10',
      title: 'Payout Authorization',
      description: 'Payout to factory authorized and queued for processing',
      date: '2024-01-21',
      time: '11:00 AM',
      user: 'Sarah Wilson',
      userType: 'user',
      status: bid.status === 'payout-approval' ? 'current' : 
             bid.status === 'tea-release' ? 'completed' : 'pending',
      type: 'milestone'
    },
    {
      id: '11',
      title: 'Tea Release Notice',
      description: 'Release authorization sent to warehouse for tea collection',
      date: '2024-01-22',
      time: '08:30 AM',
      user: 'David Chen',
      userType: 'user',
      status: bid.status === 'tea-release' ? 'completed' : 'pending',
      type: 'action'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'current':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
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
      case 'warning':
        return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'overdue':
        return 'text-red-700 bg-red-50 border-red-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  const getUserIcon = (userType: string) => {
    return userType === 'system' ? 
      <Settings className="w-3 h-3" /> : 
      <User className="w-3 h-3" />
  }

  const filteredEvents = auditEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || event.type === filterType
    const matchesUser = filterUser === 'all' || event.userType === filterUser
    
    return matchesSearch && matchesType && matchesUser
  })

  return (
    <div className="space-y-6">
      {/* Audit Log Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Comprehensive Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {auditEvents.filter(e => e.status === 'completed').length}
              </p>
              <p className="text-sm text-green-700">Completed</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {auditEvents.filter(e => e.status === 'current').length}
              </p>
              <p className="text-sm text-blue-700">In Progress</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {auditEvents.filter(e => e.status === 'pending').length}
              </p>
              <p className="text-sm text-orange-700">Pending</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-600">{auditEvents.length}</p>
              <p className="text-sm text-slate-700">Total Events</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Events</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by title, description, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="milestone">Milestones</SelectItem>
                  <SelectItem value="action">User Actions</SelectItem>
                  <SelectItem value="system">System Events</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">User Type</label>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="user">Manual Actions</SelectItem>
                  <SelectItem value="system">System Actions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Events */}
      <Card>
        <CardHeader>
          <CardTitle>Event Timeline ({filteredEvents.length} events)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {index !== filteredEvents.length - 1 && (
                  <div className="absolute left-5 top-8 w-0.5 h-16 bg-slate-200" />
                )}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="flex-1 min-w-0 bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-slate-900">{event.title}</h5>
                      <Badge className={cn("text-xs", getStatusColor(event.status))}>
                        {event.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{event.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-4">
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        <div className="flex items-center space-x-1">
                          {getUserIcon(event.userType)}
                          <span>{event.user}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    {event.metadata && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(event.metadata).map(([key, value]) => (
                            <span key={key} className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
