import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export default function InstantCash() {
  const { user } = useAuth();
  const [selectedLotId, setSelectedLotId] = useState("");
  const [ltvPercentage, setLtvPercentage] = useState([70]);
  const [lienAccepted, setLienAccepted] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lots } = useQuery({
    queryKey: ["/api/lots"],
  });

  const { data: advances } = useQuery({
    queryKey: ["/api/instant-cash"],
  });

  const instantCashMutation = useMutation({
    mutationFn: async (cashData: any) => {
      return apiRequest("POST", "/api/instant-cash", cashData);
    },
    onSuccess: () => {
      toast({
        title: "Instant Cash Approved",
        description: `Cash advance has been successfully approved`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/instant-cash"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setSelectedLotId("");
      setLtvPercentage([70]);
    },
    onError: () => {
      toast({
        title: "Cash Advance Failed",
        description: "Failed to process cash advance. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Restrict access to producers only
  if (!user || user.role !== "producer") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Zap className="h-12 w-12 text-status-amber mx-auto mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Producer Access Only</h1>
            <p className="text-sm text-slate-600">
              Instant Cash advances are only available to tea producers.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const eligibleLots = lots?.filter((lot: any) => 
    lot.canInstantCash && (lot.status === "catalogue" || lot.status === "live")
  ) || [];

  const selectedLot = lots?.find((lot: any) => lot.lotId === selectedLotId);

  const calculateEstimatedValue = () => {
    if (!selectedLot) return 0;
    const kg = parseFloat(selectedLot.kg);
    const price = parseFloat(selectedLot.offerPrice);
    return kg * price;
  };

  const calculateAdvanceAmount = () => {
    const estimatedValue = calculateEstimatedValue();
    return (estimatedValue * ltvPercentage[0] / 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLotId) {
      toast({
        title: "No Lot Selected",
        description: "Please select a lot for the cash advance",
        variant: "destructive",
      });
      return;
    }

    if (!lienAccepted) {
      toast({
        title: "Agreement Required",
        description: "You must accept the lien agreement to proceed",
        variant: "destructive",
      });
      return;
    }

    instantCashMutation.mutate({
      lotId: selectedLotId,
      ltvPercentage: ltvPercentage[0],
      advanceAmount: calculateAdvanceAmount().toFixed(2),
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title text-foreground">Instant Cash</h1>
          <p className="text-muted-foreground">Get immediate cash advances on your tea lots</p>
        </div>
        <Badge className="bg-status-amber text-white">
          <Zap className="w-4 h-4 mr-1" />
          Producer Only
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Form */}
        <Card className="feature-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="card-title flex items-center">
              <Zap className="w-5 h-5 mr-2 text-status-amber" />
              Cash Advance Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Lot Selection */}
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-3 block">
                  Select Eligible Lot
                </Label>
                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                  {eligibleLots.length > 0 ? (
                    eligibleLots.map((lot: any) => (
                      <div
                        key={lot.lotId}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedLotId === lot.lotId 
                            ? "border-primary bg-primary/5" 
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => setSelectedLotId(lot.lotId)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900">
                              {lot.lotId} - {lot.grade}
                            </div>
                            <div className="text-sm text-slate-600">
                              {parseFloat(lot.kg).toLocaleString()} kg @ ${lot.offerPrice}/kg
                            </div>
                            <div className="text-xs text-slate-500">{lot.factory}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-900">
                              Est. ${(parseFloat(lot.kg) * parseFloat(lot.offerPrice)).toLocaleString()}
                            </div>
                            <Badge className="bg-status-green text-white text-xs">
                              Cash Ready
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p>No eligible lots available for instant cash</p>
                      <p className="text-xs mt-1">Lots must be in catalogue or live status</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedLot && (
                <>
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

                  {/* Financial Summary */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Estimated Value:</span>
                        <div className="font-medium">${calculateEstimatedValue().toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Advance Amount:</span>
                        <div className="font-medium text-primary">
                          ${Math.floor(calculateAdvanceAmount()).toLocaleString()}
                        </div>
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

                  {/* Terms and Conditions */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <div className="font-medium mb-1">Important Terms:</div>
                        <ul className="space-y-1 text-xs">
                          <li>• Advance is secured by a lien on the selected lot</li>
                          <li>• Automatic repayment upon lot sale completion</li>
                          <li>• 12% annual percentage rate applies</li>
                          <li>• Funds available within 2 business hours</li>
                        </ul>
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
                      I agree to the lien on this lot as collateral for the advance. I understand that 
                      the loan will be automatically repaid upon sale completion.
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={instantCashMutation.isPending || !lienAccepted}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {instantCashMutation.isPending ? "Processing..." : "Request Instant Cash"}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Cash Advances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Active Advances:</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Outstanding:</span>
                <span className="font-medium">$15,230</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Available Credit:</span>
                <span className="font-medium text-status-green">$84,770</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Advances */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Advances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { lotId: "LOT-3421", amount: 8500, status: "Active", daysLeft: 18 },
                  { lotId: "LOT-3398", amount: 6730, status: "Active", daysLeft: 25 },
                  { lotId: "LOT-3376", amount: 12000, status: "Repaid", daysLeft: 0 }
                ].map((advance, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{advance.lotId}</span>
                      <Badge className={
                        advance.status === "Active" ? "bg-status-green text-white" : "bg-status-grey text-white"
                      }>
                        {advance.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600">
                      ${advance.amount.toLocaleString()}
                      {advance.status === "Active" && (
                        <span className="ml-2">• {advance.daysLeft} days left</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">
                Instant cash advances provide immediate liquidity against your tea lots.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View FAQ
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
