
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUser, Search } from "lucide-react";
import { UserRole, useUserRole } from "@/contexts/UserRoleContext";

export function Layout() {
  const { role, setRole } = useUserRole();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account ({role})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                 <DropdownMenuRadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <DropdownMenuRadioItem value="Admin">Admin</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Chairperson">Chairperson</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Secretary">Secretary</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Treasurer">Treasurer</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Member">Member</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
