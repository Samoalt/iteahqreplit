
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, AlertCircle, Clock, Database } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const syncStatuses = [
  { module: "General Ledger", status: "synced", lastSync: "2024-01-15 10:30 AM", records: 1247 },
  { module: "Accounts Payable", status: "pending", lastSync: "2024-01-15 09:15 AM", records: 89 },
  { module: "Accounts Receivable", status: "error", lastSync: "2024-01-15 08:45 AM", records: 156 },
  { module: "Inventory", status: "syncing", lastSync: "2024-01-15 10:45 AM", records: 324 },
]

const mappings = [
  { teaAccount: "Revenue - Tea Sales", erpAccount: "4000-001", status: "mapped" },
  { teaAccount: "COGS - Tea Purchase", erpAccount: "5000-001", status: "mapped" },
  { teaAccount: "Accounts Receivable", erpAccount: "1200-001", status: "pending" },
  { teaAccount: "VAT Payable", erpAccount: "2100-005", status: "mapped" },
]

export const ERPSync = () => {
  const handleSyncModule = (module: string) => {
    toast({
      title: "Sync Initiated",
      description: `Starting sync for ${module}...`,
    })
    console.log(`Syncing ${module}`)
  }

  const handleFullSync = () => {
    toast({
      title: "Full Sync Started",
      description: "Synchronizing all modules with ERP system...",
    })
    console.log("Starting full ERP sync")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default: return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'synced': return 'elastic-badge-success'
      case 'pending': return 'elastic-badge-warning'
      case 'error': return 'elastic-badge-error'
      case 'syncing': return 'elastic-badge-info'
      case 'mapped': return 'elastic-badge-success'
      default: return 'elastic-badge-info'
    }
  }

  return (
    <div className="space-y-6">
      {/* Sync Status Overview */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-display font-semibold elastic-gradient-text">ERP Synchronization</h3>
        <Button onClick={handleFullSync} className="elastic-button-primary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Full Sync
        </Button>
      </div>

      {/* Module Sync Status */}
      <div className="elastic-card">
        <CardHeader className="elastic-card-header border-b border-slate-200 pb-6">
          <CardTitle className="flex items-center text-xl font-display">
            <Database className="h-5 w-5 mr-2 text-elastic-teal-600" />
            Module Sync Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {syncStatuses.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300 elastic-hover-lift">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-semibold text-slate-900">{item.module}</p>
                    <p className="text-sm text-slate-600">Last sync: {item.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-600 font-numeric">{item.records} records</span>
                  <span className={`elastic-badge ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSyncModule(item.module)}
                    disabled={item.status === 'syncing'}
                    className="elastic-button-outline"
                  >
                    Sync
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      {/* Account Mappings */}
      <div className="elastic-card">
        <CardHeader className="elastic-card-header border-b border-slate-200 pb-6">
          <CardTitle className="text-xl font-display">Account Mappings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {mappings.map((mapping, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-300">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{mapping.teaAccount}</p>
                  <p className="text-sm text-slate-600">→ {mapping.erpAccount}</p>
                </div>
                <span className={`elastic-badge ${getStatusBadge(mapping.status)}`}>
                  {mapping.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </div>
  )
}
