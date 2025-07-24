
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Calendar, ArrowDownLeft, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface MMFManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: {
    currency: string;
    balance: string;
    mmfBalance?: string;
    sweepThreshold?: number;
    sweepFrequency?: string;
    sweepTime?: string;
    sweepDay?: string;
    mmfYield?: number;
    isSweepActive?: boolean;
  };
  onSaveSettings: (settings: any) => void;
}

export const MMFManagementModal = ({
  open,
  onOpenChange,
  wallet,
  onSaveSettings
}: MMFManagementModalProps) => {
  const [sweepThreshold, setSweepThreshold] = useState(wallet.sweepThreshold || 10000);
  const [sweepFrequency, setSweepFrequency] = useState(wallet.sweepFrequency || "daily");
  const [sweepTime, setSweepTime] = useState(wallet.sweepTime || "17:00");
  const [sweepDay, setSweepDay] = useState(wallet.sweepDay || "friday");
  const [isSweepActive, setIsSweepActive] = useState(wallet.isSweepActive || false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleSave = () => {
    onSaveSettings({
      sweepThreshold,
      sweepFrequency,
      sweepTime,
      sweepDay,
      isSweepActive
    });
    toast({
      title: "MMF Settings Updated",
      description: "Your sweep rules have been successfully configured"
    });
    onOpenChange(false);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Withdrawal Initiated",
      description: `${wallet.currency} ${withdrawAmount} will be transferred back to your wallet`
    });
    setWithdrawAmount("");
  };

  const getScheduleDisplay = () => {
    if (sweepFrequency === "daily") {
      return `Daily at ${sweepTime}`;
    } else if (sweepFrequency === "weekly") {
      return `Every ${sweepDay} at ${sweepTime}`;
    } else {
      return `Monthly on the 1st at ${sweepTime}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Money Market Fund - {wallet.currency} Wallet
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
            <TabsTrigger value="settings" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              Sweep Settings
            </TabsTrigger>
            <TabsTrigger value="overview" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              MMF Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border-slate-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-900">
                  <TrendingUp className="h-5 w-5 text-elastic-teal-600" />
                  <span>Auto-Sweep Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sweep-active" className="text-base font-medium text-slate-700">Enable Auto-Sweep</Label>
                  <Switch id="sweep-active" checked={isSweepActive} onCheckedChange={setIsSweepActive} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold" className="text-base font-medium text-slate-700">Sweep Threshold ({wallet.currency})</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={sweepThreshold}
                    onChange={(e) => setSweepThreshold(Number(e.target.value))}
                    placeholder="10000"
                    className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                  />
                  <p className="text-xs font-medium text-slate-500">
                    Balances above this amount will be swept to MMF
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-base font-medium text-slate-700">Sweep Frequency</Label>
                  <Select value={sweepFrequency} onValueChange={setSweepFrequency}>
                    <SelectTrigger className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300 z-50">
                      <SelectItem value="daily" className="text-slate-900 hover:bg-slate-50">Daily</SelectItem>
                      <SelectItem value="weekly" className="text-slate-900 hover:bg-slate-50">Weekly</SelectItem>
                      <SelectItem value="monthly" className="text-slate-900 hover:bg-slate-50">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sweep-time" className="flex items-center space-x-1 text-base font-medium text-slate-700">
                      <Clock className="h-4 w-4" />
                      <span>Sweep Time</span>
                    </Label>
                    <Input
                      id="sweep-time"
                      type="time"
                      value={sweepTime}
                      onChange={(e) => setSweepTime(e.target.value)}
                      className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                    />
                  </div>

                  {sweepFrequency === "weekly" && (
                    <div className="space-y-2">
                      <Label htmlFor="sweep-day" className="text-base font-medium text-slate-700">Day of Week</Label>
                      <Select value={sweepDay} onValueChange={setSweepDay}>
                        <SelectTrigger className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-300 z-50">
                          <SelectItem value="monday" className="text-slate-900 hover:bg-slate-50">Monday</SelectItem>
                          <SelectItem value="tuesday" className="text-slate-900 hover:bg-slate-50">Tuesday</SelectItem>
                          <SelectItem value="wednesday" className="text-slate-900 hover:bg-slate-50">Wednesday</SelectItem>
                          <SelectItem value="thursday" className="text-slate-900 hover:bg-slate-50">Thursday</SelectItem>
                          <SelectItem value="friday" className="text-slate-900 hover:bg-slate-50">Friday</SelectItem>
                          <SelectItem value="saturday" className="text-slate-900 hover:bg-slate-50">Saturday</SelectItem>
                          <SelectItem value="sunday" className="text-slate-900 hover:bg-slate-50">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {isSweepActive && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      Schedule: {getScheduleDisplay()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-elastic-navy-600 hover:bg-elastic-navy-700 text-white font-semibold"
              >
                Save Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white border-slate-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">MMF Balance</p>
                      <p className="text-lg font-bold text-slate-900">{wallet.currency} {wallet.mmfBalance || "0.00"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">Current Yield</p>
                      <p className="text-lg font-bold text-emerald-600">{wallet.mmfYield || 10.2}% p.a.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-slate-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-900">
                  <ArrowDownLeft className="h-5 w-5 text-purple-600" />
                  <span>Withdraw from MMF</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount" className="text-base font-medium text-slate-700">
                    Withdrawal Amount ({wallet.currency})
                  </Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                  />
                </div>
                <Button
                  onClick={handleWithdraw}
                  className="w-full bg-elastic-navy-600 hover:bg-elastic-navy-700 text-white font-semibold"
                >
                  Initiate Withdrawal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-white border-slate-300">
              <CardHeader>
                <CardTitle className="text-slate-900">Recent Sweep Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Auto-Sweep</p>
                      <p className="text-sm font-medium text-slate-600">Jan 15, 2024</p>
                    </div>
                    <p className="font-bold text-emerald-600">+{wallet.currency} 25,000</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Manual Withdrawal</p>
                      <p className="text-sm font-medium text-slate-600">Jan 10, 2024</p>
                    </div>
                    <p className="font-bold text-red-600">-{wallet.currency} 10,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
