
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BidIntake } from "@/components/tea-workflow/BidIntake"
import { PaymentMatching } from "@/components/tea-workflow/PaymentMatching"
import { SplitProcessing } from "@/components/tea-workflow/SplitProcessing"
import { PayoutApproval } from "@/components/tea-workflow/PayoutApproval"
import { TeaRelease } from "@/components/tea-workflow/TeaRelease"
import WorkflowOverview from "@/components/tea-workflow/WorkflowOverview"
import LotPool from "./LotPool"

const TeaWorkflow = () => {
  const workflowStats = [
    { stage: "Lot Pool", count: 12, status: "active" },
    { stage: "Bid Intake", count: 3, status: "active" },
    { stage: "E-Slip Sent", count: 1, status: "pending" },
    { stage: "Payment Matching", count: 2, status: "processing" },
    { stage: "Split Processing", count: 1, status: "review" },
    { stage: "Tea Release", count: 3, status: "completed" },
  ]

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="elastic-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold elastic-gradient-text mb-2">Tea Workflow</h1>
            <p className="text-slate-600 text-lg">End-to-end pipeline from lot pool to tea release</p>
          </div>
        </div>
      </div>

      {/* Workflow Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 elastic-slide-up">
        {workflowStats.map((stat, index) => (
          <div key={index} className="elastic-metric-card group">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2 font-numeric">{stat.count}</div>
              <p className="text-sm font-medium text-slate-700 mb-3">{stat.stage}</p>
              <span className={`elastic-badge ${
                stat.status === 'active' ? 'elastic-badge-success' :
                stat.status === 'pending' ? 'elastic-badge-warning' :
                stat.status === 'processing' ? 'elastic-badge-info' :
                stat.status === 'review' ? 'elastic-badge-primary' :
                'elastic-badge-success'
              }`}>
                {stat.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Tabs */}
      <div className="elastic-slide-up">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white border border-slate-200 p-1 rounded-xl elastic-shadow">
            <TabsTrigger value="overview" className="text-slate-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-elastic-navy-600 data-[state=active]:to-elastic-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">Overview</TabsTrigger>
            <TabsTrigger value="lot-pool" className="text-slate-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-elastic-navy-600 data-[state=active]:to-elastic-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">Lot Pool</TabsTrigger>
            <TabsTrigger value="bid-intake" className="text-slate-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-elastic-navy-600 data-[state=active]:to-elastic-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">Bid Intake</TabsTrigger>
            <TabsTrigger value="payment-matching" className="text-slate-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-elastic-navy-600 data-[state=active]:to-elastic-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">Payment Matching</TabsTrigger>
            <TabsTrigger value="split-processing" className="text-slate-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-elastic-navy-600 data-[state=active]:to-elastic-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">Split Processing</TabsTrigger>
            <TabsTrigger value="payout-approval" className="text-slate-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-elastic-navy-600 data-[state=active]:to-elastic-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">Payout Approval</TabsTrigger>
            <TabsTrigger value="tea-release" className="text-slate-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-elastic-navy-600 data-[state=active]:to-elastic-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">Tea Release</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <WorkflowOverview />
          </TabsContent>

          <TabsContent value="lot-pool">
            <LotPool />
          </TabsContent>

          <TabsContent value="bid-intake">
            <BidIntake />
          </TabsContent>

          <TabsContent value="payment-matching">
            <PaymentMatching />
          </TabsContent>

          <TabsContent value="split-processing">
            <SplitProcessing />
          </TabsContent>

          <TabsContent value="payout-approval">
            <PayoutApproval />
          </TabsContent>

          <TabsContent value="tea-release">
            <TeaRelease />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default TeaWorkflow
