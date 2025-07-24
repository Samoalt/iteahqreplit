
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin } from "lucide-react"

interface Market {
  id: string
  name: string
  country: string
  currency: string
  flag: string
  status: 'active' | 'closed' | 'upcoming'
}

const markets: Market[] = [
  { id: 'kenya', name: 'Kenya Tea Market', country: 'Kenya', currency: 'KES', flag: '🇰🇪', status: 'active' },
  { id: 'rwanda', name: 'Rwanda Tea Market', country: 'Rwanda', currency: 'RWF', flag: '🇷🇼', status: 'active' },
  { id: 'tanzania', name: 'Tanzania Tea Market', country: 'Tanzania', currency: 'TZS', flag: '🇹🇿', status: 'active' },
  { id: 'malawi', name: 'Malawi Tea Market', country: 'Malawi', currency: 'MWK', flag: '🇲🇼', status: 'closed' },
  { id: 'uganda', name: 'Uganda Tea Market', country: 'Uganda', currency: 'UGX', flag: '🇺🇬', status: 'upcoming' }
]

interface MarketSelectorProps {
  selectedMarket: string
  onMarketChange: (marketId: string) => void
}

export const MarketSelector = ({ selectedMarket, onMarketChange }: MarketSelectorProps) => {
  const currentMarket = markets.find(m => m.id === selectedMarket)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-red-100 text-red-800'
      case 'upcoming': return 'bg-orange-100 text-orange-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Market:</span>
      </div>
      
      <Select value={selectedMarket} onValueChange={onMarketChange}>
        <SelectTrigger className="w-64">
          <SelectValue>
            {currentMarket && (
              <div className="flex items-center space-x-2">
                <span className="text-lg">{currentMarket.flag}</span>
                <span>{currentMarket.name}</span>
                <Badge className={getStatusColor(currentMarket.status)}>
                  {currentMarket.status}
                </Badge>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {markets.map((market) => (
            <SelectItem key={market.id} value={market.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{market.flag}</span>
                  <div>
                    <div className="font-medium">{market.name}</div>
                    <div className="text-xs text-slate-500">{market.currency}</div>
                  </div>
                </div>
                <Badge className={getStatusColor(market.status)}>
                  {market.status}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
