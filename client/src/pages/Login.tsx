import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast({
          title: "Welcome to iTea Flow",
          description: "Successfully logged in to your account.",
        });
        setLocation("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: "producer@iteaflow.com", password: "demo123", role: "Producer", name: "Michael Wambugu" },
    { email: "buyer@iteaflow.com", password: "demo123", role: "Buyer", name: "Sarah Chen" },
    { email: "board@ktda.com", password: "demo123", role: "KTDA Board", name: "David Kimani" },
    { email: "admin@iteaflow.com", password: "demo123", role: "Operations Admin", name: "Admin User" }
  ];

  const fillDemoAccount = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-800 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 border border-white/20 rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">iTea Flow</h1>
              <p className="text-emerald-100 text-sm">powered by Elastic OS</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">The Future of<br />Tea Trading</h2>
              <p className="text-emerald-100 text-lg leading-relaxed">
                Connect the entire tea ecosystem with transparent pricing, instant settlements, and seamless trade finance.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Bank-grade Security</h3>
                  <p className="text-emerald-100 text-sm">256-bit encryption & multi-factor authentication</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Instant Settlements</h3>
                  <p className="text-emerald-100 text-sm">Real-time payments via Elastic OS infrastructure</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Market Analytics</h3>
                  <p className="text-emerald-100 text-sm">AI-powered insights and predictive pricing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="relative z-10 flex items-center space-x-2 text-emerald-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Trusted by 500+ producers and buyers across Kenya</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Welcome back</CardTitle>
              <p className="text-slate-600">Sign in to your account to continue</p>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 ${errors.email ? "border-red-500" : ""}`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`h-12 pr-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 ${errors.password ? "border-red-500" : ""}`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600">
                  NEW TO ITEA FLOW?
                </p>
                <Link href="/register">
                  <Button variant="outline" className="w-full h-12 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Create your account
                  </Button>
                </Link>
                <Link href="/forgot-password">
                  <span className="text-sm text-emerald-600 hover:underline cursor-pointer">
                    Forgot your password?
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Demo Accounts - Mobile Friendly */}
          <Card className="mt-6 border-emerald-200 bg-emerald-50/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-emerald-800 mb-3 text-center">Demo Accounts</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => fillDemoAccount(account.email, account.password)}
                    className="flex justify-between items-center p-3 bg-white/80 rounded-lg border border-emerald-100 hover:bg-emerald-50/80 hover:border-emerald-200 transition-all duration-200 cursor-pointer text-left w-full"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{account.name}</div>
                      <div className="text-slate-600 text-xs">{account.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-700 font-mono text-xs">{account.email}</div>
                      <div className="text-slate-500 font-mono text-xs">{account.password}</div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-emerald-700 mt-3 text-center">
                Click any account above to prefill the login form
              </p>
            </CardContent>
          </Card>
          
          {/* Security Badge */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Secured by Elastic OS • Enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}