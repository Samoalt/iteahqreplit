
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Printer, Send, FileText } from "lucide-react"
import { Bid } from "@/types/bid"

interface ESlipPreviewModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bid: Bid
  onDownload?: () => void
  onPrint?: () => void
  onSend?: () => void
}

export const ESlipPreviewModal = ({ 
  isOpen, 
  onOpenChange, 
  bid,
  onDownload,
  onPrint,
  onSend
}: ESlipPreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            E-Slip Preview - {bid.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* E-Slip Document Preview */}
          <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">iTEA PLATFORM</h1>
              <p className="text-lg text-slate-600 mt-2">Electronic Sale Slip</p>
              <p className="text-sm text-slate-500 mt-1">Document No: E-{bid.id}</p>
            </div>
            
            <Separator className="my-6" />
            
            {/* Main Content */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                  Bid Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Bid ID:</span>
                    <span className="font-medium">{bid.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium">{new Date(bid.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lot ID:</span>
                    <span className="font-medium">{bid.lotId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Grade:</span>
                    <span className="font-medium">{bid.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tea Type:</span>
                    <span className="font-medium">{bid.teaType || 'Black Tea'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                  Transaction Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Buyer:</span>
                    <span className="font-medium">{bid.buyerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Factory:</span>
                    <span className="font-medium">{bid.factory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Quantity:</span>
                    <span className="font-medium">{bid.quantity} packages</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Weight:</span>
                    <span className="font-medium">{bid.quantity * 50} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Rate:</span>
                    <span className="font-medium">${bid.pricePerKg}/kg</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Amount Section */}
            <div className="bg-slate-50 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-900">Total Amount:</span>
                <span className="text-2xl font-bold text-slate-900">${bid.amount.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Terms & Conditions */}
            <div className="mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">Terms & Conditions</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Payment: Cash on Delivery (COD)</li>
                <li>• Pricing: Ex-Warehouse</li>
                <li>• Quality: As per approved sample</li>
                <li>• Delivery: Within 7 days of payment confirmation</li>
                <li>• Warehouse: {bid.warehouseLocation || 'Main Warehouse A'}</li>
              </ul>
            </div>
            
            <Separator className="my-6" />
            
            {/* Footer */}
            <div className="text-center text-xs text-slate-500 space-y-1">
              <p>Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              <p>This is an electronically generated document and does not require a signature.</p>
              <p>For queries, contact: support@itea-platform.com</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={onSend}>
              <Send className="w-4 h-4 mr-2" />
              Send to Buyer
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
