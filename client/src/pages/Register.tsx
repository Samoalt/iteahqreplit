import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Leaf, CheckCircle, Factory, ShoppingCart, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const step1Schema = z.object({
  role: z.enum(["producer", "buyer"], { required_error: "Please select a role" }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const step2Schema = z.object({
  legalName: z.string().min(2, "Legal name is required"),
  country: z.string().min(2, "Country is required"),
  kraPin: z.string().min(1, "KRA PIN is required"),
  phone: z.string().min(1, "Phone number is required"),
  currency: z.enum(["KES", "USD"], { required_error: "Please select a currency" }),
});

const step3Schema = z.object({
  walletType: z.enum(["elastic", "bank"], { required_error: "Please select a wallet option" }),
  bankIban: z.string().optional(),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;
type Step3Form = z.infer<typeof step3Schema>;

type AllFormData = Step1Form & Step2Form & Step3Form;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<AllFormData>>({});

  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
  });

  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
  });

  const step3Form = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
  });

  const onStep1Submit = (data: Step1Form) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
  };

  const onStep2Submit = (data: Step2Form) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
  };

  const onStep3Submit = async (data: Step3Form) => {
    setIsLoading(true);
    const finalData = { ...formData, ...data };
    
    try {
      await apiRequest("POST", "/auth/signup", finalData);
      
      toast({
        title: "Account Created Successfully!",
        description: "Please check your email to verify your account.",
      });
      
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "producer": return <Factory className="w-6 h-6" />;
      case "buyer": return <ShoppingCart className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "producer": 
        return "Tea factory owner or cooperative managing production, quality control, and lot listings.";
      case "buyer": 
        return "Tea trader, exporter, or blender purchasing lots through auctions and direct sales.";
      default: 
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">iTea Flow</h1>
              <p className="text-xs text-slate-600">powered by Elastic OS</p>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Create Your Account
          </h2>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
              }`}>
                1
              </div>
              <span className="text-sm text-slate-600">Role & Email</span>
            </div>
            
            <div className={`w-8 h-1 rounded ${currentStep >= 2 ? "bg-primary" : "bg-slate-200"}`} />
            
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
              }`}>
                2
              </div>
              <span className="text-sm text-slate-600">Organization</span>
            </div>
            
            <div className={`w-8 h-1 rounded ${currentStep >= 3 ? "bg-primary" : "bg-slate-200"}`} />
            
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3 ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
              }`}>
                3
              </div>
              <span className="text-sm text-slate-600">Payment</span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Step 1: Role & Email */}
            {currentStep === 1 && (
              <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    What type of account do you need?
                  </Label>
                  <RadioGroup
                    value={step1Form.watch("role")}
                    onValueChange={(value) => step1Form.setValue("role", value as "producer" | "buyer")}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value="producer" id="producer" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="producer" className="cursor-pointer">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Factory className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="font-medium">Tea Producer</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            {getRoleDescription("producer")}
                          </p>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value="buyer" id="buyer" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="buyer" className="cursor-pointer">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <ShoppingCart className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-medium">Tea Buyer</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            {getRoleDescription("buyer")}
                          </p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {step1Form.formState.errors.role && (
                    <p className="text-sm text-red-600 mt-2">
                      {step1Form.formState.errors.role.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...step1Form.register("email")}
                      className={step1Form.formState.errors.email ? "border-red-500" : ""}
                    />
                    {step1Form.formState.errors.email && (
                      <p className="text-sm text-red-600">
                        {step1Form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        {...step1Form.register("password")}
                        className={step1Form.formState.errors.password ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                    {step1Form.formState.errors.password && (
                      <p className="text-sm text-red-600">
                        {step1Form.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Link href="/login">
                    <Button type="button" variant="outline">
                      Back to Login
                    </Button>
                  </Link>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Continue
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Organization Details */}
            {currentStep === 2 && (
              <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Organization Details</h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Tell us about your {formData.role === "producer" ? "factory or cooperative" : "trading company"}.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="legalName">Legal Name</Label>
                    <Input
                      id="legalName"
                      placeholder="Company or Cooperative Name"
                      {...step2Form.register("legalName")}
                      className={step2Form.formState.errors.legalName ? "border-red-500" : ""}
                    />
                    {step2Form.formState.errors.legalName && (
                      <p className="text-sm text-red-600">
                        {step2Form.formState.errors.legalName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select onValueChange={(value) => step2Form.setValue("country", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KE">Kenya</SelectItem>
                        <SelectItem value="UG">Uganda</SelectItem>
                        <SelectItem value="TZ">Tanzania</SelectItem>
                        <SelectItem value="RW">Rwanda</SelectItem>
                        <SelectItem value="ET">Ethiopia</SelectItem>
                        <SelectItem value="MW">Malawi</SelectItem>
                        <SelectItem value="ZM">Zambia</SelectItem>
                        <SelectItem value="ZW">Zimbabwe</SelectItem>
                      </SelectContent>
                    </Select>
                    {step2Form.formState.errors.country && (
                      <p className="text-sm text-red-600">
                        {step2Form.formState.errors.country.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kraPin">Tax ID / KRA PIN</Label>
                    <Input
                      id="kraPin"
                      placeholder="P051234567A"
                      {...step2Form.register("kraPin")}
                      className={step2Form.formState.errors.kraPin ? "border-red-500" : ""}
                    />
                    {step2Form.formState.errors.kraPin && (
                      <p className="text-sm text-red-600">
                        {step2Form.formState.errors.kraPin.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+254 700 000 000"
                      {...step2Form.register("phone")}
                      className={step2Form.formState.errors.phone ? "border-red-500" : ""}
                    />
                    {step2Form.formState.errors.phone && (
                      <p className="text-sm text-red-600">
                        {step2Form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Currency</Label>
                  <RadioGroup
                    value={step2Form.watch("currency")}
                    onValueChange={(value) => step2Form.setValue("currency", value as "KES" | "USD")}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="KES" id="kes" />
                      <Label htmlFor="kes">Kenyan Shilling (KES)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="USD" id="usd" />
                      <Label htmlFor="usd">US Dollar (USD)</Label>
                    </div>
                  </RadioGroup>
                  {step2Form.formState.errors.currency && (
                    <p className="text-sm text-red-600">
                      {step2Form.formState.errors.currency.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Continue
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Payment Setup */}
            {currentStep === 3 && (
              <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Setup</h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Choose how you want to receive payments and manage your wallet.
                  </p>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Wallet Option
                  </Label>
                  <RadioGroup
                    value={step3Form.watch("walletType")}
                    onValueChange={(value) => step3Form.setValue("walletType", value as "elastic" | "bank")}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value="elastic" id="elastic" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="elastic" className="cursor-pointer">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium">Generate Elastic Wallet</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Recommended
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Instant payments, lower fees, automatic currency conversion. 
                            Perfect for frequent trading.
                          </p>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value="bank" id="bank" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="bank" className="cursor-pointer">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-medium">Use Bank Account</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Direct bank transfers to your existing account. 
                            Higher fees, 1-3 day settlement time.
                          </p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {step3Form.formState.errors.walletType && (
                    <p className="text-sm text-red-600 mt-2">
                      {step3Form.formState.errors.walletType.message}
                    </p>
                  )}
                </div>

                {step3Form.watch("walletType") === "bank" && (
                  <div className="space-y-2">
                    <Label htmlFor="bankIban">Bank IBAN</Label>
                    <Input
                      id="bankIban"
                      placeholder="KE62 KCBL 0000 0000 0000 0000"
                      {...step3Form.register("bankIban")}
                    />
                    <p className="text-xs text-slate-500">
                      We'll verify this account before processing payments
                    </p>
                  </div>
                )}

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    After registration, you'll need to verify your email and upload KYC documents 
                    before you can start trading.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                Sign in
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}