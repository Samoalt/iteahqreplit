
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const priceData = [
  { month: 'Jan', avgPrice: 4.2, volume: 42000 },
  { month: 'Feb', avgPrice: 4.5, volume: 38000 },
  { month: 'Mar', avgPrice: 4.8, volume: 45000 },
  { month: 'Apr', avgPrice: 4.6, volume: 52000 },
  { month: 'May', avgPrice: 4.9, volume: 47000 },
  { month: 'Jun', avgPrice: 4.7, volume: 48000 },
]

const factoryData = [
  { name: 'Kericho Gardens', value: 35, volume: 15400 },
  { name: 'Nandi Hills', value: 25, volume: 11200 },
  { name: 'Mufindi Estate', value: 20, volume: 8900 },
  { name: 'Luponde Tea', value: 15, volume: 6800 },
  { name: 'Others', value: 5, volume: 2700 },
]

const buyerData = [
  { buyer: 'Global Tea Co.', purchases: 24, value: 186000 },
  { buyer: 'Premium Imports', purchases: 18, value: 142000 },
  { buyer: 'Tea Traders Inc.', purchases: 15, value: 118000 },
  { buyer: 'Export Partners', purchases: 12, value: 94000 },
  { buyer: 'Mountain Coffee', purchases: 8, value: 67000 },
]

const COLORS = ['#1e3a8a', '#0891b2', '#059669', '#10b981', '#16a34a']

export const TradePulseAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Price Trends */}
      <Card className="bg-white border-slate-300 hover:border-slate-400 transition-all duration-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Price & Volume Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.1)'
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="avgPrice" stroke="#0891b2" strokeWidth={3} name="Avg Price ($/kg)" />
              <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#059669" strokeWidth={3} name="Volume (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Factory Performance */}
        <Card className="bg-white border-slate-300 hover:border-slate-400 transition-all duration-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Factory Market Share</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={factoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {factoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Buyers */}
        <Card className="bg-white border-slate-300 hover:border-slate-400 transition-all duration-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Top Buyers by Value</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={buyerData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="buyer" type="category" width={100} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="url(#elasticGradient)" />
                <defs>
                  <linearGradient id="elasticGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="50%" stopColor="#0891b2" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Table */}
      <Card className="bg-white border-slate-300 hover:border-slate-400 transition-all duration-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Detailed Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border border-slate-200 overflow-hidden">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Factory</th>
                  <th className="text-right p-4 text-sm font-semibold text-slate-700">Volume (kg)</th>
                  <th className="text-right p-4 text-sm font-semibold text-slate-700">Avg Price</th>
                  <th className="text-right p-4 text-sm font-semibold text-slate-700">Total Value</th>
                  <th className="text-right p-4 text-sm font-semibold text-slate-700">Market Share</th>
                </tr>
              </thead>
              <tbody>
                {factoryData.map((factory, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200">
                    <td className="p-4 font-medium text-slate-900">{factory.name}</td>
                    <td className="text-right p-4 text-slate-900 font-numeric">{factory.volume.toLocaleString()}</td>
                    <td className="text-right p-4 text-slate-900 font-numeric">$4.{Math.floor(Math.random() * 9) + 1}0</td>
                    <td className="text-right p-4 text-slate-900 font-numeric">${(factory.volume * 4.5).toLocaleString()}</td>
                    <td className="text-right p-4 text-slate-900 font-numeric">{factory.value}%</td>
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
