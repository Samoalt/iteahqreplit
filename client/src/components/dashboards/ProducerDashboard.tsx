import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Factory, Leaf, TrendingUp, Calendar, Settings, AlertTriangle } from "lucide-react";

export default function ProducerDashboard() {
  return (
    <div className="space-y-6">
      {/* Production Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Production</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847 kg</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 8.2M</div>
            <p className="text-xs text-muted-foreground">+18% vs last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">6 in auction today</p>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Listing Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Auto-Listing Performance
            </CardTitle>
            <CardDescription>Your automated tea listing rules and their performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">PEKOE Grade Rule</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Progress value={87} className="h-2" />
              <p className="text-xs text-muted-foreground">87% success rate (13/15 lots listed)</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">BOPF Grade Rule</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">92% success rate (11/12 lots listed)</p>
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure Auto-Listing Rules
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Factory Alerts
            </CardTitle>
            <CardDescription>Important notifications requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="text-sm font-medium">Quality Check Required</p>
              <p className="text-xs text-muted-foreground">Lot #LOT-2024-089 needs manual quality assessment</p>
              <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="text-sm font-medium">Auto-Listing Success</p>
              <p className="text-xs text-muted-foreground">PEKOE lot automatically listed at KES 420/kg</p>
              <p className="text-xs text-blue-600 mt-1">4 hours ago</p>
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}