import { LogEntry } from "@/lib/keepalive-data";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface LogsTableProps {
  logs: LogEntry[];
  loading?: boolean;
}

export const LogsTable = ({ logs, loading }: LogsTableProps) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
            <div className="h-6 w-20 rounded bg-muted animate-pulse" />
            <div className="h-3 flex-1 rounded bg-muted/60 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">No logs to show yet.</p>
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
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Status</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Timestamp</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Service</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Code</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Latency</th>
              <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => {
              const ok = l.status === "success";
              return (
                <tr key={l._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    {ok ? (
                      <Badge variant="outline" className="border-success/30 bg-success/10 text-success gap-1.5">
                        <CheckCircle2 className="h-3 w-3" /> Success
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive gap-1.5">
                        <XCircle className="h-3 w-3" /> Fail
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</td>
                  <td className="px-5 py-3 font-mono text-xs truncate max-w-[200px]">{l.service_url ?? "—"}</td>
                  <td className="px-5 py-3 font-mono text-xs">
                    <span className={ok ? "text-success" : "text-destructive"}>{l.status_code}</span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{l.response_time} ms</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground truncate max-w-[300px]">{l.error || l.message || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden divide-y divide-border">
        {logs.map((l) => {
          const ok = l.status === "success";
          return (
            <div key={l._id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">{new Date(l.timestamp).toLocaleString()}</span>
                {ok ? (
                  <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[10px] py-0 h-5 gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Success
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive text-[10px] py-0 h-5 gap-1">
                    <XCircle className="h-2.5 w-2.5" /> Fail
                  </Badge>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs truncate">{l.service_url ?? "—"}</p>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex gap-3">
                  <span className={ok ? "text-success" : "text-destructive"}>HTTP {l.status_code}</span>
                  <span className="text-muted-foreground">{l.response_time}ms</span>
                </div>
              </div>
              {(l.error || l.message) && (
                <div className="bg-muted/30 rounded p-2 font-mono text-[10px] text-muted-foreground break-all">
                  {l.error || l.message}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
