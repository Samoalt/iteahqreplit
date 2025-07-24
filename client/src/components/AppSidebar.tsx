import { Calendar, Home, Wallet, Users, Settings, FileText, TrendingUp, Building2, CreditCard, ArrowDownUp, ArrowRightLeft, Receipt, Play, ClipboardList, Package } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Get Started",
    url: "/app/get-started",
    icon: Play,
  },
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: Home,
  },
  {
    title: "Operations",
    icon: Building2,
    items: [
      {
        title: "Lots",
        url: "/app/operations/lot-pool",
        icon: Package,
      },
      {
        title: "Bid Processing",
        url: "/app/operations/bid-processing",
        icon: ClipboardList,
      },
      {
        title: "Directory",
        url: "/app/operations/directory",
        icon: Users,
      },
      {
        title: "Statements",
        url: "/app/operations/statements",
        icon: FileText,
      },
      {
        title: "Trade Pulse",
        url: "/app/operations/trade-pulse",
        icon: TrendingUp,
      },
      {
        title: "Documents Center",
        url: "/app/operations/documents-center",
        icon: FileText,
      },
    ],
  },
  {
    title: "Banking",
    icon: Wallet,
    items: [
      {
        title: "Wallets",
        url: "/app/banking/wallets",
        icon: Wallet,
      },
      {
        title: "Transactions",
        url: "/app/banking/transactions",
        icon: ArrowRightLeft,
      },
      {
        title: "Sweeps",
        url: "/app/banking/sweeps",
        icon: ArrowDownUp,
      },
    ],
  },
  {
    title: "Accounting",
    url: "/app/accounting",
    icon: Receipt,
  },
  {
    title: "Admin",
    url: "/app/admin",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar 
      className="border-r border-slate-200 sidebar-white-bg"
      style={{ 
        backgroundColor: '#ffffff !important',
        backgroundImage: 'none !important',
        filter: 'none !important'
      }}
    >
      <SidebarHeader 
        className="p-6 border-b border-slate-100 sidebar-white-bg"
        style={{ backgroundColor: '#ffffff !important' }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-elastic-navy-600 via-elastic-teal-500 to-elastic-green-500"></div>
            <span className="text-white font-bold text-lg relative z-10">iT</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">iTea HQ</h2>
            <p className="text-sm text-slate-500 font-medium">Trading Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent 
        className="p-4 sidebar-white-bg"
        style={{ backgroundColor: '#ffffff !important' }}
      >
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-semibold text-xs uppercase tracking-wider mb-3 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-elastic-navy-700 transition-all duration-200 group-data-[state=open]/collapsible:bg-slate-50 group-data-[state=open]/collapsible:text-elastic-navy-700">
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-2 ml-2 space-y-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                  location.pathname === subItem.url 
                                    ? "bg-gradient-to-r from-elastic-navy-600 via-elastic-teal-500 to-elastic-green-500 text-white shadow-lg" 
                                    : "text-slate-600 hover:bg-slate-50 hover:text-elastic-teal-700"
                                }`}
                              >
                                <Link to={subItem.url} className="flex items-center space-x-3 w-full">
                                  <subItem.icon className="w-4 h-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        location.pathname === item.url 
                          ? "bg-gradient-to-r from-elastic-navy-600 via-elastic-teal-500 to-elastic-green-500 text-white shadow-lg" 
                          : "text-slate-700 hover:bg-slate-50 hover:text-elastic-teal-700"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center space-x-3 w-full">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}