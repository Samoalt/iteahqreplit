
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Filter, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Organization {
  id: string
  name: string
  type: 'cooperative' | 'private' | 'government'
  factoryCount: number
  marketShare: number
  country: string
}

interface Factory {
  id: string
  name: string
  organizationId: string
  region: string
  capacity: number
  grade: 'A' | 'B' | 'C'
}

const organizations: Record<string, Organization[]> = {
  kenya: [
    { id: 'ktda', name: 'KTDA', type: 'cooperative', factoryCount: 68, marketShare: 60, country: 'kenya' },
    { id: 'unilever', name: 'Unilever Tea Kenya', type: 'private', factoryCount: 12, marketShare: 15, country: 'kenya' },
    { id: 'kakuzi', name: 'Kakuzi Ltd', type: 'private', factoryCount: 3, marketShare: 8, country: 'kenya' },
    { id: 'williamson', name: 'Williamson Tea', type: 'private', factoryCount: 5, marketShare: 7, country: 'kenya' }
  ],
  rwanda: [
    { id: 'rtb', name: 'Rwanda Tea Board', type: 'government', factoryCount: 18, marketShare: 45, country: 'rwanda' },
    { id: 'pfunda', name: 'Pfunda Tea Company', type: 'private', factoryCount: 8, marketShare: 25, country: 'rwanda' },
    { id: 'sorwathe', name: 'SORWATHE', type: 'cooperative', factoryCount: 12, marketShare: 20, country: 'rwanda' }
  ]
}

const factories: Record<string, Factory[]> = {
  ktda: [
    { id: 'githunguri', name: 'Githunguri Factory', organizationId: 'ktda', region: 'Central', capacity: 2400, grade: 'A' },
    { id: 'kangaita', name: 'Kangaita Factory', organizationId: 'ktda', region: 'Central', capacity: 1800, grade: 'A' },
    { id: 'kimunye', name: 'Kimunye Factory', organizationId: 'ktda', region: 'Central', capacity: 2100, grade: 'B' },
    { id: 'gatunguru', name: 'Gatunguru Factory', organizationId: 'ktda', region: 'Central', capacity: 1600, grade: 'A' }
  ]
}

interface OrganizationFilterProps {
  selectedMarket: string
  selectedOrganization: string | null
  selectedFactories: string[]
  onOrganizationChange: (orgId: string | null) => void
  onFactoriesChange: (factoryIds: string[]) => void
}

export const OrganizationFilter = ({
  selectedMarket,
  selectedOrganization,
  selectedFactories,
  onOrganizationChange,
  onFactoriesChange
}: OrganizationFilterProps) => {
  const [showFactories, setShowFactories] = useState(false)

  const marketOrganizations = organizations[selectedMarket] || []
  const selectedOrgData = marketOrganizations.find(org => org.id === selectedOrganization)
  const orgFactories = selectedOrganization ? factories[selectedOrganization] || [] : []

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cooperative': return 'bg-green-100 text-green-800'
      case 'private': return 'bg-blue-100 text-blue-800'
      case 'government': return 'bg-purple-100 text-purple-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800'
      case 'B': return 'bg-yellow-100 text-yellow-800'
      case 'C': return 'bg-red-100 text-red-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const handleFactoryToggle = (factoryId: string) => {
    const newSelection = selectedFactories.includes(factoryId)
      ? selectedFactories.filter(id => id !== factoryId)
      : [...selectedFactories, factoryId]
    onFactoriesChange(newSelection)
  }

  const handleOrganizationSelect = (value: string) => {
    if (value === 'all') {
      onOrganizationChange(null)
    } else {
      onOrganizationChange(value)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Organization:</span>
        </div>
        
        <Select value={selectedOrganization || 'all'} onValueChange={handleOrganizationSelect}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All Organizations">
              {selectedOrgData ? (
                <div className="flex items-center space-x-2">
                  <span>{selectedOrgData.name}</span>
                  <Badge className={getTypeColor(selectedOrgData.type)}>
                    {selectedOrgData.type}
                  </Badge>
                </div>
              ) : (
                "All Organizations"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            {marketOrganizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{org.name}</div>
                    <div className="text-xs text-slate-500">{org.factoryCount} factories • {org.marketShare}% share</div>
                  </div>
                  <Badge className={getTypeColor(org.type)}>
                    {org.type}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedOrganization && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFactories(!showFactories)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Factories</span>
            {selectedFactories.length > 0 && (
              <Badge variant="secondary">{selectedFactories.length}</Badge>
            )}
          </Button>
        )}
      </div>

      {showFactories && selectedOrganization && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Select Factories</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFactories(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {orgFactories.map((factory) => (
                <div
                  key={factory.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedFactories.includes(factory.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => handleFactoryToggle(factory.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{factory.name}</div>
                      <div className="text-xs text-slate-500">{factory.region} • {factory.capacity}kg/day</div>
                    </div>
                    <Badge className={getGradeColor(factory.grade)}>
                      Grade {factory.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
