import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useCrmData } from '@/hooks/useCrmData';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';

const InterviewForm = () => {
  const navigate = useNavigate();
  const { isTelegram, profile } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  // Get telegram_id from profile
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData } = useCrmData(telegramId);

  // Build Google Form URL with prefilled fields
  const buildFormUrl = () => {
    const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdMnCbSdaQBVjOsVBHYCstiL4mZsF5HQPSV9gFdhmHzQwxCxA/viewform';
    
    // Field IDs from Google Form
    const params = new URLSearchParams();
    params.set('embedded', 'true');
    
    // 898718676 - код РОПа из профиля (crm_data.code)
    if (crmData?.code) {
      params.set('entry.898718676', crmData.code);
    }
    
    // 1890080826 - username пользователя телеграм с @
    if (profile?.username) {
      params.set('entry.1890080826', `@${profile.username}`);
    }
    
    // 416402807 - HR, по умолчанию "Тимошенко Денис @shishkarnem"
    const hrValue = 'Тимошенко Денис @shishkarnem';
    params.set('entry.416402807', hrValue);
    
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
      {/* Header */}
      {showMobileNav ? (
        <MobileHeader />
      ) : (
        <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-semibold text-white ml-4">Интервью</h1>
          </div>
        </div>
      )}

      {/* Back button for mobile at top */}
      {showMobileNav && (
        <div className="px-4 pt-20 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
        </div>
      )}

      {/* Full-width iframe container */}
      <div className={`flex-1 ${showMobileNav ? 'pb-20' : ''}`}>
        <iframe
          src={formUrl}
          className="w-full h-full min-h-[calc(100vh-80px)]"
          style={{
            border: 'none',
            margin: 0,
            padding: 0,
          }}
          title="Интервью"
          allowFullScreen
        >
          Загрузка…
        </iframe>
      </div>

      {showMobileNav && <MobileNavbar />}
    </div>
  );
};

export default InterviewForm;
