
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, FileText, AlertCircle, RefreshCw, Settings, Download, Upload, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { ERPSync } from "@/components/accounting/ERPSync"
import { JournalEntries } from "@/components/accounting/JournalEntries"
import { TaxCenter } from "@/components/accounting/TaxCenter"

const Accounting = () => {
  const [syncInProgress, setSyncInProgress] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState("2024-01-15 10:30 AM")

  const handleSyncERP = async () => {
    setSyncInProgress(true)
    toast({
      title: "ERP Sync Started",
      description: "Synchronizing data with your ERP system...",
    })

    // Simulate sync process
    setTimeout(() => {
      setSyncInProgress(false)
      setLastSyncTime(new Date().toLocaleString())
      toast({
        title: "ERP Sync Complete",
        description: "All transactions have been synchronized successfully",
      })
    }, 3000)
  }

  const handleExportToQuickBooks = () => {
    // Generate QuickBooks compatible export
    const qbData = {
      transactions: [
        { date: "2024-01-15", description: "Tea Sales - Premium Tea Distributors", debit: 25400, credit: 0, account: "Sales Revenue" },
        { date: "2024-01-15", description: "Payment to Mountain Tea Suppliers", debit: 0, credit: 12600, account: "Cost of Goods Sold" },
        { date: "2024-01-14", description: "Logistics Expense", debit: 0, credit: 3200, account: "Operating Expenses" }
      ]
    }
    
    const qbString = JSON.stringify(qbData, null, 2)
    const blob = new Blob([qbString], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `quickbooks-export-${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "QuickBooks Export Complete",
      description: "Accounting data has been exported for QuickBooks import",
    })
  }

  const handleExportToXero = () => {
    // Generate Xero compatible export
    const xeroData = {
      invoices: [
        { invoiceNumber: "INV-2024-001", date: "2024-01-15", contact: "Premium Tea Distributors", amount: 25400, status: "PAID" },
        { invoiceNumber: "INV-2024-002", date: "2024-01-14", contact: "Global Tea Network", amount: 18900, status: "AUTHORISED" }
      ],
      bills: [
        { billNumber: "BILL-2024-001", date: "2024-01-15", contact: "Mountain Tea Suppliers", amount: 12600, status: "PAID" },
        { billNumber: "BILL-2024-002", date: "2024-01-14", contact: "Transport Partners", amount: 3200, status: "AUTHORISED" }
      ]
    }
    
    const xeroString = JSON.stringify(xeroData, null, 2)
    const blob = new Blob([xeroString], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `xero-export-${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Xero Export Complete",
      description: "Accounting data has been exported for Xero import",
    })
  }

  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "Generating Report",
      description: `${reportType} report is being generated...`,
    })

    // Simulate report generation
    setTimeout(() => {
      const reportData = {
        reportType,
        period: "January 2024",
        generatedAt: new Date().toISOString(),
        summary: {
          totalRevenue: "$2,845,200",
          totalExpenses: "$1,234,500",
          netIncome: "$1,610,700",
          profitMargin: "56.6%"
        }
      }
      
      const reportString = JSON.stringify(reportData, null, 2)
      const blob = new Blob([reportString], { type: 'application/json' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${reportType.toLowerCase().replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Report Generated",
        description: `${reportType} report has been downloaded`,
      })
    }, 2000)
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="elastic-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold elastic-gradient-text mb-2">Accounting</h1>
            <p className="text-slate-600 text-lg">Financial management and ERP integration</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportToQuickBooks} className="elastic-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export to QuickBooks
            </Button>
            <Button variant="outline" onClick={handleExportToXero} className="elastic-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export to Xero
            </Button>
            <Button 
              onClick={handleSyncERP} 
              disabled={syncInProgress}
              className="elastic-button-primary"
            >
              {syncInProgress ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync ERP
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 elastic-slide-up">
        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">$2.85M</p>
              <p className="text-xs text-slate-500">+12.5% from last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Net Profit</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">$1.61M</p>
              <p className="text-xs text-slate-500">56.6% margin</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Invoices</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">23</p>
              <p className="text-xs text-slate-500">$456,200 total</p>
            </div>
            <FileText className="h-8 w-8 text-amber-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">ERP Sync Status</p>
              <div className="flex items-center space-x-2 mt-1">
                {syncInProgress ? (
                  <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                )}
                <span className="text-sm font-medium text-slate-900">
                  {syncInProgress ? 'Syncing...' : 'Up to date'}
                </span>
              </div>
              <p className="text-xs text-slate-500">Last sync: {lastSyncTime}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="elastic-card elastic-slide-up">
        <CardHeader>
          <CardTitle className="elastic-gradient-text">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleGenerateReport('Profit & Loss')}
              className="h-20 flex-col space-y-2 elastic-button-secondary"
            >
              <FileText className="h-6 w-6" />
              <span>Generate P&L Report</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleGenerateReport('Balance Sheet')}
              className="h-20 flex-col space-y-2 elastic-button-secondary"
            >
              <TrendingUp className="h-6 w-6" />
              <span>Generate Balance Sheet</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleGenerateReport('Cash Flow')}
              className="h-20 flex-col space-y-2 elastic-button-secondary"
            >
              <DollarSign className="h-6 w-6" />
              <span>Generate Cash Flow</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card className="elastic-card elastic-slide-up">
        <CardContent>
          <Tabs defaultValue="erp-sync" className="w-full">
            <TabsList className="bg-slate-100 p-1 rounded-xl w-full grid grid-cols-3 mb-6 h-12">
              <TabsTrigger 
                value="erp-sync" 
                className="rounded-lg text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-200"
              >
                ERP Sync
              </TabsTrigger>
              <TabsTrigger 
                value="journal-entries" 
                className="rounded-lg text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-200"
              >
                Journal Entries
              </TabsTrigger>
              <TabsTrigger 
                value="tax-center" 
                className="rounded-lg text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-200"
              >
                Tax Center
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="erp-sync">
              <ERPSync />
            </TabsContent>
            
            <TabsContent value="journal-entries">
              <JournalEntries />
            </TabsContent>
            
            <TabsContent value="tax-center">
              <TaxCenter />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Accounting
