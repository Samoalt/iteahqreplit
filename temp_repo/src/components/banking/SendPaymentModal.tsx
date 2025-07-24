
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Building2, Wallet, TrendingUp, Globe, Clock, Shield, Users, Factory, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SendPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: {
    currency: string;
    balance: string;
    available: string;
  } | null;
}

interface DirectoryEntity {
  id: string;
  name: string;
  type: 'buyer' | 'producer' | 'factory' | 'service_provider' | 'government';
  account?: string;
  bank?: string;
  location: string;
  status: 'active' | 'inactive';
  lastTransaction?: string;
}

export const SendPaymentModal = ({ open, onOpenChange, wallet }: SendPaymentModalProps) => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [beneficiarySource, setBeneficiarySource] = useState<"directory" | "manual">("directory");
  const [transferType, setTransferType] = useState("bank");
  const [amount, setAmount] = useState("");
  const [narrative, setNarrative] = useState("");
  const [paymentPurpose, setPaymentPurpose] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock directory entities - in real app, this would come from Directory API
  const directoryEntities: DirectoryEntity[] = [
    { 
      id: "1", 
      name: "Nandi Hills Factory", 
      type: "factory",
      account: "****1234", 
      bank: "KCB Bank", 
      location: "Nandi Hills",
      status: "active",
      lastTransaction: "2 days ago"
    },
    { 
      id: "2", 
      name: "Global Tea Co.", 
      type: "buyer",
      account: "****5678", 
      bank: "Chase Bank", 
      location: "Nairobi",
      status: "active",
      lastTransaction: "1 week ago"
    },
    { 
      id: "3", 
      name: "Highland Tea Producers", 
      type: "producer",
      account: "****9012", 
      bank: "Standard Bank", 
      location: "Kericho",
      status: "active",
      lastTransaction: "3 days ago"
    },
    { 
      id: "4", 
      name: "Export Logistics Co", 
      type: "service_provider",
      account: "****3456", 
      bank: "Barclays Bank", 
      location: "Mombasa",
      status: "active",
      lastTransaction: "1 day ago"
    },
    { 
      id: "5", 
      name: "Kenya Tea Development Authority", 
      type: "government",
      account: "****7890", 
      bank: "CBK", 
      location: "Nairobi",
      status: "active",
      lastTransaction: "1 month ago"
    }
  ];

  const transferTypes = [
    { id: "bank", name: "Bank Transfer", desc: "RTGS, PesaLink, SWIFT", icon: Building2, fee: "0.5%" },
    { id: "wallet", name: "Wallet Transfer", desc: "Internal transfer", icon: Wallet, fee: "Free" },
    { id: "mmf", name: "MMF Sweep", desc: "To Money Market Fund", icon: TrendingUp, fee: "Free" },
    { id: "fx", name: "FX Transfer", desc: "Cross-currency", icon: Globe, fee: "1.2%" },
  ];

  const paymentPurposes = [
    { id: "lot_payout", name: "Lot Payout", desc: "Payment to producers for tea lots" },
    { id: "bid_payment", name: "Bid Payment", desc: "Payment from buyer for successful bid" },
    { id: "release_fee", name: "Release Fee", desc: "Payment for tea release processing" },
    { id: "service_fee", name: "Service Fee", desc: "Payment for services rendered" },
    { id: "tax_payment", name: "Tax Payment", desc: "Government tax obligations" },
    { id: "refund", name: "Refund", desc: "Refund payment" },
    { id: "other", name: "Other", desc: "Other payment purposes" }
  ];

  const filteredEntities = directoryEntities.filter(entity =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'buyer':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'factory':
      case 'producer':
        return <Factory className="h-4 w-4 text-green-600" />;
      case 'service_provider':
        return <Truck className="h-4 w-4 text-orange-600" />;
      case 'government':
        return <Building2 className="h-4 w-4 text-purple-600" />;
      default:
        return <Users className="h-4 w-4 text-slate-600" />;
    }
  };

  const getEntityTypeBadge = (type: string) => {
    const badges = {
      buyer: "bg-blue-100 text-blue-700 border-blue-300",
      producer: "bg-green-100 text-green-700 border-green-300",
      factory: "bg-green-100 text-green-700 border-green-300",
      service_provider: "bg-orange-100 text-orange-700 border-orange-300",
      government: "bg-purple-100 text-purple-700 border-purple-300"
    };
    return badges[type as keyof typeof badges] || "bg-slate-100 text-slate-700 border-slate-300";
  };

  const handleSend = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    toast({
      title: "Payment Initiated",
      description: `${wallet?.currency} ${amount} transfer has been initiated`,
    });
    onOpenChange(false);
    setShowConfirmation(false);
    // Reset form
    setSelectedBeneficiary("");
    setAmount("");
    setNarrative("");
    setPaymentPurpose("");
    setIsScheduled(false);
    setScheduleDate("");
  };

  const selectedTransferType = transferTypes.find(t => t.id === transferType);
  const selectedEntity = directoryEntities.find(e => e.id === selectedBeneficiary);
  const selectedPurpose = paymentPurposes.find(p => p.id === paymentPurpose);
  const exchangeRate = transferType === "fx" ? "1 USD = 134.50 KES" : null;

  if (!wallet) return null;

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-slate-900 font-semibold">
              <Shield className="h-5 w-5 text-elastic-navy-600" />
              <span>Confirm Payment</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="bg-white border-slate-300 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">To:</span>
                  <span className="font-semibold text-slate-900">
                    {beneficiarySource === "directory" ? selectedEntity?.name : "Manual Entry"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Amount:</span>
                  <span className="font-bold text-xl text-elastic-navy-800">{wallet.currency} {amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Purpose:</span>
                  <span className="font-semibold text-slate-900">{selectedPurpose?.name || "Other"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Transfer Type:</span>
                  <span className="font-semibold text-slate-900">{selectedTransferType?.name}</span>
                </div>
                {exchangeRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Exchange Rate:</span>
                    <span className="font-semibold text-elastic-teal-600">{exchangeRate}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Fee:</span>
                  <span className="font-semibold text-slate-900">{selectedTransferType?.fee}</span>
                </div>
                {isScheduled && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Scheduled for:</span>
                    <span className="font-semibold text-slate-900">{scheduleDate}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-900">Enter PIN for confirmation</Label>
              <Input 
                type="password" 
                placeholder="Enter your 4-digit PIN" 
                maxLength={4} 
                className="font-mono text-center text-lg bg-white border-slate-300 focus:border-elastic-navy-500" 
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)} 
                className="flex-1 font-medium border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Back
              </Button>
              <Button 
                onClick={handleConfirm} 
                className="flex-1 bg-elastic-navy-600 hover:bg-elastic-navy-700 text-white font-semibold"
              >
                Confirm & Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Send Payment - {wallet.currency} Wallet
          </DialogTitle>
          <p className="text-base font-medium text-slate-700">
            Available Balance: <span className="font-semibold text-elastic-teal-600">{wallet.currency} {wallet.available}</span>
          </p>
        </DialogHeader>

        <Tabs defaultValue="beneficiary" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-100 p-1">
            <TabsTrigger value="beneficiary" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              Beneficiary
            </TabsTrigger>
            <TabsTrigger value="purpose" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              Purpose
            </TabsTrigger>
            <TabsTrigger value="type" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              Transfer Type
            </TabsTrigger>
            <TabsTrigger value="details" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              Details
            </TabsTrigger>
            <TabsTrigger value="review" className="font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-elastic-navy-700 data-[state=active]:shadow-sm">
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="beneficiary" className="space-y-4 mt-6">
            <Tabs value={beneficiarySource} onValueChange={(value) => setBeneficiarySource(value as "directory" | "manual")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="directory">From Directory</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>

              <TabsContent value="directory" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input 
                      placeholder="Search directory entities..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 font-medium bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900" 
                    />
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredEntities.map((entity) => (
                      <Card
                        key={entity.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedBeneficiary === entity.id 
                            ? 'ring-2 ring-elastic-navy-500 bg-elastic-navy-50 border-elastic-navy-300' 
                            : 'hover:bg-slate-50 border-slate-300 bg-white hover:border-slate-400'
                        }`}
                        onClick={() => setSelectedBeneficiary(entity.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getEntityIcon(entity.type)}
                              <div>
                                <p className="font-semibold text-base text-slate-900">{entity.name}</p>
                                <p className="text-sm font-medium text-slate-600 mt-1">
                                  {entity.location} • {entity.bank && `${entity.bank} • `}{entity.account}
                                </p>
                                {entity.lastTransaction && (
                                  <p className="text-xs text-slate-500 mt-1">Last transaction: {entity.lastTransaction}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge 
                                variant="secondary" 
                                className={`font-medium text-xs ${getEntityTypeBadge(entity.type)}`}
                              >
                                {entity.type.replace('_', ' ')}
                              </Badge>
                              <Badge 
                                variant={entity.status === 'active' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {entity.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Beneficiary Name</Label>
                      <Input placeholder="Enter beneficiary name" className="bg-white border-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input placeholder="Enter account number" className="bg-white border-slate-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input placeholder="Enter bank name" className="bg-white border-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <Label>Branch Code</Label>
                      <Input placeholder="Enter branch code" className="bg-white border-slate-300" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="purpose" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentPurposes.map((purpose) => (
                <Card
                  key={purpose.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    paymentPurpose === purpose.id 
                      ? 'ring-2 ring-elastic-navy-500 bg-elastic-navy-50 border-elastic-navy-300' 
                      : 'hover:bg-slate-50 border-slate-300 bg-white hover:border-slate-400'
                  }`}
                  onClick={() => setPaymentPurpose(purpose.id)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-900 text-base leading-tight mb-2">{purpose.name}</h3>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{purpose.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="type" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transferTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      transferType === type.id 
                        ? 'ring-2 ring-elastic-navy-500 bg-elastic-navy-50 border-elastic-navy-300' 
                        : 'hover:bg-slate-50 border-slate-300 bg-white hover:border-slate-400'
                    }`}
                    onClick={() => setTransferType(type.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start space-x-4">
                        <IconComponent className="h-6 w-6 text-elastic-navy-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-base leading-tight mb-1">{type.name}</h3>
                          <p className="text-sm font-medium text-slate-600 mb-3 leading-relaxed">{type.desc}</p>
                          <Badge variant="outline" className="text-xs font-semibold text-elastic-teal-700 border-elastic-teal-300 bg-elastic-teal-50">
                            {type.fee}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-900">Amount ({wallet.currency})</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="text-lg font-medium bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-900">Currency</Label>
                  <Input 
                    value={wallet.currency} 
                    disabled 
                    className="text-lg font-medium bg-slate-100 border-slate-300 text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-900">Purpose / Narrative</Label>
                <Textarea
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Payment for services, invoice reference, etc."
                  rows={3}
                  className="font-medium bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-slate-600" />
                    <Label className="text-base font-medium text-slate-900">Schedule Payment</Label>
                  </div>
                  <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
                </div>

                {isScheduled && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-slate-900">Schedule Date</Label>
                    <Input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="font-medium bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4 mt-6">
            <Card className="border-slate-300 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-slate-700">Beneficiary:</span>
                    <span className="font-semibold text-slate-900">
                      {beneficiarySource === "directory" 
                        ? (selectedEntity?.name || "Not selected")
                        : "Manual Entry"
                      }
                    </span>
                  </div>
                  {selectedEntity && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-slate-700">Entity Type:</span>
                        <Badge className={getEntityTypeBadge(selectedEntity.type)}>
                          {selectedEntity.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-slate-700">Location:</span>
                        <span className="font-semibold text-slate-900">{selectedEntity.location}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-slate-700">Purpose:</span>
                    <span className="font-semibold text-slate-900">{selectedPurpose?.name || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-slate-700">Amount:</span>
                    <span className="font-bold text-xl text-elastic-navy-800">{wallet.currency} {amount || "0.00"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-slate-700">Transfer Type:</span>
                    <span className="font-semibold text-slate-900">{selectedTransferType?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-slate-700">Fee:</span>
                    <span className="font-semibold text-slate-900">{selectedTransferType?.fee}</span>
                  </div>
                  {isScheduled && (
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-slate-700">Scheduled for:</span>
                      <span className="font-semibold text-slate-900">{scheduleDate}</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-slate-300" />

                <div className="flex justify-end space-x-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)} 
                    className="font-medium border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSend} 
                    disabled={!selectedBeneficiary && beneficiarySource === "directory" || !amount || !paymentPurpose}
                    className="bg-elastic-navy-600 hover:bg-elastic-navy-700 text-white font-semibold disabled:bg-slate-400"
                  >
                    Proceed to Confirm
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
