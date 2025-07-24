
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, CheckCircle } from "lucide-react"
import { Bid } from "@/types/bid"

interface BuyerProfileCardProps {
  bid: Bid
}

export const BuyerProfileCard = ({ bid }: BuyerProfileCardProps) => {
  // Simplified version for use in other contexts like the detail panel
  // Main buyer profile is now in BidOverviewTab
  
  const buyerProfile = {
    email: `${bid.buyerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: '+254 700 123 456',
    creditRating: 'A+',
    isVerified: true
  }

  const handleCall = () => {
    console.log('Call buyer:', bid.buyerName)
  }

  const handleEmail = () => {
    console.log('Email buyer:', bid.buyerName)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900">{bid.buyerName}</h4>
          {buyerProfile.isVerified && (
            <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-600">
            <Mail className="w-4 h-4 mr-2" />
            {buyerProfile.email}
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Phone className="w-4 h-4 mr-2" />
            {buyerProfile.phone}
          </div>
        </div>

        <div className="mb-4 text-sm">
          <span className="text-slate-500">Credit Rating: </span>
          <span className="font-medium text-slate-900">{buyerProfile.creditRating}</span>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={handleCall}>
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-1" />
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
