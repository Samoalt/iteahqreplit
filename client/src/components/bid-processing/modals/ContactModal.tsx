
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, MapPin, User, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  contactType: 'buyer' | 'seller'
  contactName: string
  contactInfo: {
    email: string
    phone: string
    address: string
    company?: string
    lastContact?: string
    preferredMethod?: string
  }
  bidId: string
  loading?: boolean
}

export const ContactModal = ({ 
  isOpen, 
  onOpenChange, 
  contactType,
  contactName,
  contactInfo,
  bidId,
  loading = false
}: ContactModalProps) => {
  const { toast } = useToast()
  const [isCallLoading, setIsCallLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const handleCall = async () => {
    setIsCallLoading(true)
    try {
      // Simulate call initiation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Call Initiated",
        description: `Calling ${contactName} at ${contactInfo.phone}`,
      })
      
      // In a real app, this would integrate with a calling system
      window.open(`tel:${contactInfo.phone}`)
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Unable to initiate call. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCallLoading(false)
    }
  }

  const handleEmail = async () => {
    setIsEmailLoading(true)
    try {
      // Simulate email composer opening
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const subject = `Regarding Bid ${bidId}`
      const mailtoUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}`
      window.open(mailtoUrl)
      
      toast({
        title: "Email Composer Opened",
        description: `Email composer opened for ${contactName}`,
      })
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Unable to open email composer. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleLogContact = () => {
    toast({
      title: "Contact Logged",
      description: `Contact attempt with ${contactName} has been logged`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Contact {contactType === 'buyer' ? 'Buyer' : 'Seller'} - {bidId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Contact Information */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">{contactName}</h3>
              {contactInfo.preferredMethod && (
                <Badge variant="outline" className="text-xs">
                  Prefers {contactInfo.preferredMethod}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-slate-600">
                <Mail className="w-4 h-4 mr-2" />
                {contactInfo.email}
              </div>
              <div className="flex items-center text-slate-600">
                <Phone className="w-4 h-4 mr-2" />
                {contactInfo.phone}
              </div>
              <div className="flex items-center text-slate-600">
                <MapPin className="w-4 h-4 mr-2" />
                {contactInfo.address}
              </div>
              {contactInfo.company && (
                <div className="flex items-center text-slate-600">
                  <User className="w-4 h-4 mr-2" />
                  {contactInfo.company}
                </div>
              )}
            </div>
          </div>

          {/* Last Contact */}
          {contactInfo.lastContact && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center text-blue-700">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Last Contact</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">{contactInfo.lastContact}</p>
            </div>
          )}

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Quick Actions</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="flex items-center justify-center"
                onClick={handleCall}
                disabled={isCallLoading || loading}
              >
                <Phone className="w-4 h-4 mr-2" />
                {isCallLoading ? "Calling..." : "Call"}
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center"
                onClick={handleEmail}
                disabled={isEmailLoading || loading}
              >
                <Mail className="w-4 h-4 mr-2" />
                {isEmailLoading ? "Opening..." : "Email"}
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={handleLogContact}
              disabled={loading}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Log Contact Attempt
            </Button>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
