import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, ExternalLink, Briefcase, Phone, Calendar, FileText, Video, GraduationCap, CheckCircle2, Hourglass, MessageCircle, ChevronDown, RefreshCw, Languages, Send } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import MobileLayout from '@/components/layout/MobileLayout';
import PageTransition from '@/components/PageTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTelegram } from '@/contexts/TelegramContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

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
  full_info: string | null;
  hr: string | null;
  status: string | null;
  rating: string | null;
  level: string | null;
  city: string | null;
  region: string | null;
  phone: string | null;
  birth_date: string | null;
  resume_link: string | null;
  resume_link_chat: string | null;
  resume_text: string | null;
  photo_link: string | null;
  video_script: string | null;
  video_card: string | null;
  business_card_link: string | null;
  contract_link: string | null;
  contract_date: string | null;
  test_conditions: string | null;
  test_portal: string | null;
  test_report: string | null;
  test_robot: string | null;
  interview: string | null;
  interview_date: string | null;
  training_completed: string | null;
  work_start: string | null;
  work_start_date: string | null;
  available_skills: string | null;
  language_choice: string | null;
  days_worked: number | null;
  projects_in_work: number | null;
  projects_mailing: string | null;
  contract_signing: string | null;
  tests_passed: string | null;
  dismissal_date: string | null;
  waiting_period: string | null;
  rop_name: string | null;
  checklist_answers: string | null;
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
const InfoRow = ({ label, value, isLink }: { label: string; value: string | null; isLink?: boolean }) => {
  const { language } = useLanguage();
  const openLabel = language === 'ru' ? 'Открыть' : language === 'kz' ? 'Ашу' : 'Open';
  
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      {isLink && value ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-accent hover:text-accent/80 flex items-center gap-1 text-sm"
        >
          {openLabel} <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <span className="text-white text-sm">{value || '—'}</span>
      )}
    </div>
  );
};

