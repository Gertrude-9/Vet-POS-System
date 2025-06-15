import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";
import { CalendarIcon, Download, Printer } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for reports
const salesData = [
  { date: "2023-05-01", amount: 1250 },
  { date: "2023-05-02", amount: 980 },
  { date: "2023-05-03", amount: 1520 },
  { date: "2023-05-04", amount: 1100 },
  { date: "2023-05-05", amount: 1750 },
  { date: "2023-05-06", amount: 1420 },
  { date: "2023-05-07", amount: 890 },
];

const inventoryData = [
  { id: "1", name: "Antibiotic X", category: "Antibiotics", quantity: 45, reorderPoint: 20, status: "In Stock" },
  { id: "2", name: "Pain Reliever Y", category: "Analgesics", quantity: 12, reorderPoint: 15, status: "Low Stock" },
  { id: "3", name: "Flea Treatment", category: "Parasite Control", quantity: 8, reorderPoint: 10, status: "Low Stock" },
  { id: "4", name: "Vitamin Supplement", category: "Supplements", quantity: 32, reorderPoint: 15, status: "In Stock" },
];

const expiryData = [
  { id: "1", name: "Antibiotic X", batch: "BATCH001", expiryDate: "2023-06-15", daysToExpiry: 15, status: "Expiring Soon" },
  { id: "2", name: "Pain Reliever Y", batch: "BATCH002", expiryDate: "2023-07-20", daysToExpiry: 50, status: "OK" },
  { id: "3", name: "Flea Treatment", batch: "BATCH003", expiryDate: "2023-05-30", daysToExpiry: 5, status: "Urgent" },
];

const topProductsData = [
  { name: "Antibiotic X", sales: 125, revenue: 3125 },
  { name: "Pain Reliever Y", sales: 98, revenue: 1519 },
  { name: "Flea Treatment", sales: 76, revenue: 2489 },
  { name: "Vitamin Supplement", sales: 54, revenue: 982.8 },
];

const peakHoursData = [
  { hour: "9 AM", sales: 12 },
  { hour: "10 AM", sales: 19 },
  { hour: "11 AM", sales: 15 },
  { hour: "12 PM", sales: 21 },
  { hour: "1 PM", sales: 10 },
  { hour: "2 PM", sales: 14 },
  { hour: "3 PM", sales: 18 },
  { hour: "4 PM", sales: 16 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ReportsDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [reportType, setReportType] = useState<string>("sales");

  const handleDatePreset = (days: number) => {
    setDateRange({
      from: subDays(new Date(), days),
      to: new Date(),
    });
  };

  const handleWeekPreset = () => {
    setDateRange({
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date()),
    });
  };

  const handleMonthPreset = () => {
    setDateRange({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    });
  };

  const exportReport = () => {
    // In a real app, this would generate a CSV/PDF
    console.log(`Exporting ${reportType} report`);
  };

  const printReport = () => {
    // In a real app, this would send to printer
    console.log(`Printing ${reportType} report`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={printReport}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>
                {reportType === "sales" && "Sales Reports"}
                {reportType === "inventory" && "Inventory Reports"}
                {reportType === "expiry" && "Expiry Reports"}
                {reportType === "products" && "Product Performance"}
                {reportType === "hours" && "Peak Sales Hours"}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDatePreset(1)}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDatePreset(7)}>
                  Last 7 Days
                </Button>
                <Button variant="outline" size="sm" onClick={handleWeekPreset}>
                  This Week
                </Button>
                <Button variant="outline" size="sm" onClick={handleMonthPreset}>
                  This Month
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={reportType} onValueChange={setReportType}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="expiry">Expiry</TabsTrigger>
                <TabsTrigger value="products">Top Products</TabsTrigger>
                <TabsTrigger value="hours">Peak Hours</TabsTrigger>
              </TabsList>

              <TabsContent value="sales">
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#8884d8" name="Sales ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount ($)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((sale) => (
                        <TableRow key={sale.date}>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell className="text-right">${sale.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="inventory">
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inventoryData}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" fill="#82ca9d" name="Quantity" />
                      <Bar dataKey="reorderPoint" fill="#ffc658" name="Reorder Point" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Reorder Point</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{item.reorderPoint}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "Low Stock" ? "destructive" : "default"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="expiry">
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expiryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="daysToExpiry"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expiryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead className="text-right">Days to Expiry</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiryData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.batch}</TableCell>
                          <TableCell>{item.expiryDate}</TableCell>
                          <TableCell className="text-right">{item.daysToExpiry}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "Urgent"
                                  ? "destructive"
                                  : item.status === "Expiring Soon"
                                  ? "outline"
                                  : "default"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topProductsData}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" name="Units Sold" />
                      <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Units Sold</TableHead>
                        <TableHead className="text-right">Revenue ($)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProductsData.map((product) => (
                        <TableRow key={product.name}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right">{product.sales}</TableCell>
                          <TableCell className="text-right">
                            {product.revenue.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="hours">
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={peakHoursData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" name="Transactions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hour</TableHead>
                        <TableHead className="text-right">Transactions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {peakHoursData.map((hour) => (
                        <TableRow key={hour.hour}>
                          <TableCell className="font-medium">{hour.hour}</TableCell>
                          <TableCell className="text-right">{hour.sales}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="expiry">Expiry Report</SelectItem>
                  <SelectItem value="products">Top Products</SelectItem>
                  <SelectItem value="hours">Peak Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleDatePreset(1)}>
                  Today
                </Button>
                <Button variant="outline" onClick={() => handleDatePreset(7)}>
                  Last 7 Days
                </Button>
                <Button variant="outline" onClick={handleWeekPreset}>
                  This Week
                </Button>
                <Button variant="outline" onClick={handleMonthPreset}>
                  This Month
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Reset Filters</Button>
            <Button>Generate Report</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ReportsDashboard;