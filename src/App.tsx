import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/api";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Logs from "./pages/Logs.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthRoute } from "./components/AuthRoute.tsx";

const App = () => (
  <SWRConfig value={{ 
    fetcher,
    revalidateOnFocus: false,
    revalidateIfStale: false
  }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRoute><Index /></AuthRoute>} />
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </SWRConfig>
);

export default App;
