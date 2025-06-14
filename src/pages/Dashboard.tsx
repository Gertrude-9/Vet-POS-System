
import { useUserRole } from "@/contexts/UserRoleContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import ChairpersonDashboard from "./dashboards/ChairpersonDashboard";
import MemberDashboard from "./dashboards/MemberDashboard";
import SecretaryDashboard from "./dashboards/SecretaryDashboard";
import TreasurerDashboard from "./dashboards/TreasurerDashboard";

const Dashboard = () => {
  const { role } = useUserRole();

  const renderDashboard = () => {
    switch (role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Chairperson':
        return <ChairpersonDashboard />;
      case 'Secretary':
        return <SecretaryDashboard />;
      case 'Treasurer':
        return <TreasurerDashboard />;
      case 'Member':
        return <MemberDashboard />;
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
