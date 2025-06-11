import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Bell, AlertTriangle, AlertCircle, CheckCircle, Clock, Send, Filter, Search, MoreVertical } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  description: string;
  category: "invoice" | "margin" | "system" | "auction" | "payment" | "compliance";
  priority: "high" | "medium" | "low";
  status: "unread" | "read" | "resolved" | "dismissed";
  createdAt: string;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
  actionRequired: boolean;
  assignedTo?: string;
}

export default function Alerts() {
  const { user } = useAuth();
  const { subscribe } = useWebSocket();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock alerts data - in production this would come from API
  const mockAlerts: Alert[] = [
    {
      id: "ALT-001",
      type: "critical",
      title: "Overdue Invoice Payment",
      description: "Invoice INV-8904 is 5 days overdue. Immediate action required.",
      category: "invoice",
      priority: "high",
      status: "unread",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      relatedEntity: {
        type: "invoice",
        id: "INV-8904",
        name: "Invoice INV-8904"
      },
      actionRequired: true,
      assignedTo: user?.role === "ops_admin" ? "admin" : undefined
    },
    {
      id: "ALT-002",
      type: "warning",
      title: "Margin Call Required",
      description: "Lot #3456 requires additional margin of $12,500 due to price volatility.",
      category: "margin",
      priority: "high",
      status: "unread",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      relatedEntity: {
        type: "lot",
        id: "LOT-3456",
        name: "Lot #3456"
      },
      actionRequired: true
    },
    {
      id: "ALT-003",
      type: "info",
      title: "Auction Starting Soon",
      description: "Premium PEKOE auction begins in 30 minutes. 15 lots available.",
      category: "auction",
      priority: "medium",
      status: "read",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      actionRequired: false
    },
    {
      id: "ALT-004",
      type: "success",
      title: "Payment Processed",
      description: "Wire transfer of $45,230 has been successfully processed and cleared.",
      category: "payment",
      priority: "low",
      status: "read",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      relatedEntity: {
        type: "payment",
        id: "PAY-12345",
        name: "Payment PAY-12345"
      },
      actionRequired: false
    },
    {
      id: "ALT-005",
      type: "warning",
      title: "System Maintenance Scheduled",
      description: "Planned maintenance window scheduled for tonight 2:00-4:00 AM UTC.",
      category: "system",
      priority: "medium",
      status: "unread",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      actionRequired: false
    }
  ];

  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  // WebSocket subscription for real-time alerts
  useEffect(() => {
    const unsubscribe = subscribe?.("newAlert", (alertData: Alert) => {
      setAlerts(prev => [alertData, ...prev]);
      toast({
        title: "New Alert",
        description: alertData.title,
        variant: alertData.type === "critical" ? "destructive" : "default"
      });
    });

    return unsubscribe;
  }, [subscribe, toast]);

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: "read" } : alert
      )
    );
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: "resolved" } : alert
      )
    );
    toast({
      title: "Alert Resolved",
      description: "Alert has been marked as resolved"
    });
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: "dismissed" } : alert
      )
    );
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-status-red" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-status-amber" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-status-green" />;
      default:
        return <Bell className="w-5 h-5 text-status-blue" />;
    }
  };

  const getAlertBadgeColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "bg-status-red text-white";
      case "warning":
        return "bg-status-amber text-white";
      case "success":
        return "bg-status-green text-white";
      default:
        return "bg-status-blue text-white";
    }
  };

  const getPriorityColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "high":
        return "text-status-red";
      case "medium":
        return "text-status-amber";
      default:
        return "text-status-blue";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Filter alerts based on selected filters and search
  const filteredAlerts = alerts.filter(alert => {
    if (filterType !== "all" && alert.type !== filterType) return false;
    if (filterStatus !== "all" && alert.status !== filterStatus) return false;
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !alert.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Role-based filtering
    if (user?.role === "producer" && !["auction", "payment", "margin"].includes(alert.category)) return false;
    if (user?.role === "buyer" && !["auction", "invoice", "payment", "margin"].includes(alert.category)) return false;
    
    return true;
  });

  const unreadCount = alerts.filter(alert => alert.status === "unread").length;
  const actionRequiredCount = alerts.filter(alert => alert.actionRequired && alert.status !== "resolved").length;

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
          <p className="text-slate-600">Manage notifications and system alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-status-red text-white">
            {unreadCount} Unread
          </Badge>
          {actionRequiredCount > 0 && (
            <Badge className="bg-status-amber text-white">
              {actionRequiredCount} Action Required
            </Badge>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="action-required">Action Required</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  alert.status === "unread" ? "border-l-4 border-l-accent bg-blue-50/30" : ""
                }`}
                onClick={() => {
                  setSelectedAlert(alert);
                  if (alert.status === "unread") {
                    handleMarkAsRead(alert.id);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${
                            alert.status === "unread" ? "text-slate-900" : "text-slate-700"
                          }`}>
                            {alert.title}
                          </h3>
                          <Badge className={getAlertBadgeColor(alert.type)}>
                            {alert.type}
                          </Badge>
                          {alert.actionRequired && (
                            <Badge className="bg-status-amber text-white">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(alert.createdAt)}
                          </span>
                          <span className={`font-medium ${getPriorityColor(alert.priority)}`}>
                            {alert.priority.toUpperCase()} PRIORITY
                          </span>
                          {alert.relatedEntity && (
                            <span>Related: {alert.relatedEntity.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {alert.status === "unread" && (
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                      )}
                      {alert.actionRequired && alert.status !== "resolved" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolveAlert(alert.id);
                          }}
                          className="bg-status-green hover:bg-status-green/90 text-white"
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No alerts found</h3>
                  <p className="text-slate-600">
                    {searchQuery ? "Try adjusting your search or filters" : "You're all caught up!"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <div className="space-y-3">
            {filteredAlerts.filter(alert => alert.type === "critical").map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-status-red">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <AlertTriangle className="w-5 h-5 text-status-red" />
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 mb-1">{alert.title}</h3>
                        <p className="text-sm text-slate-600">{alert.description}</p>
                        <div className="text-xs text-slate-500 mt-2">
                          {formatTimeAgo(alert.createdAt)}
                        </div>
                      </div>
                    </div>
                    {alert.actionRequired && (
                      <Button
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="bg-status-red hover:bg-status-red/90 text-white"
                      >
                        Take Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="action-required" className="space-y-4">
          <div className="space-y-3">
            {filteredAlerts.filter(alert => alert.actionRequired && alert.status !== "resolved").map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-status-amber">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 mb-1">{alert.title}</h3>
                        <p className="text-sm text-slate-600">{alert.description}</p>
                        <div className="text-xs text-slate-500 mt-2">
                          {formatTimeAgo(alert.createdAt)}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                      className="bg-status-amber hover:bg-status-amber/90 text-white"
                    >
                      Resolve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-3">
            {filteredAlerts.slice(0, 10).map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">{alert.title}</h3>
                      <p className="text-sm text-slate-600">{alert.description}</p>
                      <div className="text-xs text-slate-500 mt-2">
                        {formatTimeAgo(alert.createdAt)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getAlertIcon(selectedAlert.type)}
                <span>{selectedAlert.title}</span>
                <Badge className={getAlertBadgeColor(selectedAlert.type)}>
                  {selectedAlert.type}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">Description</Label>
                <p className="text-sm text-slate-900 mt-1">{selectedAlert.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Priority</Label>
                  <p className={`text-sm font-medium mt-1 ${getPriorityColor(selectedAlert.priority)}`}>
                    {selectedAlert.priority.toUpperCase()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Status</Label>
                  <p className="text-sm text-slate-900 mt-1 capitalize">{selectedAlert.status}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">Created</Label>
                <p className="text-sm text-slate-900 mt-1">
                  {new Date(selectedAlert.createdAt).toLocaleString()}
                </p>
              </div>

              {selectedAlert.relatedEntity && (
                <div>
                  <Label className="text-sm font-medium text-slate-700">Related Entity</Label>
                  <p className="text-sm text-slate-900 mt-1">
                    {selectedAlert.relatedEntity.type}: {selectedAlert.relatedEntity.name}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleDismissAlert(selectedAlert.id)}
                >
                  Dismiss
                </Button>
                {selectedAlert.actionRequired && selectedAlert.status !== "resolved" && (
                  <Button
                    onClick={() => {
                      handleResolveAlert(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                    className="bg-status-green hover:bg-status-green/90 text-white"
                  >
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
