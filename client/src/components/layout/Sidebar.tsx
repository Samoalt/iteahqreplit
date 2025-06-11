import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Home, Package, Wallet, Zap, DollarSign, Shield, FileText, Building, Bell, Settings } from "lucide-react";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard", roles: ["producer", "buyer", "ktda_ro", "ops_admin"] },
  { id: "lots", label: "Lots & Invoices", icon: Package, path: "/lots", roles: ["producer", "buyer", "ktda_ro"] },
  { id: "wallets", label: "Wallets & Settlement", icon: Wallet, path: "/wallets", roles: ["producer", "buyer", "ktda_ro"] },
  { id: "instant-cash", label: "Instant Cash", icon: Zap, path: "/instant-cash", roles: ["producer"] },
  { id: "fx-credit", label: "FX & Credit", icon: DollarSign, path: "/fx-credit", roles: ["buyer"] },
  { id: "insurance", label: "Insurance Hub", icon: Shield, path: "/insurance", roles: ["producer", "buyer"] },
  { id: "reports", label: "Statements & Reports", icon: FileText, path: "/reports", roles: ["producer", "buyer", "ktda_ro"] },
  { id: "board", label: "Board View", icon: Building, path: "/board", roles: ["ktda_ro"] },
  { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts", roles: ["producer", "buyer", "ktda_ro", "ops_admin"] },
  { id: "admin", label: "Admin", icon: Settings, path: "/admin", roles: ["ops_admin"] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const visibleItems = navigationItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 7.09L18 8L13.09 8.91L12 14L10.91 8.91L6 8L10.91 7.09L12 2Z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">iTea Flow</h1>
            <p className="text-xs text-slate-500">powered by Elastic OS</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {visibleItems.map((item) => {
          const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
          const Icon = item.icon;
          
          return (
            <Link key={item.id} href={item.path}>
              <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-slate-700 hover:bg-slate-100"
              }`}>
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.id === "alerts" && (
                  <span className="ml-auto bg-status-red text-white text-xs px-2 py-1 rounded-full">3</span>
                )}
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
