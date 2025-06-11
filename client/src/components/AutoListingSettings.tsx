import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Settings, Clock, Target, AlertTriangle } from "lucide-react";

interface AutoListingRule {
  id: string;
  factoryId: string;
  enabled: boolean;
  grade: string;
  minQuantity: number;
  reservePrice: number;
  listingSchedule: "immediate" | "daily" | "weekly";
  qualityThreshold: number;
  autoApprove: boolean;
}

export default function AutoListingSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newRule, setNewRule] = useState<Partial<AutoListingRule>>({
    grade: "",
    minQuantity: 100,
    reservePrice: 0,
    listingSchedule: "immediate",
    qualityThreshold: 3,
    autoApprove: false,
    enabled: true
  });

  const { data: rules } = useQuery({
    queryKey: ["/api/auto-listing/rules"],
  });

  const createRuleMutation = useMutation({
    mutationFn: (rule: Partial<AutoListingRule>) =>
      apiRequest("POST", "/api/auto-listing/rules", rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auto-listing/rules"] });
      toast({
        title: "Auto-listing rule created",
        description: "New rule has been added successfully"
      });
      setNewRule({
        grade: "",
        minQuantity: 100,
        reservePrice: 0,
        listingSchedule: "immediate",
        qualityThreshold: 3,
        autoApprove: false,
        enabled: true
      });
    }
  });

  const toggleRuleMutation = useMutation({
    mutationFn: ({ ruleId, enabled }: { ruleId: string; enabled: boolean }) =>
      apiRequest("PATCH", `/api/auto-listing/rules/${ruleId}`, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auto-listing/rules"] });
    }
  });

  const handleCreateRule = () => {
    if (!newRule.grade || !newRule.minQuantity || !newRule.reservePrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    createRuleMutation.mutate(newRule);
  };

  const mockRules: AutoListingRule[] = [
    {
      id: "RULE-001",
      factoryId: "FACTORY-123",
      enabled: true,
      grade: "PEKOE",
      minQuantity: 500,
      reservePrice: 4.20,
      listingSchedule: "daily",
      qualityThreshold: 4,
      autoApprove: true
    },
    {
      id: "RULE-002", 
      factoryId: "FACTORY-124",
      enabled: false,
      grade: "BROKEN_PEKOE",
      minQuantity: 1000,
      reservePrice: 3.80,
      listingSchedule: "immediate",
      qualityThreshold: 3,
      autoApprove: false
    }
  ];

  const activeRules = rules || mockRules;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Auto-Listing System</h2>
          <p className="text-slate-600">Configure automatic lot creation based on factory output</p>
        </div>
        <Badge variant="outline" className="bg-status-green/10 text-status-green border-status-green">
          {activeRules.filter(r => r.enabled).length} Active Rules
        </Badge>
      </div>

      {/* Create New Rule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Create New Auto-Listing Rule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Tea Grade</Label>
              <Select value={newRule.grade} onValueChange={(value) => setNewRule({...newRule, grade: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEKOE">PEKOE</SelectItem>
                  <SelectItem value="BROKEN_PEKOE">BROKEN PEKOE</SelectItem>
                  <SelectItem value="FANNINGS">FANNINGS</SelectItem>
                  <SelectItem value="DUST">DUST</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Minimum Quantity (kg)</Label>
              <Input
                type="number"
                value={newRule.minQuantity}
                onChange={(e) => setNewRule({...newRule, minQuantity: parseInt(e.target.value)})}
                placeholder="500"
              />
            </div>

            <div>
              <Label>Reserve Price (USD/kg)</Label>
              <Input
                type="number"
                step="0.01"
                value={newRule.reservePrice}
                onChange={(e) => setNewRule({...newRule, reservePrice: parseFloat(e.target.value)})}
                placeholder="4.20"
              />
            </div>

            <div>
              <Label>Listing Schedule</Label>
              <Select value={newRule.listingSchedule} onValueChange={(value: any) => setNewRule({...newRule, listingSchedule: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily at 9 AM</SelectItem>
                  <SelectItem value="weekly">Weekly on Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quality Threshold (Stars)</Label>
              <Select value={newRule.qualityThreshold?.toString()} onValueChange={(value) => setNewRule({...newRule, qualityThreshold: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="5">5 Stars Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newRule.autoApprove}
                onCheckedChange={(checked) => setNewRule({...newRule, autoApprove: checked})}
              />
              <Label>Auto-approve listings</Label>
            </div>
          </div>

          <Button 
            onClick={handleCreateRule}
            disabled={createRuleMutation.isPending}
            className="w-full md:w-auto"
          >
            {createRuleMutation.isPending ? "Creating..." : "Create Rule"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Rules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Active Rules</h3>
        {activeRules.map((rule) => (
          <Card key={rule.id} className={rule.enabled ? "border-status-green" : "border-slate-200"}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant={rule.enabled ? "default" : "secondary"}>
                      {rule.grade}
                    </Badge>
                    <span className="text-sm text-slate-600">Min: {rule.minQuantity}kg</span>
                    <span className="text-sm text-slate-600">Reserve: ${rule.reservePrice}/kg</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{rule.listingSchedule}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{rule.qualityThreshold}+ stars</span>
                    </div>
                    {rule.autoApprove && (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Auto-approve</span>
                      </div>
                    )}
                  </div>
                </div>

                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(checked) => 
                    toggleRuleMutation.mutate({ ruleId: rule.id, enabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}