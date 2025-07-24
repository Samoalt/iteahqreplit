import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, ArrowRight, User, LogOut, CheckCircle, Clock, Shield } from "lucide-react"
import { OTPVerification } from "@/components/auth/OTPVerification"
import { ForgotPassword } from "@/components/auth/ForgotPassword"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Login = () => {
  const [step, setStep] = useState<'login' | 'otp' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login process
    setStep('otp')
  }

  const handleOTPVerified = () => {
    // Simulate successful login - redirect to app/get-started page
    setIsLoggedIn(true)
    window.location.href = '/app/get-started'
  }

  const handleForgotPassword = () => {
    setStep('forgot')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setStep('login')
    setEmail('')
    setPassword('')
  }

  const handleBackToWebsite = () => {
    // Since login is now the default page, we can redirect to a marketing site or keep it as is
    window.location.href = '/'
  }

  const handleContactSales = () => {
    const subject = 'iTea HQ - Sales Inquiry'
    const body = 'Hello iTea HQ Sales Team,\n\nI am interested in learning more about iTea HQ and would like to discuss:\n\n- Platform features and capabilities\n- Pricing and licensing\n- Implementation and setup\n- Custom requirements\n\nPlease contact me at your earliest convenience.\n\nBest regards'
    const mailtoLink = `mailto:sales@iteahq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  if (step === 'otp') {
    return <OTPVerification email={email} onVerified={handleOTPVerified} onBack={() => setStep('login')} />
  }

  if (step === 'forgot') {
    return <ForgotPassword onBack={() => setStep('login')} />
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Top Header with Elastic Logo and Profile */}
      <div className="absolute top-6 right-6 z-10 flex items-center space-x-4">
        <img 
          src="/lovable-uploads/1e952d7e-6934-4496-a7b0-f74f47fa64ce.png" 
          alt="Elastic" 
          className="h-8 w-auto"
        />
        
        {isLoggedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20">
                <User className="h-5 w-5 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {email || 'john.doe@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Left Column - Gradient Background with Welcome Content */}
      <div className="hidden lg:flex lg:w-3/5 relative">
        {/* Gradient Background based on Elastic logo colors */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #0891b2 50%, #0d9488 75%, #059669 100%)'
          }}
        />
        
        {/* Subtle overlay pattern for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-white/10" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Top Content */}
          <div className="space-y-8">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                <span className="text-white font-bold text-xl">iT</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">iTea HQ</h1>
                <p className="text-white/90 font-medium">Powering Tea Markets</p>
              </div>
            </div>

            {/* Welcome Content */}
            <div className="space-y-6 max-w-lg">
              <h2 className="text-5xl font-bold leading-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Welcome to iTea HQ
              </h2>
              <p className="text-xl text-white/95 leading-relaxed">
                Your end-to-end platform for tea trade, treasury, and release management
              </p>
              
              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 rounded-full bg-green-400/20 backdrop-blur-sm flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-300 flex-shrink-0" />
                  </div>
                  <span className="text-white/95">Process auction bids with precision</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 rounded-full bg-blue-400/20 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-300 flex-shrink-0" />
                  </div>
                  <span className="text-white/95">Generate e-slips instantly</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 rounded-full bg-purple-400/20 backdrop-blur-sm flex items-center justify-center">
                    <Shield className="h-4 w-4 text-purple-300 flex-shrink-0" />
                  </div>
                  <span className="text-white/95">Manage payment splits securely</span>
                </div>
              </div>

              {/* Tagline */}
              <div className="pt-4">
                <p className="text-2xl font-semibold text-white/95 bg-gradient-to-r from-white to-white/90 bg-clip-text">
                  Real-time visibility. Seamless control. Global confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <span className="text-white font-bold text-xl">iT</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">iTea HQ</h1>
            <p className="text-slate-600 mt-1">Powering Tea Markets</p>
          </div>

          {/* Login Card */}
          <Card className="border border-gray-100 shadow-xl bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-bold text-slate-800 text-center">Sign In</CardTitle>
              <p className="text-slate-600 text-center text-lg">Access your trading dashboard</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-semibold text-base">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 text-base border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-gray-50 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-semibold text-base">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 text-base border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-gray-50 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <div className="text-center">
                <p className="text-slate-600 text-base">
                  Don't have an account?{' '}
                  <button 
                    onClick={handleContactSales}
                    className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                  >
                    Contact Sales
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
