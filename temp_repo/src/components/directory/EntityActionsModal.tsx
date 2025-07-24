
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, FileText, Download, Mail, Phone, MessageSquare } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface EntityActionsModalProps {
  entity: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EntityActionsModal = ({ entity, open, onOpenChange }: EntityActionsModalProps) => {
  const [message, setMessage] = useState("")
  const [statementPeriod, setStatementPeriod] = useState("current-month")

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({ title: "Error", description: "Please enter a message", variant: "destructive" })
      return
    }
    
    toast({ title: "Success", description: "Message sent successfully" })
    setMessage("")
  }

  const handleGenerateStatement = () => {
    toast({ title: "Success", description: "Statement generated and sent to entity" })
  }

  const handleDownloadStatement = () => {
    // Create mock PDF download
    const element = document.createElement('a')
    const file = new Blob(['Mock statement content'], { type: 'application/pdf' })
    element.href = URL.createObjectURL(file)
    element.download = `${entity?.name}-statement.pdf`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    toast({ title: "Success", description: "Statement downloaded successfully" })
  }

  const mockTransactions = [
    { date: "2024-01-15", description: "Lot Purchase - IM24252673", amount: 8481.60, type: "debit" },
    { date: "2024-01-14", description: "Payment Received", amount: 12000.00, type: "credit" },
    { date: "2024-01-13", description: "Commission Fee", amount: 250.00, type: "debit" },
    { date: "2024-01-12", description: "Lot Sale - BP1 Grade", amount: 15600.00, type: "credit" }
  ]

  if (!entity) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Entity Actions - {entity.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="message" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="statement">Statement</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="message" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Send Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Entity</Label>
                      <p className="font-medium text-slate-900">{entity.name}</p>
                    </div>
                    <div>
                      <Label>Contact</Label>
                      <p className="font-medium text-slate-900">{entity.contactPerson}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium text-blue-600">{entity.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="font-medium text-slate-900">{entity.phone}</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="min-h-[120px] mt-2"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleSendMessage} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Account Statement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="period">Statement Period</Label>
                      <select
                        id="period"
                        value={statementPeriod}
                        onChange={(e) => setStatementPeriod(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm mt-2"
                      >
                        <option value="current-month">Current Month</option>
                        <option value="last-month">Last Month</option>
                        <option value="last-3-months">Last 3 Months</option>
                        <option value="last-6-months">Last 6 Months</option>
                        <option value="year-to-date">Year to Date</option>
                      </select>
                    </div>
                    <div>
                      <Label>Entity Type</Label>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">
                        {entity.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleGenerateStatement}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate & Send Statement
                    </Button>
                    <Button onClick={handleDownloadStatement} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Statement
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Statement Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Statement Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-slate-900 mb-2">Account Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Opening Balance</span>
                          <p className="font-medium">$15,420.00</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Total Debits</span>
                          <p className="font-medium text-red-600">$8,731.60</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Total Credits</span>
                          <p className="font-medium text-green-600">$27,600.00</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Closing Balance</span>
                          <p className="font-medium">$34,288.40</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Recent Transactions</h3>
                      <div className="space-y-2">
                        {mockTransactions.map((txn, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{txn.description}</p>
                              <p className="text-sm text-slate-600">{txn.date}</p>
                            </div>
                            <div className={`font-medium ${
                              txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {txn.type === 'credit' ? '+' : '-'}${txn.amount.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
