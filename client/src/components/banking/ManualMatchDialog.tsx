
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, CreditCard, FileText, CheckCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface Payment {
  id: string
  amount: number
  payer: string
  reference: string
  date: string
}

interface Invoice {
  id: string
  buyer: string
  amount: number
  reference: string
  status: 'unpaid' | 'paid'
  dueDate: string
}

interface ManualMatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPayment?: Payment | null
  onMatchConfirmed?: (paymentId: string, invoice: Invoice) => void
}

const mockInvoices: Invoice[] = [
  { id: "INV-001", buyer: "Global Tea Co.", amount: 45200, reference: "ESL-2024-001", status: "unpaid", dueDate: "2024-01-20" },
  { id: "INV-002", buyer: "Premium Buyers Ltd", amount: 28950, reference: "ESL-2024-003", status: "unpaid", dueDate: "2024-01-22" },
  { id: "INV-003", buyer: "Tea Traders Inc.", amount: 67100, reference: "ESL-2024-002", status: "paid", dueDate: "2024-01-18" },
  { id: "INV-004", buyer: "Export Partners", amount: 19800, reference: "ESL-2024-004", status: "unpaid", dueDate: "2024-01-25" },
]

export const ManualMatchDialog = ({ open, onOpenChange, selectedPayment, onMatchConfirmed }: ManualMatchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  
  const filteredInvoices = mockInvoices.filter(invoice =>
    invoice.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.reference.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMatch = () => {
    if (!selectedPayment || !selectedInvoice) {
      toast({
        title: "Selection Required",
        description: "Please select both a payment and an invoice to match",
        variant: "destructive"
      })
      return
    }

    console.log(`Matching payment ${selectedPayment.id} with invoice ${selectedInvoice.id}`)
    
    // Call the callback to update the parent component
    if (onMatchConfirmed) {
      onMatchConfirmed(selectedPayment.id, selectedInvoice)
    }
    
    toast({
      title: "Match Successful",
      description: `Payment ${selectedPayment.reference} matched with invoice ${selectedInvoice.reference}`,
    })
    
    handleClose()
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedInvoice(null)
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-elastic-xl">
        <DialogHeader className="pb-6 border-b border-slate-200">
          <DialogTitle className="text-2xl font-display elastic-gradient-text">Manual Payment Matching</DialogTitle>
          <DialogDescription className="text-slate-600">
            Select an invoice to match with the payment below
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
          {/* Selected Payment */}
          <div className="space-y-6">
            <h3 className="font-semibold flex items-center text-lg">
              <div className="p-2 rounded-xl elastic-gradient-primary mr-3">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              Selected Payment
            </h3>
            {selectedPayment ? (
              <div className="elastic-card border-2 border-blue-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Amount:</span>
                    <span className="text-xl font-bold elastic-gradient-text">${selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">From:</span>
                    <span className="font-semibold text-slate-900">{selectedPayment.payer}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Reference:</span>
                    <span className="font-medium text-slate-700">{selectedPayment.reference || 'No reference'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Date:</span>
                    <span className="font-medium text-slate-700">{selectedPayment.date}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="elastic-card border-2 border-red-200 bg-red-50/50">
                <div className="text-center">
                  <div className="p-3 rounded-full bg-red-100 w-fit mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="font-semibold text-red-700 mb-2">No payment selected</p>
                  <p className="text-sm text-red-600">Please select a payment from the inflows list first</p>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Selection */}
          <div className="space-y-6">
            <h3 className="font-semibold flex items-center text-lg">
              <div className="p-2 rounded-xl elastic-gradient-accent mr-3">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Select Invoice to Match
            </h3>
            
            <div className="elastic-search">
              <Search className="search-icon h-5 w-5" />
              <Input
                placeholder="Search invoices by buyer or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="elastic-input pl-12 border-2 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`elastic-card cursor-pointer transition-all duration-300 ${
                    selectedInvoice?.id === invoice.id
                      ? 'border-2 border-blue-500 bg-blue-50/50 shadow-elastic-lg'
                      : 'border border-slate-200 hover:border-blue-300 hover:shadow-elastic'
                  }`}
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">{invoice.reference}</p>
                      <p className="text-sm text-slate-600">{invoice.buyer}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedInvoice?.id === invoice.id && (
                        <div className="p-1 rounded-full bg-blue-500">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <Badge className={invoice.status === 'paid' ? 'elastic-badge-success' : 'elastic-badge-warning'}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-900">${invoice.amount.toLocaleString()}</span>
                    <span className="text-slate-500">Due: {invoice.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Match Summary */}
        {selectedPayment && selectedInvoice && (
          <div className="elastic-card border-2 border-green-200 bg-green-50/50 elastic-slide-up">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Match Summary
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-slate-700">
                <span className="font-medium">Payment:</span> ${selectedPayment.amount.toLocaleString()} from {selectedPayment.payer}
              </p>
              <p className="text-slate-700">
                <span className="font-medium">Invoice:</span> {selectedInvoice.reference} - ${selectedInvoice.amount.toLocaleString()}
              </p>
              <p className={`font-semibold ${Math.abs(selectedPayment.amount - selectedInvoice.amount) < 100 ? 'text-green-700' : 'text-amber-700'}`}>
                Amount Difference: ${Math.abs(selectedPayment.amount - selectedInvoice.amount).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
          <Button variant="outline" onClick={handleClose} className="elastic-button-secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleMatch}
            disabled={!selectedPayment || !selectedInvoice}
            className="elastic-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Match
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
