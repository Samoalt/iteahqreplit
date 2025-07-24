
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";
import { RefObject } from "react";

interface BidControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  searchInputRef: RefObject<HTMLInputElement>;
  onNewBid?: () => void;
}

export const BidControls = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  searchInputRef,
  onNewBid
}: BidControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      {/* Search and Filter Controls */}
      <div className="flex flex-1 items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input 
            ref={searchInputRef} 
            placeholder="Search bids by buyer, ID, or factory..." 
            value={searchQuery} 
            onChange={e => onSearchChange(e.target.value)} 
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors" 
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-48 bg-white border-slate-200">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-slate-200 shadow-lg">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="bid-intake">Bid Intake</SelectItem>
            <SelectItem value="e-slip-sent">E-Slip Sent</SelectItem>
            <SelectItem value="payment-matching">Payment Matching</SelectItem>
            <SelectItem value="split-processing">Split Processing</SelectItem>
            <SelectItem value="payout-approval">Payout Approval</SelectItem>
            <SelectItem value="tea-release">Tea Release</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-3">
        {onNewBid && (
          <Button 
            onClick={onNewBid} 
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Bid
          </Button>
        )}
      </div>
    </div>
  );
};
