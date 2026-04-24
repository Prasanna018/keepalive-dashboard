import { Navigate } from "react-router-dom";
import { getCookie } from "@/lib/api";

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getCookie("keepalive_token");

  // If a token exists locally, assume they are logged in and send them to dashboard.
  // This keeps the login page silent (no backend pings).
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
