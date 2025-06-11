import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar as CalendarIcon, Filter, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function StatementsAndReports() {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [reportType, setReportType] = useState("");
  const [reportFormat, setReportFormat] = useState("pdf");
  const { toast } = useToast();

  const handleDownloadReport = (reportName: string, format: string) => {
    toast({
      title: "Report Downloaded",
      description: `${reportName}.${format} has been downloaded`,
    });
  };

  const handleGenerateReport = () => {
    if (!reportType) {
      toast({
        title: "Missing Selection",
        description: "Please select a report type",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Generated",
      description: `${reportType} report has been generated and downloaded`,
    });
  };

  const recentStatements = [
    {
      id: "STMT-2024-03",
      type: "Monthly Statement",
      period: "March 2024",
      status: "Available",
      generatedAt: "2024-04-01",
      size: "2.3 MB"
    },
    {
      id: "STMT-2024-02",
      type: "Monthly Statement", 
      period: "February 2024",
      status: "Available",
      generatedAt: "2024-03-01",
      size: "2.1 MB"
    },
    {
      id: "STMT-2024-Q1",
      type: "Quarterly Statement",
      period: "Q1 2024",
      status: "Available",
      generatedAt: "2024-04-01",
      size: "5.7 MB"
    },
    {
      id: "TAX-2023",
      type: "Tax Statement",
      period: "Year 2023",
      status: "Available",
      generatedAt: "2024-01-15",
      size: "3.2 MB"
    }
  ];

  const reportTemplates = [
    {
      id: "trading-summary",
      name: "Trading Summary",
      description: "Overview of lots, bids, and transactions",
      category: "Trading",
      icon: TrendingUp
    },
    {
      id: "financial-statement",
      name: "Financial Statement",
      description: "Income, expenses, and wallet balances",
      category: "Financial",
      icon: DollarSign
    },
    {
      id: "performance-analytics",
      name: "Performance Analytics",
      description: "Detailed performance metrics and trends",
      category: "Analytics",
      icon: BarChart3
    },
    {
      id: "tax-report",
      name: "Tax Report",
      description: "Tax-ready transaction summaries",
      category: "Compliance",
      icon: FileText
    }
  ];

  const kpiSummary = {
    totalRevenue: "$127,350",
    totalTransactions: 45,
    avgLotPrice: "$4.23",
    profitMargin: "12.5%"
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Statements & Reports</h1>
          <p className="text-slate-600">Generate and download financial statements and reports</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Download className="w-4 h-4 mr-2" />
          Bulk Download
        </Button>
      </div>

      {/* Quick KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">{kpiSummary.totalRevenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-status-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Transactions</p>
                <p className="text-2xl font-bold text-slate-900">{kpiSummary.totalTransactions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Lot Price</p>
                <p className="text-2xl font-bold text-slate-900">{kpiSummary.avgLotPrice}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Profit Margin</p>
                <p className="text-2xl font-bold text-slate-900">{kpiSummary.profitMargin}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-status-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="statements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="reports">Generate Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>

        {/* Statements Tab */}
        <TabsContent value="statements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Statements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Generated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentStatements.map((statement) => (
                      <tr key={statement.id}>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {statement.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">{statement.type}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{statement.period}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{statement.generatedAt}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{statement.size}</td>
                        <td className="px-6 py-4">
                          <Badge className="bg-status-green text-white">
                            {statement.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDownloadReport(statement.id, "pdf")}
                            className="text-accent hover:text-accent/80"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generate Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trading-summary">Trading Summary</SelectItem>
                        <SelectItem value="financial-statement">Financial Statement</SelectItem>
                        <SelectItem value="performance-analytics">Performance Analytics</SelectItem>
                        <SelectItem value="tax-report">Tax Report</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={setDateFrom}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="report-format">Format</Label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleGenerateReport} className="w-full bg-primary hover:bg-primary/90">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Report Preview</h4>
                  {reportType ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="capitalize">{reportType.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Period:</span>
                        <span>
                          {dateFrom && dateTo 
                            ? `${format(dateFrom, "MMM dd")} - ${format(dateTo, "MMM dd, yyyy")}`
                            : "Select dates"
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Format:</span>
                        <span className="uppercase">{reportFormat}</span>
                      </div>
                      <div className="mt-4 p-3 bg-white rounded border">
                        <div className="text-xs text-slate-500 mb-2">Report will include:</div>
                        <ul className="text-xs space-y-1 text-slate-600">
                          <li>• Transaction summaries</li>
                          <li>• Lot performance metrics</li>
                          <li>• Financial analysis</li>
                          <li>• Compliance data</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Select a report type to see preview</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-slate-900">{template.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleDownloadReport(template.name, "pdf")}
                            className="bg-accent hover:bg-accent/90"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Generate
                          </Button>
                          <Button size="sm" variant="outline">
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
