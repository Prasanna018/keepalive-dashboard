import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Service, Method, deriveServiceName } from "@/lib/keepalive-data";

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Service | null;
  onSave: (svc: Service) => void;
}

export const ServiceModal = ({ open, onOpenChange, initial, onSave }: ServiceModalProps) => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<Method>("GET");
  const [interval, setIntervalMin] = useState("5");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    if (open) {
      setUrl(initial?.url ?? "");
      setMethod(initial?.method ?? "GET");
      setIntervalMin(String(initial?.interval ?? 5));
      setHeaders(initial?.headers ?? []);
    }
  }, [open, initial]);

  const handleSave = () => {
    if (!url.trim()) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      url: url.trim(),
      method,
      interval: parseInt(interval, 10),
      status: initial?.status ?? "active",
      lastPing: initial?.lastPing ?? "Just now",
      headers: headers.filter((h) => h.key),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit service" : "Add new service"}</DialogTitle>
          <DialogDescription>
            {initial ? "Update the configuration for this service." : "KeepAlive will ping this URL on the interval you choose."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-xs uppercase tracking-wider text-muted-foreground">Backend URL</Label>
            <Input
              id="url"
              placeholder="https://my-api.onrender.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="font-mono text-sm"
              autoFocus
            />
            {url && (
              <p className="text-xs text-muted-foreground">
                Detected name: <span className="text-foreground font-medium">{deriveServiceName(url)}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Method</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as Method)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Interval</Label>
              <Select value={interval} onValueChange={setIntervalMin}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every 1 minute</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="10">Every 10 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Custom headers</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setHeaders([...headers, { key: "", value: "" }])}>
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>
            {headers.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No custom headers.</p>
            ) : (
              <div className="space-y-2">
                {headers.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder="Header"
                      value={h.key}
                      className="font-mono text-xs h-9"
                      onChange={(e) => {
                        const next = [...headers];
                        next[i] = { ...next[i], key: e.target.value };
                        setHeaders(next);
                      }}
                    />
                    <Input
                      placeholder="Value"
                      value={h.value}
                      className="font-mono text-xs h-9"
                      onChange={(e) => {
                        const next = [...headers];
                        next[i] = { ...next[i], value: e.target.value };
                        setHeaders(next);
                      }}
                    />
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!url.trim()}>{initial ? "Save changes" : "Add service"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
