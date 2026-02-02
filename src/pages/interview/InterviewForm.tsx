import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useCrmData } from '@/hooks/useCrmData';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';

// Form configurations for each language
const formConfigs: Record<Language, {
  formId: string;
  hrDefault: string;
}> = {
  ru: {
    formId: '1FAIpQLSdMnCbSdaQBVjOsVBHYCstiL4mZsF5HQPSV9gFdhmHzQwxCxA',
    hrDefault: 'Тимошенко Денис @shishkarnem',
  },
  en: {
    formId: '1FAIpQLSfGIeDZF072Gua6dP-Gv6qPaPgXQF1iz1osno7kCD6pKxOYJw',
    hrDefault: 'Timoshenko Denis @shishkarnem',
  },
  kz: {
    formId: '1FAIpQLSeL9N_FkXlKdJG-kv2Yu4b7nVyWGgMAaonNIScLsM_eU-_4Yg',
    hrDefault: 'Тимошенко Денис @shishkarnem',
  },
};

// Translations
const translations: Record<Language, {
  headerTitle: string;
  back: string;
  loading: string;
  gdprNotice: string;
}> = {
  ru: {
    headerTitle: 'Интервью',
    back: 'Назад',
    loading: 'Загрузка…',
    gdprNotice: 'Отправляя свои данные через данную форму, вы подтверждаете согласие на передачу ваших персональных данных иностранному сервису Google (Google LLC, США) в соответствии с ФЗ-152 «О персональных данных».',
  },
  en: {
    headerTitle: 'Interview',
    back: 'Back',
    loading: 'Loading…',
    gdprNotice: 'By submitting your data through this form, you confirm your consent to the transfer of your personal data to a foreign service Google (Google LLC, USA).',
  },
  kz: {
    headerTitle: 'Сұхбат',
    back: 'Артқа',
    loading: 'Жүктелуде…',
    gdprNotice: 'Осы форма арқылы деректеріңізді жіберу кезінде, сіз дербес деректеріңізді Google (Google LLC, АҚШ) шетелдік сервисіне беруге келісім бересіз.',
  },
};

const InterviewForm = () => {
  const navigate = useNavigate();
  const { isTelegram, profile } = useTelegram();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const showMobileNav = isTelegram || isMobile;

  // Get telegram_id from profile
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData } = useCrmData(telegramId);

  // Get form config and translations for current language
  const config = formConfigs[language];
  const t = translations[language];

  // Build Google Form URL with prefilled fields
  const buildFormUrl = () => {
    const baseUrl = `https://docs.google.com/forms/d/e/${config.formId}/viewform`;
    
    // Field IDs from Google Form (same across all languages)
    const params = new URLSearchParams();
    params.set('embedded', 'true');
    
    // 898718676 - код РОПа из профиля (crm_data.code)
    if (crmData?.code) {
      params.set('entry.898718676', crmData.code.toString());
    }
    
    // 1890080826 - username пользователя телеграм с @
    if (profile?.username) {
      params.set('entry.1890080826', `@${profile.username}`);
    }
    
    // 416402807 - HR, по умолчанию зависит от языка
    params.set('entry.416402807', config.hrDefault);
    
    return `${baseUrl}?${params.toString()}`;
  };

  const formUrl = buildFormUrl();

  return (
    <div 
      className="min-h-screen relative z-10 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
      }}
    >
      {/* Header - only show on desktop */}
      {!showMobileNav && (
        <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-semibold text-white ml-4">{t.headerTitle}</h1>
          </div>
        </div>
      )}

      {/* Mobile header */}
      {showMobileNav && <MobileHeader />}

      {/* GDPR Notice */}
      <div className={`px-4 ${showMobileNav ? 'pt-28' : 'pt-4'}`}>
        <div className="max-w-2xl mx-auto glass-dark rounded-xl p-4 border border-blue-500/30 bg-blue-500/5">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-lg">🔒</span>
            <p className="text-white/80 text-sm leading-relaxed">{t.gdprNotice}</p>
          </div>
        </div>
      </div>

      {/* Full-width iframe container - add padding for mobile header/navbar */}
      <div className={`flex-1 ${showMobileNav ? 'pb-32' : ''}`}>
        <iframe
          src={formUrl}
          className="w-full h-full min-h-[calc(100vh-80px)]"
          style={{
            border: 'none',
            margin: 0,
            padding: 0,
          }}
          title={t.headerTitle}
          allowFullScreen
        >
          {t.loading}
        </iframe>
      </div>

      {showMobileNav && <MobileNavbar />}
    </div>
  );
};

export default InterviewForm;
