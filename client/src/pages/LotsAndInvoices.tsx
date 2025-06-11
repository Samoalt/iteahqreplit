import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import LotCard from "@/components/lots/LotCard";
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

  const { data: lots, isLoading: lotsLoading } = useQuery({
    queryKey: ["/api/lots"],
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["/api/invoices"],
  });

  // Subscribe to WebSocket events
  useState(() => {
    const unsubscribeBid = subscribe?.("bidPlaced", (data) => {
      console.log("New bid placed:", data);
    });

    const unsubscribeInvoice = subscribe?.("invoicePaid", (data) => {
      console.log("Invoice paid:", data);
    });

    return () => {
      unsubscribeBid?.();
      unsubscribeInvoice?.();
    };
  });

  const handleBidClick = (lotId: string) => {
    const lot = lots?.find((l: Lot) => l.lotId === lotId);
    if (lot) {
      setSelectedLot(lot);
      setIsBidModalOpen(true);
    }
  };

  const handleInstantCashClick = (lotId: string) => {
    const lot = lots?.find((l: Lot) => l.lotId === lotId);
    if (lot) {
      setSelectedLot(lot);
      setIsCashDrawerOpen(true);
    }
  };

  if (!user) return null;

  const liveLots = lots?.filter((lot: Lot) => lot.status === "live") || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lots & Invoices</h1>
          <p className="text-slate-600">Manage your tea lot bidding and invoice payments</p>
        </div>
      </div>

      <Tabs defaultValue="catalogue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
          <TabsTrigger value="live">Live Lots</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Catalogue Tab */}
        <TabsContent value="catalogue" className="space-y-6">
          {lotsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-80 h-96 bg-slate-200 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lots?.map((lot: Lot) => (
                <LotCard
                  key={lot.id}
                  lot={lot}
                  onBid={user.role === "buyer" ? handleBidClick : undefined}
                  onInstantCash={user.role === "producer" ? handleInstantCashClick : undefined}
                  userRole={user.role}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Live Lots Tab */}
        <TabsContent value="live" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Live Auction Feed</CardTitle>
              <div className="flex items-center space-x-2 text-status-green">
                <div className="w-2 h-2 bg-status-green rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Updates</span>
              </div>
            </CardHeader>
            <CardContent>
              {liveLots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveLots.map((lot: Lot) => (
                    <div key={lot.id} className="relative">
                      <LotCard
                        lot={lot}
                        onBid={user.role === "buyer" ? handleBidClick : undefined}
                        onInstantCash={user.role === "producer" ? handleInstantCashClick : undefined}
                        userRole={user.role}
                      />
                      {lot.status === "live" && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-status-green text-white animate-pulse">
                            LIVE
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-slate-400 text-lg mb-2">No live lots at the moment</div>
                  <div className="text-slate-500 text-sm">Check back soon for new auctions</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-200 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Invoice #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Lots #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Amount USD
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {invoices?.map((invoice: any) => (
                        <InvoiceRow key={invoice.id} invoice={invoice} />
                      ))}
                    </tbody>
                  </table>
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
