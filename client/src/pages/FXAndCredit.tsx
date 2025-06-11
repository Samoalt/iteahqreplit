import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lock, CreditCard, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function FXAndCredit() {
  const [fxAmount, setFxAmount] = useState("");
  const [lockDuration, setLockDuration] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fxRate } = useQuery({
    queryKey: ["/api/fx-rate"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: fxLocks } = useQuery({
    queryKey: ["/api/fx-locks"],
  });

  const bookFxLockMutation = useMutation({
    mutationFn: async (lockData: any) => {
      return apiRequest("POST", "/api/fx-lock", lockData);
    },
    onSuccess: () => {
      toast({
        title: "FX Rate Locked",
        description: `Successfully locked ${fxAmount} USD at ${fxRate?.rate} KES/USD`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/fx-locks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setFxAmount("");
      setLockDuration("");
    },
    onError: () => {
      toast({
        title: "FX Lock Failed",
        description: "Failed to lock FX rate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFxLockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fxAmount || !lockDuration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Calculate expiry time based on duration
    const now = new Date();
    let expiresAt = new Date(now);
    
    switch (lockDuration) {
      case "1h":
        expiresAt.setHours(now.getHours() + 1);
        break;
      case "6h":
        expiresAt.setHours(now.getHours() + 6);
        break;
      case "24h":
        expiresAt.setDate(now.getDate() + 1);
        break;
      case "7d":
        expiresAt.setDate(now.getDate() + 7);
        break;
    }

    bookFxLockMutation.mutate({
      amountUSD: parseFloat(fxAmount).toFixed(2),
      lockedRate: fxRate?.rate || "130.45",
      duration: lockDuration,
      expiresAt: expiresAt.toISOString(),
    });
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const lenderPools = [
    {
      name: "Premium Pool",
      apr: "6.8%",
      utilisation: "72%",
      minContribution: "$10,000",
      status: "Active",
      statusColor: "bg-status-green"
    },
    {
      name: "Standard Pool",
      apr: "7.2%",
      utilisation: "68%",
      minContribution: "$5,000",
      status: "Active",
      statusColor: "bg-status-blue"
    },
    {
      name: "High Yield Pool",
      apr: "8.5%",
      utilisation: "85%",
      minContribution: "$25,000",
      status: "Review",
      statusColor: "bg-status-amber"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FX & Credit</h1>
          <p className="text-slate-600">Manage currency locks and credit facilities</p>
        </div>
      </div>

      <Tabs defaultValue="fx-lock" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fx-lock">FX Lock</TabsTrigger>
          <TabsTrigger value="bid-credit">Bid Credit</TabsTrigger>
          <TabsTrigger value="lender-pools">Lender Pools</TabsTrigger>
        </TabsList>

        {/* FX Lock Tab */}
        <TabsContent value="fx-lock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Currency Lock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <form onSubmit={handleFxLockSubmit} className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Live Quote</Label>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="text-3xl font-bold text-slate-900">
                          {fxRate?.rate || "130.45"}
                        </div>
                        <div className="text-sm text-slate-600">KES per USD</div>
                        <div className="text-xs text-status-green mt-1">
                          Updated {fxRate ? "just now" : "2 seconds ago"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fx-amount" className="text-sm font-medium text-slate-700 mb-2 block">
                        Amount (USD)
                      </Label>
                      <Input
                        id="fx-amount"
                        type="number"
                        step="0.01"
                        value={fxAmount}
                        onChange={(e) => setFxAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="lock-duration" className="text-sm font-medium text-slate-700 mb-2 block">
                        Lock Duration
                      </Label>
                      <Select value={lockDuration} onValueChange={setLockDuration} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="6h">6 Hours</SelectItem>
                          <SelectItem value="24h">24 Hours</SelectItem>
                          <SelectItem value="7d">7 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={bookFxLockMutation.isPending}
                      className="w-full bg-accent hover:bg-accent/90"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {bookFxLockMutation.isPending ? "Booking..." : "Book FX Lock"}
                    </Button>
                  </form>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-slate-900 mb-4">Active Locks</h4>
                  <div className="space-y-3">
                    {fxLocks?.length > 0 ? (
                      fxLocks.map((lock: any) => (
                        <div key={lock.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-900">
                              ${parseFloat(lock.amountUSD).toLocaleString()}
                            </span>
                            <Badge className="bg-status-green text-white">
                              {lock.status === "active" ? "Active" : lock.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600">
                            Rate: {lock.lockedRate} KES/USD
                          </div>
                          <div className="text-xs text-slate-500">
                            Expires in {formatTimeRemaining(lock.expiresAt)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900">$25,000</span>
                          <Badge className="bg-status-green text-white">Active</Badge>
                        </div>
                        <div className="text-sm text-slate-600">
                          Rate: 129.80 KES/USD
                        </div>
                        <div className="text-xs text-slate-500">
                          Expires in 4h 23m
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bid Credit Tab */}
        <TabsContent value="bid-credit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bid Credit Facility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="text-center mb-6">
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path 
                          d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" 
                          stroke="#e5e7eb" 
                          strokeWidth="3"
                        />
                        <path 
                          d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" 
                          stroke="hsl(217, 91%, 60%)" 
                          strokeWidth="3" 
                          strokeDasharray="85, 100"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900">85%</div>
                          <div className="text-xs text-slate-500">Utilised</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Credit Limit:</span>
                      <span className="font-medium">$500,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Available:</span>
                      <span className="font-medium text-status-green">$75,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Interest Rate:</span>
                      <span className="font-medium">8.5% p.a.</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-slate-900 mb-4">Margin Calls</h4>
                  <div className="space-y-3">
                    <div className="border border-status-amber rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">Lot #3456</span>
                        <Badge className="bg-status-amber text-white">Review</Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        Additional margin required: $12,500
                      </div>
                      <Button size="sm" className="mt-2 bg-status-amber hover:bg-status-amber/90 text-white">
                        Add Margin
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lender Pools Tab */}
        <TabsContent value="lender-pools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lenderPools.map((pool, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-slate-900">{pool.name}</h4>
                    <Badge className={`${pool.statusColor} text-white`}>
                      {pool.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-600">APR:</span>
                      <span className="font-medium text-status-green">{pool.apr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Utilisation:</span>
                      <span className="font-medium">{pool.utilisation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Min Contribution:</span>
                      <span className="font-medium">{pool.minContribution}</span>
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${
                      pool.status === "Review" 
                        ? "bg-slate-400 cursor-not-allowed" 
                        : "bg-accent hover:bg-accent/90"
                    }`}
                    disabled={pool.status === "Review"}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {pool.status === "Review" ? "Under Review" : "Add Liquidity"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
