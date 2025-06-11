import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, Users, Database, Activity, AlertTriangle, Shield, 
  UserPlus, Edit, Trash2, Eye, RefreshCw, Download, Upload,
  Server, BarChart3, Clock, CheckCircle, XCircle, Search,
  MoreVertical, Bell, Mail
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SystemUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  workspace: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalLots: number;
  activeBids: number;
  totalRevenue: string;
  systemUptime: string;
  avgResponseTime: number;
  errorRate: number;
}

interface AuditLog {
  id: string;
  userId: number;
  username: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details?: any;
}

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Restrict access to admin users only
  if (!user || user.role !== "ops_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Admin Access Required</h1>
            <p className="text-sm text-slate-600">
              This section is only available to operations administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock data - in production this would come from APIs
  const mockUsers: SystemUser[] = [
    {
      id: 1,
      username: "sarah.chen",
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah.chen@buyer.com",
      role: "buyer",
      workspace: "Buyer",
      isActive: true,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: "2024-01-15T00:00:00Z"
    },
    {
      id: 2,
      username: "john.producer",
      firstName: "John",
      lastName: "Kamau",
      email: "john.kamau@producer.com",
      role: "producer",
      workspace: "Producer",
      isActive: true,
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      createdAt: "2024-01-10T00:00:00Z"
    },
    {
      id: 3,
      username: "board.member",
      firstName: "Mary",
      lastName: "Wanjiku",
      email: "mary.wanjiku@ktda.com",
      role: "ktda_ro",
      workspace: "KTDA Board",
      isActive: true,
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: "2024-01-05T00:00:00Z"
    },
    {
      id: 4,
      username: "inactive.user",
      firstName: "Inactive",
      lastName: "User",
      email: "inactive@example.com",
      role: "buyer",
      workspace: "Buyer",
      isActive: false,
      createdAt: "2023-12-01T00:00:00Z"
    }
  ];

  const mockMetrics: SystemMetrics = {
    totalUsers: 247,
    activeUsers: 189,
    totalLots: 1847,
    activeBids: 342,
    totalRevenue: "$2,847,356",
    systemUptime: "99.8%",
    avgResponseTime: 245,
    errorRate: 0.12
  };

  const mockAuditLogs: AuditLog[] = [
    {
      id: "LOG-001",
      userId: 1,
      username: "sarah.chen",
      action: "LOGIN",
      resource: "authentication",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      details: { success: true }
    },
    {
      id: "LOG-002",
      userId: 2,
      username: "john.producer",
      action: "CREATE_LOT",
      resource: "lots",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0...",
      details: { lotId: "LOT-3456", grade: "PEKOE" }
    },
    {
      id: "LOG-003",
      userId: 1,
      username: "sarah.chen",
      action: "PLACE_BID",
      resource: "bids",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      details: { lotId: "LOT-3456", amount: 4.85 }
    }
  ];

  const [users] = useState<SystemUser[]>(mockUsers);
  const [metrics] = useState<SystemMetrics>(mockMetrics);
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);

  const handleToggleUserStatus = (userId: number) => {
    toast({
      title: "User Status Updated",
      description: "User account status has been updated successfully"
    });
  };

  const handleDeleteUser = (userId: number) => {
    toast({
      title: "User Deleted",
      description: "User account has been permanently deleted",
      variant: "destructive"
    });
  };

  const handleCreateUser = (userData: any) => {
    toast({
      title: "User Created",
      description: "New user account has been created successfully"
    });
    setUserModalOpen(false);
  };

  const handleSystemAction = (action: string) => {
    toast({
      title: "System Action",
      description: `${action} completed successfully`
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ops_admin":
        return "bg-status-red text-white";
      case "ktda_ro":
        return "bg-primary text-white";
      case "buyer":
        return "bg-accent text-white";
      case "producer":
        return "bg-status-green text-white";
      default:
        return "bg-status-grey text-white";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">System administration and user management</p>
        </div>
        <Badge className="bg-status-red text-white">
          <Shield className="w-4 h-4 mr-1" />
          Admin Access
        </Badge>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.totalUsers}</p>
                <p className="text-sm text-status-green">{metrics.activeUsers} active</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">System Uptime</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.systemUptime}</p>
                <p className="text-sm text-status-green">Excellent</p>
              </div>
              <Server className="w-8 h-8 text-status-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Response Time</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.avgResponseTime}ms</p>
                <p className="text-sm text-status-green">Optimal</p>
              </div>
              <Activity className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Error Rate</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.errorRate}%</p>
                <p className="text-sm text-status-green">Low</p>
              </div>
              <BarChart3 className="w-8 h-8 text-status-amber" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateUser({});
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" required />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="producer">Producer</SelectItem>
                          <SelectItem value="buyer">Buyer</SelectItem>
                          <SelectItem value="ktda_ro">KTDA Board</SelectItem>
                          <SelectItem value="ops_admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button type="button" variant="outline" onClick={() => setUserModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create User</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Workspace</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-slate-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-slate-600">{user.email}</div>
                            <div className="text-xs text-slate-500">@{user.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">{user.workspace}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              user.isActive ? "bg-status-green" : "bg-status-grey"
                            }`}></div>
                            <span className="text-sm">
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {user.lastLogin ? formatTimeAgo(user.lastLogin) : "Never"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={() => handleToggleUserStatus(user.id)}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-status-red hover:text-status-red/80"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleSystemAction("Cache Clear")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear System Cache
                </Button>
                <Button 
                  onClick={() => handleSystemAction("Database Backup")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Backup Database
                </Button>
                <Button 
                  onClick={() => handleSystemAction("Export Data")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export System Data
                </Button>
                <Button 
                  onClick={() => handleSystemAction("Import Data")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Database Status</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-status-green" />
                    <span className="text-sm text-status-green">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">API Services</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-status-green" />
                    <span className="text-sm text-status-green">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">WebSocket</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-status-green" />
                    <span className="text-sm text-status-green">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Storage</span>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-status-amber" />
                    <span className="text-sm text-status-amber">78% Used</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Resource</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">{log.username}</td>
                        <td className="px-6 py-4">
                          <Badge className="bg-accent text-white">{log.action}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">{log.resource}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{log.ipAddress}</td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">User Registration</Label>
                    <p className="text-xs text-slate-500">Allow new user self-registration</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-slate-500">Send system email notifications</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Maintenance Mode</Label>
                    <p className="text-xs text-slate-500">Enable system maintenance mode</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Audit Logging</Label>
                    <p className="text-xs text-slate-500">Log all user actions</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>
                <div>
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input id="max-login-attempts" type="number" defaultValue="5" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-slate-500">Require 2FA for admin users</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <Button className="w-full">Save Security Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active Sessions</span>
                  <span className="text-lg font-semibold text-slate-900">147</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">API Requests/min</span>
                  <span className="text-lg font-semibold text-slate-900">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active Auctions</span>
                  <span className="text-lg font-semibold text-slate-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">WebSocket Connections</span>
                  <span className="text-lg font-semibold text-slate-900">289</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-status-amber" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">High CPU Usage</p>
                    <p className="text-xs text-slate-600">Server load at 85%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Bell className="w-5 h-5 text-status-blue" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Scheduled Maintenance</p>
                    <p className="text-xs text-slate-600">Tonight 2:00-4:00 AM UTC</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-status-green" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Backup Completed</p>
                    <p className="text-xs text-slate-600">Daily backup successful</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
