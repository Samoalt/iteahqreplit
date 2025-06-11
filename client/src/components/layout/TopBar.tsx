import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Clock } from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";

export default function TopBar() {
  const { user } = useAuth();
  const [auctionTimer, setAuctionTimer] = useState({ hours: 2, minutes: 15, seconds: 43 });

  useEffect(() => {
    const interval = setInterval(() => {
      setAuctionTimer(prev => {
        let { hours, minutes, seconds } = prev;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              // Reset timer for demo purposes
              return { hours: 2, minutes: 15, seconds: 43 };
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Live Auction Timer */}
          <div className="flex items-center space-x-2 bg-status-green text-white px-3 py-2 rounded-lg animate-pulse-subtle">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">
              {formatTime(auctionTimer.hours)}:{formatTime(auctionTimer.minutes)}:{formatTime(auctionTimer.seconds)}
            </span>
            <span className="text-xs">LIVE</span>
          </div>

          {/* Status Bar */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-status-red rounded-full"></div>
              <span>12 Unmatched</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-status-amber rounded-full"></div>
              <span>8 Review</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-status-blue rounded-full"></div>
              <span>15 Processing</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-status-green rounded-full"></div>
              <span>45 Paid</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Workspace Switcher */}
          <div className="relative">
            <select 
              className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue={user.workspace === "Buyer" ? "buyer" : user.workspace === "Producer" ? "producer" : "ktda"}
            >
              <option value="producer">Producer Workspace</option>
              <option value="buyer">Buyer Workspace</option>
              <option value="ktda">KTDA Board</option>
            </select>
          </div>

          {/* User Avatar & Role */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-slate-500">
                {user.role === "buyer" ? "Buyer • Premium" :
                 user.role === "producer" ? "Producer • Verified" :
                 user.role === "ktda_ro" ? "KTDA • Board Member" :
                 "Admin • Operations"}
              </div>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
