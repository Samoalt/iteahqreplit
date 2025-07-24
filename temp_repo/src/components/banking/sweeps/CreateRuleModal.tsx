
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreateRuleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateRuleModal = ({ open, onOpenChange }: CreateRuleModalProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    frequency: "",
    customCron: "",
    triggerType: "",
    balanceThreshold: "",
    sourceWallets: [] as string[],
    destinationWallet: "",
    amountType: "",
    fixedAmount: "",
    percentage: "",
    reserveAmount: "",
    approval: "",
    notifications: {
      email: false,
      sms: false,
      slack: false
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    toast({
      title: "Auto Sweep Rule Created",
      description: `${formData.name} has been created and is now active.`,
    })
    
    onOpenChange(false)
  }

  const handleSourceWalletChange = (wallet: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sourceWallets: checked 
        ? [...prev.sourceWallets, wallet]
        : prev.sourceWallets.filter(w => w !== wallet)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-4xl border border-slate-200 shadow-xl rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Create Auto Sweep Rule
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger 
                value="basic" 
                className="text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                Basic Settings
              </TabsTrigger>
              <TabsTrigger 
                value="conditions" 
                className="text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                Conditions & Triggers
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                Approval & Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Rule Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Rule Name</Label>
                <Input
                  id="name"
                  placeholder="Enter a descriptive name for this rule"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="border-slate-300 text-slate-700"
                />
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-slate-700 font-medium">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger className="border-slate-300 text-slate-700">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom (CRON)</SelectItem>
                  </SelectContent>
                </Select>
                
                {formData.frequency === 'custom' && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter CRON expression (e.g., 0 16 * * 5)"
                      value={formData.customCron}
                      onChange={(e) => setFormData(prev => ({ ...prev, customCron: e.target.value }))}
                      className="border-slate-300 text-slate-700 font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Example: "0 16 * * 5" = Every Friday at 4:00 PM
                    </p>
                  </div>
                )}
              </div>

              {/* Wallet Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Source Wallets (Multi-select)</Label>
                  <div className="space-y-2 p-4 border border-slate-200 rounded-xl">
                    {[
                      { id: 'buyer-global', name: 'Buyer Wallet - Global Tea' },
                      { id: 'buyer-premium', name: 'Buyer Wallet - Premium Tea Co' },
                      { id: 'tax-holding', name: 'Tax Holding Wallet' },
                      { id: 'operations', name: 'Operations Wallet' }
                    ].map((wallet) => (
                      <div key={wallet.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={wallet.id}
                          checked={formData.sourceWallets.includes(wallet.id)}
                          onCheckedChange={(checked) => handleSourceWalletChange(wallet.id, checked as boolean)}
                        />
                        <Label htmlFor={wallet.id} className="text-sm text-slate-700">{wallet.name}</Label>
                      </div>
                    ))}
                  </div>
                  {formData.sourceWallets.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.sourceWallets.map((wallet) => (
                        <Badge key={wallet} className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                          {wallet.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationWallet" className="text-slate-700 font-medium">Destination Wallet</Label>
                  <Select value={formData.destinationWallet} onValueChange={(value) => setFormData(prev => ({ ...prev, destinationWallet: value }))}>
                    <SelectTrigger className="border-slate-300 text-slate-700">
                      <SelectValue placeholder="Select destination wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holding-itea">Holding Wallet - ITEA Ltd</SelectItem>
                      <SelectItem value="kra-settlement">KRA Settlement Wallet</SelectItem>
                      <SelectItem value="operations">Operations Wallet</SelectItem>
                      <SelectItem value="reserve">Reserve Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conditions" className="space-y-6">
              {/* Trigger Event */}
              <div className="space-y-2">
                <Label htmlFor="triggerType" className="text-slate-700 font-medium">Trigger Event</Label>
                <Select value={formData.triggerType} onValueChange={(value) => setFormData(prev => ({ ...prev, triggerType: value }))}>
                  <SelectTrigger className="border-slate-300 text-slate-700">
                    <SelectValue placeholder="Select trigger condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balance-threshold">Wallet balance threshold</SelectItem>
                    <SelectItem value="inflows-over">Inflows over amount</SelectItem>
                    <SelectItem value="ready-to-sweep">New transaction marked "Ready to Sweep"</SelectItem>
                    <SelectItem value="tax-allocation">New tax allocation exists</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.triggerType === 'balance-threshold' && (
                <div className="space-y-2">
                  <Label htmlFor="balanceThreshold" className="text-slate-700 font-medium">Balance Threshold (KES)</Label>
                  <Input
                    id="balanceThreshold"
                    type="number"
                    placeholder="Enter threshold amount"
                    value={formData.balanceThreshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, balanceThreshold: e.target.value }))}
                    className="border-slate-300 text-slate-700 font-mono"
                  />
                </div>
              )}

              {/* Amount Type */}
              <div className="space-y-2">
                <Label htmlFor="amountType" className="text-slate-700 font-medium">Amount Type</Label>
                <Select value={formData.amountType} onValueChange={(value) => setFormData(prev => ({ ...prev, amountType: value }))}>
                  <SelectTrigger className="border-slate-300 text-slate-700">
                    <SelectValue placeholder="Select amount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage of Balance</SelectItem>
                    <SelectItem value="full-minus-reserve">Full Balance minus Reserve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.amountType === 'fixed' && (
                <div className="space-y-2">
                  <Label htmlFor="fixedAmount" className="text-slate-700 font-medium">Fixed Amount (KES)</Label>
                  <Input
                    id="fixedAmount"
                    type="number"
                    placeholder="Enter fixed amount"
                    value={formData.fixedAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, fixedAmount: e.target.value }))}
                    className="border-slate-300 text-slate-700 font-mono"
                  />
                </div>
              )}

              {formData.amountType === 'percentage' && (
                <div className="space-y-2">
                  <Label htmlFor="percentage" className="text-slate-700 font-medium">Percentage (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    placeholder="Enter percentage (e.g., 75)"
                    value={formData.percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
                    className="border-slate-300 text-slate-700 font-mono"
                  />
                </div>
              )}

              {formData.amountType === 'full-minus-reserve' && (
                <div className="space-y-2">
                  <Label htmlFor="reserveAmount" className="text-slate-700 font-medium">Reserve Amount (KES)</Label>
                  <Input
                    id="reserveAmount"
                    type="number"
                    placeholder="Enter minimum reserve to maintain"
                    value={formData.reserveAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, reserveAmount: e.target.value }))}
                    className="border-slate-300 text-slate-700 font-mono"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              {/* Approval Flow */}
              <div className="space-y-2">
                <Label htmlFor="approval" className="text-slate-700 font-medium">Approval Flow</Label>
                <Select value={formData.approval} onValueChange={(value) => setFormData(prev => ({ ...prev, approval: value }))}>
                  <SelectTrigger className="border-slate-300 text-slate-700">
                    <SelectValue placeholder="Select approval requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto Approve</SelectItem>
                    <SelectItem value="reviewer">Requires Reviewer</SelectItem>
                    <SelectItem value="dual">Dual Approval Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <Label className="text-slate-700 font-medium">Notification Preferences</Label>
                <div className="space-y-3 p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={formData.notifications.email}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked as boolean }
                      }))}
                    />
                    <Label htmlFor="email" className="text-slate-700">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms"
                      checked={formData.notifications.sms}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, sms: checked as boolean }
                      }))}
                    />
                    <Label htmlFor="sms" className="text-slate-700">SMS Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="slack"
                      checked={formData.notifications.slack}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, slack: checked as boolean }
                      }))}
                    />
                    <Label htmlFor="slack" className="text-slate-700">Slack Notifications</Label>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Rule Activation Notice</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This rule will become active immediately upon creation. Ensure all settings are correct.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white"
              disabled={!formData.name || !formData.frequency || !formData.destinationWallet || formData.sourceWallets.length === 0}
            >
              Create Active Rule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
