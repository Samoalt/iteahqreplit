import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Leaf, Gavel, Zap } from "lucide-react";
import { Lot } from "@shared/schema";
import WatchlistButton from "./WatchlistButton";

interface LotCardProps {
  lot: Lot;
  onBid?: (lotId: string) => void;
  onInstantCash?: (lotId: string) => void;
  userRole?: string;
}

export default function LotCard({ lot, onBid, onInstantCash, userRole }: LotCardProps) {
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < count ? "text-status-amber fill-current" : "text-slate-300"
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-status-green";
      case "bidding":
        return "bg-status-blue";
      case "sold":
        return "bg-status-grey";
      default:
        return "bg-slate-400";
    }
  };

  const formatTimer = () => {
    if (!lot.auctionEndTime || lot.status === "sold") return "SOLD";
    
    const now = new Date();
    const end = new Date(lot.auctionEndTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "ENDED";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-80 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Row 1: Grade + Lot ID + Timer + Watchlist */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary text-white">{lot.grade}</Badge>
            <span className="text-slate-600 text-sm">#{lot.lotId}</span>
          </div>
          <div className="flex items-center space-x-2">
            {userRole === "buyer" && (
              <WatchlistButton lotId={lot.lotId} />
            )}
            <div className={`text-xs font-mono ${
              lot.status === "live" ? "text-status-green" : "text-slate-500"
            }`}>
              {formatTimer()}
            </div>
          </div>
        </div>

        {/* Factory & ESG */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-900 font-medium truncate">{lot.factory}</span>
          {lot.esgCertified && (
            <div className="flex items-center space-x-1">
              <Leaf className="w-4 h-4 text-status-green" />
              <span className="text-xs text-slate-600">ESG</span>
            </div>
          )}
        </div>

        {/* Row 2: Kg | Price | Stars */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{parseFloat(lot.kg).toLocaleString()} kg</div>
            <div className="text-xs text-slate-500">Weight</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">${lot.offerPrice}</div>
            <div className="text-xs text-slate-500">per kg</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              {renderStars(lot.qualityStars)}
            </div>
            <div className="text-xs text-slate-500">Quality</div>
          </div>
        </div>

        {/* Status & Badges */}
        <div className="flex items-center justify-between mb-4">
          <Badge className={`text-white ${getStatusColor(lot.status)}`}>
            {lot.status === "live" ? "Live" : 
             lot.status === "bidding" ? "Bidding" : 
             lot.status === "sold" ? "Sold" : 
             "Draft"}
          </Badge>
          {userRole === "producer" && lot.canInstantCash && (
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-status-amber" />
              <span className="text-xs text-status-amber font-medium">Cash Ready</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {lot.canBid && lot.status === "live" && onBid && (
            <Button 
              onClick={() => onBid(lot.lotId)} 
              className="w-full bg-accent hover:bg-accent/90"
            >
              <Gavel className="w-4 h-4 mr-2" />
              Bid Now
            </Button>
          )}
          
          {userRole === "producer" && lot.canInstantCash && onInstantCash && (
            <Button 
              onClick={() => onInstantCash(lot.lotId)} 
              className="w-full bg-status-amber hover:bg-status-amber/90 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Instant Cash
            </Button>
          )}
          
          {lot.status === "sold" && (
            <Button disabled className="w-full bg-slate-400 text-white cursor-not-allowed">
              <span className="mr-2">✓</span>
              Sold
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
