
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

export default App
