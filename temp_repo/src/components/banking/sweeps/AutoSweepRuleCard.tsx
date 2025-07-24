
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, Edit, Eye, Clock, ArrowRight, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AutoSweepRuleCardProps {
  rule: {
    id: string
    name: string
    frequency: string
    trigger: string
    sourceWallet: string
    destinationWallet: string
    conditions: string
    status: string
    lastRun: string
    nextRun: string
  }
}

export const AutoSweepRuleCard = ({ rule }: AutoSweepRuleCardProps) => {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(rule.status === 'active')
  const [isRunning, setIsRunning] = useState(false)

  const handleToggleRule = () => {
    const newStatus = !isActive
    setIsActive(newStatus)
    toast({
      title: newStatus ? "Rule Activated" : "Rule Paused",
      description: `${rule.name} has been ${newStatus ? 'activated' : 'paused'}.`,
    })
  }

  const handleRunNow = async () => {
    if (!isActive) {
      toast({
        title: "Cannot Execute",
        description: "Rule must be active to run manually.",
        variant: "destructive"
      })
      return
    }

    setIsRunning(true)
    toast({
      title: "Rule Executing",
      description: `${rule.name} is now being executed manually.`,
    })

    // Simulate execution time
    setTimeout(() => {
      setIsRunning(false)
      toast({
        title: "Execution Complete",
        description: `${rule.name} has been executed successfully.`,
      })
    }, 3000)
  }

  const handleViewLog = () => {
    toast({
      title: "Opening Logs",
      description: `Viewing execution logs for ${rule.name}.`,
    })
  }

  const handleEditRule = () => {
    toast({
      title: "Edit Rule",
      description: `Opening edit dialog for ${rule.name}.`,
    })
  }

  const handleDeleteRule = () => {
    toast({
      title: "Delete Rule",
      description: `Are you sure you want to delete ${rule.name}?`,
      variant: "destructive"
    })
  }

  return (
    <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-slate-900">{rule.name}</h3>
              <Badge className={`${isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'} border font-medium`}>
                {isActive ? 'ACTIVE' : 'PAUSED'}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 font-medium">{rule.frequency}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Enhanced Toggle Switch */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-600">
                {isActive ? 'Active' : 'Paused'}
              </span>
              <Switch
                checked={isActive}
                onCheckedChange={handleToggleRule}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-300"
              />
            </div>
            
            <Button
              size="sm"
              onClick={handleRunNow}
              disabled={!isActive || isRunning}
              className="bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-300 disabled:text-slate-500 min-w-[100px]"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2 animate-pulse" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Now
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Rule Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trigger Condition</label>
              <p className="text-sm font-medium text-slate-800 mt-1">{rule.trigger}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Conditions</label>
              <p className="text-sm font-medium text-slate-800 mt-1">{rule.conditions}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Execution</label>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <p className="text-sm font-medium text-slate-800 font-mono">
                  {new Date(rule.lastRun).toLocaleDateString()} at {new Date(rule.lastRun).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Scheduled Run</label>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <p className="text-sm font-medium text-slate-800 font-mono">
                  {new Date(rule.nextRun).toLocaleDateString()} at {new Date(rule.nextRun).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Flow */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
          <div className="flex-1 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Source</p>
            <p className="font-bold text-slate-900 text-sm">{rule.sourceWallet}</p>
          </div>
          <ArrowRight className="h-6 w-6 text-slate-400 mx-4" />
          <div className="flex-1 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Destination</p>
            <p className="font-bold text-slate-900 text-sm">{rule.destinationWallet}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleViewLog}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Log
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleEditRule}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Rule
            </Button>
          </div>
          
          {!isActive && (
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleDeleteRule}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Rule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
