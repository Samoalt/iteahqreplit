
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area, AreaChart } from 'recharts'

interface ChartProps {
  selectedMarket: string
  selectedOrganization: string | null
  selectedFactories: string[]
}

const marketData: Record<string, any> = {
  kenya: {
    weeklyTrend: [
      { week: 'Week 1', avgPrice: 320, volume: 180000, bids: 145, currency: 'KES' },
      { week: 'Week 2', avgPrice: 335, volume: 195000, bids: 152, currency: 'KES' },
      { week: 'Week 3', avgPrice: 342, volume: 175000, bids: 138, currency: 'KES' },
      { week: 'Week 4', avgPrice: 356, volume: 210000, bids: 161, currency: 'KES' },
      { week: 'Week 5', avgPrice: 348, volume: 188000, bids: 155, currency: 'KES' },
      { week: 'Week 6', avgPrice: 362, volume: 225000, bids: 167, currency: 'KES' }
    ],
    organizationShare: [
      { name: 'KTDA', value: 60, volume: 1350000, color: '#0891b2' },
      { name: 'Unilever', value: 15, volume: 337500, color: '#059669' },
      { name: 'Kakuzi', value: 8, volume: 180000, color: '#dc2626' },
      { name: 'Williamson', value: 7, volume: 157500, color: '#7c3aed' },
      { name: 'Others', value: 10, volume: 225000, color: '#64748b' }
    ]
  },
  rwanda: {
    weeklyTrend: [
      { week: 'Week 1', avgPrice: 4680, volume: 45000, bids: 85, currency: 'RWF' },
      { week: 'Week 2', avgPrice: 4720, volume: 52000, bids: 92, currency: 'RWF' },
      { week: 'Week 3', avgPrice: 4650, volume: 48000, bids: 88, currency: 'RWF' },
      { week: 'Week 4', avgPrice: 4780, volume: 58000, bids: 95, currency: 'RWF' },
      { week: 'Week 5', avgPrice: 4850, volume: 55000, bids: 90, currency: 'RWF' },
      { week: 'Week 6', avgPrice: 4920, volume: 62000, bids: 98, currency: 'RWF' }
    ],
    organizationShare: [
      { name: 'Rwanda Tea Board', value: 45, volume: 292500, color: '#0891b2' },
      { name: 'Pfunda Tea', value: 25, volume: 162500, color: '#059669' },
      { name: 'SORWATHE', value: 20, volume: 130000, color: '#dc2626' },
      { name: 'Others', value: 10, volume: 65000, color: '#64748b' }
    ]
  }
}

const factoryPerformance = [
  { name: 'Githunguri', performance: 95, volume: 24000, efficiency: 88, grade: 'A' },
  { name: 'Kangaita', performance: 92, volume: 18000, efficiency: 85, grade: 'A' },
  { name: 'Kimunye', performance: 78, volume: 21000, efficiency: 72, grade: 'B' },
  { name: 'Gatunguru', performance: 85, volume: 16000, efficiency: 80, grade: 'A' }
]

const COLORS = ['#0891b2', '#059669', '#dc2626', '#7c3aed', '#64748b']

export const EnhancedTradePulseCharts = ({ selectedMarket, selectedOrganization, selectedFactories }: ChartProps) => {
  const currentMarketData = marketData[selectedMarket] || marketData.kenya
  
  return (
    <div className="space-y-6">
      {/* Market Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price & Volume Trends */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Price & Volume Trends ({currentMarketData.weeklyTrend[0]?.currency || 'USD'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={currentMarketData.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area yAxisId="right" type="monotone" dataKey="volume" fill="#0891b2" fillOpacity={0.1} />
                <Line yAxisId="left" type="monotone" dataKey="avgPrice" stroke="#dc2626" strokeWidth={3} name="Avg Price" />
                <Bar yAxisId="right" dataKey="bids" fill="#059669" name="Bids" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Organization Market Share */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Organization Market Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={currentMarketData.organizationShare}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {currentMarketData.organizationShare.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value}% (${props.payload.volume.toLocaleString()} kg)`,
                    'Market Share'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Factory Performance (shown when organization is selected) */}
      {selectedOrganization && (
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Factory Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={factoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar yAxisId="left" dataKey="performance" fill="#0891b2" name="Performance Score" />
                <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#dc2626" strokeWidth={3} name="Efficiency %" />
                <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#059669" strokeWidth={2} name="Volume (000s kg)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Comparative Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Distribution */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Regional Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Central', 'Western', 'Eastern', 'Northern'].map((region, index) => (
                <div key={region} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{region}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${[45, 30, 20, 5][index]}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{[45, 30, 20, 5][index]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Grades */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Quality Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { grade: 'Premium A', percentage: 35, color: 'bg-green-600' },
                { grade: 'Grade A', percentage: 45, color: 'bg-blue-600' },
                { grade: 'Grade B', percentage: 15, color: 'bg-yellow-600' },
                { grade: 'Grade C', percentage: 5, color: 'bg-red-600' }
              ].map((item) => (
                <div key={item.grade} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.grade}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Trends */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Market Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Price Volatility', value: 'Low', color: 'text-green-600' },
                { label: 'Demand', value: 'High', color: 'text-blue-600' },
                { label: 'Supply', value: 'Stable', color: 'text-slate-600' },
                { label: 'Export Growth', value: '+12%', color: 'text-green-600' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
