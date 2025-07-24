
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, AlertCircle, Info, CheckCircle } from "lucide-react"

interface AddNoteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddNote: (note: string, priority: string, category: string) => void
  bidId: string
  loading?: boolean
}

const notePriorities = [
  { value: 'low', label: 'Low', icon: Info, color: 'text-blue-500' },
  { value: 'normal', label: 'Normal', icon: CheckCircle, color: 'text-green-500' },
  { value: 'high', label: 'High', icon: AlertCircle, color: 'text-orange-500' },
  { value: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'text-red-500' }
]

const noteCategories = [
  'General',
  'Payment Issue',
  'Quality Concern',
  'Delivery Note',
  'Compliance',
  'Customer Request',
  'Internal Process'
]

export const AddNoteModal = ({ 
  isOpen, 
  onOpenChange, 
  onAddNote,
  bidId,
  loading = false
}: AddNoteModalProps) => {
  const [note, setNote] = useState("")
  const [priority, setPriority] = useState("normal")
  const [category, setCategory] = useState("General")

  const handleSubmit = () => {
    if (note.trim()) {
      onAddNote(note, priority, category)
      setNote("")
      setPriority("normal")
      setCategory("General")
      onOpenChange(false)
    }
  }

  const selectedPriority = notePriorities.find(p => p.value === priority)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Add Note - {bidId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notePriorities.map(p => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center space-x-2">
                        <p.icon className={`w-4 h-4 ${p.color}`} />
                        <span>{p.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {noteCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="noteContent">Note Content</Label>
            <Textarea
              id="noteContent"
              placeholder="Enter your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[120px]"
              disabled={loading}
            />
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm">
              {selectedPriority && (
                <>
                  <selectedPriority.icon className={`w-4 h-4 ${selectedPriority.color}`} />
                  <span className="font-medium">{selectedPriority.label} Priority</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-600">{category}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!note.trim() || loading}
              className="flex-1"
            >
              {loading ? "Adding..." : "Add Note"}
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
