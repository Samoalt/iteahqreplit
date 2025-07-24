
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calculator, Save, Settings, X, Plus, Trash2 } from "lucide-react"
import { Bid } from "@/types/bid"
import { useToast } from "@/hooks/use-toast"

interface SplitRule {
  id: string
  beneficiary: string
  role: string
  percentage: number
  flatDeduction: number
  accountType: string
}

interface BulkSplitSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedBids: Bid[]
  onProcessBids: (splitRules: SplitRule[], settings: any) => void
}

export const BulkSplitSetupModal = ({
  open,
  onOpenChange,
  selectedBids,
  onProcessBids
}: BulkSplitSetupModalProps) => {
  const { toast } = useToast()
  const [splitMode, setSplitMode] = useState<'per-lot' | 'unified'>('unified')
  const [splitRules, setSplitRules] = useState<SplitRule[]>([
    {
      id: '1',
      beneficiary: 'Factory',
      role: 'Primary Producer',
      percentage: 85,
      flatDeduction: 0,
      accountType: 'Bank Transfer'
    },
    {
      id: '2',
      beneficiary: 'ITEA Ltd',
      role: 'Broker',
      percentage: 2,
      flatDeduction: 0,
      accountType: 'Bank Transfer'
    },
    {
      id: '3',
      beneficiary: 'Platform Fee',
      role: 'Platform',
      percentage: 0,
      flatDeduction: 50,
      accountType: 'Internal A/C'
    },
    {
      id: '4',
      beneficiary: 'Tax Authority',
      role: 'Statutory',
      percentage: 5,
      flatDeduction: 0,
      accountType: 'Mapped Account'
    }
  ])

  const [automationSettings, setAutomationSettings] = useState({
    autoGenerateESlips: true,
    autoProcessPayouts: false,
    lockSplitForAudit: true
  })

  const totalValue = selectedBids.reduce((sum, bid) => sum + bid.amount, 0)
  const totalPercentage = splitRules.reduce((sum, rule) => sum + rule.percentage, 0)
  const totalFlatDeductions = splitRules.reduce((sum, rule) => sum + (rule.flatDeduction * selectedBids.length), 0)

  const addSplitRule = () => {
    const newRule: SplitRule = {
      id: Date.now().toString(),
      beneficiary: '',
      role: '',
      percentage: 0,
      flatDeduction: 0,
      accountType: 'Bank Transfer'
    }
    setSplitRules([...splitRules, newRule])
  }

  const updateSplitRule = (id: string, field: keyof SplitRule, value: string | number) => {
    setSplitRules(rules => 
      rules.map(rule => 
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    )
  }

  const removeSplitRule = (id: string) => {
    setSplitRules(rules => rules.filter(rule => rule.id !== id))
  }

  const handleProcessBids = () => {
    if (totalPercentage !== 100) {
      toast({
        title: "Invalid Split Configuration",
        description: "Total percentage must equal 100%",
        variant: "destructive"
      })
      return
    }

    onProcessBids(splitRules, automationSettings)
    toast({
      title: "Bulk Processing Started",
      description: `Processing ${selectedBids.length} bids with configured splits`,
    })
  }

  const calculateSplitPreview = () => {
    return splitRules.map(rule => {
      const percentageAmount = (totalValue * rule.percentage) / 100
      const flatAmount = rule.flatDeduction * selectedBids.length
      const totalAmount = percentageAmount + flatAmount
      return {
        ...rule,
        calculatedAmount: totalAmount
      }
    })
  }

  const splitPreview = calculateSplitPreview()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[90vw] h-[85vh] flex flex-col overflow-hidden bg-white border border-slate-200 shadow-xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-200 flex-shrink-0 px-6 pt-6">
          <DialogTitle className="text-2xl font-semibold text-slate-900">
            Bulk Split Processing Setup
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex gap-6 flex-1 min-h-0 p-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ScrollArea className="h-full">
              <div className="space-y-6 pr-4">
                {/* Split Mode Toggle */}
                <Card className="elastic-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Split Configuration Mode</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-center space-x-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          splitMode === 'per-lot' 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}>
                          Per Lot
                        </div>
                        <Switch
                          id="split-mode"
                          checked={splitMode === 'unified'}
                          onCheckedChange={(checked) => setSplitMode(checked ? 'unified' : 'per-lot')}
                          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-300 scale-125"
                        />
                        <div className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          splitMode === 'unified' 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}>
                          Unified
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-4 text-center">
                      {splitMode === 'unified' 
                        ? 'Apply the same split percentage across all selected bids' 
                        : 'Configure individual splits for each lot (per-lot mode not yet implemented)'
                      }
                    </p>
                  </CardContent>
                </Card>

                {/* Split Rules Table */}
                <Card className="elastic-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span>Split Rules</span>
                      <Button onClick={addSplitRule} size="sm" className="elastic-button-secondary">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Rule
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Beneficiary
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Role
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              % Allocation
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Flat Deduction
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Account Type
                            </TableHead>
                            <TableHead className="px-4 py-3 w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {splitRules.map((rule) => (
                            <TableRow key={rule.id} className="hover:bg-slate-50 transition-colors">
                              <TableCell className="px-4 py-3">
                                <Input
                                  value={rule.beneficiary}
                                  onChange={(e) => updateSplitRule(rule.id, 'beneficiary', e.target.value)}
                                  placeholder="Enter beneficiary name"
                                  className="elastic-input h-9"
                                />
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <Input
                                  value={rule.role}
                                  onChange={(e) => updateSplitRule(rule.id, 'role', e.target.value)}
                                  placeholder="Role"
                                  className="elastic-input h-9"
                                />
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <Input
                                  type="number"
                                  value={rule.percentage}
                                  onChange={(e) => updateSplitRule(rule.id, 'percentage', parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                  className="elastic-input h-9"
                                  min="0"
                                  max="100"
                                />
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <Input
                                  type="number"
                                  value={rule.flatDeduction}
                                  onChange={(e) => updateSplitRule(rule.id, 'flatDeduction', parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                  className="elastic-input h-9"
                                  min="0"
                                />
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <Select
                                  value={rule.accountType}
                                  onValueChange={(value) => updateSplitRule(rule.id, 'accountType', value)}
                                >
                                  <SelectTrigger className="h-9 bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="Internal A/C">Internal A/C</SelectItem>
                                    <SelectItem value="Mapped Account">Mapped Account</SelectItem>
                                    <SelectItem value="Digital Wallet">Digital Wallet</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSplitRule(rule.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">Total Percentage:</span>
                        <span className={`font-semibold ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalPercentage}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Automation Settings */}
                <Card className="elastic-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Automation Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex flex-col">
                        <Label htmlFor="auto-eslips" className="text-sm font-medium text-slate-700">Auto-generate e-slips</Label>
                        <span className="text-xs text-slate-500 mt-1">Automatically create e-slip documents for processed splits</span>
                      </div>
                      <Switch
                        id="auto-eslips"
                        checked={automationSettings.autoGenerateESlips}
                        onCheckedChange={(checked) => 
                          setAutomationSettings(prev => ({ ...prev, autoGenerateESlips: checked }))
                        }
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-300 scale-125"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex flex-col">
                        <Label htmlFor="auto-payouts" className="text-sm font-medium text-slate-700">Auto-process payouts</Label>
                        <span className="text-xs text-slate-500 mt-1">Process payouts automatically once payment is confirmed</span>
                      </div>
                      <Switch
                        id="auto-payouts"
                        checked={automationSettings.autoProcessPayouts}
                        onCheckedChange={(checked) => 
                          setAutomationSettings(prev => ({ ...prev, autoProcessPayouts: checked }))
                        }
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-300 scale-125"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex flex-col">
                        <Label htmlFor="lock-split" className="text-sm font-medium text-slate-700">Lock split for audit</Label>
                        <span className="text-xs text-slate-500 mt-1">Prevent modifications to split rules after processing</span>
                      </div>
                      <Switch
                        id="lock-split"
                        checked={automationSettings.lockSplitForAudit}
                        onCheckedChange={(checked) => 
                          setAutomationSettings(prev => ({ ...prev, lockSplitForAudit: checked }))
                        }
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-300 scale-125"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>

          {/* Sidebar - Split Preview */}
          <div className="w-80 border-l border-slate-200 pl-6 flex-shrink-0">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                {/* Summary */}
                <Card className="elastic-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Processing Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Bids:</span>
                      <span className="font-semibold text-slate-900">{selectedBids.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Value:</span>
                      <span className="font-semibold text-slate-900">${totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Flat Deductions:</span>
                      <span className="font-semibold text-slate-900">${totalFlatDeductions.toLocaleString()}</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">Net Processing:</span>
                      <span className="font-bold text-slate-900">${(totalValue - totalFlatDeductions).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Split Preview */}
                <Card className="elastic-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Split Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {splitPreview.map((split) => (
                        <div key={split.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">{split.beneficiary}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {split.percentage > 0 && `${split.percentage}%`}
                              {split.percentage > 0 && split.flatDeduction > 0 && ' + '}
                              {split.flatDeduction > 0 && `$${split.flatDeduction}/lot`}
                            </p>
                          </div>
                          <div className="text-right ml-3">
                            <p className="font-semibold text-slate-900">${split.calculatedAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleProcessBids}
                    disabled={totalPercentage !== 100}
                    className="w-full elastic-button-primary"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Process Bids
                  </Button>
                  <Button className="w-full elastic-button-secondary">
                    <Calculator className="h-4 w-4 mr-2" />
                    Recalculate
                  </Button>
                  <Button className="w-full elastic-button-secondary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Split Template
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
