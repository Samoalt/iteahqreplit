
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, QrCode, Building2, Link, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ReceivePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: {
    currency: string;
    balance: string;
    account: string;
    bank: string;
  };
}

export const ReceivePaymentModal = ({ open, onOpenChange, wallet }: ReceivePaymentModalProps) => {
  const [requestAmount, setRequestAmount] = useState("");
  const [requestPurpose, setRequestPurpose] = useState("");
  const [requestDueDate, setRequestDueDate] = useState("");

  const bankDetails = {
    bankName: wallet.bank,
    accountNumber: wallet.account.replace('*', '') + "1234567890",
    accountName: "Your Business Name Ltd",
    currency: wallet.currency,
    swiftCode: wallet.currency === 'USD' ? 'CHASUS33' : wallet.currency === 'KES' ? 'KCBLKENX' : 'SBICGB2L',
    sortCode: wallet.currency === 'GBP' ? '12-34-56' : undefined,
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const generatePaymentLink = () => {
    const paymentData = {
      amount: requestAmount,
      currency: wallet.currency,
      purpose: requestPurpose,
      dueDate: requestDueDate,
      paymentId: `PAY-${Date.now()}`,
    };

    const link = `${window.location.origin}/pay?data=${encodeURIComponent(JSON.stringify(paymentData))}`;
    copyToClipboard(link, "Payment link");
  };

  const downloadPaymentInstructions = () => {
    toast({
      title: "Download Started",
      description: "Payment instruction slip is being generated",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Receive Payment - {wallet.currency} Wallet
          </DialogTitle>
          <p className="text-sm font-medium text-slate-600">Share payment details or create payment requests</p>
        </DialogHeader>

        <Tabs defaultValue="bank-details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1">
            <TabsTrigger value="bank-details" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              Bank Transfer
            </TabsTrigger>
            <TabsTrigger value="payment-request" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              Payment Request
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank-details" className="space-y-4">
            <Card className="bg-white border-slate-300 hover:border-slate-400 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-900">
                  <Building2 className="h-5 w-5 text-elastic-navy-600" />
                  <span>Bank Account Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-slate-700">Bank Name</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={bankDetails.bankName} readOnly className="bg-slate-50 border-slate-300 text-slate-900" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(bankDetails.bankName, "Bank name")}
                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-slate-700">Account Number</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={bankDetails.accountNumber} readOnly className="bg-slate-50 border-slate-300 text-slate-900" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(bankDetails.accountNumber, "Account number")}
                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-slate-700">Account Name</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={bankDetails.accountName} readOnly className="bg-slate-50 border-slate-300 text-slate-900" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(bankDetails.accountName, "Account name")}
                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium text-slate-700">Currency</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={bankDetails.currency} readOnly className="bg-slate-50 border-slate-300 text-slate-900" />
                      <Badge variant="secondary" className="bg-slate-100 text-slate-900 border-slate-300">{bankDetails.currency}</Badge>
                    </div>
                  </div>

                  {bankDetails.swiftCode && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium text-slate-700">SWIFT Code</Label>
                      <div className="flex items-center space-x-2">
                        <Input value={bankDetails.swiftCode} readOnly className="bg-slate-50 border-slate-300 text-slate-900" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(bankDetails.swiftCode!, "SWIFT code")}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {bankDetails.sortCode && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium text-slate-700">Sort Code</Label>
                      <div className="flex items-center space-x-2">
                        <Input value={bankDetails.sortCode} readOnly className="bg-slate-50 border-slate-300 text-slate-900" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(bankDetails.sortCode!, "Sort code")}
                          className="border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={downloadPaymentInstructions} className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50">
                    <Download className="h-4 w-4 mr-2" />
                    Download Payment Slip
                  </Button>
                  <Button
                    onClick={() => {
                      const allDetails = `${bankDetails.bankName}\nAccount: ${bankDetails.accountNumber}\nName: ${bankDetails.accountName}\nCurrency: ${bankDetails.currency}${bankDetails.swiftCode ? `\nSWIFT: ${bankDetails.swiftCode}` : ''}`;
                      copyToClipboard(allDetails, "All bank details");
                    }}
                    className="flex-1 bg-elastic-navy-600 hover:bg-elastic-navy-700 text-white font-semibold"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-request" className="space-y-4">
            <Card className="bg-white border-slate-300 hover:border-slate-400 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-900">
                  <Link className="h-5 w-5 text-elastic-teal-600" />
                  <span>Create Payment Request</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-slate-700">Amount ({wallet.currency})</Label>
                    <Input
                      type="number"
                      value={requestAmount}
                      onChange={(e) => setRequestAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center space-x-1 text-base font-medium text-slate-700">
                      <Calendar className="h-4 w-4" />
                      <span>Due Date</span>
                    </Label>
                    <Input
                      type="date"
                      value={requestDueDate}
                      onChange={(e) => setRequestDueDate(e.target.value)}
                      className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium text-slate-700">Purpose / Description</Label>
                  <Textarea
                    value={requestPurpose}
                    onChange={(e) => setRequestPurpose(e.target.value)}
                    placeholder="Invoice #123, Service payment, etc."
                    rows={3}
                    className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                  />
                </div>

                {requestAmount && (
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 text-slate-900">Payment Request Preview</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-slate-600">Amount:</span> <span className="font-bold text-slate-900">{wallet.currency} {requestAmount}</span></p>
                        <p><span className="text-slate-600">Purpose:</span> <span className="text-slate-900">{requestPurpose || "Not specified"}</span></p>
                        <p><span className="text-slate-600">Due:</span> <span className="text-slate-900">{requestDueDate || "Not specified"}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={generatePaymentLink}
                    disabled={!requestAmount}
                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Generate Payment Link
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!requestAmount}
                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
