import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ServiceTable } from "@/components/ServiceTable";
import { ServiceModal } from "@/components/ServiceModal";
import { Button } from "@/components/ui/button";
import { Plus, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";

const Dashboard = () => {
  const { data: services = [], isLoading: loading, mutate } = useSWR("/services");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const handleSave = async (svc: any) => {
    try {
      if (editing) {
        await apiFetch(`/services/${editing._id}`, "PUT", svc);
        toast.success("Service updated");
      } else {
        await apiFetch("/services", "POST", svc);
        toast.success("Service added — pinging started");
      }
      mutate();
    } catch (err: any) {
      toast.error(err?.detail || "Failed to save service");
    }
  };

  const stats = [
    { label: "Total services", value: services.length, icon: Activity, tone: "text-foreground" },
    { label: "Active", value: services.filter((s: any) => s.is_active).length, icon: CheckCircle2, tone: "text-success" },
    { label: "Paused", value: services.filter((s: any) => !s.is_active).length, icon: AlertTriangle, tone: "text-warning" },
  ];

  return (
    <AppLayout
      title="Services"
      subtitle="Keep your backends warm and responsive."
      actions={
        <>
          <div className="grid grid-cols-3 gap-3 flex-1 max-w-2xl">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-elegant">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <s.icon className={`h-3.5 w-3.5 ${s.tone}`} />
                </div>
                <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow"
            onClick={() => { setEditing(null); setModalOpen(true); }}
          >
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        </>
      }
    >
      <ServiceTable
        services={services}
        loading={loading}
        onAdd={() => { setEditing(null); setModalOpen(true); }}
        onToggle={async (id) => {
          try {
            await apiFetch(`/services/${id}/toggle`, "PATCH");
            mutate();
          } catch (err) {
            toast.error("Failed to toggle service");
          }
        }}
        onEdit={(s: any) => { setEditing(s); setModalOpen(true); }}
        onDelete={async (id) => {
          try {
            await apiFetch(`/services/${id}`, "DELETE");
            toast.success("Service removed");
            mutate();
          } catch (err) {
            toast.error("Failed to remove service");
          }
        }}
      />

      <ServiceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editing}
        onSave={handleSave}
      />
    </AppLayout>
  );
};

export default Dashboard;
