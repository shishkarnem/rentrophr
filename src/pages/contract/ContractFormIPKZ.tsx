import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCrmData } from '@/hooks/useCrmData';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/layout/MobileLayout';

const translations: Record<Language, { title: string; loading: string }> = {
  ru: { title: 'Договор ИП KZ и СНГ', loading: 'Загрузка...' },
  en: { title: 'IP KZ & CIS Contract', loading: 'Loading...' },
  kz: { title: 'ЖК KZ және ТМД шарты', loading: 'Жүктелуде...' },
};

const ContractFormIPKZ = () => {
  const navigate = useNavigate();
  const { isTelegram, profile } = useTelegram();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData, isLoading } = useCrmData(telegramId);
  
  const t = translations[language];
  
  // Get current date in Russian format for prefill
  const now = new Date();
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const day = now.getDate().toString().padStart(2, '0');
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const formattedDate = `${day} ${month} ${year} г.`;
  
  const userCode = crmData?.code || '';
  
  // Build prefilled URL
  const buildFormUrl = () => {
    const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfJra-KV3tB4I1ms5jWX5dFbXWEIaKzh6ym4sIErPS7VuyAsg/viewform';
    const params = new URLSearchParams();
    params.append('embedded', 'true');
    params.append('usp', 'pp_url');
    if (userCode) {
      params.append('entry.1127068403', userCode);
    }
    params.append('entry.2102663603', formattedDate);
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
            <FileText className="w-5 h-5 text-accent" />
            <h1 className="text-xl font-semibold text-white">{t.title}</h1>
          </div>
        </div>
      )}

      {/* Form iframe - add padding for mobile header/navbar */}
      <div className={`flex-1 w-full ${showMobileNav ? 'pt-28 pb-32' : ''}`}>
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
              minHeight: '3527px'
            }}
            title={t.title}
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

export default ContractFormIPKZ;
