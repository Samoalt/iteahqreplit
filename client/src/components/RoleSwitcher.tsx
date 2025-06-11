import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User, Building2, ShoppingCart, Settings } from "lucide-react";

const roles = [
  { value: "producer", label: "Tea Producer", icon: Building2, description: "Factory owner managing production" },
  { value: "buyer", label: "Tea Buyer", icon: ShoppingCart, description: "Purchasing tea at auctions" },
  { value: "ktda_ro", label: "KTDA Board", icon: User, description: "Board member oversight" },
  { value: "ops_admin", label: "Ops Admin", icon: Settings, description: "Platform administrator" },
];

export default function RoleSwitcher() {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  const currentRole = roles.find(role => role.value === user.role);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            {currentRole && <currentRole.icon className="w-4 h-4 text-amber-600" />}
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Demo Mode - Role Switching</p>
            <p className="text-xs text-amber-600">Currently viewing as: {currentRole?.label} ({user.role})</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = user.role === role.value;
            return (
              <Button
                key={role.value}
                size="sm"
                variant={isActive ? "default" : "outline"}
                onClick={() => switchRole(role.value)}
                className={`flex items-center space-x-2 ${isActive ? "bg-primary text-white" : "bg-white"}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{role.label.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}