
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Send } from "lucide-react"
import { ESlipDocument } from "./documents/ESlipDocument"
import { TeaReleaseCertificate } from "./documents/TeaReleaseCertificate"

interface DocumentManagerProps {
  bidId: string
  buyerName: string
  trigger?: React.ReactNode
}

export const DocumentManager = ({ bidId, buyerName, trigger }: DocumentManagerProps) => {
  const [open, setOpen] = useState(false)

  // Mock data for E-Slip
  const eslipData = {
    eslipNo: `ESL-${bidId}-001`,
    dateIssued: new Date().toISOString().split('T')[0],
    status: 'pending' as const,
    buyer: {
      name: buyerName,
      company: `${buyerName} Ltd`,
      email: `contact@${buyerName.toLowerCase().replace(' ', '')}.com`,
      phone: "+254-XXX-XXXX",
      code: "BUY001"
    },
    auction: {
      date: "2024-01-15",
      id: "AUC-2024-001",
      lotsWon: 45,
      totalWeight: 21.0,
      totalAmount: 67500
    },
    lots: [
      {
        lotNo: "LOT001",
        factoryName: "Kericho Tea Estate",
        quantity: 10.5,
        pricePerMT: 3200,
        total: 33600
      },
      {
        lotNo: "LOT002", 
        factoryName: "Nandi Hills Tea",
        quantity: 10.5,
        pricePerMT: 3228,
        total: 33894
      }
    ],
    paymentInstructions: {
      payableTo: "iTea HQ Clearing Bank",
      bankName: "Kenya Commercial Bank",
      accountNumber: "1234567890",
      swiftCode: "KCBLKENX"
    },
    dueDate: "2024-02-15"
  }

  // Mock data for Release Certificate
  const releaseData = {
    certificateNo: `TRC-${bidId}-001`,
    dateIssued: new Date().toISOString().split('T')[0],
    buyer: {
      name: buyerName,
      code: "BUY001"
    },
    payment: {
      refNo: `PAY-${bidId}-001`,
      amount: 67500,
      status: 'confirmed' as const
    },
    lots: [
      {
        lotNo: "LOT001",
        factoryName: "Kericho Tea Estate", 
        grade: "PEKOE",
        quantity: 10.5,
        releaseStatus: 'released' as const
      },
      {
        lotNo: "LOT002",
        factoryName: "Nandi Hills Tea",
        grade: "FBOP", 
        quantity: 10.5,
        releaseStatus: 'released' as const
      }
    ],
    warehouse: {
      name: "Mombasa Tea Warehouse",
      address: "Industrial Area, Mombasa, Kenya",
      contactPerson: "John Warehouse",
      phone: "+254-XXX-XXXX"
    },
    signatures: {
      iteaAuthorized: "Authorized on " + new Date().toISOString().split('T')[0],
      warehouseManager: "Confirmed on " + new Date().toISOString().split('T')[0],
      dateOfCollection: new Date().toISOString().split('T')[0]
    }
  }

  const handleDownloadESlip = () => {
    console.log(`Downloading E-Slip for ${bidId}`)
    // In a real app, this would generate and download a PDF
  }

  const handleResendESlip = () => {
    console.log(`Resending E-Slip for ${bidId}`)
    // In a real app, this would send the E-Slip via email
  }

  const handleDownloadCertificate = () => {
    console.log(`Downloading Release Certificate for ${bidId}`)
    // In a real app, this would generate and download a PDF
  }

  const handleResendCertificate = () => {
    console.log(`Sending Release Certificate to warehouse for ${bidId}`)
    // In a real app, this would send the certificate to the warehouse
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            View Documents
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Document Management - {bidId}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="eslip" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger 
              value="eslip"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
            >
              E-Slip Invoice
            </TabsTrigger>
            <TabsTrigger 
              value="certificate"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700"
            >
              Release Certificate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="eslip" className="mt-4">
            <ESlipDocument 
              data={eslipData}
              onDownload={handleDownloadESlip}
              onResend={handleResendESlip}
            />
          </TabsContent>

          <TabsContent value="certificate" className="mt-4">
            <TeaReleaseCertificate 
              data={releaseData}
              onDownload={handleDownloadCertificate}
              onResend={handleResendCertificate}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
