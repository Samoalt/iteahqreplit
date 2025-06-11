import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Gavel, PieChart, FileText, CreditCard, ArrowUp, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: kpis, refetch: refetchKpis } = useQuery({
    queryKey: ["/api/dashboard/kpis"],
  });

  const { data: gradeData } = useQuery({
    queryKey: ["/api/dashboard/grade-data"],
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/activities"],
  });

  const handleRefresh = () => {
    refetchKpis();
  };

  if (!user) return null;

  const kpiCards = [
    {
      label: "Active Bids",
      value: kpis?.activeBids?.value || 24,
      change: kpis?.activeBids?.change || "+12.5%",
      icon: Gavel,
      color: "text-accent"
    },
    {
      label: "Portfolio Value",
      value: kpis?.portfolioValue?.value || "$847,230",
      change: kpis?.portfolioValue?.change || "+8.2%",
      icon: PieChart,
      color: "text-primary"
    },
    {
      label: "Pending Invoices",
      value: kpis?.pendingInvoices?.value || 7,
      change: kpis?.pendingInvoices?.change || "2 due today",
      icon: FileText,
      color: "text-status-amber"
    },
    {
      label: "Credit Available",
      value: kpis?.creditAvailable?.value || "$425K",
      change: kpis?.creditAvailable?.change || "85% utilization",
      icon: CreditCard,
      color: "text-status-blue"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Overview of your tea trading activity</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleRefresh} className="bg-accent hover:bg-accent/90">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{card.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                    <p className="text-sm text-status-green flex items-center mt-1">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      <span>{card.change}</span>
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-opacity-10 ${
                    card.color === "text-accent" ? "bg-accent" :
                    card.color === "text-primary" ? "bg-primary" :
                    card.color === "text-status-amber" ? "bg-status-amber" :
                    "bg-status-blue"
                  }`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lots Heat Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lots by Grade</CardTitle>
            <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {gradeData?.map((grade: any, index: number) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-lg p-4 text-center hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="text-lg font-bold text-slate-900">{grade.count}</div>
                  <div className="text-sm text-slate-600">{grade.name}</div>
                  <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${grade.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )) || [
                { name: "PEKOE", count: 45, percentage: 75 },
                { name: "BOPF", count: 32, percentage: 53 },
                { name: "BROKEN", count: 28, percentage: 47 },
                { name: "FANNINGS", count: 19, percentage: 32 },
                { name: "DUST", count: 12, percentage: 20 }
              ].map((grade, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-lg p-4 text-center hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="text-lg font-bold text-slate-900">{grade.count}</div>
                  <div className="text-sm text-slate-600">{grade.name}</div>
                  <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${grade.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities?.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === "lot_won" ? "bg-status-green" :
                    activity.type === "invoice_paid" ? "bg-status-blue" :
                    activity.type === "bid_rejected" ? "bg-status-amber" :
                    activity.type === "fx_locked" ? "bg-status-green" :
                    "bg-status-blue"
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )) || [
                { description: "Won lot #3456 - PEKOE grade", createdAt: new Date(Date.now() - 120000) },
                { description: "Invoice #INV-8901 paid via wallet", createdAt: new Date(Date.now() - 900000) },
                { description: "Bid rejected - lot #3421", createdAt: new Date(Date.now() - 3600000) },
                { description: "FX rate locked at 130.45 KES/USD", createdAt: new Date(Date.now() - 7200000) },
                { description: "Credit limit increased to $500K", createdAt: new Date(Date.now() - 86400000) }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-status-green rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
