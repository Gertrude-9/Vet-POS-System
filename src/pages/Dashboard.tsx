
import { useUserRole } from "@/contexts/UserRoleContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import CashierDashboard from "./dashboards/CashierDashboard";
import InventoryManagerDashboard from "./dashboards/InventoryManagerDashboard";

const Dashboard = () => {
  const { role } = useUserRole();

  const renderDashboard = () => {
    switch (role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Cashier':
        return <CashierDashboard />;
      case 'Inventory Manager':
        return <InventoryManagerDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="py-4">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
