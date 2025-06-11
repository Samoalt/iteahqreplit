import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Target, Clock, TrendingDown, Gavel, Eye } from "lucide-react";

export default function BuyerDashboard() {
  return (
    <div className="space-y-6">
      {/* Bidding Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 new bids today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lots Won</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">68% win rate this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 387</div>
            <p className="text-xs text-green-600">-2.4% below market avg</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Next Auction</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h 15m</div>
            <p className="text-xs text-muted-foreground">Kericho auction starts</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Auctions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Auction Monitor
            </CardTitle>
            <CardDescription>Real-time bidding status for active lots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">LOT-3456 • PEKOE</div>
                  <div className="text-xs text-muted-foreground">Kericho Factory • 1,250kg</div>
                  <div className="text-xs text-green-600 mt-1">Your bid: KES 420/kg</div>
                </div>
                <div className="text-right">
                  <Badge variant="default">Leading</Badge>
                  <div className="text-xs text-muted-foreground mt-1">2m 45s left</div>
                </div>
              </div>
              
              <div className="flex justify-between items-start p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">LOT-3457 • BOPF</div>
                  <div className="text-xs text-muted-foreground">Nyeri Factory • 890kg</div>
                  <div className="text-xs text-red-600 mt-1">Outbid by: KES 15/kg</div>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">Outbid</Badge>
                  <div className="text-xs text-muted-foreground mt-1">5m 12s left</div>
                </div>
              </div>
              
              <div className="flex justify-between items-start p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">LOT-3458 • OP</div>
                  <div className="text-xs text-muted-foreground">Eldoret Factory • 2,100kg</div>
                  <div className="text-xs text-blue-600 mt-1">Watching</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Watching</Badge>
                  <div className="text-xs text-muted-foreground mt-1">12m 08s left</div>
                </div>
              </div>
            </div>
            
            <Button className="w-full" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View All Live Auctions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Purchase Summary
            </CardTitle>
            <CardDescription>Your recent tea purchases and pending invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold">8,450kg</p>
                <p className="text-xs text-muted-foreground">across 12 lots</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold">KES 3.2M</p>
                <p className="text-xs text-muted-foreground">avg KES 379/kg</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Grade Distribution</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>PEKOE (45%)</span>
                  <span>3,803kg</span>
                </div>
                <Progress value={45} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>BOPF (32%)</span>
                  <span>2,704kg</span>
                </div>
                <Progress value={32} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>OP (23%)</span>
                  <span>1,943kg</span>
                </div>
                <Progress value={23} className="h-1" />
              </div>
            </div>
            
            <Button className="w-full" variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Purchase History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Auctions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Auctions</CardTitle>
          <CardDescription>Schedule of tea auctions and lot previews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Today 4:00 PM</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Kericho Auction</span>
                  <Badge variant="default">Live Soon</Badge>
                </div>
                <div className="text-xs text-muted-foreground">45 lots • Est. 12,500kg</div>
                <div className="text-xs text-blue-600">18 lots in watchlist</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Tomorrow 10:00 AM</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Nyeri Auction</span>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
                <div className="text-xs text-muted-foreground">32 lots • Est. 8,900kg</div>
                <div className="text-xs text-blue-600">12 lots in watchlist</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Friday 2:00 PM</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Eldoret Auction</span>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
                <div className="text-xs text-muted-foreground">28 lots • Est. 7,200kg</div>
                <div className="text-xs text-blue-600">6 lots in watchlist</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}