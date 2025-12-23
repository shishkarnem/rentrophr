import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TelegramProvider } from "@/contexts/TelegramContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Wiki from "./pages/Wiki";
import AIAssistant from "./components/AIAssistant";
import P5Background from "./components/P5Background";
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

// Motivation sub-pages
import Fix from "./pages/conditions/motivation/Fix";
import Variable from "./pages/conditions/motivation/Variable";
import Partner from "./pages/conditions/motivation/Partner";
import Services from "./pages/conditions/motivation/Services";
import SubPartner from "./pages/conditions/motivation/SubPartner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TelegramProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wiki" element={<Wiki />} />
              
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
              <Route path="/conditions/motivation/fix" element={<Fix />} />
              <Route path="/conditions/motivation/variable" element={<Variable />} />
              <Route path="/conditions/motivation/partner" element={<Partner />} />
              <Route path="/conditions/motivation/services" element={<Services />} />
              <Route path="/conditions/motivation/subpartner" element={<SubPartner />} />
              <Route path="/conditions/training" element={<Training />} />
              <Route path="/conditions/projects" element={<Projects />} />
              <Route path="/conditions/registration" element={<Registration />} />
              <Route path="/conditions/payments" element={<Payments />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* P5.js Background Animation */}
            <P5Background />
            
            {/* AI Assistant - available on all pages */}
            <AIAssistant />
          </BrowserRouter>
        </TooltipProvider>
      </TelegramProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
