
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, CheckCircle, Split, Calculator, Phone, Mail, MapPin, Loader2 } from "lucide-react"
import { Bid } from "@/types/bid"
import { useToast } from "@/hooks/use-toast"
import { EmailComposerModal } from "./modals/EmailComposerModal"
import { ContactModal } from "./modals/ContactModal"
import { generateESlipContent, createBlobDownload } from "@/utils/fileOperations"

interface BidOverviewTabProps {
  bid: Bid
}

export const BidOverviewTab = ({ bid }: BidOverviewTabProps) => {
  const { toast } = useToast()
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [loadingStates, setLoadingStates] = useState({
    downloadESlip: false,
    markPaid: false,
    initiateSplit: false,
    simulateSplit: false
  })

  const setLoading = (action: keyof typeof loadingStates, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [action]: loading }))
  }

  const handleDownloadESlip = async () => {
    setLoading('downloadESlip', true)
    try {
      const eSlipContent = generateESlipContent(bid)
      createBlobDownload(eSlipContent, `e-slip-${bid.id}.txt`)
      toast({
        title: "E-Slip Downloaded",
        description: `E-Slip for ${bid.id} has been downloaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download E-Slip. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('downloadESlip', false)
    }
  }

  const handleMarkAsPaid = async () => {
    setLoading('markPaid', true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: "Payment Status Updated",
        description: `Bid ${bid.id} has been marked as paid`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('markPaid', false)
    }
  }

  const handleInitiateSplit = async () => {
    setLoading('initiateSplit', true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Split Processing Initiated",
        description: `Split processing for ${bid.id} has been started`,
      })
    } catch (error) {
      toast({
        title: "Initiation Failed",
        description: "Failed to initiate split processing. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('initiateSplit', false)
    }
  }

  const handleSimulateSplit = async () => {
    setLoading('simulateSplit', true)
    try {
      // Simulate calculation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const factoryShare = bid.amount * 0.85
      const platformFee = bid.amount * 0.15
      
      toast({
        title: "Split Simulation Complete",
        description: `Factory: $${factoryShare.toLocaleString()}, Platform: $${platformFee.toLocaleString()}`,
      })
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "Failed to simulate split. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading('simulateSplit', false)
    }
  }

  const handleCallBuyer = () => {
    setIsContactModalOpen(true)
  }

  const handleEmailBuyer = () => {
    setIsEmailModalOpen(true)
  }

  // Financial calculations
  const unitPrice = bid.pricePerKg
  const totalKgs = bid.quantity * 50 // Assuming 50kg per package
  const subtotal = totalKgs * unitPrice
  const vatRate = 0.16 // 16% VAT
  const brokerFeeRate = bid.broker ? 0.02 : 0 // 2% broker fee if broker exists
  const txnChargeRate = 0.005 // 0.5% transaction charges
  
  const vatAmount = subtotal * vatRate
  const brokerFeeAmount = subtotal * brokerFeeRate
  const txnChargeAmount = subtotal * txnChargeRate
  const totalDeductions = vatAmount + brokerFeeAmount + txnChargeAmount
  const finalTotal = subtotal + totalDeductions

  // Mock buyer data - in real app this would come from buyer database
  const buyerProfile = {
    email: `${bid.buyerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: '+254 700 123 456',
    address: 'Nairobi, Kenya',
    paymentMethod: 'Bank Transfer',
    creditRating: 'A+',
    totalBids: 12,
    completedBids: 8,
    isVerified: true,
    company: `${bid.buyerName} Trading Ltd`,
    lastContact: 'Called 2 days ago - Payment confirmed',
    preferredMethod: 'Email'
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions - Workflow Specific */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleDownloadESlip} 
              variant="outline"
              disabled={loadingStates.downloadESlip}
            >
              {loadingStates.downloadESlip ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {loadingStates.downloadESlip ? "Generating..." : "Download E-Slip"}
            </Button>
            <Button 
              onClick={handleMarkAsPaid} 
              variant="outline"
              disabled={['payment-matching', 'split-processing', 'payout-approval', 'tea-release'].includes(bid.status) || loadingStates.markPaid}
            >
              {loadingStates.markPaid ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {loadingStates.markPaid ? "Updating..." : "Mark as Paid"}
            </Button>
            <Button 
              onClick={handleInitiateSplit} 
              variant="outline"
              disabled={!['payment-matching', 'split-processing'].includes(bid.status) || loadingStates.initiateSplit}
            >
              {loadingStates.initiateSplit ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Split className="w-4 h-4 mr-2" />
              )}
              {loadingStates.initiateSplit ? "Initiating..." : "Initiate Split Processing"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bid Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bid Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bid Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Bid Date</span>
                <span className="text-sm font-medium text-slate-900">
                  {new Date(bid.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Factory Name</span>
                <span className="text-sm font-medium text-slate-900">{bid.factory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Lot ID</span>
                <span className="text-sm font-medium text-slate-900">{bid.lotId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Grade</span>
                <span className="text-sm font-medium text-slate-900">{bid.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Quantity</span>
                <span className="text-sm font-medium text-slate-900">{bid.quantity} packages</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Price per Kg</span>
                <span className="text-sm font-medium text-slate-900">${bid.pricePerKg}</span>
              </div>
              {bid.broker && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Broker</span>
                  <span className="text-sm font-medium text-slate-900">{bid.broker}</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Amount</span>
                <span className="text-2xl font-bold text-slate-900">
                  ${bid.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Buyer Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Buyer Information
              {buyerProfile.isVerified && (
                <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">{bid.buyerName}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-slate-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {buyerProfile.email}
                </div>
                <div className="flex items-center text-slate-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {buyerProfile.phone}
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {buyerProfile.address}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Credit Rating</span>
                <p className="font-medium text-slate-900">{buyerProfile.creditRating}</p>
              </div>
              <div>
                <span className="text-slate-500">Payment Method</span>
                <p className="font-medium text-slate-900">{buyerProfile.paymentMethod}</p>
              </div>
              <div>
                <span className="text-slate-500">Total Bids</span>
                <p className="font-medium text-slate-900">{buyerProfile.totalBids}</p>
              </div>
              <div>
                <span className="text-slate-500">Completed</span>
                <p className="font-medium text-slate-900">{buyerProfile.completedBids}</p>
              </div>
            </div>

            <Separator />

            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={handleCallBuyer}>
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={handleEmailBuyer}>
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary - Table Style */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">Unit Price (per kg)</td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right">${unitPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-600">Packages</td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right">{bid.quantity}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">Total Kg</td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right">{totalKgs.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">Subtotal</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">${subtotal.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 text-sm text-slate-600">VAT ({(vatRate * 100).toFixed(0)}%)</td>
                    <td className="px-4 py-3 text-sm text-red-700 text-right">${vatAmount.toLocaleString()}</td>
                  </tr>
                  {bid.broker && (
                    <tr className="bg-red-50">
                      <td className="px-4 py-3 text-sm text-slate-600">Broker Fee ({(brokerFeeRate * 100).toFixed(1)}%)</td>
                      <td className="px-4 py-3 text-sm text-red-700 text-right">${brokerFeeAmount.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 text-sm text-slate-600">Transaction Charges ({(txnChargeRate * 100).toFixed(1)}%)</td>
                    <td className="px-4 py-3 text-sm text-red-700 text-right">${txnChargeAmount.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-green-50 border-t-2 border-green-200">
                    <td className="px-4 py-3 text-lg font-semibold text-slate-900">Final Total</td>
                    <td className="px-4 py-3 text-lg font-bold text-green-700 text-right">${finalTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleSimulateSplit}
              disabled={loadingStates.simulateSplit}
            >
              {loadingStates.simulateSplit ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calculator className="w-4 h-4 mr-2" />
              )}
              {loadingStates.simulateSplit ? "Calculating..." : "Simulate Split Breakdown"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      {bid.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-700">{bid.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <EmailComposerModal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        recipientName={bid.buyerName}
        recipientEmail={buyerProfile.email}
        bidId={bid.id}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        contactType="buyer"
        contactName={bid.buyerName}
        contactInfo={buyerProfile}
        bidId={bid.id}
      />
    </div>
  )
}
