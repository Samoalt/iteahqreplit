
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, FileText } from "lucide-react"
import { useState } from "react"

interface JournalEntry {
  id: string
  date: string
  reference: string
  description: string
  debitAccount: string
  creditAccount: string
  amount: number
  status: 'posted' | 'pending' | 'reversed'
  glCode: string
}

const mockJournalEntries: JournalEntry[] = [
  {
    id: "JE001",
    date: "2024-01-15", 
    reference: "PAY-001",
    description: "Payment received from Global Tea Co.",
    debitAccount: "Cash at Bank",
    creditAccount: "Accounts Receivable",
    amount: 45200,
    status: "posted",
    glCode: "1001/2001"
  },
  {
    id: "JE002",
    date: "2024-01-14",
    reference: "INV-002", 
    description: "Tea sales invoice raised",
    debitAccount: "Accounts Receivable",
    creditAccount: "Sales Revenue",
    amount: 28950,
    status: "posted",
    glCode: "2001/4001"
  },
  {
    id: "JE003",
    date: "2024-01-13",
    reference: "EXP-001",
    description: "Transportation expenses",
    debitAccount: "Transport Expense",
    creditAccount: "Cash at Bank", 
    amount: 1200,
    status: "pending",
    glCode: "6001/1001"
  }
]

export const JournalEntries = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [entries] = useState<JournalEntry[]>(mockJournalEntries)

  const filteredEntries = entries.filter(entry =>
    entry.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'elastic-badge-success'
      case 'pending': return 'elastic-badge-warning' 
      case 'reversed': return 'elastic-badge-error'
      default: return 'elastic-badge-info'
    }
  }

  return (
    <div className="elastic-card">
      <CardHeader className="elastic-card-header border-b border-slate-200 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-display">
            <FileText className="h-5 w-5 mr-2 text-elastic-teal-600" />
            Journal Entries
          </CardTitle>
          <div className="flex items-center space-x-3">
            <div className="elastic-search">
              <Search className="search-icon h-4 w-4" />
              <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 elastic-input pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="elastic-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="elastic-button-primary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="elastic-table">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-slate-100">Date</th>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-slate-100">Reference</th>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-slate-100">Description</th>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-slate-100">Debit Account</th>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-slate-100">Credit Account</th>
                <th className="text-right p-4 text-xs font-medium text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-slate-100">Amount</th>
                <th className="text-center p-4 text-xs font-medium text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-slate-100">Status</th>
                <th className="text-center p-4 text-xs font-medium text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-900">{entry.date}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{entry.reference}</td>
                  <td className="p-4 text-sm text-slate-900">{entry.description}</td>
                  <td className="p-4 text-sm text-slate-900">{entry.debitAccount}</td>
                  <td className="p-4 text-sm text-slate-900">{entry.creditAccount}</td>
                  <td className="text-right p-4 text-sm font-medium text-slate-900 font-numeric">${entry.amount.toLocaleString()}</td>
                  <td className="text-center p-4">
                    <span className={`elastic-badge ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="text-center p-4">
                    <Button size="sm" variant="outline" className="elastic-button-outline">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  )
}
