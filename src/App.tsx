import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import CashierDashboard from "./pages/dashboards/CashierDashboard";
import InventoryManagerDashboard from "./pages/dashboards/InventoryManagerDashboard";
import Pos from "./pages/Pos";
import Products from "./pages/Products";
import SupplierManagement from "./pages/SupplierManagement";
import Discount from "./pages/Discount";
import StockAlerts from "./pages/StockAlerts";
import UserManagement from "./pages/UserManagement";
import Restock from "./pages/Restock";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      <UserRoleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Layout />}>
            {/* <Route path="/" element={<Login />} /> */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/restock" element={<Restock />} />
              <Route path="/alerts" element={<StockAlerts />} />
              <Route path="/suppliers" element={<SupplierManagement />} />
              <Route path="/discount" element={<Discount />} />
              <Route path="/pos" element={<Pos />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
             <Route path="/cashier-dashboard" element={<CashierDashboard />} />
             <Route path="/inventory-dashboard" element={<InventoryManagerDashboard />} />
  
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserRoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
