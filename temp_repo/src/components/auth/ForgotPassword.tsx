
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Mail, ArrowLeft, Key, RefreshCw, CheckCircle } from "lucide-react"

interface ForgotPasswordProps {
  onBack: () => void
}

export const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false)
      setStep('otp')
    }, 1500)
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return
    
    setIsLoading(true)
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      setStep('reset')
    }, 1500)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return
    
    setIsLoading(true)
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false)
      setStep('success')
    }, 1500)
  }

  const renderEmailStep = () => (
    <Card className="elastic-card border-0 shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl text-slate-800">Reset Password</CardTitle>
        <p className="text-sm text-slate-600 mt-2">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 elastic-input"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full elastic-button-primary h-12 text-base"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send verification code'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full elastic-button-outline h-12 text-base"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const renderOTPStep = () => (
    <Card className="elastic-card border-0 shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl text-slate-800">Verify Your Email</CardTitle>
        <p className="text-sm text-slate-600 mt-2">
          Enter the 6-digit code sent to<br />
          <span className="font-medium text-slate-800">{email}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleVerifyOTP}
            disabled={otp.length !== 6 || isLoading}
            className="w-full elastic-button-primary h-12 text-base"
          >
            {isLoading ? (
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
            onClick={() => setStep('email')}
            className="w-full elastic-button-outline h-12 text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderResetStep = () => (
    <Card className="elastic-card border-0 shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl text-slate-800">Create New Password</CardTitle>
        <p className="text-sm text-slate-600 mt-2">
          Your new password must be different from your previous password.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-slate-700 font-medium">New Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 elastic-input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 elastic-input"
                required
              />
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || isLoading}
            className="w-full elastic-button-primary h-12 text-base"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  const renderSuccessStep = () => (
    <Card className="elastic-card border-0 shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-xl text-slate-800">Password Reset Successful</CardTitle>
        <p className="text-sm text-slate-600 mt-2">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onBack}
          className="w-full elastic-button-primary h-12 text-base"
        >
          Back to Login
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
            <div className="text-white font-bold text-xl">iT</div>
          </div>
          <div>
            <h1 className="text-3xl font-bold elastic-gradient-text">iTea HQ</h1>
            <p className="text-slate-600 mt-2">
              {step === 'email' && 'Reset your password'}
              {step === 'otp' && 'Verify your identity'}
              {step === 'reset' && 'Create new password'}
              {step === 'success' && 'All set!'}
            </p>
          </div>
        </div>

        {/* Form Steps */}
        {step === 'email' && renderEmailStep()}
        {step === 'otp' && renderOTPStep()}
        {step === 'reset' && renderResetStep()}
        {step === 'success' && renderSuccessStep()}

        {/* Footer */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
            <span>Powered by</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded"></div>
              <span className="font-semibold text-slate-700">Elastic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
