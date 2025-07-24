
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddBankAccountModal } from "../AddBankAccountModal"
import { Building, CheckCircle, Plus, Edit, Trash2, Shield } from "lucide-react"

interface EntityBankingTabProps {
  entity: any
}

export const EntityBankingTab = ({ entity }: EntityBankingTabProps) => {
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false)

  // Mock banking data
  const primaryAccount = {
    id: "1",
    bankName: "Equity Bank Kenya",
    branch: "Westlands Branch",
    accountName: entity.name,
    accountNumber: "****7892",
    fullAccountNumber: "0120001237892",
    currency: "KES",
    accountType: "Business Current",
    transactionTypes: ["Incoming", "Payout"],
    status: "verified",
    verifiedDate: "2024-01-15",
    isPrimary: true
  }

  const secondaryAccounts = [
    {
      id: "2",
      bankName: "Standard Chartered",
      branch: "Nairobi Branch", 
      accountName: entity.name,
      accountNumber: "****4521",
      currency: "USD",
      accountType: "Foreign Currency",
      transactionTypes: ["Incoming"],
      status: "pending",
      isPrimary: false
    },
    {
      id: "3",
      bankName: "KCB Bank",
      branch: "Industrial Area",
      accountName: entity.name,
      accountNumber: "****9876",
      currency: "KES",
      accountType: "Savings",
      transactionTypes: ["Payout"],
      status: "archived",
      isPrimary: false
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: { variant: "success" as const, label: "Verified" },
      pending: { variant: "warning" as const, label: "Pending" },
      archived: { variant: "secondary" as const, label: "Archived" }
    }
    return variants[status as keyof typeof variants] || { variant: "secondary" as const, label: "Unknown" }
  }

  return (
    <div className="space-y-6">
      {/* Primary Account Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Primary Bank Account
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="info">Primary</Badge>
              <Badge variant={getStatusBadge(primaryAccount.status).variant}>
                <CheckCircle className="h-3 w-3 mr-1" />
                {getStatusBadge(primaryAccount.status).label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Bank Details</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-600">Bank Name</p>
                  <p className="font-medium">{primaryAccount.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Branch</p>
                  <p className="font-medium">{primaryAccount.branch}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Account Name</p>
                  <p className="font-medium">{primaryAccount.accountName}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Account Information</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-600">Account Number</p>
                  <p className="font-mono font-medium">{primaryAccount.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Currency</p>
                  <Badge variant="outline">{primaryAccount.currency}</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Account Type</p>
                  <p className="font-medium">{primaryAccount.accountType}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Permissions</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-600">Transaction Types</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {primaryAccount.transactionTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Verified</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    {primaryAccount.verifiedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4 border-t">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Account
            </Button>
            <Button variant="outline" size="sm">
              View Full Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Accounts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Additional Bank Accounts</CardTitle>
            <Button onClick={() => setAddAccountModalOpen(true)} className="elastic-button-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Bank Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {secondaryAccounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank & Branch</TableHead>
                  <TableHead>Account Details</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {secondaryAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{account.bankName}</p>
                        <p className="text-sm text-slate-600">{account.branch}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-mono text-sm">{account.accountNumber}</p>
                        <p className="text-sm text-slate-600">{account.accountName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{account.currency}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{account.accountType}</p>
                        <div className="flex flex-wrap gap-1">
                          {account.transactionTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(account.status).variant}>
                        {getStatusBadge(account.status).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Building className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No additional bank accounts added</p>
              <p className="text-sm">Add a secondary account to enable multi-currency transactions</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddBankAccountModal
        open={addAccountModalOpen}
        onOpenChange={setAddAccountModalOpen}
        entity={entity}
      />
    </div>
  )
}
