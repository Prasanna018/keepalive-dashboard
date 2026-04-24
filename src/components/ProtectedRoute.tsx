import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isError, error } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 1. If it's a maintenance/suspension error, stay here and let AppLayout show the screen.
  if (isError && error?.detail === "BACKEND_SUSPENDED") {
    return <>{children}</>;
  }

  // 2. Otherwise, if there's an error or no user, redirect to login.
  if (isError || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
