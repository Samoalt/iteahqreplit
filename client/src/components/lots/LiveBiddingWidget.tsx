import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Gavel, Clock, TrendingUp, Lock, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
import { Lot } from "@shared/schema";

interface LiveBiddingWidgetProps {
  lot: Lot;
  highestBid?: number;
  currentFxRate: string;
}

export default function LiveBiddingWidget({ lot, highestBid = 0, currentFxRate }: LiveBiddingWidgetProps) {
  const { user } = useAuth();
  const { subscribe } = useWebSocket();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState("");
  const [lockFx, setLockFx] = useState(false);
  const [isLeading, setIsLeading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const unsubscribe = subscribe?.("bidPlaced", (data) => {
      if (data.lotId === lot.lotId) {
        if (data.bidderId === user?.id) {
          setIsLeading(true);
          toast({
            title: "You're Leading!",
            description: `Your bid of $${data.bidAmount} is now the highest`,
          });
        } else {
          setIsLeading(false);
          toast({
            title: "Outbid!",
            description: `New highest bid: $${data.bidAmount}`,
            variant: "destructive",
          });
        }
      }
    });

    return unsubscribe;
  }, [subscribe, lot.lotId, user?.id, toast]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (lot.auctionEndTime) {
        const now = new Date();
        const end = new Date(lot.auctionEndTime);
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeLeft("ENDED");
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lot.auctionEndTime]);

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    if (amount <= highestBid) {
      toast({
        title: "Invalid Bid",
        description: "Bid must be higher than current highest bid",
        variant: "destructive",
      });
      return;
    }

    // Simulate bid placement - in real implementation would call API
    toast({
      title: "Bid Placed",
      description: `Bid of $${amount} submitted${lockFx ? ' with FX locked' : ''}`,
    });
    setBidAmount("");
  };

  const kesAmount = parseFloat(bidAmount || "0") * parseFloat(currentFxRate);

  return (
    <Card className="feature-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="card-title flex items-center space-x-2">
            <Gavel className="w-5 h-5 text-primary" />
            <span>Live Bidding</span>
            {isLeading && (
              <Badge className="bg-green-100 text-green-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                Leading
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className={`text-sm font-mono ${
              timeLeft === "ENDED" ? "text-destructive" : "text-success"
            }`}>
              {timeLeft}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Lot Info */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Grade</span>
              <div className="font-medium">{lot.grade}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Weight</span>
              <div className="font-medium">{parseFloat(lot.kg).toLocaleString()} kg</div>
            </div>
            <div>
              <span className="text-muted-foreground">Reserve</span>
              <div className="font-medium">${lot.reservePrice}</div>
            </div>
          </div>
        </div>

        {/* Current Highest Bid */}
        <div className="text-center p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Current Highest Bid</div>
          <div className="text-2xl font-bold text-foreground">
            ${highestBid.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            KES {(highestBid * parseFloat(currentFxRate)).toLocaleString()}
          </div>
        </div>

        {user?.role === "buyer" && timeLeft !== "ENDED" ? (
          <div className="space-y-4">
            {/* Bid Input */}
            <div className="space-y-2">
              <Label htmlFor="bid-amount">Your Bid (USD)</Label>
              <Input
                id="bid-amount"
                type="number"
                placeholder="Enter bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                step="0.01"
                min={highestBid + 0.01}
              />
              {bidAmount && (
                <div className="text-sm text-muted-foreground">
                  ≈ KES {kesAmount.toLocaleString()} 
                  {lockFx && <span className="text-primary ml-1">(Locked)</span>}
                </div>
              )}
            </div>

            {/* FX Lock Option */}
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Switch
                id="fx-lock"
                checked={lockFx}
                onCheckedChange={setLockFx}
              />
              <div className="flex-1">
                <Label htmlFor="fx-lock" className="text-sm font-medium">
                  Lock FX Rate
                </Label>
                <div className="text-xs text-muted-foreground">
                  Fix your KES cost at {currentFxRate} USD/KES
                </div>
              </div>
              <Lock className="w-4 h-4 text-blue-600" />
            </div>

            {/* Bid Button */}
            <Button 
              onClick={handleBid}
              disabled={!bidAmount || parseFloat(bidAmount) <= highestBid}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Gavel className="w-4 h-4 mr-2" />
              Place Bid ${bidAmount || "0.00"}
            </Button>
          </div>
        ) : user?.role === "board" ? (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Board View Only</div>
            <div className="text-xs text-muted-foreground mt-1">
              Monitoring auction activity
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              {timeLeft === "ENDED" ? "Auction Ended" : "Producer View Only"}
            </div>
          </div>
        )}

        {/* Quick Bid Actions for Buyers */}
        {user?.role === "buyer" && timeLeft !== "ENDED" && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBidAmount((highestBid + 1).toFixed(2))}
            >
              +$1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBidAmount((highestBid + 5).toFixed(2))}
            >
              +$5
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBidAmount((highestBid + 10).toFixed(2))}
            >
              +$10
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}