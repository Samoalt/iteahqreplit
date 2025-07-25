
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { User, LogOut, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlatformTourContext } from "@/contexts/PlatformTourContext";

const Layout: React.FC = () => {
  const { restartTour } = usePlatformTourContext();

  const handleLogout = () => {
    // Handle logout logic here - redirect to login page (now at root)
    window.location.href = '/';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="p-2 border-b border-gray-200 bg-white flex items-center justify-between">
            <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors" />
            
            {/* Top Header with Elastic Logo and Profile */}
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/1e952d7e-6934-4496-a7b0-f74f47fa64ce.png" 
                alt="Elastic" 
                className="h-8 w-auto"
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200"
                    data-testid="user-profile"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        john.doe@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={restartTour} className="text-teal-600 focus:text-teal-600">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Platform Tour</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

import { ReactNode } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { NotificationCenter } from "@/components/NotificationCenter";
import { PlatformTour } from "@/components/tour/PlatformTour";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <AppSidebar />
      <SidebarInset className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
      <NotificationCenter />
      <PlatformTour />
    </div>
  );
}
