
import { NavLink, useLocation } from "react-router-dom";
import {
  Briefcase,
  Home,
  LineChart,
  Package,
  Settings,
  ShoppingCart,
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

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/reports", label: "Reports", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const getNavCls = (path: string) =>
    cn(
      "flex items-center px-3 py-2 rounded-md text-sm font-medium",
      location.pathname === path
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted"
    );

  return (
    <Sidebar className={cn("border-r", collapsed ? "w-14" : "w-64")}>
      <SidebarHeader>
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed && "justify-center"
          )}
        >
          <Briefcase className="w-6 h-6 text-primary" />
          {!collapsed && (
            <span className="text-lg font-semibold">VetPOS</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <NavLink to={item.href} className={getNavCls(item.href)}>
                <item.icon className="h-5 w-5" />
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
