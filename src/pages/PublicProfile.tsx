import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, ExternalLink, Briefcase, MapPin, Phone, Calendar, FileText, Video, GraduationCap, CheckCircle2, Hourglass } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import MobileNavbar from '@/components/MobileNavbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTelegram } from '@/contexts/TelegramContext';

interface ProfileData {
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  language_code: string | null;
}

interface CrmData {
  telegram_id: number | null;
  code: string | null;
  telegram_name: string | null;
  status: string | null;
  level: string | null;
  city: string | null;
  region: string | null;
  phone: string | null;
  birth_date: string | null;
  resume_link: string | null;
  resume_text: string | null;
  photo_link: string | null;
  video_script: string | null;
  video_card: string | null;
  business_card_link: string | null;
  test_conditions: string | null;
  test_portal: string | null;
  test_report: string | null;
  test_robot: string | null;
  interview: string | null;
  interview_date: string | null;
  training_completed: string | null;
  contract_link: string | null;
  contract_date: string | null;
  work_start: string | null;
  available_skills: string | null;
  days_worked: number | null;
  projects_in_work: number | null;
}

// Progress item component
const ProgressItem = ({ 
  label, 
  value,
  language
}: { 
  label: string; 
  value: string | null;
  language: Language;
}) => {
  const pendingLabels: Record<Language, string> = {
    ru: 'Ожидает',
    en: 'Pending',
    kz: 'Күтілуде',
  };

  const isPending = !!value && (value.includes('⌛') || value.includes('⌛️') || value.includes('⏳'));
  const isCompleted = !!value && value.toLowerCase() !== 'нет' && value !== '0' && value !== '' && !isPending;

  const displayValue = isPending ? pendingLabels[language] : (value || '—');
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-green-400" />
        ) : isPending ? (
          <Hourglass className="w-4 h-4 text-accent" />
        ) : (
          <div className="w-4 h-4 rounded-full border border-white/30" />
        )}
        <span className={`text-sm ${isCompleted ? 'text-green-400' : isPending ? 'text-accent' : 'text-white/50'}`}>
          {displayValue}
        </span>
      </div>
    </div>
  );
};

// Info row component
const InfoRow = ({ label, value, isLink }: { label: string; value: string | null; isLink?: boolean }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
    <span className="text-muted-foreground text-sm">{label}</span>
    {isLink && value ? (
      <a 
        href={value} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-accent hover:text-accent/80 flex items-center gap-1 text-sm"
      >
        Открыть <ExternalLink className="w-3 h-3" />
      </a>
    ) : (
      <span className="text-white text-sm">{value || '—'}</span>
    )}
  </div>
);

