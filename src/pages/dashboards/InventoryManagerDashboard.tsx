import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Pill, AlertTriangle, Syringe, HospitalIcon, Scale, CalendarCheck, ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from '../../components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Mock data for veterinary drug shop
const inventoryStats = {
  totalProducts: 215,
  expiringSoon: 18,
  outOfStock: 7,
  controlledSubstances: 23,
  inventoryValue: 68250,
};

const drugCategories = [
  { name: 'Antibiotics', inStock: 65, lowStock: 5, critical: 2 },
  { name: 'Vaccines', inStock: 42, lowStock: 3, critical: 1 },
  { name: 'Parasiticides', inStock: 38, lowStock: 4, critical: 0 },
  { name: 'Pain Meds', inStock: 27, lowStock: 2, critical: 1 },
  { name: 'Supplements', inStock: 43, lowStock: 3, critical: 0 },
];

const expiringSoon = [
  { id: 'ABX-2024', name: 'Amoxicillin 250mg', expiry: '2023-07-15', category: 'Antibiotic' },
  { id: 'VAC-2025', name: 'Rabies Vaccine', expiry: '2023-08-01', category: 'Vaccine' },
  { id: 'PAR-2026', name: 'Ivermectin 1%', expiry: '2023-07-22', category: 'Parasiticide' },
];

const controlledSubstances = [
  { id: 'CS-1001', name: 'Tramadol 50mg', quantity: 15, requiredTracking: true },
  { id: 'CS-1002', name: 'Ketamine 100mg/ml', quantity: 8, requiredTracking: true },
  { id: 'CS-1003', name: 'Diazepam 5mg', quantity: 22, requiredTracking: true },
];

const InventoryManagerDashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      {/* Dashboard Header */}
     

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <CalendarCheck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Within next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Critical medications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Controlled Substances</CardTitle>
            <Scale className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.controlledSubstances}</div>
            <p className="text-xs text-muted-foreground">Require special tracking</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Drug Categories Stock Levels */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Medication Categories</CardTitle>
            <CardDescription>Current stock levels by therapeutic class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={drugCategories}>
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="inStock" fill="#3B82F6" radius={[4, 4, 0, 0]} name="In Stock" />
                <Bar dataKey="lowStock" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Low Stock" />
                <Bar dataKey="critical" fill="#EF4444" radius={[4, 4, 0, 0]} name="Critical Level" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pharmacy Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link to="/inventory">
              <Button size="lg" className="w-full">
                <HospitalIcon className="h-4 w-4 mr-2" />
                Drug Inventory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/prescriptions">
              <Button variant="outline" size="lg" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Process Prescription
              </Button>
            </Link>
            
            <Link to="/restock">
              <Button variant="outline" size="lg" className="w-full">
                <Syringe className="h-4 w-4 mr-2" />
                Order Medications
              </Button>
            </Link>
            
            <Link to="/controlled">
              <Button variant="outline" size="lg" className="w-full">
                <Scale className="h-4 w-4 mr-2" />
                Controlled Substances
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Expiring Soon</CardTitle>
                <CardDescription>Medications expiring in the next 30 days</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expiringSoon.map((drug) => (
                <div key={drug.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="font-medium">{drug.name}</p>
                    <p className="text-sm text-muted-foreground">{drug.id} • {drug.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-orange-600">Exp: {drug.expiry}</p>
                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Out of Stock</p>
                <Badge variant="destructive">{inventoryStats.outOfStock}</Badge>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800">Enrofloxacin 10%</p>
                <p className="text-xs text-red-600">Antibiotic • 0 in stock</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800">Rabies Vaccine</p>
                <p className="text-xs text-red-600">Vaccine • 0 in stock</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Controlled Substances</p>
                <Badge variant="outline">{inventoryStats.controlledSubstances}</Badge>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-800">Ketamine 100mg/ml</p>
                <p className="text-xs text-purple-600">Only 8 vials remaining</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryManagerDashboard;