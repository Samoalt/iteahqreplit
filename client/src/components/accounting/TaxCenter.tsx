
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, FileText, Download, DollarSign, AlertTriangle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const taxReturns = [
  { period: "January 2024", type: "VAT Return", status: "filed", dueDate: "2024-02-20", amount: 24580 },
  { period: "February 2024", type: "VAT Return", status: "pending", dueDate: "2024-03-20", amount: 28450 },
  { period: "Q4 2023", type: "Income Tax", status: "filed", dueDate: "2024-01-31", amount: 45600 },
  { period: "Q1 2024", type: "Income Tax", status: "draft", dueDate: "2024-04-30", amount: 0 },
]

const taxCalculations = [
  { description: "Tea Sales - Standard Rate", rate: "16%", taxable: 156750, tax: 25080 },
  { description: "Export Sales - Zero Rate", rate: "0%", taxable: 89430, tax: 0 },
  { description: "Input VAT - Purchases", rate: "16%", taxable: -45200, tax: -7232 },
  { description: "Input VAT - Expenses", rate: "16%", taxable: -12800, tax: -2048 },
]

export const TaxCenter = () => {
  const handleFileReturn = (period: string) => {
    toast({
      title: "Filing Tax Return",
      description: `Processing ${period} tax return...`,
    })
    console.log(`Filing tax return for ${period}`)
  }

  const handleGenerateReport = (type: string) => {
    toast({
      title: "Generating Report",
      description: `Creating ${type} report...`,
    })
    console.log(`Generating ${type} report`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'filed': return 'elastic-badge-success'
      case 'pending': return 'elastic-badge-warning'
      case 'draft': return 'elastic-badge-info'
      case 'overdue': return 'elastic-badge-error'
      default: return 'elastic-badge-info'
    }
  }

  const totalTaxLiability = taxCalculations.reduce((sum, calc) => sum + calc.tax, 0)

  return (
    <div className="space-y-6">
      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Current VAT</p>
              <p className="text-2xl font-bold text-slate-900 font-numeric">$15,800</p>
            </div>
            <div className="p-3 rounded-xl elastic-gradient-accent group-hover:scale-110 transition-transform duration-300">
              <Calculator className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tax Wallet</p>
              <p className="text-2xl font-bold text-emerald-600 font-numeric">$25,000</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Pending Returns</p>
              <p className="text-2xl font-bold text-amber-600 font-numeric">2</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500 group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-red-600 font-numeric">0</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500 group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tax Returns */}
      <div className="elastic-card">
        <CardHeader className="elastic-card-header border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl font-display">
              <FileText className="h-5 w-5 mr-2 text-elastic-teal-600" />
              Tax Returns
            </CardTitle>
            <Button onClick={() => handleGenerateReport('Tax Summary')} className="elastic-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {taxReturns.map((taxReturn, index) => (
              <div key={index} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300 elastic-hover-lift">
                <div>
                  <p className="font-semibold text-slate-900">{taxReturn.period}</p>
                  <p className="text-sm text-slate-600">{taxReturn.type}</p>
                  <p className="text-sm text-slate-500">Due: {taxReturn.dueDate}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-slate-900 font-numeric">
                    ${taxReturn.amount.toLocaleString()}
                  </span>
                  <span className={`elastic-badge ${getStatusBadge(taxReturn.status)}`}>
                    {taxReturn.status}
                  </span>
                  {taxReturn.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => handleFileReturn(taxReturn.period)}
                      className="elastic-button-primary"
                    >
                      File Return
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      {/* Tax Calculations */}
      <div className="elastic-card">
        <CardHeader className="elastic-card-header border-b border-slate-200 pb-6">
          <CardTitle className="flex items-center text-xl font-display">
            <Calculator className="h-5 w-5 mr-2 text-elastic-teal-600" />
            Current Period Tax Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {taxCalculations.map((calc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-300">
                <div>
                  <p className="font-semibold text-slate-900">{calc.description}</p>
                  <p className="text-sm text-slate-600">Rate: {calc.rate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 font-numeric">${calc.taxable.toLocaleString()}</p>
                  <p className={`text-sm font-medium font-numeric ${calc.tax >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    ${Math.abs(calc.tax).toLocaleString()} {calc.tax >= 0 ? 'owed' : 'credit'}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex justify-between items-center p-4 rounded-xl elastic-gradient-secondary">
                <span className="font-bold text-slate-900 text-lg">Net Tax Liability:</span>
                <span className={`font-bold text-xl font-numeric ${totalTaxLiability >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  ${Math.abs(totalTaxLiability).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  )
}
