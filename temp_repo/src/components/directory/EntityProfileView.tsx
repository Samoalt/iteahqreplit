
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EntityOverviewTab } from "./profile-tabs/EntityOverviewTab"
import { EntityDocumentsTab } from "./profile-tabs/EntityDocumentsTab"
import { EntityActivityTab } from "./profile-tabs/EntityActivityTab"
import { EntityBankingTab } from "./profile-tabs/EntityBankingTab"
import { X, Edit } from "lucide-react"

interface EntityProfileViewProps {
  entity: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (entity: any) => void
}

export const EntityProfileView = ({ entity, open, onOpenChange, onEdit }: EntityProfileViewProps) => {
  if (!entity) return null

  const getEntityBadge = (type: string) => {
    const badgeVariants = {
      buyer: 'info' as const,
      producer: 'success' as const, 
      warehouse: 'default' as const
    }
    return badgeVariants[type as keyof typeof badgeVariants] || 'default' as const
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[900px] sm:max-w-[900px] p-0 overflow-hidden">
        <SheetHeader className="px-6 py-4 border-b border-slate-200 bg-gradient-secondary">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <SheetTitle className="text-xl font-display font-bold text-slate-900">
                  {entity.name}
                </SheetTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={getEntityBadge(entity.type)} className="text-xs font-semibold">
                    {entity.type.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-slate-600">{entity.location}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(entity)}
              className="elastic-button-outline"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Entity
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="h-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-white p-0 h-auto">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-3 text-slate-700 data-[state=active]:text-blue-600 font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="banking" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-3 text-slate-700 data-[state=active]:text-blue-600 font-medium"
              >
                Banking Details
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-3 text-slate-700 data-[state=active]:text-blue-600 font-medium"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-3 text-slate-700 data-[state=active]:text-blue-600 font-medium"
              >
                Activity Log
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0">
                <EntityOverviewTab entity={entity} />
              </TabsContent>

              <TabsContent value="banking" className="mt-0">
                <EntityBankingTab entity={entity} />
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <EntityDocumentsTab entity={entity} />
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <EntityActivityTab entity={entity} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
