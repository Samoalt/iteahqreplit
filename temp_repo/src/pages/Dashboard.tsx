import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, Users, Package, FileText, Activity, Plus, Upload, AlertTriangle, Timer, ArrowRight, Download, Eye } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { NewLotModal } from "@/components/dashboard/NewLotModal"
import { UploadESlipModal } from "@/components/dashboard/UploadESlipModal"

const Dashboard = () => {
  const navigate = useNavigate()
  const [timeFilter, setTimeFilter] = useState("This Week")
  const [newLotModalOpen, setNewLotModalOpen] = useState(false)
  const [uploadESlipModalOpen, setUploadESlipModalOpen] = useState(false)

  // Sample data for charts
  const volumeData = [
    { name: 'Mon', value: 45000, lots: 12 },
    { name: 'Tue', value: 52000, lots: 15 },
    { name: 'Wed', value: 38000, lots: 10 },
    { name: 'Thu', value: 61000, lots: 18 },
    { name: 'Fri', value: 55000, lots: 16 },
    { name: 'Sat', value: 42000, lots: 11 },
    { name: 'Sun', value: 48000, lots: 13 }
  ]

  const bidStageData = [
    { name: 'Bid Intake', value: 35, color: '#3B82F6' },
    { name: 'E-Slip Sent', value: 25, color: '#8B5CF6' },
    { name: 'Payment Matching', value: 20, color: '#F59E0B' },
    { name: 'Released', value: 20, color: '#10B981' }
  ]

  const factoryData = [
    { name: 'Lihunda', value: 0.75 },
    { name: 'Nandi Hills', value: 0.6 },
    { name: 'Motsata', value: 0.4 },
    { name: 'Highland', value: 0.3 },
    { name: 'Kencho Tea', value: 0.25 }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "eslip",
      icon: FileText,
      title: "E-Slip sent to Premium Tea Co.",
      amount: "$22,000",
      time: "4 hours ago",
      status: "completed",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      type: "split",
      icon: TrendingUp,
      title: "Split approved for Kericho Tea Co.",
      amount: "$22,000",
      time: "4 hours ago",
      status: "completed",
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ]

  const alerts = [
    { type: "eslip", count: 3, message: "E-Slips pending > 2 days", icon: AlertTriangle, color: "text-amber-600" },
    { type: "payment", count: 2, message: "Unmatched Payments > 7 days", icon: Timer, color: "text-blue-600" }
  ]

  const handleDownloadReport = () => {
    console.log('Downloading dashboard report...')
  }

  const handleViewDirectory = () => {
    navigate('/app/operations/directory')
  }

  const handleViewAllPayments = () => {
    navigate('/app/banking/transactions')
  }

  const handleViewAllActivity = () => {
    navigate('/app/operations/bid-processing')
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tea Trading Platform Overview</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Time Filter */}
          <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            {["Today", "This Week", "This Month", "Custom"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  timeFilter === filter
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          {/* Quick Actions */}
          <Button 
            onClick={() => setNewLotModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Lot
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setUploadESlipModalOpen(true)}
            className="shadow-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload E-Slip
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {alerts.map((alert, index) => (
            <Card key={index} className="border-l-4 border-l-amber-500 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <alert.icon className={`h-5 w-5 ${alert.color}`} />
                    <span className="font-semibold text-gray-900">
                      {alert.count} {alert.message}
                    </span>
                  </div>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/app/operations/bid-processing')}
                    className="text-blue-600 p-0 h-auto text-sm"
                  >
                    Review →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content - Left Side */}
        <div className="col-span-8 space-y-6">
          {/* Metrics Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Value</p>
                    <p className="text-3xl font-bold mt-2">$630K</p>
                    <div className="flex items-center mt-3 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+12% from last week</span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Lots</p>
                    <p className="text-3xl font-bold mt-2">42</p>
                    <div className="flex items-center mt-3 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+6% from last week</span>
                    </div>
                  </div>
                  <Package className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Bids</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">128</p>
                    <div className="flex items-center mt-3 text-sm text-gray-600">
                      <span className="mr-2">Received</span>
                      <Badge variant="secondary" className="text-xs">188</Badge>
                    </div>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Buyers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
                    <Button 
                      variant="link" 
                      onClick={handleViewDirectory}
                      className="text-blue-600 p-0 h-auto text-sm mt-2"
                    >
                      View Directory →
                    </Button>
                  </div>
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Trading Volume Trend */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Trading Volume Trend</span>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      <span>Value</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <span>Lots</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bid Progress Overview */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="h-5 w-5" />
                  <span>Bid Progress Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={bidStageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {bidStageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {bidStageData.map((stage, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: stage.color }}></div>
                      <span className="text-gray-600 flex-1 truncate">{stage.name}</span>
                      <span className="font-semibold">{stage.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Factories by Volume */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Top Factories by Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {factoryData.map((factory, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-700 truncate">
                      {factory.name}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${factory.value * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 w-12 text-right">
                      {Math.round(factory.value * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Payment Status */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Released</span>
                  <span className="font-semibold">$280K 60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Awaiting Released</span>
                  <span className="font-medium">$92K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Awaiting Split</span>
                  <span className="font-medium">$158K</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleViewAllPayments}
                className="w-full mt-4"
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Payments
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={`p-3 rounded-lg ${activity.bgColor} cursor-pointer hover:shadow-sm transition-all`}>
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm mb-1">
                          {activity.title}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {activity.amount}
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="link" 
                onClick={handleViewAllActivity}
                className="w-full text-blue-600 mt-4"
              >
                View All Activity →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewLotModal 
        open={newLotModalOpen} 
        onOpenChange={setNewLotModalOpen}
      />

      <UploadESlipModal 
        open={uploadESlipModalOpen} 
        onOpenChange={setUploadESlipModalOpen}
      />
    </div>
  )
}

export default Dashboard
