import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCrmData } from '@/hooks/useCrmData';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';

const translations = {
  ru: {
    title: 'Договор ИП KZ и СНГ',
    subtitle: 'Заполните форму для создания договора (для Казахстана и всего мира)',
  },
  en: {
    title: 'IP KZ & CIS Contract',
    subtitle: 'Fill out the form to create a contract (for Kazakhstan and worldwide)',
  },
  kz: {
    title: 'ЖК KZ және ТМД шарты',
    subtitle: 'Шарт жасау үшін форманы толтырыңыз (Қазақстан және бүкіл әлем үшін)',
  },
};

const ContractFormIPKZ = () => {
  const navigate = useNavigate();
  const { isTelegram, profile } = useTelegram();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData } = useCrmData(telegramId);
  
  const t = translations[language];
  
  // Get current date in Russian format for prefill
  const now = new Date();
  const months: Record<Language, string[]> = {
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    kz: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'],
  };
  const day = now.getDate().toString().padStart(2, '0');
  const month = months.ru[now.getMonth()]; // Always Russian for form
  const year = now.getFullYear();
  const formattedDate = `${day} ${month} ${year} г.`;
  
  const userCode = crmData?.code || '';
  
  // Build prefilled URL
  const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfJra-KV3tB4I1ms5jWX5dFbXWEIaKzh6ym4sIErPS7VuyAsg/viewform';
  const params = new URLSearchParams({
    'usp': 'pp_url',
    'entry.1127068403': userCode,
    'entry.2102663603': formattedDate,
  });
  const iframeSrc = `${baseUrl}?${params.toString()}&embedded=true`;

  return (
    <div 
      className="min-h-screen relative z-10"
      style={{
        background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
      }}
    >
      {/* Header */}
      {showMobileNav ? (
        <MobileHeader />
      ) : (
        <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <h1 className="text-lg font-semibold text-white">{t.title}</h1>
            </div>
          </div>
        </div>
      )}

      <main className={`container mx-auto px-4 py-6 ${showMobileNav ? 'pt-4 pb-24' : ''}`}>
        <div className="glass-dark rounded-2xl p-4 overflow-hidden">
          <p className="text-white/70 text-sm mb-4 text-center">{t.subtitle}</p>
          <div className="bg-white rounded-xl overflow-hidden">
            <iframe 
              src={iframeSrc}
              width="100%" 
              height="3527" 
              frameBorder="0" 
              marginHeight={0} 
              marginWidth={0}
              title={t.title}
              className="w-full"
            >
              Загрузка…
            </iframe>
          </div>
        </div>
      </main>

      {showMobileNav && <MobileNavbar />}
    </div>
  );
};

export default ContractFormIPKZ;
