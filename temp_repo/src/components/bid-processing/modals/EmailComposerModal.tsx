
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Paperclip, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailComposerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  recipientName: string
  recipientEmail: string
  bidId: string
  loading?: boolean
}

const emailTemplates = [
  { value: 'payment-reminder', label: 'Payment Reminder' },
  { value: 'status-update', label: 'Status Update' },
  { value: 'general', label: 'General Communication' }
]

export const EmailComposerModal = ({ 
  isOpen, 
  onOpenChange, 
  recipientName,
  recipientEmail,
  bidId,
  loading = false
}: EmailComposerModalProps) => {
  const { toast } = useToast()
  const [template, setTemplate] = useState("general")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [cc, setCc] = useState("")

  const handleTemplateChange = (value: string) => {
    setTemplate(value)
    
    switch (value) {
      case 'payment-reminder':
        setSubject(`Payment Reminder - Bid ${bidId}`)
        setMessage(`Dear ${recipientName},\n\nThis is a friendly reminder regarding the payment for bid ${bidId}.\n\nPlease process the payment at your earliest convenience.\n\nBest regards,\niTea Platform Team`)
        break
      case 'status-update':
        setSubject(`Status Update - Bid ${bidId}`)
        setMessage(`Dear ${recipientName},\n\nWe're writing to update you on the status of bid ${bidId}.\n\n[Please add specific details about the status change]\n\nBest regards,\niTea Platform Team`)
        break
      default:
        setSubject("")
        setMessage("")
    }
  }

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both subject and message",
        variant: "destructive"
      })
      return
    }

    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Email Sent",
        description: `Email sent successfully to ${recipientName}`,
      })
      
      onOpenChange(false)
      setSubject("")
      setMessage("")
      setCc("")
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Compose Email - {bidId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipient">To</Label>
              <Input 
                id="recipient" 
                value={`${recipientName} <${recipientEmail}>`}
                disabled
                className="bg-slate-50"
              />
            </div>
            <div>
              <Label htmlFor="template">Template</Label>
              <Select value={template} onValueChange={handleTemplateChange} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="cc">CC (Optional)</Label>
            <Input 
              id="cc"
              placeholder="Additional recipients..."
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject"
              placeholder="Email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px]"
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" className="flex items-center">
              <Paperclip className="w-4 h-4 mr-2" />
              Attach Files
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={!subject.trim() || !message.trim() || loading}>
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
