import { useAuth } from "@/hooks/useAuth";
import RoleSwitcher from "@/components/RoleSwitcher";
import ProducerDashboard from "@/components/dashboards/ProducerDashboard";
import BuyerDashboard from "@/components/dashboards/BuyerDashboard";
import KTDABoardDashboard from "@/components/dashboards/KTDABoardDashboard";
import OperationsAdminDashboard from "@/components/dashboards/OperationsAdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const renderDashboard = () => {
    switch (user.role) {
      case "producer":
        return <ProducerDashboard />;
      case "buyer":
        return <BuyerDashboard />;
      case "ktda_ro":
        return <KTDABoardDashboard />;
      case "ops_admin":
        return <OperationsAdminDashboard />;
      default:
        return <BuyerDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <RoleSwitcher />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user.workspace} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName} {user.lastName}
          </p>
        </div>
      </div>

      {renderDashboard()}
    </div>
  );
}