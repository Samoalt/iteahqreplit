
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileText, CreditCard, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bid } from "@/types/bid";
import { useToast } from "@/hooks/use-toast";

interface BidProcessingBidViewProps {
  bids: Bid[];
  selectedBids: string[];
  onBidSelect: (bidId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

const statusColors = {
  'bid-intake': 'bg-slate-100 text-slate-800 border-slate-200',
  'e-slip-sent': 'bg-blue-100 text-blue-800 border-blue-200',
  'payment-matching': 'bg-green-100 text-green-800 border-green-200',
  'split-processing': 'bg-purple-100 text-purple-800 border-purple-200',
  'payout-approval': 'bg-orange-100 text-orange-800 border-orange-200',
  'tea-release': 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

const statusLabels = {
  'bid-intake': 'E-slip Pending',
  'e-slip-sent': 'E-slip Sent',
  'payment-matching': 'Paid',
  'split-processing': 'Split Processed',
  'payout-approval': 'Payout Approval',
  'tea-release': 'Released'
};

export const BidProcessingBidView = ({
  bids,
  selectedBids,
  onBidSelect,
  onSelectAll
}: BidProcessingBidViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBidClick = (bid: Bid) => {
    navigate(`/app/operations/bid-processing/${bid.id}`);
  };

  const handleGenerateESlip = (bid: Bid, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "E-Slip Generation",
      description: `Generating E-Slip for bid ${bid.id}...`,
    });
    
    // Simulate E-slip generation
    setTimeout(() => {
      toast({
        title: "E-Slip Generated",
        description: `E-Slip for bid ${bid.id} has been generated and sent to ${bid.buyerName}`,
      });
    }, 2000);
  };

  const handleMatchPayment = (bid: Bid, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Payment Matching",
      description: `Initiating payment matching for bid ${bid.id}...`,
    });
    
    // Simulate payment matching
    setTimeout(() => {
      toast({
        title: "Payment Matched",
        description: `Payment for bid ${bid.id} has been successfully matched`,
      });
    }, 1500);
  };

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50">
              <TableHead className="w-12 px-4 py-3">
                <Checkbox 
                  checked={selectedBids.length === bids.length && bids.length > 0} 
                  onCheckedChange={onSelectAll} 
                  className="border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Bid ID / Lot ID</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Buyer</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Factory</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Warehouse</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Status</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Amount</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.map(bid => {
              const isSelected = selectedBids.includes(bid.id);
              return (
                <TableRow 
                  key={bid.id} 
                  className={cn(
                    "border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors",
                    isSelected && "bg-blue-50 hover:bg-blue-100"
                  )} 
                  onClick={() => handleBidClick(bid)}
                >
                  <TableCell className="px-4 py-4">
                    <Checkbox 
                      checked={isSelected} 
                      onCheckedChange={(checked) => onBidSelect(bid.id, checked as boolean)} 
                      onClick={(e) => e.stopPropagation()} 
                      className="border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{bid.id}</p>
                      <p className="text-sm text-slate-500">Lot: {bid.lotId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {bid.buyerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{bid.buyerName}</p>
                        <p className="text-sm text-slate-500">Active buyer</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{bid.factory}</p>
                      <p className="text-sm text-slate-500">{bid.grade} • {bid.quantity} kg</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Warehouse className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">Warehouse A</p>
                        <p className="text-sm text-slate-500">SLOC-001</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <Badge className={cn("text-xs", statusColors[bid.status])}>
                      {statusLabels[bid.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div>
                      <p className="font-bold text-slate-900">LKR {bid.amount.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">@ LKR {bid.pricePerKg}/kg</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBidClick(bid);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2 text-slate-600 hover:text-green-600 hover:bg-green-50" 
                        onClick={(e) => handleGenerateESlip(bid, e)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50" 
                        onClick={(e) => handleMatchPayment(bid, e)}
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {bids.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No bids found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
