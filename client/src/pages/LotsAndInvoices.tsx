import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import LotCard from "@/components/lots/LotCard";
import LotFilters from "@/components/lots/LotFilters";
import LiveBiddingWidget from "@/components/lots/LiveBiddingWidget";
import BidModal from "@/components/lots/BidModal";
import CashDrawer from "@/components/lots/CashDrawer";
import InvoiceRow from "@/components/invoices/InvoiceRow";
import { Lot } from "@shared/schema";

export default function LotsAndInvoices() {
  const { user } = useAuth();
  const { subscribe } = useWebSocket();
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isCashDrawerOpen, setIsCashDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    grade: "",
    minQuality: 0,
    esgCertified: false,
    status: "",
    factory: ""
  });

  const { data: lots, isLoading: lotsLoading } = useQuery({
    queryKey: ["/api/lots"],
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["/api/invoices"],
  });

  const { data: fxRate } = useQuery({
    queryKey: ["/api/fx-rate"],
  });

  // Handle bid clicks
  const handleBidClick = (lotId: string) => {
    const lot = lots?.find((l: Lot) => l.lotId === lotId);
    if (lot) {
      setSelectedLot(lot);
      setIsBidModalOpen(true);
    }
  };

  // Handle instant cash clicks
  const handleInstantCashClick = (lotId: string) => {
    const lot = lots?.find((l: Lot) => l.lotId === lotId);
    if (lot) {
      setSelectedLot(lot);
      setIsCashDrawerOpen(true);
    }
  };

  // Filter lots based on current filters
  const filteredLots = useMemo(() => {
    if (!lots) return [];
    
    return lots.filter((lot: Lot) => {
      if (filters.grade && lot.grade !== filters.grade) return false;
      if (filters.minQuality && lot.qualityStars < filters.minQuality) return false;
      if (filters.esgCertified && !lot.esgCertified) return false;
      if (filters.status && lot.status !== filters.status) return false;
      if (filters.factory && lot.factory !== filters.factory) return false;
      return true;
    });
  }, [lots, filters]);

  // Get available factories for filter dropdown
  const availableFactories = useMemo(() => {
    if (!lots) return [];
    const factories = lots.map((lot: Lot) => lot.factory);
    return [...new Set(factories)];
  }, [lots]);

  const liveLots = filteredLots.filter((lot: Lot) => lot.status === "live");
  const loanReadyLots = filteredLots.filter((lot: Lot) => lot.canInstantCash && user?.role === "producer");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title text-foreground">Lots & Invoices</h1>
          <p className="text-muted-foreground">Manage your tea lot bidding and invoice payments</p>
        </div>
        {user?.role === "producer" && (
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            List New Lot
          </Button>
        )}
      </div>

      {/* Producer Quick Stats */}
      {user?.role === "producer" && loanReadyLots.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                {loanReadyLots.length} lots ready for instant cash advance
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="catalogue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
          <TabsTrigger value="live">Live Lots</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Catalogue Tab */}
        <TabsContent value="catalogue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <LotFilters 
                onFiltersChange={setFilters}
                availableFactories={availableFactories}
              />
            </div>

            {/* Lots Grid */}
            <div className="lg:col-span-3">
              {lotsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-full h-96 bg-slate-200 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : filteredLots.length === 0 ? (
                <Card className="feature-card">
                  <CardContent className="p-8 text-center">
                    <h3 className="card-title text-muted-foreground mb-2">No lots found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or check back later for new listings.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredLots.map((lot: Lot) => (
                    <LotCard
                      key={lot.id}
                      lot={lot}
                      onBid={user?.role === "buyer" ? handleBidClick : undefined}
                      onInstantCash={user?.role === "producer" ? handleInstantCashClick : undefined}
                      userRole={user?.role}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Live Lots Tab */}
        <TabsContent value="live" className="space-y-6">
          {liveLots.length === 0 ? (
            <Card className="feature-card">
              <CardContent className="p-8 text-center">
                <h3 className="card-title text-muted-foreground mb-2">No live auctions</h3>
                <p className="text-sm text-muted-foreground">
                  Check back later for active bidding opportunities.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveLots.map((lot: Lot) => (
                <LiveBiddingWidget
                  key={lot.id}
                  lot={lot}
                  highestBid={parseFloat(lot.offerPrice)}
                  currentFxRate={fxRate?.rate || "130.00"}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-200 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : invoices?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">No invoices found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices?.map((invoice: any) => (
                    <InvoiceRow key={invoice.id} invoice={invoice} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        lot={selectedLot}
      />

      <CashDrawer
        isOpen={isCashDrawerOpen}
        onClose={() => setIsCashDrawerOpen(false)}
        lot={selectedLot}
      />
    </div>
  );
}