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

  if (isError || !user) {
    // If the backend is suspended/maintenance, don't redirect to login.
    // Let the AppLayout handle showing the maintenance screen.
    if (error?.detail === "BACKEND_SUSPENDED") {
      return <>{children}</>;
    }

    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
