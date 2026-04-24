import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { LogsTable } from "@/components/LogsTable";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import { LogEntry } from "@/lib/keepalive-data";
import useSWR from "swr";

const Logs = () => {
  const { data: logs = [], isLoading: loading, mutate, isValidating } = useSWR("/logs", { refreshInterval: 5000 });
  const [filter, setFilter] = useState<"all" | "success" | "fail">("all");

  const filtered = filter === "all" ? logs : logs.filter((l) => l.status === filter);

  return (
    <AppLayout
      title="Logs"
      subtitle="Every ping, every response. The full audit trail."
      actions={
        <>
          <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-elegant">
            {(["all", "success", "fail"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f} {f !== "all" && `(${logs.filter((l) => l.status === f).length})`}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => mutate()} disabled={isValidating}>
              <RefreshCw className={`h-3.5 w-3.5 ${isValidating ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-3.5 w-3.5" /> Export</Button>
          </div>
        </>
      }
    >
      <LogsTable logs={filtered} loading={loading} />
    </AppLayout>
  );
};

export default Logs;
