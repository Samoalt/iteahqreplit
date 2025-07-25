
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PlatformTourProvider } from "@/contexts/PlatformTourContext"
import { PaymentInflowsProvider } from "@/contexts/PaymentInflowsContext"
import Login from "./pages/auth/Login"
import Dashboard from "./pages/Dashboard"
import GetStarted from "./pages/GetStarted"
import Admin from "./pages/Admin"
import Accounting from "./pages/Accounting"
import Directory from "./pages/operations/Directory"
import Statements from "./pages/operations/Statements"
import LotPool from "./pages/operations/LotPool"
import BidProcessing from "./pages/operations/BidProcessing"
import BidDetails from "./pages/operations/BidDetails"
import TeaWorkflow from "./pages/operations/TeaWorkflow"
import TradePulse from "./pages/operations/TradePulse"
import DocumentsCenter from "./pages/operations/DocumentsCenter"
import Wallets from "./pages/banking/Wallets"
import Transactions from "./pages/banking/Transactions"
import Sweeps from "./pages/banking/Sweeps"
import NotFound from "./pages/NotFound"
import Layout from "./components/Layout"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PlatformTourProvider>
            <PaymentInflowsProvider>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/app" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="get-started" element={<GetStarted />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="accounting" element={<Accounting />} />
                  <Route path="operations/directory" element={<Directory />} />
                  <Route path="operations/statements" element={<Statements />} />
                  <Route path="operations/lot-pool" element={<LotPool />} />
                  <Route path="operations/bid-processing" element={<BidProcessing />} />
                  <Route path="operations/bid-processing/:bidId" element={<BidDetails />} />
                  <Route path="operations/tea-workflow" element={<TeaWorkflow />} />
                  <Route path="operations/trade-pulse" element={<TradePulse />} />
                  <Route path="operations/documents-center" element={<DocumentsCenter />} />
                  <Route path="banking/wallets" element={<Wallets />} />
                  <Route path="banking/transactions" element={<Transactions />} />
                  <Route path="banking/sweeps" element={<Sweeps />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PaymentInflowsProvider>
          </PlatformTourProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

import { Switch, Route } from "wouter";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BidStateProvider } from "@/contexts/BidStateContext";
import { PaymentInflowsProvider } from "@/contexts/PaymentInflowsContext";
import { PlatformTourProvider } from "@/contexts/PlatformTourContext";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";

// Protected pages
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import GetStarted from "@/pages/GetStarted";
import LotsAndInvoices from "@/pages/LotsAndInvoices";
import WalletsAndSettlement from "@/pages/WalletsAndSettlement";
import FXAndCredit from "@/pages/FXAndCredit";
import InstantCash from "@/pages/InstantCash";
import InsuranceHub from "@/pages/InsuranceHub";
import AutoListing from "@/pages/AutoListing";
import StatementsAndReports from "@/pages/StatementsAndReports";
import Admin from "@/pages/Admin";
import Accounting from "@/pages/Accounting";
import BoardView from "@/pages/BoardView";
import Alerts from "@/pages/Alerts";

// Operations pages
import TradePulse from "@/pages/operations/TradePulse";
import BidProcessing from "@/pages/operations/BidProcessing";
import BidDetails from "@/pages/operations/BidDetails";
import LotPool from "@/pages/operations/LotPool";
import Directory from "@/pages/operations/Directory";
import DocumentsCenter from "@/pages/operations/DocumentsCenter";
import TeaWorkflow from "@/pages/operations/TeaWorkflow";
import Statements from "@/pages/operations/Statements";

// Banking pages
import Wallets from "@/pages/banking/Wallets";
import Payments from "@/pages/banking/Payments";
import Transactions from "@/pages/banking/Transactions";
import Inflows from "@/pages/banking/Inflows";
import Sweeps from "@/pages/banking/Sweeps";

import NotFound from "@/pages/NotFound";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <PlatformTourProvider>
        <BidStateProvider>
          <PaymentInflowsProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-gray-50">
                <Switch>
                  {/* Public routes */}
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route path="/forgot-password" component={ForgotPassword} />
                  
                  {/* Protected routes */}
                  <Route path="/">
                    <ProtectedRoute>
                      <Layout>
                        <Switch>
                          <Route path="/" component={Dashboard} />
                          <Route path="/dashboard" component={Dashboard} />
                          <Route path="/app/get-started" component={GetStarted} />
                          <Route path="/lots-and-invoices" component={LotsAndInvoices} />
                          <Route path="/wallets-and-settlement" component={WalletsAndSettlement} />
                          <Route path="/fx-and-credit" component={FXAndCredit} />
                          <Route path="/instant-cash" component={InstantCash} />
                          <Route path="/insurance-hub" component={InsuranceHub} />
                          <Route path="/auto-listing" component={AutoListing} />
                          <Route path="/statements-and-reports" component={StatementsAndReports} />
                          <Route path="/admin" component={Admin} />
                          <Route path="/accounting" component={Accounting} />
                          <Route path="/board-view" component={BoardView} />
                          <Route path="/alerts" component={Alerts} />
                          
                          {/* Operations routes */}
                          <Route path="/operations/trade-pulse" component={TradePulse} />
                          <Route path="/operations/bid-processing" component={BidProcessing} />
                          <Route path="/operations/bid-details/:bidId?" component={BidDetails} />
                          <Route path="/operations/lot-pool" component={LotPool} />
                          <Route path="/operations/directory" component={Directory} />
                          <Route path="/operations/documents-center" component={DocumentsCenter} />
                          <Route path="/operations/tea-workflow" component={TeaWorkflow} />
                          <Route path="/operations/statements" component={Statements} />
                          
                          {/* Banking routes */}
                          <Route path="/banking/wallets" component={Wallets} />
                          <Route path="/banking/payments" component={Payments} />
                          <Route path="/banking/transactions" component={Transactions} />
                          <Route path="/banking/inflows" component={Inflows} />
                          <Route path="/banking/sweeps" component={Sweeps} />
                          
                          <Route component={NotFound} />
                        </Switch>
                      </Layout>
                    </ProtectedRoute>
                  </Route>
                </Switch>
              </div>
              <Toaster />
            </SidebarProvider>
          </PaymentInflowsProvider>
        </BidStateProvider>
      </PlatformTourProvider>
    </AuthProvider>
  );
}

export default App
