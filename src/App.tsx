import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TelegramProvider, useTelegram } from "@/contexts/TelegramContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Wiki from "./pages/Wiki";
import ProjectsPage from "./pages/ProjectsPage";
import AdminCRM from "./pages/AdminCRM";
import AIAssistant from "./components/AIAssistant";
import P5Background from "./components/P5Background";
import ScrollToTop from "./components/ScrollToTop";
import TelegramLoader from "./components/TelegramLoader";
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

// Inner component that has access to Telegram context
const AppContent = () => {
  const { isLoading, isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  // Show loader while Telegram is initializing (only in first ~5 seconds)
  if (isLoading) {
    return <TelegramLoader />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/crm" element={<AdminCRM />} />
        <Route path="/wiki" element={<Wiki />} />
        <Route path="/projects" element={<ProjectsPage />} />
        
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
      
      {/* AI Assistant - hide on mobile/telegram, using bottom navbar instead */}
      {!showMobileNav && <AIAssistant />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TelegramProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </TelegramProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
