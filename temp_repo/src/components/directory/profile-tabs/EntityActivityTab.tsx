
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, User, FileText, DollarSign, MessageSquare, Edit } from "lucide-react"

interface EntityActivityTabProps {
  entity: any
}

export const EntityActivityTab = ({ entity }: EntityActivityTabProps) => {
  const activities = [
    {
      id: "1",
      type: "transaction",
      action: "Payment received",
      description: "Lot purchase payment - Ref: IM24252673",
      amount: "$8,481.60",
      user: "System",
      timestamp: "2024-01-18 14:30",
      icon: DollarSign,
      iconColor: "text-green-600"
    },
    {
      id: "2",
      type: "communication",
      action: "Message sent",
      description: "Tea quality inspection report shared",
      user: "John Admin",
      timestamp: "2024-01-18 10:15",
      icon: MessageSquare,
      iconColor: "text-blue-600"
    },
    {
      id: "3",
      type: "document",
      action: "Document uploaded",
      description: "Trading Agreement 2024.pdf",
      user: "Jane Manager",
      timestamp: "2024-01-17 16:45",
      icon: FileText,
      iconColor: "text-purple-600"
    },
    {
      id: "4",
      type: "profile",
      action: "Profile updated",
      description: "Banking details modified",
      user: "John Admin",
      timestamp: "2024-01-17 09:20",
      icon: Edit,
      iconColor: "text-orange-600"
    },
    {
      id: "5",
      type: "transaction",
      action: "Payment processed",
      description: "Commission payment - BP1 Grade lot",
      amount: "$250.00",
      user: "System",
      timestamp: "2024-01-16 11:30",
      icon: DollarSign,
      iconColor: "text-red-600"
    }
  ]

  const getActivityBadge = (type: string) => {
    const variants = {
      transaction: { variant: "success" as const, label: "Transaction" },
      communication: { variant: "info" as const, label: "Communication" },
      document: { variant: "secondary" as const, label: "Document" },
      profile: { variant: "warning" as const, label: "Profile Update" }
    }
    return variants[type as keyof typeof variants] || { variant: "secondary" as const, label: "Activity" }
  }

  return (
    <div className="space-y-6">
      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200"></div>
            
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-white border-2 border-slate-200 rounded-full">
                    <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  
                  {/* Activity content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-900">{activity.action}</h4>
                        <Badge variant={getActivityBadge(activity.type).variant} className="text-xs">
                          {getActivityBadge(activity.type).label}
                        </Badge>
                      </div>
                      {activity.amount && (
                        <span className={`font-semibold ${
                          activity.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {activity.amount}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-600 mb-2">{activity.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{activity.user}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-slate-900">23</p>
            <p className="text-sm text-slate-600">Transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-slate-900">8</p>
            <p className="text-sm text-slate-600">Messages</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-slate-900">5</p>
            <p className="text-sm text-slate-600">Documents</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
