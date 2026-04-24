import { Bell, Search, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  title: string;
  subtitle?: string;
}

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";
import { Menu } from "lucide-react";

export const Navbar = ({ title, subtitle }: NavbarProps) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  const handleLogout = () => {
    localStorage.removeItem("keepalive_token");
    navigate("/auth");
  };

  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="h-full px-4 sm:px-6 flex items-center gap-4">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-sidebar border-r-sidebar-border">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>

        <div className="hidden lg:flex relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services, logs..."
            className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:bg-background"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition-colors outline-none">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {user && (
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold leading-tight truncate max-w-[120px]">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-medium">{user?.full_name || "My Account"}</p>
              <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive gap-2 cursor-pointer">
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
