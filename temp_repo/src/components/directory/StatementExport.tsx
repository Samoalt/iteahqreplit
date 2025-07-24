
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, Mail, FileText, Printer, Share } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StatementExportProps {
  entity: any
  dateRange: string
  statementType: string
}

export const StatementExport = ({ entity, dateRange, statementType }: StatementExportProps) => {
  const [exportFormat, setExportFormat] = useState("pdf")
  const [includeTransactionDetails, setIncludeTransactionDetails] = useState(true)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [includeGraphs, setIncludeGraphs] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async (action: 'download' | 'email' | 'print') => {
    setIsExporting(true)
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsExporting(false)
    
    switch (action) {
      case 'download':
        toast({
          title: "Statement Downloaded",
          description: `${entity.name} statement has been downloaded as ${exportFormat.toUpperCase()}.`,
        })
        break
      case 'email':
        toast({
          title: "Statement Sent",
          description: `Statement has been emailed to ${entity.email}.`,
        })
        break
      case 'print':
        toast({
          title: "Print Initiated",
          description: "Statement has been sent to printer.",
        })
        break
    }
  }

  const handleBulkExport = async () => {
    setIsExporting(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsExporting(false)
    
    toast({
      title: "Bulk Export Complete",
      description: "All statements have been generated and downloaded.",
    })
  }

  // Handler functions to properly handle CheckedState
  const handleTransactionDetailsChange = (checked: boolean | "indeterminate") => {
    setIncludeTransactionDetails(checked === true)
  }

  const handleSummaryChange = (checked: boolean | "indeterminate") => {
    setIncludeSummary(checked === true)
  }

  const handleGraphsChange = (checked: boolean | "indeterminate") => {
    setIncludeGraphs(checked === true)
  }

  return (
    <Card className="elastic-card border-0 elastic-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span className="font-display font-bold text-slate-900">Export & Share Statement</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-display font-bold text-slate-800 uppercase tracking-wider">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="elastic-input h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                <SelectItem value="xlsx">Excel Workbook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label className="text-sm font-display font-bold text-slate-800 uppercase tracking-wider">Include Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transaction-details"
                  checked={includeTransactionDetails}
                  onCheckedChange={handleTransactionDetailsChange}
                />
                <Label htmlFor="transaction-details" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Transaction Details
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="summary"
                  checked={includeSummary}
                  onCheckedChange={handleSummaryChange}
                />
                <Label htmlFor="summary" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Financial Summary
                </Label>
              </div>
              
              {exportFormat === 'pdf' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="graphs"
                    checked={includeGraphs}
                    onCheckedChange={handleGraphsChange}
                  />
                  <Label htmlFor="graphs" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Charts & Graphs
                  </Label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statement Preview Info */}
        <div className="elastic-card bg-gradient-secondary p-4">
          <h3 className="font-display font-bold text-slate-900 mb-2">Statement Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-600 font-medium">Entity</p>
              <p className="font-bold text-slate-900">{entity.name}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Period</p>
              <p className="font-medium text-slate-800 capitalize">{dateRange.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Type</p>
              <p className="font-medium text-slate-800 capitalize">{statementType.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Format</p>
              <p className="font-medium text-slate-800 uppercase">{exportFormat}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => handleExport('download')}
            disabled={isExporting}
            className="elastic-button-primary flex-1 min-w-[200px]"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Generating...' : `Download ${exportFormat.toUpperCase()}`}
          </Button>

          <Button
            onClick={() => handleExport('email')}
            disabled={isExporting}
            className="elastic-button-secondary flex-1 min-w-[200px]"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Statement
          </Button>

          <Button
            onClick={() => handleExport('print')}
            disabled={isExporting}
            className="elastic-button-outline flex-1 min-w-[150px]"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Bulk Actions */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-slate-900">Bulk Operations</h3>
              <p className="text-sm text-slate-600 font-medium">Generate statements for multiple entities</p>
            </div>
            <Button
              onClick={handleBulkExport}
              disabled={isExporting}
              className="elastic-button-primary"
            >
              <Share className="h-4 w-4 mr-2" />
              Bulk Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