const PublicProfile = () => {
  const { telegramId } = useParams<{ telegramId: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const { isTelegram } = useTelegram();
  const showMobileNav = isTelegram || isMobile;
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [crmData, setCrmData] = useState<CrmData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!telegramId) {
        setError('ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch telegram profile
        const { data: profile, error: profileError } = await supabase
          .from('telegram_profiles')
          .select('*')
          .eq('telegram_id', parseInt(telegramId))
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
        }

        if (profile) {
          setProfileData(profile);
        }

        // Fetch CRM data
        const { data: crm, error: crmError } = await supabase
          .from('crm_data')
          .select('*')
          .eq('telegram_id', parseInt(telegramId))
          .single();

        if (crmError && crmError.code !== 'PGRST116') {
          console.error('CRM fetch error:', crmError);
        }

        if (crm) {
          setCrmData(crm);
        }

        if (!profile && !crm) {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Error loading profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [telegramId]);

  // Labels for translations
  const labels: Record<Language, {
    title: string;
    notFound: string;
    loading: string;
    personalData: string;
    workInfo: string;
    progress: string;
    skills: string;
    resume: string;
    code: string;
    status: string;
    level: string;
    city: string;
    region: string;
    phone: string;
    birthDate: string;
    resumeLink: string;
    videoCard: string;
    businessCard: string;
    testConditions: string;
    testPortal: string;
    testReport: string;
    testRobot: string;
    interview: string;
    training: string;
    contract: string;
    workStart: string;
    daysWorked: string;
    projectsInWork: string;
    back: string;
  }> = {
    ru: {
      title: 'Профиль',
      notFound: 'Профиль не найден',
      loading: 'Загрузка...',
      personalData: 'Личные данные',
      workInfo: 'Рабочая информация',
      progress: 'Прогресс',
      skills: 'Навыки',
      resume: 'Резюме',
      code: 'Код',
      status: 'Статус',
      level: 'Уровень',
      city: 'Город',
      region: 'Регион',
      phone: 'Телефон',
      birthDate: 'Дата рождения',
      resumeLink: 'Ссылка на резюме',
      videoCard: 'Видео-визитка',
      businessCard: 'Визитка',
      testConditions: 'Тест условий',
      testPortal: 'Тест портала',
      testReport: 'Тест отчёта',
      testRobot: 'Тест робота',
      interview: 'Собеседование',
      training: 'Обучение',
      contract: 'Договор',
      workStart: 'Начало работы',
      daysWorked: 'Дней отработано',
      projectsInWork: 'Проектов в работе',
      back: 'Назад',
    },
    en: {
      title: 'Profile',
      notFound: 'Profile not found',
      loading: 'Loading...',
      personalData: 'Personal Data',
      workInfo: 'Work Information',
      progress: 'Progress',
      skills: 'Skills',
      resume: 'Resume',
      code: 'Code',
      status: 'Status',
      level: 'Level',
      city: 'City',
      region: 'Region',
      phone: 'Phone',
      birthDate: 'Birth Date',
      resumeLink: 'Resume Link',
      videoCard: 'Video Card',
      businessCard: 'Business Card',
      testConditions: 'Conditions Test',
      testPortal: 'Portal Test',
      testReport: 'Report Test',
      testRobot: 'Robot Test',
      interview: 'Interview',
      training: 'Training',
      contract: 'Contract',
      workStart: 'Work Start',
      daysWorked: 'Days Worked',
      projectsInWork: 'Projects in Work',
      back: 'Back',
    },
    kz: {
      title: 'Профиль',
      notFound: 'Профиль табылмады',
      loading: 'Жүктелуде...',
      personalData: 'Жеке деректер',
      workInfo: 'Жұмыс ақпараты',
      progress: 'Прогресс',
      skills: 'Дағдылар',
      resume: 'Түйіндеме',
      code: 'Код',
      status: 'Мәртебесі',
      level: 'Деңгей',
      city: 'Қала',
      region: 'Аймақ',
      phone: 'Телефон',
      birthDate: 'Туған күні',
      resumeLink: 'Түйіндеме сілтемесі',
      videoCard: 'Бейне визитка',
      businessCard: 'Визитка',
      testConditions: 'Шарттар тесті',
      testPortal: 'Портал тесті',
      testReport: 'Есеп тесті',
      testRobot: 'Робот тесті',
      interview: 'Сұхбат',
      training: 'Оқыту',
      contract: 'Келісімшарт',
      workStart: 'Жұмыс басталуы',
      daysWorked: 'Жұмыс істеген күндер',
      projectsInWork: 'Жұмыстағы жобалар',
      back: 'Артқа',
    },
  };

  const l = labels[language];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || (!profileData && !crmData)) {
    return (
      <div 
        className="min-h-screen relative z-10"
        style={{ background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)' }}
      >
        <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-semibold text-white">{l.title}</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-20 text-center">
          <User className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">{l.notFound}</h2>
        </div>
      </div>
    );
  }

  const displayName = profileData?.first_name || crmData?.telegram_name || 'User';
  const photoUrl = profileData?.photo_url || crmData?.photo_link;

  return (
    <div 
      className="min-h-screen relative z-10"
      style={{ background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)' }}
    >
      {/* Header */}
      <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">{l.title}</h1>
        </div>
      </div>

      <div className={`container mx-auto px-4 py-8 max-w-md space-y-6 ${showMobileNav ? 'pb-24' : ''}`}>
        {/* Profile Photo */}
        <div className="relative mt-4" style={{ padding: '0 5%' }}>
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-accent/30 bg-muted flex items-center justify-center">
            {photoUrl ? (
              <img 
                src={photoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-24 h-24 text-muted-foreground" />
            )}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-white">
              {profileData?.first_name} {profileData?.last_name}
            </h2>
            {profileData?.username && (
              <p className="text-muted-foreground">@{profileData.username}</p>
            )}
            {crmData?.code && (
              <p className="text-accent font-medium mt-1">{crmData.code}</p>
            )}
          </div>
        </div>

        {/* Work Info */}
        {crmData && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{l.workInfo}</h3>
            </div>
            
            <InfoRow label={l.status} value={crmData.status} />
            <InfoRow label={l.level} value={crmData.level} />
            <InfoRow label={l.city} value={crmData.city} />
            <InfoRow label={l.region} value={crmData.region} />
            {crmData.days_worked !== null && crmData.days_worked > 0 && (
              <InfoRow label={l.daysWorked} value={crmData.days_worked.toString()} />
            )}
            {crmData.projects_in_work !== null && crmData.projects_in_work > 0 && (
              <InfoRow label={l.projectsInWork} value={crmData.projects_in_work.toString()} />
            )}
          </div>
        )}

        {/* Skills */}
        {crmData?.available_skills && (
          <div className="glass-dark rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{l.skills}</h3>
            </div>
            <p className="text-white/80 text-sm">{crmData.available_skills}</p>
          </div>
        )}

        {/* Progress */}
        {crmData && (
          <div className="glass-dark rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{l.progress}</h3>
            </div>
            
            <ProgressItem label={l.testConditions} value={crmData.test_conditions} language={language} />
            <ProgressItem label={l.testPortal} value={crmData.test_portal} language={language} />
            <ProgressItem label={l.testReport} value={crmData.test_report} language={language} />
            <ProgressItem label={l.testRobot} value={crmData.test_robot} language={language} />
            <ProgressItem label={l.interview} value={crmData.interview} language={language} />
            <ProgressItem label={l.training} value={crmData.training_completed} language={language} />
            <ProgressItem label={l.contract} value={crmData.contract_link ? '✓' : null} language={language} />
            <ProgressItem label={l.workStart} value={crmData.work_start} language={language} />
          </div>
        )}

        {/* Links */}
        {(crmData?.video_card || crmData?.business_card_link || crmData?.resume_link) && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ExternalLink className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{l.resume}</h3>
            </div>
            
            {crmData.video_card && (
              <InfoRow label={l.videoCard} value={crmData.video_card} isLink />
            )}
            {crmData.business_card_link && (
              <InfoRow label={l.businessCard} value={crmData.business_card_link} isLink />
            )}
            {crmData.resume_link && (
              <InfoRow label={l.resumeLink} value={crmData.resume_link} isLink />
            )}
          </div>
        )}

        {/* Resume Text Preview */}
        {crmData?.resume_text && (
          <div className="glass-dark rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{l.resume}</h3>
            </div>
            <p className="text-white/80 text-sm whitespace-pre-wrap bg-white/5 rounded-lg p-3 max-h-48 overflow-hidden">
              {crmData.resume_text.slice(0, 500)}
              {crmData.resume_text.length > 500 && '...'}
            </p>
          </div>
        )}
      </div>

      {showMobileNav && <MobileNavbar />}
    </div>
  );
};

export default PublicProfile;
