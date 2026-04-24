import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ServiceTable } from "@/components/ServiceTable";
import { ServiceModal } from "@/components/ServiceModal";
import { Button } from "@/components/ui/button";
import { Plus, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import { Service, initialServices } from "@/lib/keepalive-data";
import { toast } from "sonner";

const Dashboard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setServices(initialServices);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleSave = (svc: Service) => {
    setServices((prev) => {
      const exists = prev.find((s) => s.id === svc.id);
      if (exists) {
        toast.success("Service updated");
        return prev.map((s) => (s.id === svc.id ? svc : s));
      }
      toast.success("Service added — pinging started");
      return [svc, ...prev];
    });
  };

  const stats = [
    { label: "Total services", value: services.length, icon: Activity, tone: "text-foreground" },
    { label: "Active", value: services.filter((s) => s.status === "active").length, icon: CheckCircle2, tone: "text-success" },
    { label: "Paused", value: services.filter((s) => s.status === "paused").length, icon: AlertTriangle, tone: "text-warning" },
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
        onToggle={(id) => {
          setServices((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s));
        }}
        onEdit={(s) => { setEditing(s); setModalOpen(true); }}
        onDelete={(id) => {
          setServices((prev) => prev.filter((s) => s.id !== id));
          toast.success("Service removed");
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
