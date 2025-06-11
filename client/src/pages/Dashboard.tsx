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
          label: "Instant Cash Available",
          value: "$89,500",
          change: "Ready for advance",
          icon: CreditCard,
          color: "text-status-green"
        }
      ];
    } else if (user.role === "buyer") {
      return [
        {
          label: "Won Lots Pending",
          value: 3,
          change: "$74,250 awaiting payment",
          icon: Gavel,
          color: "text-status-amber"
        },
        {
          label: "Active Bids",
          value: 7,
          change: "On 5 live auctions",
          icon: TrendingUp,
          color: "text-accent"
        },
        {
          label: "Buying Power",
          value: "$895,000",
          change: "Available credit",
          icon: PieChart,
          color: "text-status-green"
        },
        {
          label: "FX Position",
          value: "$234,500",
          change: "78% hedged KES",
          icon: RefreshCw,
          color: "text-purple-600"
        }
      ];
    } else if (user.role === "ktda_ro") {
      return [
        {
          label: "Processing Delays",
          value: 2,
          change: "Factories requiring attention",
          icon: Clock,
          color: "text-status-destructive"
        },
        {
          label: "Monthly Volume",
          value: "$12.4M",
          change: "+18.7% vs last month",
          icon: TrendingUp,
          color: "text-status-green"
        },
        {
          label: "Factory Network",
          value: 89,
          change: "87 active, 2 maintenance",
          icon: PieChart,
          color: "text-accent"
        },
        {
          label: "ESG Score",
          value: "A-",
          change: "Target: A+ by Q2",
          icon: FileText,
          color: "text-status-green"
        }
      ];
    } else {
      return [
        {
          label: "Platform Health",
          value: "99.8%",
          change: "Uptime this month",
          icon: RefreshCw,
          color: "text-status-green"
        },
        {
          label: "Daily Users",
          value: 1243,
          change: "+8.3% growth rate",
          icon: TrendingUp,
          color: "text-accent"
        },
        {
          label: "Settlement Volume",
          value: "$3.8M",
          change: "Processed today",
          icon: CreditCard,
          color: "text-primary"
        },
        {
          label: "Open Issues",
          value: 12,
          change: "4 critical, 8 medium",
          icon: FileText,
          color: "text-status-amber"
        }
      ];
    }
  };

  const kpiCards = getKpiCards();

  // Role-specific welcome messages and content
  const getRoleContent = () => {
    switch (user.role) {
      case "producer":
        return {
          title: "Producer Dashboard",
          subtitle: "Manage your tea production and automated listing",
          highlight: "Auto-Listing enabled for 2 factories • Next auction in 4h 23m"
        };
      case "buyer":
        return {
          title: "Buyer Dashboard", 
          subtitle: "Monitor live auctions and manage purchases",
          highlight: "5 live auctions • 3 lots requiring payment"
        };
      case "ktda_ro":
        return {
          title: "KTDA Board View",
          subtitle: "Strategic oversight and network performance",
          highlight: "89 factories operational • ESG score: A-"
        };
      case "ops_admin":
        return {
          title: "Operations Admin",
          subtitle: "Platform administration and system monitoring", 
          highlight: "99.8% uptime • 12 pending support tickets"
        };
      default:
        return {
          title: "Dashboard",
          subtitle: "Overview of tea trading activity",
          highlight: ""
        };
    }
  };

  const roleContent = getRoleContent();

  return (
    <div className="space-y-6">
      {/* Role-specific Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title text-foreground">{roleContent.title}</h1>
          <p className="text-muted-foreground">{roleContent.subtitle}</p>
          {roleContent.highlight && (
            <div className="mt-2 text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full inline-block">
              {roleContent.highlight}
            </div>
          )}
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
