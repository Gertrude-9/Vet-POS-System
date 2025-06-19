import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { DollarSign, Package, Users, ShoppingCart, TrendingUp, AlertCircle, CreditCard, Activity, RefreshCw, UserPlus, Settings } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { salesByDay, products } from '../../lib/mock-data';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

// Mock data for customer growth (last 12 months)
const customerGrowth = [
  { month: "Jan", newCustomers: 12 },
  { month: "Feb", newCustomers: 18 },
  { month: "Mar", newCustomers: 22 },
  { month: "Apr", newCustomers: 25 },
  { month: "May", newCustomers: 30 },
  { month: "Jun", newCustomers: 28 },
  { month: "Jul", newCustomers: 35 },
  { month: "Aug", newCustomers: 40 },
  { month: "Sep", newCustomers: 38 },
  { month: "Oct", newCustomers: 45 },
  { month: "Nov", newCustomers: 50 },
  { month: "Dec", newCustomers: 55 },
];

const stats = [
  { name: "Total Revenue", value: "Ugx 4,523,500", icon: DollarSign, change: "+20.1% from last month", trend: "up" },
  { name: "Products Sold", value: "1,204", icon: Package, change: "+12.2% from last month", trend: "up" },
  { name: "New Customers", value: "32", icon: UserPlus, change: "+5 from last month", trend: "up" },
  { name: "Today's Sales", value: "3", icon: ShoppingCart, change: "Updated just now", trend: "neutral" },
];

const performanceStats = [
  { name: "Avg. Order Value", value: "$89.50", icon: CreditCard, change: "+8.2%" },
  { name: "Conversion Rate", value: "3.2%", icon: Activity, change: "+0.5%" },
  { name: "Return Rate", value: "1.8%", icon: RefreshCw, change: "-0.3%" },
];

// Filter products where quantity is below reorder point
const lowStockItems = products.filter(product => product.quantity < product.reorderPoint);

// Data for pie chart (sales by category)
const salesByCategory = [
  { name: "Antibiotics / Antimicrobials", value: 35 },
  { name: "Antiparasitics", value: 25 },
  { name: "Anti-inflammatory Drugs", value: 20 },
  { name: "Vaccines", value: 15 },
  { name: "Analgesics / Painkillers", value: 5 },
  { name: "Anesthetics / Sedatives", value: 5 },
  { name: "Hormones and Reproductive Drugs", value: 5 },
  { name: "Fluid Therapy and Electrolytes", value: 5 },
  { name: "Antifungals", value: 5 },
  { name: "Neurological / Behavioral Drugs", value: 5 },
  { name: "Vitamins and Supplements", value: 5 },
  { name: "Disinfectants / Antiseptics", value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Mock data for recent transactions
const recentTransactions = [
  { id: 1001, customer: "Alice Smith", amount: 120.50, status: "completed" },
  { id: 1002, customer: "Bob Johnson", amount: 89.99, status: "pending" },
  { id: 1003, customer: "Carol Lee", amount: 45.00, status: "completed" },
  { id: 1004, customer: "David Kim", amount: 230.00, status: "failed" },
  { id: 1005, customer: "Eva Brown", amount: 67.25, status: "completed" },
];

// Mock data for top selling items
const topSellingItems = [
  { id: 1, name: "Dog Food Premium", sold: 120 },
  { id: 2, name: "Cat Litter", sold: 95 },
  { id: 3, name: "Bird Seed", sold: 80 },
  { id: 4, name: "Aquarium Filter", sold: 60 },
  { id: 5, name: "Rabbit Hay", sold: 45 },
];

export const AdminDashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      

      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 text-muted-foreground ${
                stat.trend === 'up' ? 'text-green-500' : 
                stat.trend === 'down' ? 'text-red-500' : ''
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1 text-green-500" />}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Last 30 days revenue performance</CardDescription>
              </div>
              <Button variant="outline" size="sm">View Report</Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {performanceStats.map((stat) => (
              <div key={stat.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{stat.name}</p>
                    <p className="text-xs text-muted-foreground">vs last month</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{stat.value}</p>
                  <Badge 
                    variant={stat.change.startsWith('+') ? 'default' : 'destructive'} 
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
            ))}

            {/* Sales by Category Pie Chart */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Sales by Category</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest 5 completed orders</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-md ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-600' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">#{transaction.id}</p>
                      <p className="text-sm text-muted-foreground">{transaction.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts & Top Selling Items */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Low Stock Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Low Stock Items</p>
                <Badge variant="destructive" className="px-2 py-0.5">
                  {lowStockItems.length} alerts
                </Badge>
              </div>
              {lowStockItems.length > 0 ? (
                <ul className="space-y-2">
                  {lowStockItems.slice(0, 3).map(item => (
                    <li key={item.id} className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {item.name} (Qty: {item.quantity})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No low stock items at the moment.
                </p>
              )}
              {lowStockItems.length > 3 && (
                <Button variant="ghost" size="sm" className="mt-2 w-full">
                  View All {lowStockItems.length} Items
                </Button>
              )}
            </div>

            {/* Top Selling Items */}
            <div>
              <p className="text-sm font-medium mb-2">Top Selling Products</p>
              <ul className="space-y-3">
                {topSellingItems.map((item, index) => (
                  <li key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <p className="text-sm">{item.name}</p>
                    </div>
                    <Badge variant="outline">{item.sold} sold</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Customer Growth */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>New customers over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar
                  dataKey="newCustomers"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start">
              <Package className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;