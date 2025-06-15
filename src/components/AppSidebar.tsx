import { NavLink, useLocation } from "react-router-dom";
import {
  BadgePercent,
  Briefcase,
  Home,
  LineChart,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Menu items config
const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/discount", label: "Discount", icon: BadgePercent },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/suppliers", label: "Supplier Management", icon: Truck },
  { href: "/reports", label: "Reports", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  // Navigation item style
  const getNavCls = (path: string) =>
    cn(
      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
      location.pathname === path
        ? "bg-[#1e293b] text-white font-semibold" // Active tab
        : "text-slate-300 hover:bg-[#1e293b]"     // Inactive tab + hover
    );

  return (
    <Sidebar
      className={cn(
        "border-r bg-[#0f172a] text-white", // Dark blue background
        collapsed ? "w-14" : "w-64"
      )}
    >
      <SidebarHeader>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2",
            collapsed && "justify-center"
          )}
        >
          <Briefcase className="w-6 h-6 text-white" />
          {!collapsed && <span className="text-lg font-semibold">VetPOS</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <NavLink to={item.href} className={getNavCls(item.href)}>
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    location.pathname === item.href
                      ? "text-white"
                      : "text-slate-300"
                  )}
                />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarTrigger className="m-2 self-end" />
    </Sidebar>
  );
}
