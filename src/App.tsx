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

// Interview pages
import InterviewIntro from "./pages/interview/InterviewIntro";
import InterviewForm from "./pages/interview/InterviewForm";

// Test pages
import TestConditionsIntro from "./pages/tests/TestConditionsIntro";
import TestConditionsForm from "./pages/tests/TestConditionsForm";
import TestPortalIntro from "./pages/tests/TestPortalIntro";
import TestPortalForm from "./pages/tests/TestPortalForm";
import TestReportIntro from "./pages/tests/TestReportIntro";
import TestReportForm from "./pages/tests/TestReportForm";
import TestRobotIntro from "./pages/tests/TestRobotIntro";
import TestRobotForm from "./pages/tests/TestRobotForm";
import TrainingDashboard from "./pages/TrainingDashboard";

// Contract pages
import ContractIntro from "./pages/contract/ContractIntro";
import ContractFormIPRF from "./pages/contract/ContractFormIPRF";
import ContractFormPhysRF from "./pages/contract/ContractFormPhysRF";
import ContractFormIPKZ from "./pages/contract/ContractFormIPKZ";

// Video Card page
import VideoCardIntro from "./pages/video-card/VideoCardIntro";

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
        
        {/* Interview routes */}
        <Route path="/interview" element={<InterviewIntro />} />
        <Route path="/interview/form" element={<InterviewForm />} />
        
        {/* Test routes */}
        <Route path="/tests/conditions" element={<TestConditionsIntro />} />
        <Route path="/tests/conditions/form" element={<TestConditionsForm />} />
        <Route path="/tests/portal" element={<TestPortalIntro />} />
        <Route path="/tests/portal/form" element={<TestPortalForm />} />
        <Route path="/tests/report" element={<TestReportIntro />} />
        <Route path="/tests/report/form" element={<TestReportForm />} />
        <Route path="/tests/robot" element={<TestRobotIntro />} />
        <Route path="/tests/robot/form" element={<TestRobotForm />} />
        
        {/* Training Dashboard */}
        <Route path="/training" element={<TrainingDashboard />} />
        
        {/* Contract routes */}
        <Route path="/contract" element={<ContractIntro />} />
        <Route path="/contract/ip-rf" element={<ContractFormIPRF />} />
        <Route path="/contract/phys-rf" element={<ContractFormPhysRF />} />
        
        {/* Video Card route */}
        <Route path="/video-card" element={<VideoCardIntro />} />
        <Route path="/contract/ip-kz" element={<ContractFormIPKZ />} />
        
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
