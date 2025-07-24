
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatementFilters } from "@/components/directory/StatementFilters"
import { StatementExport } from "@/components/directory/StatementExport"
import { StatementModal } from "@/components/directory/StatementModal"
import { FileText, Download, Mail, Filter, Users, Building, Warehouse } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Statements = () => {
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [statementModalOpen, setStatementModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState("current-month")
  const [statementType, setStatementType] = useState("transaction")
  const { toast } = useToast()

  // Mock entities data
  const entities = [
    {
      id: "1",
      name: "Premium Tea Co.",
      type: "buyer",
      contactPerson: "John Smith",
      email: "john@premiumtea.com",
      phone: "+254-700-123456",
      location: "Nairobi, Kenya"
    },
    {
      id: "2", 
      name: "Kericho Gardens",
      type: "producer",
      contactPerson: "Mary Kimani",
      email: "mary@kerichogardens.com",
      phone: "+254-701-234567",
      location: "Kericho, Kenya"
    },
    {
      id: "3",
      name: "Mombasa Tea Warehouse",
      type: "warehouse",
      contactPerson: "Peter Ochieng",
      email: "peter@mombasatw.com",
      phone: "+254-702-345678",
      location: "Mombasa, Kenya"
    }
  ]

  const handleEntitySelect = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId)
    setSelectedEntity(entity)
    
    if (entity) {
      toast({
        title: "Entity Selected",
        description: `Selected ${entity.name} for statement generation`,
      })
    }
  }

  const handleViewStatement = () => {
    if (selectedEntity) {
      setStatementModalOpen(true)
    } else {
      toast({
        title: "No Entity Selected",
        description: "Please select an entity to view its statement",
        variant: "destructive"
      })
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'buyer': return Building
      case 'producer': return Warehouse
      case 'warehouse': return Users
      default: return Building
    }
  }

  const stats = [
    { label: "Total Entities", value: entities.length.toString(), icon: Users },
    { label: "Statements Generated", value: "127", icon: FileText },
    { label: "This Month", value: "23", icon: FileText },
    { label: "Pending Reviews", value: "5", icon: FileText }
  ]

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Financial Statements
        </h1>
        <p className="text-lg text-slate-700 font-medium">Generate and manage financial statements for buyers, producers, and warehouses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statement Generation Controls */}
      <Card className="bg-white border border-slate-200 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Generate Statement</h2>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-slate-300 hover:bg-slate-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Entity Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Select Entity</label>
              <Select onValueChange={handleEntitySelect}>
                <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Choose entity..." />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => {
                    const IconComponent = getEntityIcon(entity.type)
                    return (
                      <SelectItem key={entity.id} value={entity.id}>
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{entity.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{entity.type}</p>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statement Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Statement Type</label>
              <Select value={statementType} onValueChange={setStatementType}>
                <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transaction">Transaction Statement</SelectItem>
                  <SelectItem value="balance">Balance Statement</SelectItem>
                  <SelectItem value="summary">Summary Statement</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Statement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Actions</label>
              <div className="flex space-x-2">
                <Button
                  onClick={handleViewStatement}
                  disabled={!selectedEntity}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-slate-200 pt-6">
              <StatementFilters />
            </div>
          )}

          {/* Selected Entity Preview */}
          {selectedEntity && (
            <div className="border-t border-slate-200 pt-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-bold text-slate-900 mb-3">Selected Entity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Name</p>
                    <p className="font-bold text-slate-900">{selectedEntity.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Type</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedEntity.type === 'buyer' ? 'bg-blue-100 text-blue-800' :
                      selectedEntity.type === 'producer' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedEntity.type.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Contact</p>
                    <p className="font-medium text-slate-800">{selectedEntity.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Location</p>
                    <p className="font-medium text-slate-700">{selectedEntity.location}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
      {selectedEntity && (
        <StatementExport entity={selectedEntity} dateRange={dateRange} statementType={statementType} />
      )}

      {/* Statement Modal */}
      {selectedEntity && (
        <StatementModal
          open={statementModalOpen}
          onOpenChange={setStatementModalOpen}
          entity={selectedEntity}
        />
      )}
    </div>
  )
}

export default Statements
