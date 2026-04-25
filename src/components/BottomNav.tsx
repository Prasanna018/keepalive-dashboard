import { NavLink } from "react-router-dom";
import { LayoutDashboard, ScrollText, Settings, Webhook } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Services", icon: LayoutDashboard },
  { to: "/logs", label: "Logs", icon: ScrollText },
  { to: "/integrations", label: "Integrations", icon: Webhook, disabled: true },
  { to: "/settings", label: "Settings", icon: Settings, disabled: true },
];

export const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border px-4 pb-safe-offset-2">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {items.map(({ to, label, icon: Icon, disabled }) => (
          <NavLink
            key={to}
            to={disabled ? "#" : to}
            onClick={(e) => disabled && e.preventDefault()}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200 w-16",
                disabled ? "opacity-30 pointer-events-none" : "hover:text-primary",
                isActive && !disabled ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              "group-hover:scale-110"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
            {/* Active indicator */}
            <span className={cn(
              "absolute bottom-2 h-1 w-1 rounded-full bg-primary transition-all duration-300",
              "scale-0 opacity-0 active:scale-100 active:opacity-100"
            )} />
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
