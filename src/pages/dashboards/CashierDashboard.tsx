import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button';
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CashierDashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Cashier Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Updated just now</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Link to="/pos">
            <Button size="lg" className="w-full md:w-auto">
              Go to Point of Sale
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashierDashboard;
