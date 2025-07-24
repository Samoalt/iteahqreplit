
import { LotPoolTable } from "@/components/lot-pool/LotPoolTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, Clock, CheckCircle } from "lucide-react"

const LotPool = () => {
  const stats = [
    { label: "Total Lots", value: "1,247", icon: Package, color: "text-blue-600" },
    { label: "Ready for Auction", value: "342", icon: CheckCircle, color: "text-green-600" },
    { label: "In Processing", value: "89", icon: Clock, color: "text-orange-600" },
    { label: "Total Value", value: "$2.4M", icon: TrendingUp, color: "text-purple-600" }
  ]

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Lot Pool Management</h1>
        <p className="text-slate-600 mt-2">Manage tea lots, inventory, and auction preparations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 bg-white">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-slate-50`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lot Pool Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="bg-white">
          <CardTitle>Lot Inventory</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <LotPoolTable />
        </CardContent>
      </Card>
    </div>
  )
}

export default LotPool
