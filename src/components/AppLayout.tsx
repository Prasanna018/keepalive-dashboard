import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

import { BackendSuspended } from "./BackendSuspended";
import { useUser } from "@/hooks/useUser";

export const AppLayout = ({ title, subtitle, children, actions }: AppLayoutProps) => {
  const { isError, error } = useUser();

  if (isError && error?.detail === "BACKEND_SUSPENDED") {
    return <BackendSuspended />;
  }

  return (
    <div className="min-h-screen flex w-full bg-background bg-mesh">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {actions && <div className="mb-6 flex flex-wrap items-center justify-between gap-3">{actions}</div>}
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};
