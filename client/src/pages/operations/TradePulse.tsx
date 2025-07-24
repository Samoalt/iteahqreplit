import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, MapPin, BarChart3, Target, Globe } from "lucide-react"
import { MarketSelector } from "@/components/operations/MarketSelector"
import { OrganizationFilter } from "@/components/operations/OrganizationFilter"
import { EnhancedTradePulseCharts } from "@/components/operations/EnhancedTradePulseCharts"
import { BusinessIntelligence } from "@/components/operations/BusinessIntelligence"

const TradePulse = () => {
  const [selectedMarket, setSelectedMarket] = useState('kenya')
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null)
  const [selectedFactories, setSelectedFactories] = useState<string[]>([])

  // Market-specific data
  const marketData: Record<string, any> = {
    kenya: {
      stats: [
        { label: "Market Price", value: "KES 342/kg", change: "+2.3%", trend: "up", icon: DollarSign },
        { label: "Weekly Volume", value: "2.1M kg", change: "+12.5%", trend: "up", icon: Package },
        { label: "Active Buyers", value: "187", change: "-1.2%", trend: "down", icon: Users },
        { label: "Processing Plants", value: "68", change: "+2", trend: "up", icon: MapPin }
      ],
      marketStatus: "Open",
      nextAuction: "Tomorrow 9:00 AM",
      currency: "KES"
    },
    rwanda: {
      stats: [
        { label: "Market Price", value: "RWF 4,850/kg", change: "+1.8%", trend: "up", icon: DollarSign },
        { label: "Weekly Volume", value: "320K kg", change: "+8.2%", trend: "up", icon: Package },
        { label: "Active Buyers", value: "92", change: "+5.7%", trend: "up", icon: Users },
        { label: "Processing Plants", value: "18", change: "0", trend: "neutral", icon: MapPin }
      ],
      marketStatus: "Open",
      nextAuction: "Today 2:00 PM",
      currency: "RWF"
    }
  }

  const currentMarket = marketData[selectedMarket] || marketData.kenya

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-slate-600'
    }
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
            <Globe className="h-8 w-8 text-blue-600" />
            <span>Trade Pulse</span>
          </h1>
          <p className="text-slate-600 mt-2">Multi-market analytics and trading insights across East Africa</p>
        </div>

        {/* Market & Organization Selectors */}
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 p-4 bg-white rounded-lg border border-slate-200">
          <MarketSelector 
            selectedMarket={selectedMarket} 
            onMarketChange={setSelectedMarket} 
          />
          
          <OrganizationFilter
            selectedMarket={selectedMarket}
            selectedOrganization={selectedOrganization}
            selectedFactories={selectedFactories}
            onOrganizationChange={setSelectedOrganization}
            onFactoriesChange={setSelectedFactories}
          />
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentMarket.stats.map((stat: any, index: number) => (
          <Card key={index} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <stat.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Status Card */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">
              {selectedMarket.charAt(0).toUpperCase() + selectedMarket.slice(1)} Market Status
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">
              {currentMarket.marketStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">Next Auction:</span>
              <span className="text-sm text-slate-600">{currentMarket.nextAuction}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">Currency:</span>
              <Badge variant="outline">{currentMarket.currency}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200">
          <TabsTrigger value="analytics" className="flex items-center space-x-2 text-slate-700 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium">
            <BarChart3 className="h-4 w-4" />
            <span>Market Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center space-x-2 text-slate-700 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium">
            <Target className="h-4 w-4" />
            <span>Business Intelligence</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center space-x-2 text-slate-700 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>Comparative Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <EnhancedTradePulseCharts 
            selectedMarket={selectedMarket}
            selectedOrganization={selectedOrganization}
            selectedFactories={selectedFactories}
          />
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <BusinessIntelligence 
            selectedMarket={selectedMarket}
            selectedOrganization={selectedOrganization}
          />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle>Cross-Market Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>Comparative analysis features coming soon</p>
                <p className="text-sm">Compare performance across markets and organizations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TradePulse
