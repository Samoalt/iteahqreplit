
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const weeklyTrendData = [
  { week: 'Week 1', avgPrice: 4.2, volume: 12000, bids: 45 },
  { week: 'Week 2', avgPrice: 4.5, volume: 15000, bids: 52 },
  { week: 'Week 3', avgPrice: 4.8, volume: 13500, bids: 48 },
  { week: 'Week 4', avgPrice: 4.6, volume: 16200, bids: 61 },
  { week: 'Week 5', avgPrice: 4.9, volume: 14800, bids: 55 },
  { week: 'Week 6', avgPrice: 4.7, volume: 17500, bids: 67 }
]

const geographicData = [
  { region: 'Nairobi', percentage: 35, volume: 18500 },
  { region: 'Mombasa', percentage: 25, volume: 13200 },
  { region: 'Kericho', percentage: 20, volume: 10600 },
  { region: 'Nandi', percentage: 15, volume: 7900 },
  { region: 'Other', percentage: 5, volume: 2800 }
]

export const TradePulseCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Auction Trendline */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Weekly Auction Trendline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="week" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString() : value,
                  name === 'avgPrice' ? 'Avg Price ($/kg)' : 
                  name === 'volume' ? 'Volume (kg)' : 'Bids Count'
                ]}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="avgPrice" 
                stroke="#0891b2" 
                strokeWidth={3}
                dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0891b2', strokeWidth: 2 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="bids" 
                stroke="#059669" 
                strokeWidth={3}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-slate-600">Average Price</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-slate-600">Bid Count</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geographicData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="region" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  `${value}%`,
                  'Market Share'
                ]}
              />
              <Bar 
                dataKey="percentage" 
                fill="url(#geographicGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="geographicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="50%" stopColor="#0891b2" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {geographicData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: index === 0 ? '#1e3a8a' : 
                                     index === 1 ? '#0891b2' : 
                                     index === 2 ? '#059669' : 
                                     index === 3 ? '#10b981' : '#16a34a'
                    }}
                  ></div>
                  <span className="text-slate-700">{item.region}</span>
                </div>
                <div className="text-slate-600">
                  {item.percentage}% ({item.volume.toLocaleString()} kg)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
