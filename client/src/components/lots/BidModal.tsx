import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lot } from "@shared/schema";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: Lot | null;
}

export default function BidModal({ isOpen, onClose, lot }: BidModalProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [lockFx, setLockFx] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fxRate } = useQuery({
    queryKey: ["/api/fx-rate"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: bids } = useQuery({
    queryKey: ["/api/lots", lot?.lotId, "bids"],
    enabled: !!lot?.lotId,
  });

  const placeBidMutation = useMutation({
    mutationFn: async (bidData: any) => {
      return apiRequest("POST", `/api/lots/${lot?.lotId}/bid`, bidData);
    },
    onSuccess: () => {
      toast({
        title: "Bid Placed Successfully",
        description: `Your bid of $${bidAmount} has been placed on lot ${lot?.lotId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      onClose();
      setBidAmount("");
      setLockFx(false);
    },
    onError: () => {
      toast({
        title: "Bid Failed",
        description: "Failed to place bid. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bestBid = bids?.length > 0 
    ? Math.max(...bids.map((b: any) => parseFloat(b.bidAmount))).toFixed(2)
    : lot?.offerPrice || "0.00";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bidAmount || parseFloat(bidAmount) < parseFloat(lot?.reservePrice || "0")) {
      toast({
        title: "Invalid Bid",
        description: `Bid must be at least $${lot?.reservePrice} (reserve price)`,
        variant: "destructive",
      });
      return;
    }

    placeBidMutation.mutate({
      bidAmount: parseFloat(bidAmount).toFixed(2),
      fxRate: fxRate?.rate,
      lockFx,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setBidAmount("");
      setLockFx(false);
    }
  }, [isOpen]);

  if (!lot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Place Bid</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lot Information */}
          <div>
            <Label className="text-sm font-medium text-slate-700">Lot Information</Label>
            <div className="bg-slate-50 rounded-lg p-3 mt-2">
              <div className="text-sm text-slate-900 font-medium">
                Lot #{lot.lotId} - {lot.grade} Grade
              </div>
              <div className="text-xs text-slate-600">
                {parseFloat(lot.kg).toLocaleString()} kg from {lot.factory}
              </div>
            </div>
          </div>

          {/* Bid Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Best Bid</Label>
              <div className="text-lg font-bold text-status-green">${bestBid}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Reserve Price</Label>
              <div className="text-lg font-bold text-slate-900">${lot.reservePrice}</div>
            </div>
          </div>

          {/* Bid Amount */}
          <div>
            <Label htmlFor="bidAmount" className="text-sm font-medium text-slate-700">
              Your Bid Amount (USD per kg)
            </Label>
            <Input
              id="bidAmount"
              type="number"
              step="0.01"
              min={lot.reservePrice}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              className="mt-2"
              required
            />
          </div>

          {/* FX Quote */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700">Live FX Quote</span>
              <span className="text-sm font-mono text-slate-900">
                {fxRate?.rate || "130.45"} KES/USD
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Updated {fxRate ? "just now" : "5 seconds ago"}
            </div>
          </div>

          {/* FX Lock Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lockFx"
              checked={lockFx}
              onCheckedChange={(checked) => setLockFx(checked as boolean)}
            />
            <Label htmlFor="lockFx" className="text-sm text-slate-700">
              Lock FX rate for this bid
            </Label>
          </div>

          {/* Credit Utilization (mock) */}
          <div>
            <Label className="text-sm font-medium text-slate-700">Credit Utilisation</Label>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: "85%" }}></div>
            </div>
            <div className="text-xs text-slate-600 mt-1">85% of $500K limit</div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={placeBidMutation.isPending}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              {placeBidMutation.isPending ? "Placing..." : "Place Bid"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
