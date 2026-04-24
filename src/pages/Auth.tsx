import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const Auth = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = tab === "login" ? "/auth/login" : "/auth/register";
      const payload = tab === "register"
        ? { email, password, full_name: fullName }
        : { email, password };
      const data = await apiFetch(endpoint, "POST", payload);
      localStorage.setItem("keepalive_token", data.access_token);
      toast.success(tab === "login" ? "Welcome back!" : "Account created — let's go.");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left — form */}
      <div className="flex flex-col justify-between p-8 sm:p-12">
        <Logo />

        <div className="mx-auto w-full max-w-sm animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tab === "login"
                ? "Sign in to keep your backends awake."
                : "Start pinging your services in under 60 seconds."}
            </p>
          </div>

          <div className="inline-flex w-full rounded-lg border border-border bg-card p-1 mb-6">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                  tab === t ? "bg-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-11" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input id="email" type="email" placeholder="dev@yourcompany.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
                {tab === "login" && (
                  <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
                )}
              </div>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 font-mono" />
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90 shadow-glow gap-2 h-11">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  {tab === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>


        </div>

        <p className="text-xs text-muted-foreground">© 2026 KeepAlive. Built for developers.</p>
      </div>

      {/* Right — visual */}
      <div className="hidden lg:flex relative items-center justify-center bg-mesh border-l border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/10" />
        <div className="relative max-w-md p-12 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs font-medium">
              <span className="pulse-dot" /> Live · pinging 12,431 endpoints
            </div>
            <h2 className="text-4xl font-semibold tracking-tight leading-tight">
              Your backend should never sleep.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              KeepAlive pings your free-tier services on schedule, tracks every response, and alerts you the moment something breaks.
            </p>
          </div>

          {/* Mini terminal preview */}
          <div className="rounded-xl border border-border bg-card/80 backdrop-blur shadow-elegant overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/40">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">keepalive.log</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-muted-foreground overflow-x-auto">
<span className="text-success">✓</span> 10:00:01  GET  my-api-1       <span className="text-success">200</span>  120ms
<span className="text-success">✓</span> 10:05:00  GET  my-api-1       <span className="text-success">200</span>  118ms
<span className="text-destructive">✗</span> 10:05:30  GET  payments       <span className="text-destructive">502</span>  511ms
<span className="text-success">✓</span> 10:06:00  GET  my-api-2       <span className="text-success">200</span>   88ms
<span className="text-success">✓</span> 10:10:00  GET  my-api-1       <span className="text-success">200</span>  102ms
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
