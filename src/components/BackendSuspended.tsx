import { ServerOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BackendSuspended = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background bg-mesh p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative h-20 w-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-elegant">
          <ServerOff className="h-10 w-10 text-primary animate-pulse" />
        </div>
      </div>
      
      <h1 className="text-3xl font-semibold tracking-tight mb-3">Maintenance in Progress</h1>
      <p className="text-muted-foreground max-w-md leading-relaxed mb-8">
        Our services are temporarily unavailable due to scheduled maintenance. We'll be back online very shortly — thank you for your patience.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          size="lg" 
          variant="default" 
          className="gap-2 bg-gradient-primary shadow-glow"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" /> Try Reconnecting
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          onClick={() => window.open('https://dashboard.render.com', '_blank')}
        >
          Open Render Dashboard
        </Button>
      </div>
      
      <p className="mt-12 text-xs text-muted-foreground font-mono">
        Status: 503 SERVICE_UNAVAILABLE
      </p>
    </div>
  );
};
