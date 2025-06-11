import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Leaf, Ship, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface InsuranceType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  maxCoverage: string;
  premiumRate: string;
  trigger: string;
  settlement: string;
}

const insuranceTypes: InsuranceType[] = [
  {
    id: "drought",
    name: "Drought Protection",
    description: "Weather-based coverage",
    icon: Sun,
    color: "text-status-amber",
    bgColor: "bg-status-amber/10",
    maxCoverage: "Up to $100K",
    premiumRate: "2.5% of value",
    trigger: "30 days no rain",
    settlement: "7 days"
  },
  {
    id: "quality",
    name: "Quality Assurance",
    description: "Grade protection",
    icon: Leaf,
    color: "text-status-green",
    bgColor: "bg-status-green/10",
    maxCoverage: "Up to $75K",
    premiumRate: "1.8% of value",
    trigger: "Grade downgrade",
    settlement: "3 days"
  },
  {
    id: "marine",
    name: "Marine Transit",
    description: "Shipping protection",
    icon: Ship,
    color: "text-status-blue",
    bgColor: "bg-status-blue/10",
    maxCoverage: "Up to $200K",
    premiumRate: "0.5% of value",
    trigger: "Loss/damage",
    settlement: "14 days"
  }
];

export default function InsuranceHub() {
  const [selectedType, setSelectedType] = useState("drought");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<any>(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: policies } = useQuery({
    queryKey: ["/api/insurance/policies"],
  });

  const getQuoteMutation = useMutation({
    mutationFn: async (quoteData: any) => {
      const response = await apiRequest("POST", "/api/insurance/quote", quoteData);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentQuote(data);
      setBuyModalOpen(true);
    },
    onError: () => {
      toast({
        title: "Quote Failed",
        description: "Failed to generate quote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const buyInsuranceMutation = useMutation({
    mutationFn: async (policyData: any) => {
      return apiRequest("POST", "/api/insurance/buy", policyData);
    },
    onSuccess: () => {
      toast({
        title: "Insurance Purchased",
        description: "Your insurance policy has been successfully purchased",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/insurance/policies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setBuyModalOpen(false);
      setCurrentQuote(null);
    },
    onError: () => {
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase insurance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetQuote = (type: string) => {
    setQuoteModalOpen(true);
  };

  const handleQuoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const coverageAmount = formData.get("coverageAmount") as string;
    
    getQuoteMutation.mutate({
      type: selectedType,
      coverageAmount: parseFloat(coverageAmount)
    });
    
    setQuoteModalOpen(false);
  };

  const handleBuyInsurance = () => {
    if (!currentQuote) return;
    
    buyInsuranceMutation.mutate({
      type: currentQuote.type,
      coverageAmount: currentQuote.coverageAmount,
      premiumAmount: currentQuote.premiumAmount
    });
  };

  const selectedInsuranceType = insuranceTypes.find(type => type.id === selectedType);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insurance Hub</h1>
          <p className="text-slate-600">Protect your tea investments with comprehensive coverage</p>
        </div>
      </div>

      {/* Insurance Type Selector */}
      <div className="flex flex-wrap gap-3">
        {insuranceTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "outline"}
              className={`${
                selectedType === type.id 
                  ? "bg-accent text-white" 
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {type.name}
            </Button>
          );
        })}
      </div>

      {/* Insurance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insuranceTypes.map((type) => {
          const Icon = type.icon;
          
          return (
            <Card key={type.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 ${type.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`${type.color} w-6 h-6`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{type.name}</h3>
                    <p className="text-sm text-slate-600">{type.description}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Coverage Amount:</span>
                    <span className="font-medium">{type.maxCoverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Premium Rate:</span>
                    <span className="font-medium">{type.premiumRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Trigger:</span>
                    <span className="font-medium">{type.trigger}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Settlement:</span>
                    <span className="font-medium">{type.settlement}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      setSelectedType(type.id);
                      handleGetQuote(type.id);
                    }}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    Get Quote
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-slate-100"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Active Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Policy #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Coverage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Premium</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {policies?.length > 0 ? (
                  policies.map((policy: any) => (
                    <tr key={policy.id}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {policy.policyNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 capitalize">
                        {policy.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        ${parseFloat(policy.coverageAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        ${parseFloat(policy.premiumAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-status-green text-white">
                          {policy.status === "bound" ? "Active" : policy.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">POL-8901</td>
                    <td className="px-6 py-4 text-sm text-slate-500">Drought</td>
                    <td className="px-6 py-4 text-sm text-slate-900">$50,000</td>
                    <td className="px-6 py-4 text-sm text-slate-900">$1,250</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-status-green text-white">Active</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                        View
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quote Modal */}
      <Dialog open={quoteModalOpen} onOpenChange={setQuoteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Insurance Quote</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div>
              <Label htmlFor="coverage-amount">Coverage Amount (USD)</Label>
              <Input
                id="coverage-amount"
                name="coverageAmount"
                type="number"
                step="0.01"
                placeholder="Enter coverage amount"
                required
              />
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-700 mb-2">Selected Coverage:</div>
              <div className="font-medium">{selectedInsuranceType?.name}</div>
              <div className="text-sm text-slate-600">{selectedInsuranceType?.description}</div>
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => setQuoteModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={getQuoteMutation.isPending} className="flex-1">
                {getQuoteMutation.isPending ? "Generating..." : "Get Quote"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Buy Insurance Modal */}
      <Dialog open={buyModalOpen} onOpenChange={setBuyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Insurance Policy</DialogTitle>
          </DialogHeader>
          {currentQuote && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-600">Type:</span>
                    <div className="font-medium capitalize">{currentQuote.type}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Coverage:</span>
                    <div className="font-medium">${parseFloat(currentQuote.coverageAmount).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Premium:</span>
                    <div className="font-medium">${parseFloat(currentQuote.premiumAmount).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Rate:</span>
                    <div className="font-medium">{currentQuote.premiumRate}</div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-600">
                Quote valid until: {new Date(currentQuote.validUntil).toLocaleString()}
              </div>
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setBuyModalOpen(false)} 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBuyInsurance}
                  disabled={buyInsuranceMutation.isPending}
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {buyInsuranceMutation.isPending ? "Purchasing..." : "Buy Policy"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
