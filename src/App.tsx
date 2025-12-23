import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Work pages
import WorkIndex from "./pages/work/index";
import ArendaRopov from "./pages/work/ArendaRopov";
import AboutCompany from "./pages/work/AboutCompany";
import Community from "./pages/work/Community";
import Reports from "./pages/work/Reports";
import DPR from "./pages/work/DPR";
import Employees from "./pages/work/Employees";

// Conditions pages
import ConditionsIndex from "./pages/conditions/index";
import Motivation from "./pages/conditions/Motivation";
import Training from "./pages/conditions/Training";
import Projects from "./pages/conditions/Projects";
import Registration from "./pages/conditions/Registration";
import Payments from "./pages/conditions/Payments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Work routes */}
          <Route path="/work" element={<WorkIndex />} />
          <Route path="/work/arenda-ropov" element={<ArendaRopov />} />
          <Route path="/work/about" element={<AboutCompany />} />
          <Route path="/work/community" element={<Community />} />
          <Route path="/work/reports" element={<Reports />} />
          <Route path="/work/dpr" element={<DPR />} />
          <Route path="/work/employees" element={<Employees />} />
          
          {/* Conditions routes */}
          <Route path="/conditions" element={<ConditionsIndex />} />
          <Route path="/conditions/motivation" element={<Motivation />} />
          <Route path="/conditions/training" element={<Training />} />
          <Route path="/conditions/projects" element={<Projects />} />
          <Route path="/conditions/registration" element={<Registration />} />
          <Route path="/conditions/payments" element={<Payments />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
