
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { ArrowLeft, Shield, RefreshCw } from "lucide-react"

interface OTPVerificationProps {
  email: string
  onVerified: () => void
  onBack: () => void
}

export const OTPVerification = ({ email, onVerified, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    if (otp.length !== 6) return
    
    setIsVerifying(true)
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false)
      // Redirect to Get Started page after successful verification
      window.location.href = '/app/get-started'
    }, 1500)
  }

  const handleResendOTP = () => {
    // Simulate resending OTP
    console.log('OTP resent to:', email)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Verify Your Identity</h1>
            <p className="text-slate-600 mt-2">Enter the 6-digit code sent to your email</p>
          </div>
        </div>

        {/* OTP Form */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-slate-800">Email Verification</CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              We've sent a verification code to<br />
              <span className="font-medium text-slate-800">{email}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot 
                      index={0} 
                      className="w-12 h-12 text-center border-2 border-slate-300 rounded-lg bg-white text-slate-900 font-semibold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                    />
                    <InputOTPSlot 
                      index={1} 
                      className="w-12 h-12 text-center border-2 border-slate-300 rounded-lg bg-white text-slate-900 font-semibold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                    />
                    <InputOTPSlot 
                      index={2} 
                      className="w-12 h-12 text-center border-2 border-slate-300 rounded-lg bg-white text-slate-900 font-semibold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                    />
                    <InputOTPSlot 
                      index={3} 
                      className="w-12 h-12 text-center border-2 border-slate-300 rounded-lg bg-white text-slate-900 font-semibold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                    />
                    <InputOTPSlot 
                      index={4} 
                      className="w-12 h-12 text-center border-2 border-slate-300 rounded-lg bg-white text-slate-900 font-semibold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                    />
                    <InputOTPSlot 
                      index={5} 
                      className="w-12 h-12 text-center border-2 border-slate-300 rounded-lg bg-white text-slate-900 font-semibold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleVerify}
                disabled={otp.length !== 6 || isVerifying}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12 text-base"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <Button
                variant="outline"
                onClick={onBack}
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 h-12 text-base"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResendOTP}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                Resend verification code
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-400">
            This code will expire in 10 minutes for security.
          </p>
        </div>
      </div>
    </div>
  )
}
