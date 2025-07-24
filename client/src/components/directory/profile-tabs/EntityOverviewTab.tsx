
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Building, Calendar, MessageSquare } from "lucide-react"

interface EntityOverviewTabProps {
  entity: any
}

export const EntityOverviewTab = ({ entity }: EntityOverviewTabProps) => {
  const stats = [
    { label: "Total Transactions", value: "156", trend: "+12%" },
    { label: "This Month", value: "23", trend: "+5%" },
    { label: "Outstanding Balance", value: "$12,450", trend: "-8%" },
    { label: "Last Activity", value: "2 days ago", trend: "" }
  ]

  return (
    <div className="space-y-6">
      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium text-blue-600">{entity.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-medium">{entity.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm text-slate-600">Location</p>
                <p className="font-medium">{entity.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm text-slate-600">Contact Person</p>
                <p className="font-medium">{entity.contactPerson}</p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button className="elastic-button-primary">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                {stat.trend && (
                  <p className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tags and Labels */}
      <Card>
        <CardHeader>
          <CardTitle>Tags & Labels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Premium Client</Badge>
            <Badge variant="success">Verified</Badge>
            <Badge variant="info">Regular Trader</Badge>
            <Badge variant="outline">+ Add Tag</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
