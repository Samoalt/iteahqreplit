
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Package, DollarSign, Users, Scale, User, FileText, Eye, ArrowRight, Search, CheckCircle, ArrowDownRight, ArrowUpRight, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

import { Scale as ScaleIcon } from 'lucide-react'

interface WorkflowItem {
  id: string
  buyer: string
  status: string
  stage: string
  progress: number
  value: string
  teaType: string
  quantity: string
  origin: string
  lastUpdate: string
  assignee: string
  priority: 'high' | 'medium' | 'low'
  documents: string[]
  notifications: number
}

const WorkflowOverview = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleViewDetails = (itemId: string) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter(id => id !== itemId))
    } else {
      setExpandedItems([...expandedItems, itemId])
    }
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const handleAutoProgressStatus = (itemId: string) => {
    const item = workflowItems.find(w => w.id === itemId)
    if (!item) return

    let nextStatus = item.status
    let nextStage = item.stage

    // Define progression logic
    switch (item.status) {
      case 'payment_matching':
        nextStatus = 'split_processing'
        nextStage = 'Processing'
        break
      case 'split_processing':
        nextStatus = 'document_review'
        nextStage = 'Review'
        break
      case 'document_review':
        nextStatus = 'payout_approval'
        nextStage = 'Approval'
        break
      case 'payout_approval':
        nextStatus = 'tea_release'
        nextStage = 'Release'
        break
      case 'tea_release':
        nextStatus = 'completed'
        nextStage = 'Completed'
        break
      default:
        toast({
          title: "Workflow Complete",
          description: `${item.id} is already in final status`,
          variant: "destructive"
        })
        return
    }

    // Update the workflow item
    setWorkflowItems(prev => 
      prev.map(w => 
        w.id === itemId 
          ? { 
              ...w, 
              status: nextStatus, 
              stage: nextStage,
              progress: Math.min(w.progress + 20, 100),
              lastUpdate: new Date().toLocaleDateString()
            }
          : w
      )
    )

    toast({
      title: "Workflow Progressed",
      description: `${item.id} moved to ${nextStage} stage`,
    })

    console.log(`Auto-progressing workflow ${itemId} from ${item.status} to ${nextStatus}`)
  }

  const handleBulkApprove = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select workflow items to approve",
        variant: "destructive"
      })
      return
    }

    const approvedItems = selectedItems.filter(itemId => {
      const item = workflowItems.find(w => w.id === itemId)
      return item && ['payout_approval', 'document_review'].includes(item.status)
    })

    if (approvedItems.length === 0) {
      toast({
        title: "No Approvable Items",
        description: "Selected items are not in a state that requires approval",
        variant: "destructive"
      })
      return
    }

    // Progress approved items
    setWorkflowItems(prev => 
      prev.map(w => 
        approvedItems.includes(w.id)
          ? { 
              ...w, 
              status: w.status === 'payout_approval' ? 'tea_release' : 'payout_approval',
              stage: w.status === 'payout_approval' ? 'Release' : 'Approval',
              progress: Math.min(w.progress + 20, 100),
              lastUpdate: new Date().toLocaleDateString()
            }
          : w
      )
    )

    setSelectedItems([])
    
    toast({
      title: "Bulk Approval Complete",
      description: `${approvedItems.length} workflow items have been approved and progressed`,
    })

    console.log('Bulk approved and progressed items:', approvedItems)
  }

  const handleBulkNotify = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select workflow items to notify",
        variant: "destructive"
      })
      return
    }

    // Simulate sending notifications
    const notifications = selectedItems.map(itemId => {
      const item = workflowItems.find(w => w.id === itemId)
      return {
        to: item?.buyer,
        subject: `Workflow Update - ${item?.id}`,
        message: `Your tea workflow ${item?.id} has been updated. Current status: ${item?.status.replace('_', ' ')}`
      }
    })

    setTimeout(() => {
      toast({
        title: "Notifications Sent",
        description: `${notifications.length} notifications have been sent to buyers`,
      })
    }, 1000)

    setSelectedItems([])
    console.log('Sending notifications for items:', selectedItems)
    console.log('Notification details:', notifications)
  }

  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([
    { 
      id: "WF001", 
      buyer: "Premium Tea Distributors", 
      status: "payment_matching", 
      stage: "Matching",
      progress: 75, 
      value: "$125,400",
      teaType: "Earl Grey Premium",
      quantity: "2,500 kg",
      origin: "Ceylon",
      lastUpdate: "2024-01-15",
      assignee: "Sarah Johnson",
      priority: "high" as const,
      documents: ["E-Slip", "Quality Certificate"],
      notifications: 3
    },
    { 
      id: "WF002", 
      buyer: "Global Tea Network", 
      status: "split_processing", 
      stage: "Processing",
      progress: 45, 
      value: "$89,200",
      teaType: "Darjeeling First Flush",
      quantity: "1,800 kg",
      origin: "India",
      lastUpdate: "2024-01-14",
      assignee: "Mike Chen",
      priority: "medium" as const,
      documents: ["Purchase Order", "Shipping Docs"],
      notifications: 1
    },
    { 
      id: "WF003", 
      buyer: "Artisan Tea Co", 
      status: "document_review", 
      stage: "Review",
      progress: 90, 
      value: "$156,800",
      teaType: "Oolong Dragon Well",
      quantity: "3,200 kg",
      origin: "China",
      lastUpdate: "2024-01-13",
      assignee: "Lisa Wang",
      priority: "high" as const,
      documents: ["Quality Report", "Export License"],
      notifications: 0
    },
    { 
      id: "WF004", 
      buyer: "Boutique Blends Ltd", 
      status: "payout_approval", 
      stage: "Approval",
      progress: 85, 
      value: "$67,300",
      teaType: "Jasmine Green Tea",
      quantity: "1,400 kg",
      origin: "China",
      lastUpdate: "2024-01-12",
      assignee: "David Park",
      priority: "low" as const,
      documents: ["Payout Request", "Final Invoice"],
      notifications: 2
    },
    { 
      id: "WF005", 
      buyer: "Tea Masters Inc", 
      status: "tea_release", 
      stage: "Release",
      progress: 95, 
      value: "$234,500",
      teaType: "White Peony",
      quantity: "4,800 kg",
      origin: "Fujian",
      lastUpdate: "2024-01-11",
      assignee: "Emma Thompson",
      priority: "medium" as const,
      documents: ["Release Certificate", "Shipping Manifest"],
      notifications: 1
    },
  ])

  const filteredItems = workflowItems.filter(item => {
    const matchesSearch = item.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.teaType.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl font-semibold text-slate-900">
              <Package className="h-6 w-6 mr-3 text-blue-600" />
              Workflow Overview
              <Badge variant="secondary" className="ml-3 bg-blue-50 text-blue-700 border-blue-200">
                {filteredItems.length} Active
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {selectedItems.length > 0 && (
                <>
                  <Button onClick={handleBulkApprove} className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Bulk Approve ({selectedItems.length})
                  </Button>
                  <Button onClick={handleBulkNotify} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    <Bell className="h-4 w-4 mr-2" />
                    Notify ({selectedItems.length})
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center justify-between space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 border-slate-300">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="payment_matching">Payment Matching</SelectItem>
                <SelectItem value="split_processing">Split Processing</SelectItem>
                <SelectItem value="document_review">Document Review</SelectItem>
                <SelectItem value="payout_approval">Payout Approval</SelectItem>
                <SelectItem value="tea_release">Tea Release</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48 border-slate-300">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.id])
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id))
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Badge variant={
                    item.status === 'completed' ? 'default' :
                    item.status === 'payment_matching' ? 'secondary' :
                    item.status === 'split_processing' ? 'secondary' :
                    item.status === 'document_review' ? 'secondary' :
                    item.status === 'payout_approval' ? 'secondary' :
                    'default'
                  } className={
                    item.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                    item.status === 'payment_matching' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    item.status === 'split_processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    item.status === 'document_review' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    item.status === 'payout_approval' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-green-100 text-green-800 border-green-200'
                  }>
                    {item.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={
                    item.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                    item.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }>
                    {item.priority.toUpperCase()}
                  </Badge>
                  <span className="font-semibold text-slate-900">{item.id}</span>
                  {item.notifications > 0 && (
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                      <Bell className="h-3 w-3 mr-1" />
                      {item.notifications}
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-slate-500">Updated: {item.lastUpdate}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Progress: {item.stage}</span>
                  <span className="text-sm text-slate-500">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
              
              {/* Main Content Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Value</p>
                    <p className="font-semibold text-slate-900">{item.value}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Buyer</p>
                    <p className="font-semibold text-slate-900 text-sm">{item.buyer}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Tea Type</p>
                    <p className="font-semibold text-slate-900 text-sm">{item.teaType}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="p-2 rounded-lg bg-amber-50">
                    <ScaleIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Quantity</p>
                    <p className="font-semibold text-slate-900 text-sm">{item.quantity}</p>
                  </div>
                </div>
              </div>
              
              {/* Assignee and Documents */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Assigned to: {item.assignee}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">{item.documents.join(', ')}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                  Origin: {item.origin}
                </Badge>
              </div>
              
              {/* Expanded Details */}
              {expandedItems.includes(item.id) && (
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Workflow Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm text-slate-600">Payment received and matched</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.progress >= 40 ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}></div>
                          <span className="text-sm text-slate-600">Split processing initiated</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.progress >= 60 ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}></div>
                          <span className="text-sm text-slate-600">Documents under review</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.progress >= 80 ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}></div>
                          <span className="text-sm text-slate-600">Payout approval pending</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.progress >= 100 ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}></div>
                          <span className="text-sm text-slate-600">Tea release authorized</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Recent Activity</h4>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span>Status updated to {item.status.replace('_', ' ')}</span>
                            <span className="text-xs text-slate-400">{item.lastUpdate}</span>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span>Assigned to {item.assignee}</span>
                            <span className="text-xs text-slate-400">2024-01-10</span>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span>Quality documents uploaded</span>
                            <span className="text-xs text-slate-400">2024-01-09</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  {item.status !== 'completed' && (
                    <Button 
                      onClick={() => handleAutoProgressStatus(item.id)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700"
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Progress to Next Stage
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    onClick={() => handleViewDetails(item.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span>
                      {expandedItems.includes(item.id) ? 'Hide Details' : 'View Details'}
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default WorkflowOverview
