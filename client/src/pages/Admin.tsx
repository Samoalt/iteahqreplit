import React, { useState } from "react";
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

interface SystemUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  workspace: string;
  status: string;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  pendingInvites: number;
  totalTransactions: number;
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
  
  // All hooks must be called before any conditional returns
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
      email: "sarah.chen@iteaflow.com",
      role: "producer",
      workspace: "Kiambu Factory",
      status: "active",
      lastLogin: "2024-01-15 14:30",
      createdAt: "2023-08-15",
      permissions: ["view_lots", "create_lots", "manage_inventory"]
    },
    {
      id: 2,
      username: "james.mwangi",
      firstName: "James",
      lastName: "Mwangi",
      email: "james.mwangi@iteaflow.com",
      role: "buyer",
      workspace: "Unilever Kenya",
      status: "active",
      lastLogin: "2024-01-15 16:45",
      createdAt: "2023-09-10",
      permissions: ["view_auctions", "place_bids", "manage_payments"]
    },
    {
      id: 3,
      username: "mary.wanjiku",
      firstName: "Mary",
      lastName: "Wanjiku",
      email: "mary.wanjiku@ktda.com",
      role: "ktda_ro",
      workspace: "KTDA Board",
      status: "active",
      lastLogin: "2024-01-15 09:15",
      createdAt: "2023-06-20",
      permissions: ["view_reports", "monitor_compliance", "access_analytics"]
    },
    {
      id: 4,
      username: "admin.user",
      firstName: "System",
      lastName: "Administrator",
      email: "admin@iteaflow.com",
      role: "ops_admin",
      workspace: "iTea Flow Operations",
      status: "active",
      lastLogin: "2024-01-15 17:00",
      createdAt: "2023-05-01",
      permissions: ["full_access"]
    },
    {
      id: 5,
      username: "peter.kamau",
      firstName: "Peter",
      lastName: "Kamau",
      email: "peter.kamau@iteaflow.com",
      role: "producer",
      workspace: "Nyeri Factory",
      status: "pending",
      lastLogin: "Never",
      createdAt: "2024-01-10",
      permissions: ["view_lots", "create_lots"]
    }
  ];

  const systemMetrics: SystemMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    pendingInvites: 23,
    totalTransactions: 15678,
    activeBids: 156,
    totalRevenue: "KES 245,780,000",
    systemUptime: "99.94%",
    avgResponseTime: 142,
    errorRate: 0.02
  };

  const auditLogs: AuditLog[] = [
    {
      id: "audit_001",
      userId: 2,
      username: "james.mwangi",
      action: "PLACE_BID",
      resource: "LOT-3456",
      timestamp: "2024-01-15 16:45:23",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 Chrome/120.0",
      details: { bidAmount: "KES 4,200,000", previousBid: "KES 4,100,000" }
    },
    {
      id: "audit_002",
      userId: 1,
      username: "sarah.chen",
      action: "CREATE_LOT",
      resource: "LOT-3457",
      timestamp: "2024-01-15 14:30:15",
      ipAddress: "10.0.1.50",
      userAgent: "Mozilla/5.0 Safari/17.0",
      details: { lotSize: "500kg", grade: "PEKOE", reservePrice: "KES 3,500,000" }
    },
    {
      id: "audit_003",
      userId: 4,
      username: "admin.user",
      action: "USER_LOGIN",
      resource: "SYSTEM",
      timestamp: "2024-01-15 17:00:00",
      ipAddress: "172.16.0.10",
      userAgent: "Mozilla/5.0 Chrome/120.0",
      details: { loginMethod: "SSO", sessionId: "sess_abc123" }
    },
    {
      id: "audit_004",
      userId: 3,
      username: "mary.wanjiku",
      action: "VIEW_REPORT",
      resource: "ESG_COMPLIANCE",
      timestamp: "2024-01-15 09:15:45",
      ipAddress: "203.0.113.25",
      userAgent: "Mozilla/5.0 Firefox/121.0",
      details: { reportType: "Monthly ESG Summary", factoriesReviewed: 15 }
    }
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = () => {
    toast({
      title: "User Creation",
      description: "User creation functionality would be implemented here.",
    });
  };

  const handleEditUser = (user: SystemUser) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    toast({
      title: "User Deletion",
      description: `User ${userId} deletion would be processed here.`,
      variant: "destructive",
    });
  };

  const handleResetPassword = (userId: number) => {
    toast({
      title: "Password Reset",
      description: `Password reset email sent to user ${userId}.`,
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ops_admin": return "bg-red-100 text-red-800";
      case "ktda_ro": return "bg-purple-100 text-purple-800";
      case "buyer": return "bg-blue-100 text-blue-800";
      case "producer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Administration</h1>
          <p className="text-slate-600">Manage users, monitor system health, and review audit logs</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600">71.5% online rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.systemUptime}</div>
            <p className="text-xs text-green-600">24.8 days continuous</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.errorRate}%</div>
            <p className="text-xs text-green-600">-0.1% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* User Management Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="text-sm text-slate-600">Manage user accounts, roles, and permissions</p>
            </div>
            <Button onClick={handleCreateUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="producer">Producer</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="ktda_ro">KTDA Board</SelectItem>
                <SelectItem value="ops_admin">Operations Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">User</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Workspace</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Last Login</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-slate-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-slate-600">@{user.username}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{user.workspace}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{user.lastLogin}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleResetPassword(user.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        <TabsContent value="system" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">System Health Monitoring</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Avg Response Time</span>
                  <span className="font-medium text-green-600">{systemMetrics.avgResponseTime}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Transactions</span>
                  <span className="font-medium">{systemMetrics.totalTransactions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Bids</span>
                  <span className="font-medium">{systemMetrics.activeBids}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Server Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">API Server: Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Database: Healthy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Cache: Operational</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{systemMetrics.totalRevenue}</div>
                <p className="text-xs text-slate-600">Total platform revenue</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Timestamp</th>
                      <th className="p-4 font-medium">User</th>
                      <th className="p-4 font-medium">Action</th>
                      <th className="p-4 font-medium">Resource</th>
                      <th className="p-4 font-medium">IP Address</th>
                      <th className="p-4 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-slate-50">
                        <td className="p-4 text-sm">{log.timestamp}</td>
                        <td className="p-4 text-sm font-medium">{log.username}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {log.action}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{log.resource}</td>
                        <td className="p-4 text-sm font-mono">{log.ipAddress}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="settings" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-slate-600">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Session Timeout</Label>
                    <p className="text-xs text-slate-600">Auto-logout after inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15min</SelectItem>
                      <SelectItem value="30">30min</SelectItem>
                      <SelectItem value="60">1hr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Maintenance Mode</Label>
                    <p className="text-xs text-slate-600">Enable system maintenance</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Debug Logging</Label>
                    <p className="text-xs text-slate-600">Enable detailed system logs</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Edit Modal */}
      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={selectedUser.firstName} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={selectedUser.lastName} />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={selectedUser.email} />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="producer">Producer</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="ktda_ro">KTDA Board</SelectItem>
                    <SelectItem value="ops_admin">Operations Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setUserModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setUserModalOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}