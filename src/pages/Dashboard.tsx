// Update the import path below to the actual location of your Card components.
// For example, if your Card components are in 'src/components/ui/card.tsx', use the following:
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { UserCog, Laptop, HardHat } from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  { name: "Admin", description: "Full access to all system features.", icon: UserCog, href: "/admin-dashboard" },
  { name: "Cashier", description: "Access to Point of Sale and daily reports.", icon: Laptop, href: "/cashier-dashboard" },
  { name: "Inventory Manager", description: "Access to product and stock management.", icon: HardHat, href: "/inventory-manager-dashboard" },
];

const Dashboard = () => {
  return (
    <div className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Select Your Role</h2>
        <p className="text-muted-foreground mt-2">Choose a dashboard to view. This is a temporary step until authentication is implemented.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 max-w-4xl w-full">
        {roles.map((role) => (
          <Link to={role.href} key={role.name} className="block hover:scale-105 transition-transform">
            <Card className="h-full flex flex-col text-center hover:border-primary">
              <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                    <role.icon className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <CardTitle className="text-xl mb-2">{role.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
