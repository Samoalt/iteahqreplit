
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Award, AlertTriangle, Download, Target } from "lucide-react"

interface BIProps {
  selectedMarket: string
  selectedOrganization: string | null
}

const performanceMetrics = {
  kenya: {
    topPerformers: [
      { name: 'Githunguri Factory', score: 96, trend: 'up', change: '+2.3%', org: 'KTDA' },
      { name: 'Kangaita Factory', score: 94, trend: 'up', change: '+1.8%', org: 'KTDA' },
      { name: 'Brookside Estate', score: 92, trend: 'up', change: '+3.1%', org: 'Unilever' },
      { name: 'Kimunye Factory', score: 89, trend: 'down', change: '-0.5%', org: 'KTDA' }
    ],
    alerts: [
      { type: 'warning', message: 'Gatunguru Factory efficiency below 75%', priority: 'high' },
      { type: 'info', message: 'New quality standards effective next month', priority: 'medium' },
      { type: 'success', message: 'Q4 export targets exceeded by 12%', priority: 'low' }
    ],
    kpis: [
      { label: 'Overall Efficiency', value: '87.5%', target: '85%', status: 'above' },
      { label: 'Quality Score', value: '4.2/5', target: '4.0/5', status: 'above' },
      { label: 'Market Share', value: '58.3%', target: '60%', status: 'below' },
      { label: 'Cost per KG', value: 'KES 285', target: 'KES 300', status: 'above' }
    ]
  },
  rwanda: {
    topPerformers: [
      { name: 'Pfunda Main', score: 93, trend: 'up', change: '+4.2%', org: 'Pfunda Tea' },
      { name: 'Gatare Factory', score: 91, trend: 'up', change: '+2.1%', org: 'RTB' },
      { name: 'Sorwathe Central', score: 88, trend: 'stable', change: '0%', org: 'SORWATHE' },
      { name: 'Mulindi Factory', score: 85, trend: 'up', change: '+1.5%', org: 'RTB' }
    ],
    alerts: [
      { type: 'success', message: 'Export volume increased 18% this quarter', priority: 'low' },
      { type: 'warning', message: 'Seasonal capacity constraints expected', priority: 'medium' },
      { type: 'info', message: 'New processing equipment installation complete', priority: 'low' }
    ],
    kpis: [
      { label: 'Processing Efficiency', value: '92.1%', target: '90%', status: 'above' },
      { label: 'Export Quality', value: '4.6/5', target: '4.3/5', status: 'above' },
      { label: 'Local Market Share', value: '34.2%', target: '35%', status: 'below' },
      { label: 'Revenue Growth', value: '+15.3%', target: '+12%', status: 'above' }
    ]
  }
}

export const BusinessIntelligence = ({ selectedMarket, selectedOrganization }: BIProps) => {
  const currentMetrics = performanceMetrics[selectedMarket as keyof typeof performanceMetrics] || performanceMetrics.kenya

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-slate-600'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'success': return <Award className="h-4 w-4 text-green-600" />
      default: return <AlertTriangle className="h-4 w-4 text-blue-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-50 border-orange-200'
      case 'success': return 'bg-green-50 border-green-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  const getKPIStatus = (status: string) => {
    switch (status) {
      case 'above': return { color: 'text-green-600', bg: 'bg-green-100' }
      case 'below': return { color: 'text-red-600', bg: 'bg-red-100' }
      default: return { color: 'text-slate-600', bg: 'bg-slate-100' }
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Dashboard */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">
              Key Performance Indicators
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {currentMetrics.kpis.map((kpi, index) => {
              const statusStyle = getKPIStatus(kpi.status)
              return (
                <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">{kpi.label}</span>
                    <Target className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-slate-900">{kpi.value}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Target: {kpi.target}</span>
                      <Badge className={`${statusStyle.bg} ${statusStyle.color} text-xs`}>
                        {kpi.status === 'above' ? '↑' : '↓'} {kpi.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentMetrics.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-slate-400' : 
                      index === 2 ? 'bg-orange-600' : 'bg-slate-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{performer.name}</div>
                      <div className="text-sm text-slate-500">{performer.org}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{performer.score}</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(performer.trend)}
                      <span className={`text-sm ${getTrendColor(performer.trend)}`}>
                        {performer.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentMetrics.alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{alert.message}</p>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance League Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Factory Performance League
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">Rank</th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">Factory</th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">Organization</th>
                  <th className="text-right p-3 text-sm font-semibold text-slate-700">Score</th>
                  <th className="text-right p-3 text-sm font-semibold text-slate-700">Volume (kg)</th>
                  <th className="text-right p-3 text-sm font-semibold text-slate-700">Efficiency</th>
                  <th className="text-right p-3 text-sm font-semibold text-slate-700">Quality</th>
                </tr>
              </thead>
              <tbody>
                {currentMetrics.topPerformers.map((performer, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 text-sm font-medium text-slate-900">#{index + 1}</td>
                    <td className="p-3 text-sm font-medium text-slate-900">{performer.name}</td>
                    <td className="p-3 text-sm text-slate-600">{performer.org}</td>
                    <td className="p-3 text-right text-sm font-bold text-slate-900">{performer.score}</td>
                    <td className="p-3 text-right text-sm text-slate-600">
                      {(Math.random() * 50000 + 20000).toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-sm text-slate-600">
                      {(85 + Math.random() * 15).toFixed(1)}%
                    </td>
                    <td className="p-3 text-right">
                      <Badge className="bg-green-100 text-green-800">Grade A</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
