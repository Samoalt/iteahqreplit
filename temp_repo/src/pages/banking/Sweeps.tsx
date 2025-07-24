
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRightLeft, Settings } from "lucide-react"
import { SweepFilters } from "@/components/banking/sweeps/SweepFilters"
import { SweepsTable } from "@/components/banking/sweeps/SweepsTable"
import { InitiateSweepModal } from "@/components/banking/sweeps/InitiateSweepModal"
import { AutoSweepRuleCard } from "@/components/banking/sweeps/AutoSweepRuleCard"
import { CreateRuleModal } from "@/components/banking/sweeps/CreateRuleModal"

const Sweeps = () => {
  const [initiateSweepOpen, setInitiateSweepOpen] = useState(false)
  const [createRuleOpen, setCreateRuleOpen] = useState(false)

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

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Wallet Sweeps</h1>
            <p className="text-slate-600 mt-1 font-medium">Manage wallet sweeps and automated rules</p>
          </div>
        </div>
      </div>

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
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
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
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
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

export default Sweeps
