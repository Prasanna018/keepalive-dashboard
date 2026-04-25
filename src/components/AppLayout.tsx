import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const AppLayout = ({ title, subtitle, children, actions }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-background bg-mesh">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {actions && <div className="mb-6 flex flex-wrap items-center justify-between gap-4">{actions}</div>}
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
