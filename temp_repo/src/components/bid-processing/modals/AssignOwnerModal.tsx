
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Search } from "lucide-react"

interface AssignOwnerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAssignOwner: (userId: string, notes: string) => void
  bidId: string
  currentOwner?: string
  loading?: boolean
}

const mockUsers = [
  { id: '1', name: 'John Smith', email: 'john@example.com', role: 'Bid Processor' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Senior Processor' },
  { id: '3', name: 'Mike Chen', email: 'mike@example.com', role: 'Operations Manager' },
  { id: '4', name: 'Lisa Williams', email: 'lisa@example.com', role: 'Quality Controller' }
]

export const AssignOwnerModal = ({ 
  isOpen, 
  onOpenChange, 
  onAssignOwner,
  bidId,
  currentOwner,
  loading = false
}: AssignOwnerModalProps) => {
  const [selectedUser, setSelectedUser] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [notes, setNotes] = useState("")

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = () => {
    if (selectedUser && selectedUser !== currentOwner) {
      onAssignOwner(selectedUser, notes)
      setSelectedUser("")
      setNotes("")
      setSearchTerm("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Assign Owner - {bidId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {currentOwner && (
            <div>
              <Label>Current Owner</Label>
              <div className="p-2 bg-slate-50 rounded-md text-sm font-medium text-slate-700">
                {mockUsers.find(u => u.id === currentOwner)?.name || currentOwner}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="userSearch">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="userSearch"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="newOwner">Select New Owner</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.role} • {user.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignmentNotes">Assignment Notes</Label>
            <Textarea
              id="assignmentNotes"
              placeholder="Add notes about this assignment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[60px]"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!selectedUser || selectedUser === currentOwner || loading}
              className="flex-1"
            >
              {loading ? "Assigning..." : "Assign Owner"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
