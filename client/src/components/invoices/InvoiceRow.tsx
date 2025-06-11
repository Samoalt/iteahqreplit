import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Wallet, University, FileText, Check, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PDFGenerator } from "@/lib/pdfGenerator";
import { Invoice, Lot } from "@shared/schema";

interface InvoiceRowProps {
  invoice: Invoice;
}

export default function InvoiceRow({ invoice }: InvoiceRowProps) {
  const [isPayDropdownOpen, setIsPayDropdownOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get lot data for PDF generation
  const { data: lots } = useQuery({
    queryKey: ["/api/lots"],
  });

  const payInvoiceMutation = useMutation({
    mutationFn: async (method: string) => {
      return apiRequest("POST", `/api/invoices/${invoice.invoiceNumber}/pay`, { method });
    },
    onSuccess: (_, method) => {
      toast({
        title: "Payment Processed",
        description: `Invoice ${invoice.invoiceNumber} paid via ${method}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setIsPayDropdownOpen(false);
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-status-amber text-white";
      case "in_clearing":
        return "bg-status-blue text-white";
      case "paid":
        return "bg-status-green text-white";
      default:
        return "bg-status-grey text-white";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in_clearing":
        return "In Clearing";
      case "paid":
        return "Paid";
      default:
        return status;
    }
  };

  const handlePayment = (method: string) => {
    payInvoiceMutation.mutate(method);
  };

  const handleDownloadPDF = () => {
    // Mock PDF download
    toast({
      title: "PDF Downloaded",
      description: `Invoice ${invoice.invoiceNumber}.pdf has been downloaded`,
    });
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
        {invoice.invoiceNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {invoice.lotIds.join(", ")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
        ${parseFloat(invoice.amountUSD).toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge className={getStatusColor(invoice.status)}>
          {getStatusLabel(invoice.status)}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        {invoice.status === "pending" && (
          <DropdownMenu open={isPayDropdownOpen} onOpenChange={setIsPayDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                className="bg-accent hover:bg-accent/90"
                disabled={payInvoiceMutation.isPending}
              >
                {payInvoiceMutation.isPending ? "Processing..." : "Pay"}
                <ChevronDown className="ml-1 w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handlePayment("wallet")}>
                <Wallet className="mr-2 w-4 h-4" />
                Wallet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePayment("wire")}>
                <University className="mr-2 w-4 h-4" />
                Wire (E-Slip)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {invoice.status === "in_clearing" && (
          <span className="text-slate-400">Processing...</span>
        )}
        
        {invoice.status === "paid" && (
          <span className="text-status-green">
            <Check className="inline w-4 h-4 mr-1" /> Completed
          </span>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDownloadPDF}
          className="text-accent hover:text-accent/80"
        >
          <FileText className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
