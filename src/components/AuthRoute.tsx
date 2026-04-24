import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
