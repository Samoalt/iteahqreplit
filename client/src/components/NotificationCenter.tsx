import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      return apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4 text-status-red" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-status-amber" />;
      case "medium":
        return <Info className="w-4 h-4 text-status-blue" />;
      default:
        return <CheckCircle className="w-4 h-4 text-status-green" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-status-red";
      case "high":
        return "bg-status-amber";
      case "medium":
        return "bg-status-blue";
      default:
        return "bg-status-green";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-status-red text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification: Notification) => (
                <Card
                  key={notification.id}
                  className={`m-2 cursor-pointer transition-colors hover:bg-slate-50 ${
                    !notification.read ? "bg-blue-50 border-l-4 border-l-primary" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      {getPriorityIcon(notification.priority)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <Badge
                              className={`${getPriorityColor(notification.priority)} text-white text-xs`}
                            >
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}