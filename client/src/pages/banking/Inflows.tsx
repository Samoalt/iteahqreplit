
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDownRight, DollarSign, Clock, CheckCircle, Search, Filter, X, TrendingDown, Zap } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { autoMatchPayments, manualMatch } from "@/utils/paymentMatching"
import { ManualMatchDialog } from "@/components/banking/ManualMatchDialog"
import { usePaymentInflows } from "@/contexts/PaymentInflowsContext"

const Inflows = () => {
  const { inflows, matchPayment, getUnmatchedInflows } = usePaymentInflows()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInflow, setSelectedInflow] = useState<string | null>(null)
  const [matchReference, setMatchReference] = useState("")
  const [showManualMatchDialog, setShowManualMatchDialog] = useState(false)
  const [selectedPaymentForMatch, setSelectedPaymentForMatch] = useState<any>(null)

  const filteredInflows = inflows.filter(inflow => 
    inflow.payer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inflow.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inflow.bankRef.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMatch = (inflowId: string) => {
    if (!matchReference.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reference to match against",
        variant: "destructive"
      })
      return
    }

    const result = manualMatch(inflowId, matchReference)
    
    toast({
      title: "Payment Matched",
      description: result.message,
    })
    
    setSelectedInflow(null)
    setMatchReference("")
  }

  const handleAutoMatch = () => {
    const outstandingBids = [
      { id: "BID001", buyer: "Global Tea Co.", amount: 45200, eslipRef: "ESL-2024-001" },
      { id: "BID002", buyer: "Premium Buyers", amount: 28950, eslipRef: "ESL-2024-003" },
    ]
    
    const matches = autoMatchPayments(inflows, outstandingBids)
    
    toast({
      title: "Auto-Match Complete",
      description: `Found ${matches.length} potential matches. Review and confirm matches.`,
    })
    
    console.log('Auto-match results:', matches)
  }

  const handleManualMatchClick = () => {
    const unmatchedPayments = getUnmatchedInflows()
    if (unmatchedPayments.length === 0) {
      toast({
        title: "No Unmatched Payments",
        description: "All payments are already matched or pending",
        variant: "destructive"
      })
      return
    }
    
    setSelectedPaymentForMatch(unmatchedPayments[0])
    setShowManualMatchDialog(true)
  }

  const handleQuickMatch = (inflow: any) => {
    console.log('Quick match selected payment:', inflow)
    setSelectedPaymentForMatch(inflow)
    setShowManualMatchDialog(true)
  }

  const handleDialogClose = (open: boolean) => {
    setShowManualMatchDialog(open)
    if (!open) {
      setSelectedPaymentForMatch(null)
    }
  }

  const handleMatchConfirmed = (paymentId: string, invoice: any) => {
    matchPayment(paymentId, invoice)
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="elastic-slide-up">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-display font-bold elastic-gradient-text mb-2">Payment Inflows</h1>
            <p className="text-slate-600 text-lg">Payment matching and reconciliation dashboard</p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <Button onClick={handleAutoMatch} className="elastic-button-secondary">
              <Zap className="h-4 w-4 mr-2" />
              Auto-Match
            </Button>
            <Button onClick={handleManualMatchClick} className="elastic-button-primary">
              <TrendingDown className="h-4 w-4 mr-2" />
              Manual Match
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 elastic-slide-up">
        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Inflows Today</p>
              <p className="text-2xl font-bold elastic-gradient-text">$195,550</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">↗ +12.5% from yesterday</p>
            </div>
            <div className="p-3 rounded-xl elastic-gradient-primary group-hover:scale-110 transition-transform duration-300">
              <ArrowDownRight className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Auto-Matched</p>
              <p className="text-2xl font-bold text-emerald-600">{inflows.filter(i => i.status === 'matched').length}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Successfully processed</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Unmatched</p>
              <p className="text-2xl font-bold text-amber-600">{inflows.filter(i => i.status === 'unmatched').length}</p>
              <p className="text-xs text-amber-600 font-medium mt-1">Requires attention</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="elastic-metric-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Match Rate</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round((inflows.filter(i => i.status === 'matched').length / inflows.length) * 100)}%</p>
              <p className="text-xs text-blue-600 font-medium mt-1">Above target</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Matching Table */}
      <div className="elastic-card elastic-slide-up">
        <CardHeader className="elastic-card-header border-b border-slate-200 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <CardTitle className="text-xl font-display">Payment Matching</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="elastic-search">
                <Search className="search-icon h-4 w-4" />
                <Input
                  placeholder="Search by payer, reference, or bank ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 elastic-input pl-10"
                />
              </div>
              <Button variant="outline" size="sm" className="elastic-button-outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {filteredInflows.map((inflow, index) => (
              <div key={inflow.id} className={`p-6 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-all duration-200 ${index === 0 ? 'elastic-slide-up' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      inflow.status === 'matched' ? 'bg-emerald-100' :
                      inflow.status === 'unmatched' ? 'bg-red-100' : 'bg-amber-100'
                    }`}>
                      <ArrowDownRight className={`h-5 w-5 ${
                        inflow.status === 'matched' ? 'text-emerald-600' :
                        inflow.status === 'unmatched' ? 'text-red-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-lg">${inflow.amount.toLocaleString()}</p>
                      <p className="text-sm text-slate-600">from {inflow.payer}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-slate-500">Bank Ref: {inflow.bankRef}</p>
                        {inflow.reference && (
                          <p className="text-xs text-slate-500">Invoice Ref: {inflow.reference}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`elastic-badge ${
                        inflow.status === 'matched' ? 'elastic-badge-success' :
                        inflow.status === 'unmatched' ? 'elastic-badge-error' :
                        'elastic-badge-warning'
                      }`}>
                        {inflow.status}
                      </span>
                      <p className="text-xs text-slate-500 mt-2">{inflow.date}</p>
                    </div>
                    {inflow.status === 'unmatched' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleQuickMatch(inflow)}
                        className="elastic-button-primary text-sm px-4 py-2"
                      >
                        Match
                      </Button>
                    )}
                  </div>
                </div>
                
                {selectedInflow === inflow.id && (
                  <div className="mt-6 p-5 bg-blue-50 rounded-xl border-l-4 border-blue-500 elastic-slide-up">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-900">Match Payment</h4>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedInflow(null)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Input
                        placeholder="Enter invoice/order reference..."
                        value={matchReference}
                        onChange={(e) => setMatchReference(e.target.value)}
                        className="flex-1 elastic-input"
                      />
                      <Button onClick={() => handleMatch(inflow.id)} className="elastic-button-primary">
                        Confirm Match
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      <ManualMatchDialog 
        open={showManualMatchDialog}
        onOpenChange={handleDialogClose}
        selectedPayment={selectedPaymentForMatch}
        onMatchConfirmed={handleMatchConfirmed}
      />
    </div>
  )
}

export default Inflows
