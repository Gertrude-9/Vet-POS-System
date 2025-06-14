
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, PackagePlus, AlertTriangle } from "lucide-react";

const InventoryManagerDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Inventory Manager Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Items</div>
            <p className="text-xs text-muted-foreground">Require re-ordering soon.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Add New Product</CardTitle>
            <PackagePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Register a new product in the inventory.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Update quantities, prices, and expiry dates.</p>
          </CardContent>
        </Card>
      </div>
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        Details on expiring products and supplier management can be displayed here.
      </div>
    </div>
  );
};
export default InventoryManagerDashboard;
