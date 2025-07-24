
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface MetricDrilldownData {
  title: string
  value: string | number
  trend?: string
  details: Array<{
    label: string
    value: string | number
    description?: string
  }>
  chartData?: any[]
}

interface MetricDrilldownModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: MetricDrilldownData | null
}

export const MetricDrilldownModal = ({ open, onOpenChange, data }: MetricDrilldownModalProps) => {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="elastic-gradient-text">{data.title} - Detailed View</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="elastic-card">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Current Value</p>
                  <p className="text-2xl font-bold text-slate-900 font-numeric">{data.value}</p>
                </div>
                {data.trend && (
                  <div>
                    <p className="text-sm text-slate-600">Trend</p>
                    <p className="text-lg font-medium text-emerald-600">{data.trend}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="elastic-card">
            <CardHeader>
              <CardTitle>Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.details.map((detail, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-900">{detail.label}</p>
                      {detail.description && (
                        <p className="text-sm text-slate-600">{detail.description}</p>
                      )}
                    </div>
                    <span className="font-semibold text-slate-900 font-numeric">{detail.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
