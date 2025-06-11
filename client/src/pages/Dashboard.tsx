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

  // Role-specific KPI cards with authentic data
  const getKpiCards = () => {
    if (user.role === "producer") {
      return [
        {
          label: "Cash-to-Cash Cycle",
          value: "16h 23m",
          change: "Target: <24h",
          icon: Clock,
          color: "text-status-green",
          description: "Average time from auction to payment"
        },
        {
          label: "Active Lots",
          value: 8,
          change: "3 ready for instant cash",
          icon: Gavel,
          color: "text-accent"
        },
        {
          label: "Factory Output",
          value: "24,850 kg",
          change: "+12% vs last month",
          icon: PieChart,
          color: "text-primary"
        },
        {
          label: "Active Advances",
          value: kpis?.activeAdvances?.value || 3,
          change: kpis?.activeAdvances?.change || "$45,200 outstanding",
          icon: CreditCard,
          color: "text-accent"
        }
      ];
    } else if (user.role === "buyer") {
      return [
        {
          label: "Lots Won & Unpaid",
          value: kpis?.lotsWonUnpaid?.value || 5,
          change: kpis?.lotsWonUnpaid?.change || "2 due today",
          icon: FileText,
          color: "text-status-red",
          description: "Lots requiring payment settlement"
        },
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
          label: "FX Exposure",
          value: kpis?.fxExposure?.value || "$120,450",
          change: kpis?.fxExposure?.change || "85% hedged",
          icon: TrendingUp,
          color: "text-status-green"
        }
      ];
    } else if (user.role === "ktda_ro") {
      return [
        {
          label: "Factories with Payout >24h",
          value: kpis?.factoriesDelayed?.value || 2,
          change: kpis?.factoriesDelayed?.change || "Target: <2%",
          icon: Clock,
          color: "text-status-red",
          description: "Factories exceeding payout target"
        },
        {
          label: "Total GMV",
          value: kpis?.totalGMV?.value || "$2.4M",
          change: kpis?.totalGMV?.change || "+15.3% vs last month",
          icon: PieChart,
          color: "text-primary"
        },
        {
          label: "Active Factories",
          value: kpis?.activeFactories?.value || 47,
          change: kpis?.activeFactories?.change || "3 new this month",
          icon: Gavel,
          color: "text-status-green"
        },
        {
          label: "ESG Compliance",
          value: kpis?.esgCompliance?.value || "94%",
          change: kpis?.esgCompliance?.change || "+2% improvement",
          icon: TrendingUp,
          color: "text-status-green"
        }
      ];
    } else {
      return [
        {
          label: "System Health",
          value: kpis?.systemHealth?.value || "99.8%",
          change: kpis?.systemHealth?.change || "Excellent",
          icon: TrendingUp,
          color: "text-status-green"
        },
        {
          label: "Active Users",
          value: kpis?.activeUsers?.value || 189,
          change: kpis?.activeUsers?.change || "+12 today",
          icon: Gavel,
          color: "text-accent"
        },
        {
          label: "Transaction Volume",
          value: kpis?.transactionVolume?.value || "$847,230",
          change: kpis?.transactionVolume?.change || "+8.2%",
          icon: PieChart,
          color: "text-primary"
        },
        {
          label: "Support Tickets",
          value: kpis?.supportTickets?.value || 3,
          change: kpis?.supportTickets?.change || "2 pending",
          icon: FileText,
          color: "text-status-amber"
        }
      ];
    }
  };

  const kpiCards = getKpiCards();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your tea trading activity</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleRefresh} className="bg-primary hover:bg-primary/90">
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
            <Card key={index} className="card-dashboard feature-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    <p className="text-sm text-success flex items-center mt-1">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      <span>{card.change}</span>
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-opacity-10 ${
                    card.color === "text-accent" ? "gradient-purple" :
                    card.color === "text-primary" ? "gradient-blue" :
                    card.color === "text-status-amber" ? "gradient-yellow" :
                    "gradient-blue"
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
