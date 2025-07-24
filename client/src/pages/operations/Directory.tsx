import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EntityFormModal } from "@/components/directory/EntityFormModal"
import { BulkImportModal } from "@/components/directory/BulkImportModal"
import { EntityActionsModal } from "@/components/directory/EntityActionsModal"
import { EntityProfileView } from "@/components/directory/EntityProfileView"
import { Search, Plus, Upload, Users, Building, Warehouse, MessageSquare, FileText, BarChart3, Eye } from "lucide-react"
import { Link } from "react-router-dom"

const Directory = () => {
  const [entities, setEntities] = useState([
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
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [actionsModalOpen, setActionsModalOpen] = useState(false)
  const [profileViewOpen, setProfileViewOpen] = useState(false)

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEntityAction = (entity: any, action: string) => {
    setSelectedEntity(entity)
    if (action === 'profile') {
      setProfileViewOpen(true)
    } else {
      setActionsModalOpen(true)
    }
  }

  const handleEditEntity = (entity: any) => {
    setSelectedEntity(entity)
    setFormModalOpen(true)
    setProfileViewOpen(false)
  }

  const getEntityBadge = (type: string) => {
    const badgeClasses = {
      buyer: 'elastic-badge-info',
      producer: 'elastic-badge-success', 
      warehouse: 'elastic-badge-primary'
    }
    return (
      <span className={`elastic-badge ${badgeClasses[type as keyof typeof badgeClasses] || 'elastic-badge-primary'}`}>
        {type.toUpperCase()}
      </span>
    )
  }

  const stats = [
    { label: "Total Entities", value: entities.length.toString(), icon: Users },
    { label: "Buyers", value: entities.filter(e => e.type === 'buyer').length.toString(), icon: Building },
    { label: "Producers", value: entities.filter(e => e.type === 'producer').length.toString(), icon: Warehouse },
    { label: "Active This Month", value: "89", icon: Users }
  ]

  return (
    <div className="p-8 space-y-8 bg-gradient-secondary min-h-screen animate-fade-in">
      {/* Enhanced Header with Elastic Design */}
      <div className="elastic-card border-0 elastic-shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold elastic-gradient-text mb-2">Entity Directory</h1>
            <p className="text-lg text-slate-700 font-medium">Manage buyers, producers, warehouses, and other trading partners</p>
          </div>
          <Link to="/app/operations/statements">
            <Button className="elastic-button-primary">
              <BarChart3 className="h-5 w-5 mr-2" />
              View Statements
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Stats with Elastic Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-elastic-slide-up">
        {stats.map((stat, index) => (
          <div key={index} className="elastic-metric-card elastic-hover-lift">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-xl elastic-gradient-primary">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="metric-label font-semibold uppercase tracking-wide">{stat.label}</p>
                <p className="metric-value font-numeric">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Controls with Elastic Design */}
      <div className="elastic-card flex items-center justify-between border-0 elastic-shadow">
        <div className="elastic-search flex-1 max-w-lg">
          <Search className="search-icon h-5 w-5" />
          <Input
            placeholder="Search entities by name, type, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="elastic-input h-12 text-base font-medium"
          />
        </div>
        <div className="flex space-x-4 ml-6">
          <Button 
            onClick={() => setImportModalOpen(true)} 
            className="elastic-button-secondary elastic-hover-lift h-12 px-6"
          >
            <Upload className="h-5 w-5 mr-2" />
            Import CSV
          </Button>
          <Button 
            onClick={() => setFormModalOpen(true)} 
            className="elastic-button-primary h-12 px-6"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Entity
          </Button>
        </div>
      </div>

      {/* Enhanced Entity Table with Elastic Design */}
      <div className="elastic-table">
        <div className="elastic-card-header border-b border-slate-200 p-6">
          <h2 className="text-2xl font-display font-bold text-slate-900">Entity Directory</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-secondary hover:bg-gradient-secondary border-b-2 border-slate-200">
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Name</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Type</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Contact Person</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Email</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Phone</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Location</TableHead>
              <TableHead className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider py-4 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities.map((entity) => (
              <TableRow key={entity.id} className="hover:bg-slate-50 border-b border-slate-100 transition-all duration-200">
                <TableCell className="font-display font-bold text-slate-900 text-base py-4 px-6">{entity.name}</TableCell>
                <TableCell className="py-4 px-6">{getEntityBadge(entity.type)}</TableCell>
                <TableCell className="font-medium text-slate-800 py-4 px-6">{entity.contactPerson}</TableCell>
                <TableCell className="text-blue-600 font-medium hover:text-blue-800 py-4 px-6">{entity.email}</TableCell>
                <TableCell className="font-numeric font-medium text-slate-800 py-4 px-6">{entity.phone}</TableCell>
                <TableCell className="font-medium text-slate-700 py-4 px-6">{entity.location}</TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleEntityAction(entity, 'profile')}
                      className="elastic-button-outline"
                      title="View Profile"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEntityAction(entity, 'message')}
                      className="elastic-button-outline"
                      title="Send Message"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEntityAction(entity, 'statement')}
                      className="elastic-button-outline"
                      title="Generate Statement"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <EntityFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        entity={selectedEntity}
        onSubmit={(entityData) => {
          if (selectedEntity) {
            // Update existing entity
            setEntities(prev => prev.map(e => e.id === selectedEntity.id ? { ...e, ...entityData } : e))
          } else {
            // Add new entity
            const newEntity = { ...entityData, id: Date.now().toString() }
            setEntities(prev => [...prev, newEntity])
          }
          setFormModalOpen(false)
          setSelectedEntity(null)
        }}
      />

      <BulkImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />

      <EntityActionsModal
        entity={selectedEntity}
        open={actionsModalOpen}
        onOpenChange={setActionsModalOpen}
      />

      <EntityProfileView
        entity={selectedEntity}
        open={profileViewOpen}
        onOpenChange={setProfileViewOpen}
        onEdit={handleEditEntity}
      />
    </div>
  )
}

export default Directory
