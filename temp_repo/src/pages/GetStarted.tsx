
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Gavel, FileText, DollarSign, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlatformTourContext } from "@/contexts/PlatformTourContext";

const GetStarted = () => {
  const { startTour } = usePlatformTourContext();
  
  const quickActions = [
    {
      title: "View Auction Bids",
      description: "Browse current auctions and see bid details",
      icon: Gavel,
      href: "/app/operations/tea-workflow",
      color: "text-elastic-teal-600",
      bgColor: "bg-elastic-teal-50"
    },
    {
      title: "Generate E-Slips",
      description: "Create electronic slips for your tea transactions",
      icon: FileText,
      href: "/app/operations/tea-workflow",
      color: "text-elastic-navy-600",
      bgColor: "bg-elastic-navy-50"
    },
    {
      title: "Divide Payments",
      description: "Split received payments to suppliers and tax",
      icon: DollarSign,
      href: "/app/banking/payments",
      color: "text-elastic-green-600",
      bgColor: "bg-elastic-green-50"
    },
    {
      title: "Release Tea Lots",
      description: "Send release certificates to buyers and warehouse",
      icon: Package,
      href: "/app/operations/tea-workflow",
      color: "text-elastic-teal-600",
      bgColor: "bg-elastic-teal-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8 animate-elastic-slide-up">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-slate-900 font-display">Hello Alex!</h1>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-elastic-navy-600 via-elastic-teal-500 to-elastic-green-500 bg-clip-text text-transparent">
              Welcome to iTea HQ
            </h2>
          </div>
          
          <p className="text-xl text-slate-600 max-w-2xl">
            Get started with key actions to streamline your workflow with easy actions.
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              size="lg" 
              onClick={startTour} 
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-lg text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Platform Tour
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              asChild 
              variant="outline" 
              className="border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Link to="/app/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-sm bg-white hover:scale-105">
              <Link to={action.href} className="block h-full">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl ${action.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className={`h-8 w-8 ${action.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-teal-500 group-hover:to-green-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 font-display">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display">
              Your Complete Tea Trading Platform
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              iTea HQ provides end-to-end solutions for tea auction management, from bid processing 
              to payment distribution and lot release. Everything you need to manage your tea trading 
              operations efficiently in one integrated platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 p-4 rounded-xl bg-teal-50 border border-teal-100">
                <h4 className="font-semibold text-slate-700 font-display">Operations</h4>
                <p className="text-slate-600">Workflow management, directory, and trade analytics</p>
              </div>
              <div className="space-y-2 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <h4 className="font-semibold text-slate-700 font-display">Banking</h4>
                <p className="text-slate-600">Payment processing, wallet management, and inflows</p>
              </div>
              <div className="space-y-2 p-4 rounded-xl bg-green-50 border border-green-100">
                <h4 className="font-semibold text-slate-700 font-display">Administration</h4>
                <p className="text-slate-600">User management, system settings, and reporting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
