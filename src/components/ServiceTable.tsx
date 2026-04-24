import { Service, deriveServiceName } from "@/lib/keepalive-data";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, ExternalLink, Clock, ServerCrash } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceTableProps {
  services: Service[];
  loading?: boolean;
  onToggle: (id: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const ServiceTable = ({ services, loading, onToggle, onEdit, onDelete, onAdd }: ServiceTableProps) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
            <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 rounded bg-muted animate-pulse" />
              <div className="h-2.5 w-64 rounded bg-muted/60 animate-pulse" />
            </div>
            <div className="h-6 w-16 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <ServerCrash className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold mb-1">No services yet</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
          Add your first backend URL and KeepAlive will start pinging it on schedule.
        </p>
        <Button onClick={onAdd} variant="default">Add your first service</Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-elegant overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Service</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Interval</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Status</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Last Ping</th>
              <th className="text-right font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center font-mono text-xs font-semibold shrink-0",
                      s.status === "active" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {deriveServiceName(s.url).slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{deriveServiceName(s.url)}</p>
                      <a href={s.url} target="_blank" rel="noreferrer" className="font-mono text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 truncate max-w-[280px]">
                        <span className="truncate">{s.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {s.interval} min
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground font-mono">{s.lastPing}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Switch
                      checked={s.status === "active"}
                      onCheckedChange={() => onToggle(s.id)}
                      aria-label="Toggle service"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(s)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(s.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        {services.map((s) => (
          <div key={s.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{deriveServiceName(s.url)}</p>
                <p className="font-mono text-xs text-muted-foreground truncate">{s.url}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>{s.interval} min · {s.lastPing}</span>
              <div className="flex items-center gap-1">
                <Switch checked={s.status === "active"} onCheckedChange={() => onToggle(s.id)} />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(s)}><Edit2 className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: "active" | "paused" }) => {
  if (status === "active") {
    return (
      <Badge variant="outline" className="border-success/30 bg-success/10 text-success font-medium gap-1.5">
        <span className="pulse-dot" />
        Active
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-muted-foreground/30 bg-muted/30 text-muted-foreground font-medium gap-1.5">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
      Paused
    </Badge>
  );
};
