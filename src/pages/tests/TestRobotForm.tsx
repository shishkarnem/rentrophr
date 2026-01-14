import { useNavigate } from "react-router-dom";
import { useTelegram } from "@/contexts/TelegramContext";
import { useCrmData } from "@/hooks/useCrmData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";

// Form configurations per language
const formConfigs: Record<Language, { formId: string; minHeight: string }> = {
  ru: {
    formId: "1FAIpQLSc2p7UG57RRZZZvQQbGkNpqGvj4KLM8Uo8frlyPI-Hjp4z9eQ",
    minHeight: "3063px"
  },
  en: {
    formId: "1FAIpQLSeD_ndbybOokLC5xOd1g740EfhUL7Mu7hbIHPVq7v9rmb1I5w",
    minHeight: "3099px"
  },
  kz: {
    formId: "1FAIpQLSfK7GFU86Xgu9o0LWBiIQfyWjsQQRYppa-x6kMUADFA5Av-ew",
    minHeight: "2991px"
  }
};

const translations: Record<Language, { headerTitle: string; back: string; loading: string }> = {
  ru: { headerTitle: "Тест Робот", back: "Назад", loading: "Загрузка..." },
  en: { headerTitle: "Robot Test", back: "Back", loading: "Loading..." },
  kz: { headerTitle: "Робот тесті", back: "Артқа", loading: "Жүктелуде..." }
};

const TestRobotForm = () => {
  const navigate = useNavigate();
  const { isTelegram, profile } = useTelegram();
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData, isLoading } = useCrmData(telegramId);
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const showMobileNav = isTelegram || isMobile;
  
  const t = translations[language];
  const config = formConfigs[language];

  // Build the form URL with pre-filled data
  const buildFormUrl = () => {
    const baseUrl = `https://docs.google.com/forms/d/e/${config.formId}/viewform`;
    const params = new URLSearchParams();
    params.append('embedded', 'true');
    
    // Pre-fill CRM code (entry.31317174)
    if (crmData?.code) {
      params.append('entry.31317174', crmData.code);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const content = (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
      }}
    >
      {/* Header - only show on desktop */}
      {!showMobileNav && (
        <div className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10" style={{ background: 'rgba(23, 52, 79, 0.9)' }}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-white">{t.headerTitle}</h1>
          </div>
        </div>
      )}

      {/* Form iframe */}
      <div className="flex-1 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <span className="ml-2 text-white/70">{t.loading}</span>
          </div>
        ) : (
          <iframe
            src={buildFormUrl()}
            className="w-full border-0"
            style={{ 
              height: 'calc(100vh - 80px)',
              minHeight: config.minHeight
            }}
            title="Robot Test Form"
          >
            {t.loading}
          </iframe>
        )}
      </div>
    </div>
  );

  if (showMobileNav) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  return content;
};

export default TestRobotForm;