// Expandable text component
const ExpandableText = ({ 
  label, 
  value, 
  showAllText 
}: { 
  label: string; 
  value: string | null; 
  showAllText?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!value) {
    return <InfoRow label={label} value={null} />;
  }
  
  const lines = value.split('\n');
  const previewLines = lines.slice(0, 10).join('\n');
  const hasMore = lines.length > 10;
  
  return (
    <>
      <div className="py-2 border-b border-white/10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-muted-foreground text-sm">{label}</span>
          {hasMore && (
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-accent hover:text-accent/80 flex items-center gap-1 text-xs"
            >
              {showAllText || 'Показать всё'} <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-white text-sm whitespace-pre-wrap bg-white/5 rounded-lg p-3 max-h-48 overflow-hidden">
          {previewLines}
          {hasMore && '...'}
        </p>
      </div>
      
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[80vh] overflow-y-auto glass-dark border-white/10 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-white">{label}</DialogTitle>
          </DialogHeader>
          <p className="text-white text-sm whitespace-pre-wrap">{value}</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

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
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Script dialog state
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  
  // Translation state
  const [isTranslatingResume, setIsTranslatingResume] = useState(false);

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
        setCrmData(crm as CrmData);
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

  useEffect(() => {
    fetchProfile();
  }, [telegramId]);

  // Handle manual sync
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await fetchProfile();
      toast.success(
        language === 'ru' ? 'Данные обновлены' :
        language === 'kz' ? 'Деректер жаңартылды' :
        'Data updated'
      );
    } catch (err) {
      toast.error(
        language === 'ru' ? 'Ошибка обновления' :
        language === 'kz' ? 'Жаңарту қатесі' :
        'Update error'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle resume translation
  const handleTranslateResume = async () => {
    if (!crmData?.resume_text) {
      toast.error(
        language === 'ru' ? 'Резюме не заполнено' :
        language === 'kz' ? 'Түйіндеме толтырылмаған' :
        'Resume not filled'
      );
      return;
    }

    setIsTranslatingResume(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-resume', {
        body: { 
          resumeText: crmData.resume_text,
          targetLanguage: language,
          telegramId: parseInt(telegramId!)
        }
      });

      if (error) throw error;
      
      if (data?.translatedText) {
        toast.success(
          language === 'ru' ? 'Резюме переведено' :
          language === 'kz' ? 'Түйіндеме аударылды' :
          'Resume translated'
        );
        fetchProfile();
      }
    } catch (err) {
      console.error('Error translating resume:', err);
      toast.error(
        language === 'ru' ? 'Ошибка перевода' :
        language === 'kz' ? 'Аударма қатесі' :
        'Translation error'
      );
    } finally {
      setIsTranslatingResume(false);
    }
  };

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
    resumeLinkChat: string;
    videoCard: string;
    businessCard: string;
    testConditions: string;
    testPortal: string;
    testReport: string;
    testRobot: string;
    interview: string;
    training: string;
    contract: string;
    contractDate: string;
    workStart: string;
    workStartDate: string;
    daysWorked: string;
    projectsInWork: string;
    back: string;
    refresh: string;
    scriptTitle: string;
    showAll: string;
    fullInfo: string;
    hr: string;
    rating: string;
    testsPassed: string;
    dismissalDate: string;
    waitingPeriod: string;
    trainingCompleted: string;
    availableSkills: string;
    languageChoice: string;
    contractSigning: string;
    projectsMailing: string;
    interviewSection: string;
    ropName: string;
    checklistAnswers: string;
    resumeText: string;
    translate: string;
    openTelegram: string;
    testsProgress: string;
    photo: string;
  }> = {
    ru: {
      title: 'Профиль',
      notFound: 'Профиль не найден',
      loading: 'Загрузка...',
      personalData: 'Личные данные',
      workInfo: 'Рабочие данные',
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
      resumeLinkChat: 'Ссылка на резюме в чате',
      videoCard: 'Видео-визитка',
      businessCard: 'Визитка',
      testConditions: 'Тест условий',
      testPortal: 'Тест портала',
      testReport: 'Тест отчёта',
      testRobot: 'Тест робота',
      interview: 'Интервью',
      training: 'Обучение',
      contract: 'Договор',
      contractDate: 'Дата договора',
      workStart: 'Выход на работу',
      workStartDate: 'Дата начала работы',
      daysWorked: 'Дней отработано',
      projectsInWork: 'Проектов в работе',
      back: 'Назад',
      refresh: 'Обновить',
      scriptTitle: 'Сценарий видео-визитки',
      showAll: 'Показать всё',
      fullInfo: 'ФИО, Код и Телеграм',
      hr: 'HR',
      rating: 'Рейтинг',
      testsPassed: 'Пройдено тестов',
      dismissalDate: 'Дата увольнения',
      waitingPeriod: 'Срок в ожидании',
      trainingCompleted: 'Пройдено обучение за',
      availableSkills: 'Доступные навыки',
      languageChoice: 'Выбор языка',
      contractSigning: 'Подписание договора',
      projectsMailing: 'Рассылка проектов',
      interviewSection: 'Данные интервью',
      ropName: 'РОП (ФИО)',
      checklistAnswers: 'Ответы на чек-лист',
      resumeText: 'Текст резюме',
      translate: 'Перевести',
      openTelegram: 'Открыть в Telegram',
      testsProgress: 'Прогресс тестов',
      photo: 'Фото',
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
      resumeLinkChat: 'Resume Link in Chat',
      videoCard: 'Video Card',
      businessCard: 'Business Card',
      testConditions: 'Conditions Test',
      testPortal: 'Portal Test',
      testReport: 'Report Test',
      testRobot: 'Robot Test',
      interview: 'Interview',
      training: 'Training',
      contract: 'Contract',
      contractDate: 'Contract Date',
      workStart: 'Work Start',
      workStartDate: 'Work Start Date',
      daysWorked: 'Days Worked',
      projectsInWork: 'Projects in Work',
      back: 'Back',
      refresh: 'Refresh',
      scriptTitle: 'Video Business Card Script',
      showAll: 'Show all',
      fullInfo: 'Full Name, Code & Telegram',
      hr: 'HR',
      rating: 'Rating',
      testsPassed: 'Tests Passed',
      dismissalDate: 'Dismissal Date',
      waitingPeriod: 'Waiting Period',
      trainingCompleted: 'Training Completed In',
      availableSkills: 'Available Skills',
      languageChoice: 'Language Choice',
      contractSigning: 'Contract Signing',
      projectsMailing: 'Projects Mailing',
      interviewSection: 'Interview Data',
      ropName: 'ROP (Full Name)',
      checklistAnswers: 'Checklist Answers',
      resumeText: 'Resume Text',
      translate: 'Translate',
      openTelegram: 'Open in Telegram',
      testsProgress: 'Tests Progress',
      photo: 'Photo',
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
      resumeLinkChat: 'Чаттағы түйіндеме сілтемесі',
      videoCard: 'Бейне визитка',
      businessCard: 'Визитка',
      testConditions: 'Шарттар тесті',
      testPortal: 'Портал тесті',
      testReport: 'Есеп тесті',
      testRobot: 'Робот тесті',
      interview: 'Сұхбат',
      training: 'Оқыту',
      contract: 'Келісімшарт',
      contractDate: 'Келісімшарт күні',
      workStart: 'Жұмыс басталуы',
      workStartDate: 'Жұмыс басталу күні',
      daysWorked: 'Жұмыс істеген күндер',
      projectsInWork: 'Жұмыстағы жобалар',
      back: 'Артқа',
      refresh: 'Жаңарту',
      scriptTitle: 'Бейне визитка сценарийі',
      showAll: 'Барлығын көрсету',
      fullInfo: 'Аты-жөні, Код және Телеграм',
      hr: 'HR',
      rating: 'Рейтинг',
      testsPassed: 'Өткен тесттер',
      dismissalDate: 'Жұмыстан шығу күні',
      waitingPeriod: 'Күту мерзімі',
      trainingCompleted: 'Оқыту аяқталды',
      availableSkills: 'Қол жетімді дағдылар',
      languageChoice: 'Тіл таңдау',
      contractSigning: 'Келісімшартқа қол қою',
      projectsMailing: 'Жобалар тарату',
      interviewSection: 'Сұхбат деректері',
      ropName: 'РОП (Аты-жөні)',
      checklistAnswers: 'Чек-лист жауаптары',
      resumeText: 'Түйіндеме мәтіні',
      translate: 'Аудару',
      openTelegram: 'Telegram-да ашу',
      testsProgress: 'Тесттер прогресі',
      photo: 'Фото',
    },
  };

  const l = labels[language];

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient">
        <MobileLayout>
          <PageTransition>
            <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>
            </main>
          </PageTransition>
        </MobileLayout>
      </div>
    );
  }

  if (error || (!profileData && !crmData)) {
    return (
      <div className="min-h-screen hero-gradient">
        <MobileLayout>
          <PageTransition>
            <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
              <div className="container mx-auto px-4">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {l.back}
                </button>
                
                <div className="text-center py-12">
                  <User className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-white">{l.notFound}</h2>
                </div>
              </div>
            </main>
          </PageTransition>
        </MobileLayout>
      </div>
    );
  }

  const displayName = profileData?.first_name || crmData?.telegram_name || 'User';
  const photoUrl = profileData?.photo_url || crmData?.photo_link;
  const telegramLink = profileData?.username ? `https://t.me/${profileData.username}` : null;

  // Tests progress calculation
  const tests = [
    { key: 'conditions', value: crmData?.test_conditions },
    { key: 'portal', value: crmData?.test_portal },
    { key: 'report', value: crmData?.test_report },
    { key: 'robot', value: crmData?.test_robot },
  ];
  const passedCount = tests.filter(test => {
    const v = test.value;
    if (!v || v === '' || v === '0') return false;
    const lower = v.toLowerCase();
    if (lower === 'нет' || v.includes('⌛') || v.includes('⌛️') || v.includes('⏳')) return false;
    return true;
  }).length;
  const progressPercent = (passedCount / tests.length) * 100;

  return (
    <div className="min-h-screen hero-gradient">
      <MobileLayout>
        <PageTransition>
          <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
            <div className="container mx-auto px-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                {l.back}
              </button>
              
              <div className="max-w-md mx-auto space-y-6">
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
            
            {/* Telegram Link Button */}
            {telegramLink && (
              <Button
                variant="outline"
                className="mt-4 gap-2 border-accent/50 text-accent hover:bg-accent/10"
                asChild
              >
                <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                  <Send className="w-4 h-4" />
                  {l.openTelegram}
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Photo from CRM (photo_link) - if different from profile photo */}
        {crmData?.photo_link && crmData.photo_link !== photoUrl && (
          <div className="px-[5%]">
            <p className="text-muted-foreground text-sm mb-2">{l.photo}</p>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10">
              <img 
                src={crmData.photo_link} 
                alt="CRM Photo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Personal Data */}
        {profileData && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{l.personalData}</h3>
            </div>
            
            <InfoRow label="Telegram ID" value={profileData.telegram_id?.toString() || null} />
            {profileData.first_name && <InfoRow label={language === 'ru' ? 'Имя' : language === 'kz' ? 'Есімі' : 'First Name'} value={profileData.first_name} />}
            {profileData.last_name && <InfoRow label={language === 'ru' ? 'Фамилия' : language === 'kz' ? 'Тегі' : 'Last Name'} value={profileData.last_name} />}
            {profileData.username && <InfoRow label={language === 'ru' ? 'Username' : 'Username'} value={`@${profileData.username}`} />}
            {telegramLink && <InfoRow label="Telegram" value={telegramLink} isLink />}
          </div>
        )}

        {/* Work Info */}
        {crmData && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-white">{l.workInfo}</h3>
              </div>
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                variant="cta"
                size="sm"
                className="gap-1.5"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {l.refresh}
              </Button>
            </div>
            
            <InfoRow label={l.code} value={crmData.code} />
            <InfoRow label={l.fullInfo} value={crmData.full_info} />
            <InfoRow label={l.hr} value={crmData.hr} />
            <InfoRow label={l.status} value={crmData.status} />
            <InfoRow label={l.rating} value={crmData.rating} />
            <InfoRow label={l.level} value={crmData.level} />
            <InfoRow label={l.city} value={crmData.city} />
            <InfoRow label={l.region} value={crmData.region} />
            <InfoRow label={l.phone} value={crmData.phone} />
            <InfoRow label={l.birthDate} value={crmData.birth_date} />
            <InfoRow label={l.contractDate} value={crmData.contract_date} />
            <InfoRow label={l.contract} value={crmData.contract_link} isLink />
            <InfoRow label={l.businessCard} value={crmData.business_card_link} isLink />
            <InfoRow label={l.workStartDate} value={crmData.work_start_date} />
            <InfoRow label={l.testsPassed} value={crmData.tests_passed} />
            <InfoRow label={l.dismissalDate} value={crmData.dismissal_date} />
            {crmData.days_worked !== null && crmData.days_worked > 0 && (
              <InfoRow label={l.daysWorked} value={crmData.days_worked.toString()} />
            )}
            <InfoRow label={l.waitingPeriod} value={crmData.waiting_period} />
            <InfoRow label={l.trainingCompleted} value={crmData.training_completed} />
            {crmData.projects_in_work !== null && crmData.projects_in_work > 0 && (
              <InfoRow label={l.projectsInWork} value={crmData.projects_in_work.toString()} />
            )}
          </div>
        )}

        {/* Video Script Preview */}
        {crmData?.video_script && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-white">{l.scriptTitle}</h3>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 max-h-32 overflow-hidden">
              <p className="text-white/80 text-sm whitespace-pre-wrap">
                {crmData.video_script.split('\n').slice(0, 5).join('\n')}
                {crmData.video_script.split('\n').length > 5 && '...'}
              </p>
            </div>
            
            <Button
              onClick={() => setShowScriptDialog(true)}
              variant="gold"
              size="sm"
              className="w-full gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              {l.showAll}
            </Button>
          </div>
        )}

        {/* Progress Block */}
        {crmData && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{l.progress}</h3>
            </div>
            
            {/* Tests Progress Visualization */}
            <div className="mb-4 p-4 bg-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-sm">{l.testsProgress}</span>
                <span className="text-accent font-bold">{passedCount}/4</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
              <div className="flex justify-between mt-2">
                {tests.map((test, idx) => {
                  const isPassed = test.value && test.value.toLowerCase() !== 'нет' && test.value !== '0' && test.value !== '' && !test.value.includes('⌛') && !test.value.includes('⌛️') && !test.value.includes('⏳');
                  return (
                    <div 
                      key={test.key} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPassed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-1">
              <ProgressItem label={l.availableSkills} value={crmData.available_skills} language={language} />
              <ProgressItem label={l.languageChoice} value={crmData.language_choice} language={language} />
              <ProgressItem label={l.interview} value={crmData.interview} language={language} />
              <ProgressItem label={l.testConditions} value={crmData.test_conditions} language={language} />
              <ProgressItem label={l.testPortal} value={crmData.test_portal} language={language} />
              <ProgressItem label={l.testReport} value={crmData.test_report} language={language} />
              <ProgressItem label={l.testRobot} value={crmData.test_robot} language={language} />
              <ProgressItem label={l.contractSigning} value={crmData.contract_signing} language={language} />
              <ProgressItem label={l.videoCard} value={crmData.video_card} language={language} />
              <ProgressItem label={l.workStart} value={crmData.work_start} language={language} />
              <ProgressItem label={l.projectsMailing} value={crmData.projects_mailing} language={language} />
            </div>
          </div>
        )}

        {/* Interview Block */}
        {crmData && (crmData.rop_name || crmData.city || crmData.region || crmData.checklist_answers || crmData.interview_date) && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{l.interviewSection}</h3>
            </div>
            
            <div className="space-y-2">
              <InfoRow label={l.ropName} value={crmData.rop_name} />
              <InfoRow label={l.city} value={crmData.city} />
              <InfoRow label={l.region} value={crmData.region} />
              {crmData.interview_date && <InfoRow label={language === 'ru' ? 'Дата интервью' : language === 'kz' ? 'Сұхбат күні' : 'Interview Date'} value={crmData.interview_date} />}
              <ExpandableText label={l.checklistAnswers} value={crmData.checklist_answers} showAllText={l.showAll} />
            </div>
          </div>
        )}

        {/* Resume Block */}
        <div className="glass-dark rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{l.resume}</h3>
            </div>
            {crmData?.resume_text && (
              <Button
                onClick={handleTranslateResume}
                disabled={isTranslatingResume}
                variant="outline"
                size="sm"
                className="gap-1.5 border-accent/50 text-accent hover:bg-accent/10"
              >
                {isTranslatingResume ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-accent"></div>
                ) : (
                  <>
                    <Languages className="w-4 h-4" />
                    {l.translate}
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <InfoRow label={l.phone} value={crmData?.phone || null} />
            <InfoRow label={l.birthDate} value={crmData?.birth_date || null} />
            <InfoRow label={l.resumeLink} value={crmData?.resume_link || null} isLink />
            <InfoRow label={l.resumeLinkChat} value={crmData?.resume_link_chat || null} isLink />
            <InfoRow label={l.videoCard} value={crmData?.video_card || null} isLink />
            <InfoRow label={l.businessCard} value={crmData?.business_card_link || null} isLink />
            <ExpandableText label={l.resumeText} value={crmData?.resume_text || null} showAllText={l.showAll} />
          </div>
        </div>

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
              </div>
            </div>
          </main>
        </PageTransition>
      </MobileLayout>

      {/* Script Dialog */}
      <Dialog open={showScriptDialog} onOpenChange={setShowScriptDialog}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[80vh] overflow-y-auto glass-dark border-white/10 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-accent" />
              {l.scriptTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/90 whitespace-pre-wrap leading-relaxed text-sm">
              {crmData?.video_script}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicProfile;
