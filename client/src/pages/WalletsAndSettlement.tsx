import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, ArrowUpDown, Clock, Check, AlertTriangle, Wallet as WalletIcon, DollarSign } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function WalletsAndSettlement() {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [ledgerDrawerOpen, setLedgerDrawerOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wallets } = useQuery({
    queryKey: ["/api/wallets"],
  });

  const { data: fxRate } = useQuery({
    queryKey: ["/api/fx-rate"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: wireTransferCounts } = useQuery({
    queryKey: ["/api/wire-transfers/counts"],
  });

  const handleDepositSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount") as string;
    const currency = formData.get("currency") as string;
    const method = formData.get("method") as string;

    try {
      await apiRequest("POST", "/api/wire-transfers", {
        amount: parseFloat(amount),
        currency,
        direction: "inbound",
        reference: `DEP-${Date.now()}`,
      });

      toast({
        title: "Deposit Initiated",
        description: `${method} deposit of ${amount} ${currency} has been initiated`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wire-transfers/counts"] });
      setDepositModalOpen(false);
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Failed to initiate deposit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount") as string;
    const currency = formData.get("currency") as string;
    const method = formData.get("method") as string;

    try {
      await apiRequest("POST", "/api/wire-transfers", {
        amount: parseFloat(amount),
        currency,
        direction: "outbound",
        reference: `WDR-${Date.now()}`,
      });

      toast({
        title: "Withdrawal Initiated",
        description: `${method} withdrawal of ${amount} ${currency} has been initiated`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wire-transfers/counts"] });
      setWithdrawModalOpen(false);
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Failed to initiate withdrawal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openLedgerDrawer = (currency: string) => {
    setSelectedCurrency(currency);
    setLedgerDrawerOpen(true);
  };

  const kesWallet = wallets?.find((w: any) => w.currency === "KES");
  const usdWallet = wallets?.find((w: any) => w.currency === "USD");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wallets & Settlement</h1>
          <p className="text-slate-600">Manage your balances and wire transfers</p>
        </div>
      </div>

      {/* Balance Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openLedgerDrawer("KES")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">KES Wallet</p>
                <p className="text-2xl font-bold text-slate-900">
                  {kesWallet ? parseFloat(kesWallet.balance).toLocaleString() : "2,847,356"}
                </p>
                <p className="text-sm text-status-green">Available</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">KES</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openLedgerDrawer("USD")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">USD Wallet</p>
                <p className="text-2xl font-bold text-slate-900">
                  {usdWallet ? parseFloat(usdWallet.balance).toLocaleString() : "21,847"}
                </p>
                <p className="text-sm text-status-green">Available</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold">USD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-600">Quick Actions</p>
              </div>
            </div>
            <div className="space-y-2">
              <Dialog open={depositModalOpen} onOpenChange={setDepositModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deposit Funds</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleDepositSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="deposit-amount">Amount</Label>
                      <Input
                        id="deposit-amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="deposit-currency">Currency</Label>
                      <Select name="currency" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KES">KES</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="deposit-method">Method</Label>
                      <Select name="method" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACH">ACH Transfer</SelectItem>
                          <SelectItem value="SWIFT">SWIFT Wire</SelectItem>
                          <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-3">
                      <Button type="button" variant="outline" onClick={() => setDepositModalOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Initiate Deposit
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-slate-600 hover:bg-slate-700 text-sm">
                    <Minus className="w-4 h-4 mr-2" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="withdraw-amount">Amount</Label>
                      <Input
                        id="withdraw-amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="withdraw-currency">Currency</Label>
                      <Select name="currency" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KES">KES</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="withdraw-method">Method</Label>
                      <Select name="method" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RTGS">RTGS</SelectItem>
                          <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                          <SelectItem value="SWIFT">SWIFT Wire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-3">
                      <Button type="button" variant="outline" onClick={() => setWithdrawModalOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Initiate Withdrawal
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">FX Rate</p>
                <p className="text-xl font-bold text-slate-900">
                  {fxRate?.rate || "130.45"}
                </p>
                <p className="text-sm text-status-green">KES/USD</p>
              </div>
              <div className="w-12 h-12 bg-status-green/10 rounded-full flex items-center justify-center">
                <ArrowUpDown className="w-5 h-5 text-status-green" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wire Tracker Widget */}
      <Card>
        <CardHeader>
          <CardTitle>Wire Transfer Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-status-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-status-blue" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {wireTransferCounts?.inClearing || 5}
              </div>
              <div className="text-sm text-slate-600">In Clearing</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-status-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8 text-status-green" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {wireTransferCounts?.cleared || 18}
              </div>
              <div className="text-sm text-slate-600">Cleared</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-status-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-status-red" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {wireTransferCounts?.overdue || 2}
              </div>
              <div className="text-sm text-slate-600">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Drawer */}
      <Dialog open={ledgerDrawerOpen} onOpenChange={setLedgerDrawerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCurrency} Wallet Ledger</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-600">Available Balance:</span>
                  <div className="font-bold text-lg">
                    {selectedCurrency === "KES" ? "2,847,356" : "21,847"} {selectedCurrency}
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Pending:</span>
                  <div className="font-bold text-lg text-status-amber">
                    {selectedCurrency === "KES" ? "125,000" : "5,200"} {selectedCurrency}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <div className="text-sm font-medium text-slate-700">Recent Transactions</div>
              {[
                { type: "credit", amount: "500,000", description: "Invoice payment received", date: "2024-01-15" },
                { type: "debit", amount: "125,000", description: "Wire transfer to supplier", date: "2024-01-14" },
                { type: "credit", amount: "350,000", description: "Lot sale proceeds", date: "2024-01-13" }
              ].map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === "credit" ? "bg-status-green/10" : "bg-status-red/10"
                    }`}>
                      {tx.type === "credit" ? (
                        <Plus className={`w-4 h-4 text-status-green`} />
                      ) : (
                        <Minus className={`w-4 h-4 text-status-red`} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{tx.description}</div>
                      <div className="text-xs text-slate-500">{tx.date}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    tx.type === "credit" ? "text-status-green" : "text-status-red"
                  }`}>
                    {tx.type === "credit" ? "+" : "-"}{tx.amount} {selectedCurrency}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
