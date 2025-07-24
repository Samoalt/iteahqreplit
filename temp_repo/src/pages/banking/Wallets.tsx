import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowUpRight, ArrowDownRight, Eye, Activity, ArrowRightLeft, Settings, Send, Bell, AlertTriangle } from "lucide-react"
import { AddWalletModal } from "@/components/banking/AddWalletModal"
import { FundWalletModal } from "@/components/banking/FundWalletModal"
import { WithdrawModal } from "@/components/banking/WithdrawModal"
import { WalletTransactionsModal } from "@/components/banking/WalletTransactionsModal"
import { SendPaymentModal } from "@/components/banking/SendPaymentModal"
import { PaymentsOverviewTab } from "@/components/banking/PaymentsOverviewTab"
import { PaymentAlertsComponent } from "@/components/banking/PaymentAlertsComponent"
import { SweepFilters } from "@/components/banking/sweeps/SweepFilters"
import { SweepsTable } from "@/components/banking/sweeps/SweepsTable"
import { InitiateSweepModal } from "@/components/banking/sweeps/InitiateSweepModal"
import { AutoSweepRuleCard } from "@/components/banking/sweeps/AutoSweepRuleCard"
import { CreateRuleModal } from "@/components/banking/sweeps/CreateRuleModal"

const Wallets = () => {
  const [addWalletOpen, setAddWalletOpen] = useState(false)
  const [fundWalletOpen, setFundWalletOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [transactionsOpen, setTransactionsOpen] = useState(false)
  const [sendPaymentOpen, setSendPaymentOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  const [initiateSweepOpen, setInitiateSweepOpen] = useState(false)
  const [createRuleOpen, setCreateRuleOpen] = useState(false)

  const wallets = [
    {
      id: 1,
      name: "KES Wallet",
      currency: "KES",
      balance: 2450000,
      lastActivity: "2 hours ago",
      status: "active",
      transactions: 156
    },
    {
      id: 2,
      name: "USD Wallet",
      currency: "USD",
      balance: 85000,
      lastActivity: "1 day ago",
      status: "active",
      transactions: 89
    },
    {
      id: 3,
      name: "EUR Wallet",
      currency: "EUR",
      balance: 12500,
      lastActivity: "3 days ago",
      status: "active",
      transactions: 23
    },
    {
      id: 4,
      name: "GBP Wallet",
      currency: "GBP",
      balance: 0,
      lastActivity: "Never",
      status: "inactive",
      transactions: 0
    }
  ]

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleViewTransactions = (wallet: any) => {
    setSelectedWallet(wallet)
    setTransactionsOpen(true)
  }

  const handleSendPayment = (wallet: any) => {
    setSelectedWallet(wallet)
    setSendPaymentOpen(true)
  }

  const autoSweepRules = [
    {
      id: "1",
      name: "Weekly Buyer Sweep",
      frequency: "Weekly (Fridays 4pm)",
      trigger: "Balance > KES 2M",
      sourceWallet: "Buyer Wallets (Global Tea)",
      destinationWallet: "Holding Wallet (iTea Ops)",
      conditions: "If Inflows Today > KES 1M",
      status: "active",
      lastRun: "2024-01-05 16:00:00",
      nextRun: "2024-01-12 16:00:00"
    },
    {
      id: "2",
      name: "Daily Tax Sweep",
      frequency: "Daily (EOD)",
      trigger: "New Tax Allocation Exists",
      sourceWallet: "Tax Holding Wallet",
      destinationWallet: "KRA Settlement Wallet",
      conditions: "Always",
      status: "active",
      lastRun: "2024-01-05 23:59:00",
      nextRun: "2024-01-06 23:59:00"
    }
  ]

  const getWalletAlerts = (wallet: any) => {
    const alerts = []
    if (wallet.balance < 100000 && wallet.currency === 'KES') {
      alerts.push({ type: 'warning', message: 'Low balance for daily operations' })
    }
    if (wallet.status === 'inactive') {
      alerts.push({ type: 'info', message: 'Wallet inactive' })
    }
    return alerts
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-secondary min-h-screen animate-fade-in">
      {/* Enhanced Header with Alerts */}
      <div className="elastic-card border-0 elastic-shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold elastic-gradient-text">Wallet Management</h1>
            <p className="text-slate-600 mt-1 font-medium">Manage your trading platform wallets, payments and sweeps</p>
          </div>
          <PaymentAlertsComponent />
        </div>
      </div>

      <Tabs defaultValue="wallets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <TabsTrigger 
            value="wallets" 
            className="flex items-center space-x-2 px-4 py-2 text-slate-800 font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900"
          >
            <Activity className="h-4 w-4" />
            <span className="font-medium">Wallets</span>
          </TabsTrigger>
          <TabsTrigger 
            value="payments" 
            className="flex items-center space-x-2 px-4 py-2 text-slate-800 font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900"
          >
            <Send className="h-4 w-4" />
            <span className="font-medium">Payments</span>
          </TabsTrigger>
          <TabsTrigger 
            value="sweeps" 
            className="flex items-center space-x-2 px-4 py-2 text-slate-800 font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span className="font-medium">Sweeps</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-6">
          {/* Enhanced Quick Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button 
              onClick={() => setWithdrawOpen(true)}
              className="elastic-button-secondary"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
            <Button 
              onClick={() => setFundWalletOpen(true)}
              className="elastic-button-secondary"
            >
              <ArrowDownRight className="h-4 w-4 mr-2" />
              Fund Wallet
            </Button>
            <Button 
              onClick={() => setAddWalletOpen(true)}
              className="elastic-button-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Wallet
            </Button>
          </div>

          {/* Enhanced Wallet Cards with Send Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-elastic-slide-up">
            {wallets.map((wallet) => {
              const alerts = getWalletAlerts(wallet)
              return (
                <div key={wallet.id} className="elastic-card elastic-hover-lift border-0 elastic-shadow relative">
                  {/* Alert indicator */}
                  {alerts.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {alerts.length}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display font-bold text-slate-900">
                      {wallet.name}
                    </h3>
                    <span className={`elastic-badge ${wallet.status === 'active' ? 'elastic-badge-success' : 'elastic-badge-info'}`}>
                      {wallet.status}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Enhanced Balance Display */}
                    <div>
                      <p className="text-sm text-slate-600 mb-2 font-semibold uppercase tracking-wide">Current Balance</p>
                      <p className="text-2xl font-display font-bold text-slate-900 font-numeric">
                        {formatCurrency(wallet.balance, wallet.currency)}
                      </p>
                    </div>
                    
                    {/* Enhanced Wallet Details */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Currency</span>
                      <span className="elastic-badge elastic-badge-primary font-bold">{wallet.currency}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Last Activity</span>
                      <span className="text-sm text-slate-900 font-semibold">{wallet.lastActivity}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Transactions</span>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-900 font-numeric">{wallet.transactions}</span>
                      </div>
                    </div>

                    {/* Alerts Display */}
                    {alerts.length > 0 && (
                      <div className="space-y-1">
                        {alerts.map((alert, index) => (
                          <div key={index} className={`flex items-center space-x-2 text-xs p-2 rounded ${
                            alert.type === 'warning' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            <AlertTriangle className="h-3 w-3" />
                            <span>{alert.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Enhanced Action Buttons */}
                    <div className="space-y-2 mt-4">
                      <Button 
                        onClick={() => handleSendPayment(wallet)}
                        className="w-full elastic-button-primary"
                        disabled={wallet.status === 'inactive' || wallet.balance === 0}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Payment
                      </Button>
                      <Button 
                        onClick={() => handleViewTransactions(wallet)}
                        className="w-full elastic-button-secondary"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Transactions
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Enhanced Summary Stats with Elastic Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="elastic-metric-card elastic-hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="metric-label">Total Balance (USD Equiv.)</p>
                  <p className="metric-value font-numeric">$147,500</p>
                </div>
                <div className="h-12 w-12 rounded-lg flex items-center justify-center elastic-gradient-primary">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="elastic-metric-card elastic-hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="metric-label">Active Wallets</p>
                  <p className="metric-value font-numeric">3</p>
                </div>
                <div className="h-12 w-12 rounded-lg flex items-center justify-center status-success">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="elastic-metric-card elastic-hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="metric-label">Total Transactions</p>
                  <p className="metric-value font-numeric">268</p>
                </div>
                <div className="h-12 w-12 rounded-lg flex items-center justify-center elastic-gradient-accent">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentsOverviewTab wallets={wallets} />
        </TabsContent>

        <TabsContent value="sweeps" className="space-y-6">
          <Tabs defaultValue="manual" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
              <TabsTrigger 
                value="manual" 
                className="flex items-center space-x-2 px-4 py-2 text-slate-700 font-medium rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span>Manual Sweeps</span>
              </TabsTrigger>
              <TabsTrigger 
                value="auto" 
                className="flex items-center space-x-2 px-4 py-2 text-slate-700 font-medium rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                <Settings className="h-4 w-4" />
                <span>Auto Rules</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SweepFilters />
                </div>
                <Button 
                  onClick={() => setInitiateSweepOpen(true)}
                  className="elastic-button-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Initiate Sweep
                </Button>
              </div>

              <SweepsTable />
            </TabsContent>

            <TabsContent value="auto" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Auto Sweep Rules</h2>
                <Button 
                  onClick={() => setCreateRuleOpen(true)}
                  className="elastic-button-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Rule
                </Button>
              </div>

              <div className="grid gap-6">
                {autoSweepRules.map((rule) => (
                  <AutoSweepRuleCard key={rule.id} rule={rule} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Enhanced Modals */}
      <AddWalletModal 
        open={addWalletOpen} 
        onOpenChange={setAddWalletOpen}
      />

      <FundWalletModal 
        open={fundWalletOpen} 
        onOpenChange={setFundWalletOpen}
      />

      <WithdrawModal 
        open={withdrawOpen} 
        onOpenChange={setWithdrawOpen}
      />

      <WalletTransactionsModal
        open={transactionsOpen}
        onOpenChange={setTransactionsOpen}
        wallet={selectedWallet}
      />

      <SendPaymentModal
        open={sendPaymentOpen}
        onOpenChange={setSendPaymentOpen}
        wallet={selectedWallet ? {
          currency: selectedWallet.currency,
          balance: formatCurrency(selectedWallet.balance, selectedWallet.currency),
          available: formatCurrency(selectedWallet.balance * 0.95, selectedWallet.currency) // 95% available for safety
        } : null}
      />

      <InitiateSweepModal 
        open={initiateSweepOpen} 
        onOpenChange={setInitiateSweepOpen}
      />

      <CreateRuleModal 
        open={createRuleOpen} 
        onOpenChange={setCreateRuleOpen}
      />
    </div>
  )
}

export default Wallets
