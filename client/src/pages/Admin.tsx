import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Users, Activity, Shield } from "lucide-react"
import { AddUserModal } from "@/components/admin/AddUserModal"
import { MetricDrilldownModal } from "@/components/common/MetricDrilldownModal"

const Admin = () => {
  const [users, setUsers] = useState([
    { name: "John Doe", role: "Admin", email: "john@itea.com", status: "active" },
    { name: "Alex Kamau", role: "Approver", email: "alex@itea.com", status: "active" },
    { name: "Kepha Rinsyi", role: "Initiator", email: "kepha@itea.com", status: "active" },
    { name: "Martin Obanda", role: "Viewer", email: "martin@itea.com", status: "active" },
  ])

  const [drilldownOpen, setDrilldownOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<any>(null)

  const handleUserAdded = (newUser: { name: string; email: string; role: string }) => {
    setUsers(prev => [...prev, { ...newUser, status: "active" }])
  }

  const handleMetricClick = (metricType: string) => {
    let drilldownData = null

    switch (metricType) {
      case 'total-users':
        drilldownData = {
          title: 'Total Users',
          value: users.length,
          trend: '+2 this month',
          details: [
            { label: 'Active Users', value: users.filter(u => u.status === 'active').length, description: 'Currently active in the system' },
            { label: 'Inactive Users', value: users.filter(u => u.status !== 'active').length, description: 'Temporarily disabled accounts' },
            { label: 'New This Month', value: 2, description: 'Recently added users' },
            { label: 'Last Login Today', value: Math.floor(users.length * 0.7), description: 'Users active today' }
          ]
        }
        break
      case 'active-users':
        drilldownData = {
          title: 'Active Users',
          value: users.filter(u => u.status === 'active').length,
          trend: '100% active rate',
          details: [
            { label: 'Online Now', value: Math.floor(users.length * 0.3), description: 'Currently logged in' },
            { label: 'Active Today', value: Math.floor(users.length * 0.7), description: 'Logged in within 24 hours' },
            { label: 'Active This Week', value: users.filter(u => u.status === 'active').length, description: 'Active within 7 days' },
            { label: 'Average Session Time', value: '2.5 hrs', description: 'Average time spent per session' }
          ]
        }
        break
      case 'admins':
        const adminUsers = users.filter(u => u.role === 'Admin')
        drilldownData = {
          title: 'Admin Users',
          value: adminUsers.length,
          trend: 'Stable count',
          details: [
            { label: 'Super Admins', value: 1, description: 'Full system access' },
            { label: 'Regular Admins', value: adminUsers.length - 1, description: 'Limited admin privileges' },
            { label: 'Recent Admin Actions', value: 23, description: 'Actions taken this week' },
            { label: 'Pending Approvals', value: 5, description: 'Items awaiting admin review' }
          ]
        }
        break
      case 'activity-logs':
        drilldownData = {
          title: 'Activity Logs',
          value: 156,
          trend: '+12 today',
          details: [
            { label: 'User Logins', value: 89, description: 'Successful login attempts' },
            { label: 'System Changes', value: 34, description: 'Configuration updates' },
            { label: 'Error Events', value: 12, description: 'System errors logged' },
            { label: 'Security Events', value: 21, description: 'Security-related activities' }
          ]
        }
        break
    }

    setSelectedMetric(drilldownData)
    setDrilldownOpen(true)
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="elastic-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold elastic-gradient-text mb-2">Admin Center</h1>
            <p className="text-slate-600 text-lg">Platform control, users, and system settings</p>
          </div>
          <AddUserModal onUserAdded={handleUserAdded} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 elastic-slide-up">
        <div className="elastic-metric-card group cursor-pointer" onClick={() => handleMetricClick('total-users')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-elastic-teal-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="elastic-metric-card group cursor-pointer" onClick={() => handleMetricClick('active-users')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Users</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <Shield className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="elastic-metric-card group cursor-pointer" onClick={() => handleMetricClick('admins')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Admins</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">{users.filter(u => u.role === 'Admin').length}</p>
            </div>
            <Settings className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="elastic-metric-card group cursor-pointer" onClick={() => handleMetricClick('activity-logs')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Activity Logs</p>
              <p className="text-3xl font-bold text-slate-900 font-numeric">156</p>
            </div>
            <Activity className="h-8 w-8 text-elastic-navy-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      <Card className="elastic-card elastic-slide-up">
        <CardHeader>
          <CardTitle className="elastic-gradient-text">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 border border-slate-100 hover:border-slate-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-elastic-teal-50 to-blue-50 rounded-full flex items-center justify-center border border-elastic-teal-200">
                    <span className="text-elastic-teal-700 font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{user.role}</span>
                  <span className={`elastic-badge ${user.status === 'active' ? 'elastic-badge-success' : 'elastic-badge-error'}`}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <MetricDrilldownModal 
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        data={selectedMetric}
      />
    </div>
  )
}

export default Admin
