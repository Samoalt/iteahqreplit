
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Mail, Shield } from "lucide-react"

interface AddUserModalProps {
  onUserAdded: (user: { name: string; email: string; role: string }) => void
}

export const AddUserModal = ({ onUserAdded }: AddUserModalProps) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && role) {
      onUserAdded({ name, email, role })
      setName('')
      setEmail('')
      setRole('')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-elastic-navy-600 hover:bg-elastic-navy-700 text-white font-semibold">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-300">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-bold text-slate-900">
            <User className="h-5 w-5 text-elastic-teal-600" />
            <span>Add New User</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium text-slate-700">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium text-slate-700">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-base font-medium text-slate-700">Role</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger className="bg-white border-slate-300 focus:border-elastic-navy-500 text-slate-900">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <SelectValue placeholder="Select a role" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 z-50">
                <SelectItem value="Admin" className="text-slate-900 hover:bg-slate-50">Admin</SelectItem>
                <SelectItem value="Approver" className="text-slate-900 hover:bg-slate-50">Approver</SelectItem>
                <SelectItem value="Initiator" className="text-slate-900 hover:bg-slate-50">Initiator</SelectItem>
                <SelectItem value="Viewer" className="text-slate-900 hover:bg-slate-50">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-elastic-navy-600 hover:bg-elastic-navy-700 text-white font-semibold"
            >
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
