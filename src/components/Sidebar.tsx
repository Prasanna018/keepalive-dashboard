import { NavLink } from "react-router-dom";
import { LayoutDashboard, ScrollText, Settings, Webhook } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Services", icon: LayoutDashboard },
  { to: "/logs", label: "Logs", icon: ScrollText },
  { to: "/integrations", label: "Integrations", icon: Webhook, disabled: true },
  { to: "/settings", label: "Settings", icon: Settings, disabled: true },
];

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-5 h-16 flex items-center border-b border-sidebar-border">
        <Logo />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        {items.map(({ to, label, icon: Icon, disabled }) => (
          <NavLink
            key={to}
            to={disabled ? "#" : to}
            onClick={(e) => disabled && e.preventDefault()}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                disabled && "opacity-40 cursor-not-allowed",
                isActive && !disabled
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-elegant"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {disabled && (
              <span className="ml-auto text-[9px] uppercase tracking-wider rounded bg-muted px-1.5 py-0.5">
                Soon
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-xl border border-sidebar-border bg-gradient-to-br from-accent/40 to-transparent p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="pulse-dot" />
          <p className="text-xs font-semibold text-foreground">All systems pinging</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          3 services monitored. 99.8% uptime over 24h.
        </p>
      </div>
    </aside>
  );
};
