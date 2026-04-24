import { Activity } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
      <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
    </div>
    <div className="flex items-baseline gap-0.5">
      <span className="text-lg font-semibold tracking-tight text-foreground">Keep</span>
      <span className="text-lg font-semibold tracking-tight text-primary">Alive</span>
    </div>
  </div>
);
