import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, TrendingUp, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";

export default function KTDABoardDashboard() {
  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Factories</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">across 12 regions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Production</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">184.7T</div>
            <p className="text-xs text-muted-foreground">+8.3% vs last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 2.8B</div>
            <p className="text-xs text-muted-foreground">+15.2% YoY growth</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ESG Compliance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600">Above target (90%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Regional Performance
            </CardTitle>
            <CardDescription>Production and quality metrics by region</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">Kericho Region</div>
                  <div className="text-xs text-muted-foreground">18 factories • 45.2T production</div>
                </div>
                <div className="text-right">
                  <Badge variant="default">Excellent</Badge>
                  <div className="text-xs text-green-600">96% quality score</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">Nyeri Region</div>
                  <div className="text-xs text-muted-foreground">12 factories • 32.8T production</div>
                </div>
                <div className="text-right">
                  <Badge variant="default">Good</Badge>
                  <div className="text-xs text-green-600">92% quality score</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">Eldoret Region</div>
                  <div className="text-xs text-muted-foreground">15 factories • 38.1T production</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Review</Badge>
                  <div className="text-xs text-yellow-600">87% quality score</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">Murang'a Region</div>
                  <div className="text-xs text-muted-foreground">22 factories • 68.6T production</div>
                </div>
                <div className="text-right">
                  <Badge variant="default">Excellent</Badge>
                  <div className="text-xs text-green-600">95% quality score</div>
                </div>
              </div>
            </div>
            
            <Button className="w-full" variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              View Regional Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Factory Flags & Issues
            </CardTitle>
            <CardDescription>Quality and operational issues requiring board attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Quality Alert - Eldoret F7</p>
                    <p className="text-xs text-muted-foreground">Below grade standards for 3 consecutive batches</p>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <p className="text-xs text-blue-600 mt-1">Escalated 4 hours ago</p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">ESG Compliance - Nyeri F3</p>
                    <p className="text-xs text-muted-foreground">Environmental certification renewal required</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <p className="text-xs text-blue-600 mt-1">Due in 14 days</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Equipment Upgrade - Kericho F12</p>
                    <p className="text-xs text-muted-foreground">Board approval needed for new drying equipment</p>
                  </div>
                  <Badge variant="outline">Review</Badge>
                </div>
                <p className="text-xs text-blue-600 mt-1">Submitted yesterday</p>
              </div>
            </div>
            
            <Button className="w-full" variant="outline">
              <AlertCircle className="h-4 w-4 mr-2" />
              Review All Factory Flags
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ESG & Sustainability Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>ESG & Sustainability Dashboard</CardTitle>
          <CardDescription>Environmental, Social, and Governance performance across the KTDA network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Environmental Score
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Carbon Footprint</span>
                  <span className="text-xs font-medium">-12% YoY</span>
                </div>
                <Progress value={88} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Water Usage Efficiency</span>
                  <span className="text-xs font-medium">+8% improvement</span>
                </div>
                <Progress value={92} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Renewable Energy</span>
                  <span className="text-xs font-medium">34% of total</span>
                </div>
                <Progress value={34} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Social Impact
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Farmer Training Programs</span>
                  <span className="text-xs font-medium">2,847 farmers</span>
                </div>
                <Progress value={95} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Community Development</span>
                  <span className="text-xs font-medium">KES 45M invested</span>
                </div>
                <Progress value={78} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Fair Trade Compliance</span>
                  <span className="text-xs font-medium">94% certified</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Governance
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Board Attendance</span>
                  <span className="text-xs font-medium">96% average</span>
                </div>
                <Progress value={96} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Audit Compliance</span>
                  <span className="text-xs font-medium">100% passed</span>
                </div>
                <Progress value={100} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Policy Updates</span>
                  <span className="text-xs font-medium">12 this quarter</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}