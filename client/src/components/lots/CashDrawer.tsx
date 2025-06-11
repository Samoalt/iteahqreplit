import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lot } from "@shared/schema";

interface CashDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lot: Lot | null;
}

export default function CashDrawer({ isOpen, onClose, lot }: CashDrawerProps) {
  const [ltvPercentage, setLtvPercentage] = useState([70]);
  const [lienAccepted, setLienAccepted] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const instantCashMutation = useMutation({
    mutationFn: async (cashData: any) => {
      return apiRequest("POST", "/api/instant-cash", cashData);
    },
    onSuccess: () => {
      toast({
        title: "Instant Cash Approved",
        description: `Cash advance of $${calculateAdvanceAmount()} has been approved`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Cash Advance Failed",
        description: "Failed to process cash advance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateEstimatedValue = () => {
    if (!lot) return 0;
    const kg = parseFloat(lot.kg);
    const price = parseFloat(lot.offerPrice);
    return kg * price;
  };

  const calculateAdvanceAmount = () => {
    const estimatedValue = calculateEstimatedValue();
    return (estimatedValue * ltvPercentage[0] / 100).toFixed(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lienAccepted) {
      toast({
        title: "Agreement Required",
        description: "You must accept the lien agreement to proceed",
        variant: "destructive",
      });
      return;
    }

    instantCashMutation.mutate({
      lotId: lot?.lotId,
      ltvPercentage: ltvPercentage[0],
      advanceAmount: calculateAdvanceAmount(),
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setLtvPercentage([70]);
      setLienAccepted(true);
    }
  }, [isOpen]);

  if (!lot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Instant Cash Advance</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* LTV Slider */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-4 block">
              Loan-to-Value (LTV) Percentage
            </Label>
            <div className="px-4">
              <Slider
                value={ltvPercentage}
                onValueChange={setLtvPercentage}
                max={80}
                min={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>60%</span>
                <span>70%</span>
                <span>80%</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-lg font-bold text-primary">{ltvPercentage[0]}%</span>
              <span className="text-sm text-slate-600 ml-1">LTV</span>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Estimated Value:</span>
                <div className="font-medium">${calculateEstimatedValue().toLocaleString()}</div>
              </div>
              <div>
                <span className="text-slate-600">Advance Amount:</span>
                <div className="font-medium text-primary">${parseInt(calculateAdvanceAmount()).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-slate-600">APR:</span>
                <div className="font-medium">12% p.a.</div>
              </div>
              <div>
                <span className="text-slate-600">Term:</span>
                <div className="font-medium">30 days</div>
              </div>
            </div>
          </div>

          {/* Lien Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="lienAgreement"
              checked={lienAccepted}
              onCheckedChange={(checked) => setLienAccepted(checked as boolean)}
            />
            <Label htmlFor="lienAgreement" className="text-sm text-slate-700 leading-relaxed">
              I agree to the lien on this lot as collateral for the advance. The loan will be 
              automatically repaid upon sale completion.
            </Label>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={instantCashMutation.isPending || !lienAccepted}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {instantCashMutation.isPending ? "Processing..." : "Accept Advance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
