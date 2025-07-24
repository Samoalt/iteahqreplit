
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

interface Alert {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  actionRequired: boolean
}

export const PaymentAlertsComponent = () => {
  const [alertsOpen, setAlertsOpen] = useState(false)

  const alerts: Alert[] = [
    {
      id: "1",
      type: "warning",
      title: "Low Balance Alert",
      message: "KES Wallet balance below operational threshold (KES 100,000)",
      timestamp: "2 hours ago",
      actionRequired: true
    },
    {
      id: "2",
      type: "error", 
      title: "Payment Failed",
      message: "Payment to Global Tea Co. failed - insufficient funds",
      timestamp: "4 hours ago",
      actionRequired: true
    },
    {
      id: "3",
      type: "info",
      title: "Scheduled Payment",
      message: "Payment to Nandi Hills Factory scheduled for tomorrow 9:00 AM",
      timestamp: "1 day ago",
      actionRequired: false
    },
    {
      id: "4",
      type: "warning",
      title: "Pending Approval",
      message: "Payment of USD 15,000 requires management approval",
      timestamp: "6 hours ago",
      actionRequired: true
    }
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'info':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-slate-500" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">Warning</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">Success</Badge>
      case 'info':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">Info</Badge>
      default:
        return <Badge variant="outline">Alert</Badge>
    }
  }

  const actionRequiredCount = alerts.filter(alert => alert.actionRequired).length

  return (
    <Popover open={alertsOpen} onOpenChange={setAlertsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {actionRequiredCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {actionRequiredCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-slate-900">Payment Alerts</h3>
          <p className="text-sm text-slate-600">
            {actionRequiredCount} {actionRequiredCount === 1 ? 'alert requires' : 'alerts require'} your attention
          </p>
        </div>
        <ScrollArea className="max-h-80">
          <div className="p-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 hover:bg-slate-50 rounded-lg border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {alert.title}
                      </h4>
                      {getAlertBadge(alert.type)}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {alert.timestamp}
                      </span>
                      {alert.actionRequired && (
                        <Button size="sm" variant="outline" className="text-xs h-6">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t bg-slate-50">
          <Button variant="outline" size="sm" className="w-full">
            View All Alerts
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
