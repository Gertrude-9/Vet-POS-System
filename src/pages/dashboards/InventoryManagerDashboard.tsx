// Update the import path below if the actual file is named 'Card.tsx' (case-sensitive) or located elsewhere
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button';
import { Package, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const InventoryManagerDashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Inventory Manager Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">+12.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">items need reordering</p>
          </CardContent>
        </Card>
      </div>
       <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Link to="/inventory">
            <Button size="lg" className="w-full md:w-auto">
              Manage Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagerDashboard;
