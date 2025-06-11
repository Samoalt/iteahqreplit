import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { websocketService } from "@/lib/websocket";
import { useEffect } from "react";

import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/pages/Dashboard";
import LotsAndInvoices from "@/pages/LotsAndInvoices";
import WalletsAndSettlement from "@/pages/WalletsAndSettlement";
import FXAndCredit from "@/pages/FXAndCredit";
import InsuranceHub from "@/pages/InsuranceHub";
import BoardView from "@/pages/BoardView";
import InstantCash from "@/pages/InstantCash";
import StatementsAndReports from "@/pages/StatementsAndReports";
import Alerts from "@/pages/Alerts";
import Admin from "@/pages/Admin";
import AutoListing from "@/pages/AutoListing";
import NotFound from "@/pages/not-found";

function Router() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 7.09L18 8L13.09 8.91L12 14L10.91 8.91L6 8L10.91 7.09L12 2Z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">iTea Flow</h1>
          <p className="text-slate-600 mb-6">powered by Elastic OS</p>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 max-w-sm mx-auto">
            <p className="text-sm text-slate-600 mb-4">Demo Access - No login required</p>
            <p className="text-xs text-slate-500">Automatically logging in as Sarah Chen (Buyer)</p>
          </div>
        </div>
      </div>
    );
  }

  // Role-based route filtering
  const getRoleBasedRoutes = () => {
    const baseRoutes = [
      { path: "/", component: Dashboard },
      { path: "/dashboard", component: Dashboard },
    ];

    switch (user.role) {
      case "buyer":
        return [
          ...baseRoutes,
          { path: "/lots", component: LotsAndInvoices },
          { path: "/wallets", component: WalletsAndSettlement },
          { path: "/fx-credit", component: FXAndCredit },
          { path: "/insurance", component: InsuranceHub },
          { path: "/instant-cash", component: InstantCash },
          { path: "/reports", component: StatementsAndReports },
          { path: "/alerts", component: Alerts },
        ];
      
      case "producer":
        return [
          ...baseRoutes,
          { path: "/lots", component: LotsAndInvoices },
          { path: "/wallets", component: WalletsAndSettlement },
          { path: "/fx-credit", component: FXAndCredit },
          { path: "/insurance", component: InsuranceHub },
          { path: "/auto-listing", component: AutoListing },
          { path: "/reports", component: StatementsAndReports },
          { path: "/alerts", component: Alerts },
        ];
      
      case "ktda_ro":
        return [
          ...baseRoutes,
          { path: "/board", component: BoardView },
          { path: "/reports", component: StatementsAndReports },
          { path: "/alerts", component: Alerts },
        ];
      
      case "ops_admin":
        return [
          ...baseRoutes,
          { path: "/lots", component: LotsAndInvoices },
          { path: "/wallets", component: WalletsAndSettlement },
          { path: "/fx-credit", component: FXAndCredit },
          { path: "/insurance", component: InsuranceHub },
          { path: "/board", component: BoardView },
          { path: "/instant-cash", component: InstantCash },
          { path: "/reports", component: StatementsAndReports },
          { path: "/alerts", component: Alerts },
          { path: "/admin", component: Admin },
          { path: "/auto-listing", component: AutoListing },
        ];
      
      default:
        return baseRoutes;
    }
  };

  const allowedRoutes = getRoleBasedRoutes();

  return (
    <AppShell>
      <Switch>
        {allowedRoutes.map((route, index) => (
          <Route 
            key={index}
            path={route.path} 
            component={route.component} 
          />
        ))}
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  useEffect(() => {
    // Initialize WebSocket connection
    websocketService.connect();
    
    return () => {
      websocketService.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
