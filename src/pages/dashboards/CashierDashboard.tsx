import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ShoppingCart, ArrowRight, Users, Percent, Clock, TrendingUp, Package, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from '../../components/ui/badge';

const CashierDashboard = () => {
  // Sample data - replace with real data from your backend
  const stats = {
    todaySales: 3,
    todayRevenue: 2450,
    activeCustomers: 12,
    pendingDiscounts: 2,
    averageTransactionTime: "4.5 min",
    salesTrend: "+12%",
    lowStockItems: 5
  };

  const recentTransactions = [
    { id: 1, customer: "John Doe", amount: 120.50, time: "10:30 AM", items: 3 },
    { id: 2, customer: "Jane Smith", amount: 85.75, time: "11:15 AM", items: 2 },
    { id: 3, customer: "Robert Johnson", amount: 210.00, time: "1:45 PM", items: 5 },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySales}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>{stats.salesTrend} from yesterday</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">3 transactions</p>
          </CardContent>
        </Card>

        {/* Active Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">In store right now</p>
          </CardContent>
        </Card>

        {/* Pending Discounts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Discounts</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDiscounts}</div>
            <p className="text-xs text-muted-foreground">Require approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions Card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link to="/pos">
              <Button size="lg" className="w-full">
                Go to Point of Sale
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-24 flex-col">
                <Package className="h-6 w-6 mb-2" />
                <span>Inventory Lookup</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>Customer Search</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Percent className="h-6 w-6 mb-2" />
                <span>Apply Discount</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Bell className="h-6 w-6 mb-2" />
                <span>Alerts</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="font-medium">{transaction.customer}</p>
                    <p className="text-sm text-muted-foreground">{transaction.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{transaction.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full">
                View all transactions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Avg. Time</span>
              </div>
              <Badge variant="outline">{stats.averageTransactionTime}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Sales Trend</span>
              </div>
              <Badge variant="outline" className={stats.salesTrend.includes('+') ? 'text-green-500' : 'text-red-500'}>
                {stats.salesTrend}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Low Stock</span>
              </div>
              <Badge variant="destructive">{stats.lowStockItems} items</Badge>
            </div>
            
            <div className="pt-4">
              <Button variant="outline" className="w-full">
                View Performance Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashierDashboard;