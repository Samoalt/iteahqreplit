
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, MoreHorizontal, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bid } from "@/types/bid";

interface BidListViewProps {
  bids: Bid[];
  onBidClick: (bid: Bid) => void;
  selectedBids?: string[];
  onBidSelect?: (bidId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

const statusColors = {
  'bid-intake': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'e-slip-sent': 'bg-orange-100 text-orange-800 border-orange-200',
  'payment-matching': 'bg-blue-100 text-blue-800 border-blue-200',
  'split-processing': 'bg-purple-100 text-purple-800 border-purple-200',
  'payout-approval': 'bg-green-100 text-green-800 border-green-200',
  'tea-release': 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

const statusLabels = {
  'bid-intake': 'pending',
  'e-slip-sent': 'verified',
  'payment-matching': 'matched',
  'split-processing': 'processing',
  'payout-approval': 'approved',
  'tea-release': 'completed'
};

const stageLabels = {
  'bid-intake': 'bid intake',
  'e-slip-sent': 'e-slip sent',
  'payment-matching': 'payment matching',
  'split-processing': 'split processing',
  'payout-approval': 'payout approval',
  'tea-release': 'tea release'
};

export const BidListView = ({
  bids,
  onBidClick,
  selectedBids = [],
  onBidSelect,
  onSelectAll
}: BidListViewProps) => {
  const navigate = useNavigate();
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    setAllSelected(bids.length > 0 && selectedBids.length === bids.length);
  }, [selectedBids, bids]);

  const handleBidClick = (bid: Bid) => {
    navigate(`/app/operations/bid-processing/${bid.id}`);
  };

  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    onSelectAll?.(checked);
  };

  const handleBidSelect = (bidId: string, checked: boolean) => {
    onBidSelect?.(bidId, checked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      main: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      due: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };
  };

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50">
              <TableHead className="w-12 px-4 py-3">
                <Checkbox 
                  checked={allSelected} 
                  onCheckedChange={handleSelectAll} 
                  className="text-zinc-950 font-bold bg-gray-950 hover:bg-gray-800" 
                />
              </TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Bid ID ↑↓</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Buyer ↑↓</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Amount ↑↓</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Tea Details</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Factory</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Status ↑↓</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Stage ↑↓</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Date ↑↓</TableHead>
              <TableHead className="text-slate-700 font-semibold px-4 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.map(bid => {
              const dateInfo = formatDate(bid.date);
              const isOverdue = new Date(bid.date) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Consider overdue if older than 7 days
              const isSelected = selectedBids.includes(bid.id);
              
              return (
                <TableRow 
                  key={bid.id} 
                  className={cn(
                    "border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors",
                    isSelected && "bg-blue-50"
                  )}
                  onClick={() => handleBidClick(bid)}
                >
                  <TableCell className="px-4 py-4">
                    <Checkbox 
                      checked={isSelected} 
                      onCheckedChange={(checked) => handleBidSelect(bid.id, checked as boolean)}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gray-950 hover:bg-gray-800" 
                    />
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 px-4 py-4">
                    {bid.id}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {bid.buyerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{bid.buyerName}</p>
                        <div className="flex items-center space-x-1 text-slate-500">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs">+254 {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 9000000 + 1000000)}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div>
                      <p className="font-bold text-slate-900">USD ${bid.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{bid.quantity} kg @ USD ${bid.pricePerKg}/kg</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-slate-900">{bid.grade}</p>
                      <p className="text-xs text-slate-500">Lot: {bid.lotId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-slate-900">{bid.factory}</p>
                      <p className="text-xs text-slate-500">Warehouse A</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <Badge className={cn("text-xs border", statusColors[bid.status])}>
                      {statusLabels[bid.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <Badge variant="outline" className="text-xs border border-slate-200 text-slate-700">
                      {stageLabels[bid.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="text-sm">
                      <p className="text-slate-900">{dateInfo.main}</p>
                      <p className={cn(
                        "text-xs",
                        isOverdue ? "text-red-600" : "text-slate-500"
                      )}>
                        Due: {dateInfo.due}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 hover:bg-blue-100 text-slate-600 hover:text-blue-600"
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
                        className="h-8 w-8 p-0 hover:bg-slate-100 text-slate-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
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
