import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Server, Users, HelpCircle, Activity, Shield, Database } from "lucide-react";

export default function OperationsAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.97%</div>
            <p className="text-xs text-green-600">24.8 days continuous</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+127 new this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-red-600">8 high priority pending</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187ms</div>
            <p className="text-xs text-green-600">-12ms from last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* System Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time System Metrics
            </CardTitle>
            <CardDescription>Current system performance and resource utilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <Progress value={23} className="h-2" />
              <p className="text-xs text-muted-foreground">4 cores @ 2.8GHz average</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm font-medium">67%</span>
              </div>
              <Progress value={67} className="h-2" />
              <p className="text-xs text-muted-foreground">10.7GB of 16GB allocated</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Connections</span>
                <span className="text-sm font-medium">145/200</span>
              </div>
              <Progress value={72} className="h-2" />
              <p className="text-xs text-muted-foreground">55 connections available</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Network I/O</span>
                <span className="text-sm font-medium">892 Mbps</span>
              </div>
              <Progress value={35} className="h-2" />
              <p className="text-xs text-muted-foreground">35% of 2.5Gbps capacity</p>
            </div>
            
            <Button className="w-full" variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              View Detailed Metrics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support Queue
            </CardTitle>
            <CardDescription>Incoming support tickets and their priority levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Payment Gateway Timeout</p>
                    <p className="text-xs text-muted-foreground">Multiple users reporting payment failures</p>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <p className="text-xs text-blue-600 mt-1">Ticket #SYS-2024-0891 • 23 minutes ago</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">Auto-Listing Not Triggering</p>
                    <p className="text-xs text-muted-foreground">Kericho Factory - PEKOE grade rules inactive</p>
                  </div>
                  <Badge variant="outline">High</Badge>
                </div>
                <p className="text-xs text-blue-600 mt-1">Ticket #PRD-2024-0456 • 1 hour ago</p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">API Rate Limit Issues</p>
                    <p className="text-xs text-muted-foreground">FX rate service hitting limits during peak hours</p>
                  </div>
                  <Badge variant="outline">Medium</Badge>
                </div>
                <p className="text-xs text-blue-600 mt-1">Ticket #API-2024-0234 • 3 hours ago</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">User Access Request</p>
                    <p className="text-xs text-muted-foreground">New buyer needs platform access approval</p>
                  </div>
                  <Badge variant="outline">Low</Badge>
                </div>
                <p className="text-xs text-blue-600 mt-1">Ticket #USR-2024-0678 • 6 hours ago</p>
              </div>
            </div>
            
            <Button className="w-full" variant="outline">
              <HelpCircle className="h-4 w-4 mr-2" />
              Manage Support Queue
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Compliance Dashboard
          </CardTitle>
          <CardDescription>System security status and compliance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Security Health
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">SSL Certificates</span>
                  <span className="text-xs font-medium text-green-600">Valid (89 days)</span>
                </div>
                <Progress value={100} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Failed Login Attempts</span>
                  <span className="text-xs font-medium">12 (24h)</span>
                </div>
                <Progress value={8} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Firewall Status</span>
                  <span className="text-xs font-medium text-green-600">Active</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Data Protection
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">Backup Success Rate</span>
                  <span className="text-xs font-medium">100% (7 days)</span>
                </div>
                <Progress value={100} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Encryption Status</span>
                  <span className="text-xs font-medium text-green-600">AES-256 Active</span>
                </div>
                <Progress value={100} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">GDPR Compliance</span>
                  <span className="text-xs font-medium">98% compliant</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Access Control
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">MFA Adoption</span>
                  <span className="text-xs font-medium">87% of users</span>
                </div>
                <Progress value={87} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Admin Sessions</span>
                  <span className="text-xs font-medium">4 active</span>
                </div>
                <Progress value={20} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-xs">Role Permissions</span>
                  <span className="text-xs font-medium text-green-600">Up to date</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Operations
          </CardTitle>
          <CardDescription>Real-time database performance and maintenance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Query Performance</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Avg Response Time</span>
                  <span className="font-medium text-green-600">23ms</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Slow Queries (&gt;1s)</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Cache Hit Rate</span>
                  <span className="font-medium text-green-600">94.7%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Storage</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Database Size</span>
                  <span className="font-medium">847 GB</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Daily Growth</span>
                  <span className="font-medium">+2.3 GB</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Free Space</span>
                  <span className="font-medium text-green-600">1.2 TB</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Maintenance</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Last Backup</span>
                  <span className="font-medium text-green-600">2 hours ago</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Index Optimization</span>
                  <span className="font-medium">Scheduled</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Next Maintenance</span>
                  <span className="font-medium">Sunday 2:00 AM</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Replication</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Primary-Secondary Lag</span>
                  <span className="font-medium text-green-600">0.8s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Replica Status</span>
                  <span className="font-medium text-green-600">Healthy</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Failover Ready</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}