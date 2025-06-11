import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
            <p className="text-xs text-amber-600">Currently viewing as: {currentRole?.label}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={user.role} onValueChange={switchRole}>
            <SelectTrigger className="w-48 bg-white border-amber-200">
              <SelectValue placeholder="Switch role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-muted-foreground">{role.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}