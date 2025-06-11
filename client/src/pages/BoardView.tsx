import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Building, TrendingUp, DollarSign, Users, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function BoardView() {
  const { user } = useAuth();

  // Mock data for board analytics
  const kpiData = {
    totalFactories: 127,
    activeLots: 342,
    monthlyVolume: "2,847,356",
    avgPrice: "4.23"
  };

  const factoryPerformance = [
    { name: "Kangaita", lots: 45, volume: 125000, avgPrice: 4.75, status: "Excellent" },
    { name: "Michimikuru", lots: 38, volume: 98000, avgPrice: 4.52, status: "Good" },
    { name: "Githambo", lots: 42, volume: 110000, avgPrice: 4.38, status: "Good" },
    { name: "Kanyenyaini", lots: 35, volume: 87000, avgPrice: 4.12, status: "Average" },
    { name: "Thumaita", lots: 29, volume: 76000, avgPrice: 3.98, status: "Below Average" }
  ];

  const volumeData = [
    { month: "Jan", volume: 2450000, revenue: 10387500 },
    { month: "Feb", volume: 2680000, revenue: 11354000 },
    { month: "Mar", volume: 2847356, revenue: 12042186 },
    { month: "Apr", volume: 2950000, revenue: 12485000 },
    { month: "May", volume: 3100000, revenue: 13115000 },
    { month: "Jun", volume: 3250000, revenue: 13737500 }
  ];

  const gradeDistribution = [
    { name: "PEKOE", value: 35, color: "#01624E" },
    { name: "BOPF", value: 28, color: "#3B82F6" },
    { name: "BROKEN", value: 20, color: "#10B981" },
    { name: "FANNINGS", value: 12, color: "#FABB00" },
    { name: "DUST", value: 5, color: "#F04438" }
  ];

  const payoutTimeline = [
    { factory: "Kangaita", stage: "Auction Complete", daysElapsed: 1, target: 7, status: "on-track" },
    { factory: "Michimikuru", stage: "Quality Assessment", daysElapsed: 3, target: 7, status: "on-track" },
    { factory: "Githambo", stage: "Payment Processing", daysElapsed: 6, target: 7, status: "on-track" },
    { factory: "Kanyenyaini", stage: "Payment Processing", daysElapsed: 8, target: 7, status: "delayed" },
    { factory: "Thumaita", stage: "Quality Assessment", daysElapsed: 5, target: 7, status: "on-track" }
  ];

  // Restrict access to KTDA board members only
  if (!user || user.role !== "ktda_ro") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h1>
            <p className="text-sm text-slate-600">
              This section is only available to KTDA Board members.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Board View</h1>
          <p className="text-slate-600">KTDA oversight dashboard and analytics</p>
        </div>
        <Badge className="bg-primary text-white">
          Read-Only Access
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="factories">Factories</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Factories</p>
                    <p className="text-2xl font-bold text-slate-900">{kpiData.totalFactories}</p>
                    <p className="text-sm text-status-green">+3 this quarter</p>
                  </div>
                  <Building className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Active Lots</p>
                    <p className="text-2xl font-bold text-slate-900">{kpiData.activeLots}</p>
                    <p className="text-sm text-status-green">+12.5%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Monthly Volume</p>
                    <p className="text-2xl font-bold text-slate-900">{kpiData.monthlyVolume} kg</p>
                    <p className="text-sm text-status-green">+8.2%</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-status-green" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Average Price</p>
                    <p className="text-2xl font-bold text-slate-900">${kpiData.avgPrice}</p>
                    <p className="text-sm text-status-green">+0.15 per kg</p>
                  </div>
                  <Users className="w-8 h-8 text-status-blue" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Volume & Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="volume" stroke="hsl(160, 98%, 19%)" strokeWidth={2} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(217, 91%, 60%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Factories Tab */}
        <TabsContent value="factories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Factory Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Factory</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lots</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Volume (kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Avg Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {factoryPerformance.map((factory, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{factory.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">{factory.lots}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{factory.volume.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">${factory.avgPrice}</td>
                        <td className="px-6 py-4">
                          <Badge className={
                            factory.status === "Excellent" ? "bg-status-green text-white" :
                            factory.status === "Good" ? "bg-status-blue text-white" :
                            factory.status === "Average" ? "bg-status-amber text-white" :
                            "bg-status-red text-white"
                          }>
                            {factory.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{factory.name} Factory Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="text-sm text-slate-600">Total Lots</div>
                                    <div className="text-2xl font-bold">{factory.lots}</div>
                                  </div>
                                  <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="text-sm text-slate-600">Total Volume</div>
                                    <div className="text-2xl font-bold">{factory.volume.toLocaleString()} kg</div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-sm font-medium">Payout Timeline</div>
                                  <div className="space-y-2">
                                    {["Auction Complete", "Quality Assessment", "Payment Processing", "Funds Disbursed"].map((stage, i) => (
                                      <div key={i} className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-status-green rounded-full"></div>
                                        <span className="text-sm text-slate-600">{stage}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Timeline Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Factory</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Current Stage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Days Elapsed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Target (Days)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {payoutTimeline.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.factory}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{item.stage}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{item.daysElapsed}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{item.target}</td>
                        <td className="px-6 py-4">
                          <Badge className={
                            item.status === "on-track" ? "bg-status-green text-white" : "bg-status-red text-white"
                          }>
                            {item.status === "on-track" ? "On Track" : "Delayed"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                            <Calendar className="w-4 h-4 mr-1" />
                            View Timeline
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Factory Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={factoryPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgPrice" fill="hsl(160, 98%, 19%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: "Central Kenya", factories: 45, avgPrice: 4.65, performance: 92 },
                    { region: "Eastern Kenya", factories: 38, avgPrice: 4.12, performance: 87 },
                    { region: "Western Kenya", factories: 44, avgPrice: 4.33, performance: 89 }
                  ].map((region, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900">{region.region}</span>
                        <Badge className="bg-status-green text-white">{region.performance}%</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Factories:</span>
                          <span className="font-medium ml-2">{region.factories}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Avg Price:</span>
                          <span className="font-medium ml-2">${region.avgPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
