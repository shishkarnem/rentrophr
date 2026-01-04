import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, ArrowLeft, Edit2, FileText, Briefcase, CheckCircle2, ExternalLink, ChevronDown, X } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCrmData } from '@/hooks/useCrmData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Inline language switcher for profile with DB sync
const ProfileLanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const { profile, updateProfile } = useTelegram();
  
  const languages: { code: Language; label: string }[] = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'kz', label: 'KZ' },
  ];

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);
    
    // Sync to database if profile exists
    if (profile) {
      const langCode = lang === 'kz' ? 'kk' : lang;
      await updateProfile({ language_code: langCode });
    }
  };

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            language === lang.code
              ? 'bg-accent text-primary'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

// Progress item component
const ProgressItem = ({ label, value }: { label: string; value: string | null }) => {
  const isCompleted = value && value.toLowerCase() !== 'нет' && value !== '0' && value !== '';
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-green-400" />
        ) : (
          <div className="w-4 h-4 rounded-full border border-white/30" />
        )}
        <span className={`text-sm ${isCompleted ? 'text-green-400' : 'text-white/50'}`}>
          {value || '—'}
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

// Resume text with expandable popup
const ResumeTextRow = ({ label, value }: { label: string; value: string | null }) => {
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
              Показать всё <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-white text-sm whitespace-pre-wrap bg-white/5 rounded-lg p-3 max-h-48 overflow-hidden">
          {previewLines}
          {hasMore && '...'}
        </p>
      </div>
      
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass-dark border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">{label}</DialogTitle>
          </DialogHeader>
          <p className="text-white text-sm whitespace-pre-wrap">{value}</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { isTelegram, profile, isLoading, updateProfile, uploadPhoto } = useTelegram();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get telegram_id from profile
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData, isLoading: isCrmLoading, updateCrmData } = useCrmData(telegramId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    username: profile?.username || '',
  });

  const [resumeFormData, setResumeFormData] = useState({
    phone: '',
    birth_date: '',
    resume_link: '',
    resume_text: '',
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        username: profile.username || '',
      });
    }
  }, [profile]);

  // Update resume form when CRM data loads
  useEffect(() => {
    if (crmData) {
      setResumeFormData({
        phone: crmData.phone || '',
        birth_date: crmData.birth_date || '',
        resume_link: crmData.resume_link || '',
        resume_text: crmData.resume_text || '',
      });
    }
  }, [crmData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isTelegram) {
    return (
      <div 
        className="min-h-screen relative z-10"
        style={{
          background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
        }}
      >
        {/* Header */}
        <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-lg font-semibold text-white">{t('profile.title')}</h1>
            </div>
            <ProfileLanguageSwitcher />
          </div>
        </div>

        <main className="container mx-auto px-4 py-10 max-w-md">
          <section className="glass-dark rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg">{t('profile.openViaBot')}</h2>
            <p className="text-white/70 mt-2">
              {t('profile.autofillHint')}
            </p>
            <Button
              className="w-full mt-6 bg-accent hover:bg-accent/80 text-primary"
              asChild
            >
              <a
                href="https://t.me/RentROP_HR_bot/app"
                target="_blank"
                rel="noreferrer"
              >
                {t('profile.openButton')}
              </a>
            </Button>
          </section>
        </main>
      </div>
    );
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('profile.selectImage'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('profile.fileTooLarge'));
      return;
    }

    setIsUploading(true);
    try {
      const photoUrl = await uploadPhoto(file);
      if (photoUrl) {
        toast.success(t('profile.photoUpdated'));
      } else {
        toast.error(t('profile.photoError'));
      }
    } catch (error) {
      toast.error(t('profile.photoError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile({
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        username: formData.username || null,
      });

      if (result) {
        toast.success(t('profile.saved'));
        setIsEditing(false);
      } else {
        toast.error(t('profile.saveError'));
      }
    } catch (error) {
      toast.error(t('profile.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveResume = async () => {
    setIsSavingResume(true);
    try {
      await updateCrmData({
        phone: resumeFormData.phone || null,
        birth_date: resumeFormData.birth_date || null,
        resume_link: resumeFormData.resume_link || null,
        resume_text: resumeFormData.resume_text || null,
      });
      toast.success(t('profile.saved'));
      setIsEditingResume(false);
    } catch (error) {
      toast.error(t('profile.saveError'));
    } finally {
      setIsSavingResume(false);
    }
  };

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
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-lg font-semibold text-white">{t('profile.title')}</h1>
            </div>
            <ProfileLanguageSwitcher />
          </div>
        </div>
      )}

      <div className={`container mx-auto px-4 py-8 max-w-md space-y-6 ${showMobileNav ? 'pt-20 pb-24' : ''}`}>
        {/* Profile Photo - Square format, full width with 5% padding */}
        <div 
          className="relative mt-4"
          style={{ padding: '0 5%' }}
        >
          <div 
            className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-accent/30 bg-muted flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handlePhotoClick}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            ) : profile?.photo_url ? (
              <img 
                src={profile.photo_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-24 h-24 text-muted-foreground" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePhotoClick();
              }}
              className="absolute bottom-4 right-4 p-3 bg-accent rounded-full text-primary hover:bg-accent/80 transition-colors shadow-lg"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-white">
              {profile?.first_name} {profile?.last_name}
            </h2>
            {profile?.username && (
              <p className="text-muted-foreground">@{profile.username}</p>
            )}
          </div>
        </div>

        {/* Photo from CRM (photo_link) */}
        {crmData?.photo_link && (
          <div className="px-[5%]">
            <p className="text-muted-foreground text-sm mb-2">{t('profile.photoLink') || 'Фото'}</p>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10">
              <img 
                src={crmData.photo_link} 
                alt="CRM Photo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Personal Info */}
        <div className="glass-dark rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{t('profile.personalData')}</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4 text-accent" />
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="first_name" className="text-muted-foreground">{t('profile.firstName')}</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="last_name" className="text-muted-foreground">{t('profile.lastName')}</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="username" className="text-muted-foreground">{t('profile.username')}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-accent hover:bg-accent/80 text-primary"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('profile.save')}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <InfoRow label="Telegram ID" value={profile?.telegram_id?.toString() || null} />
              <InfoRow label={t('profile.firstName')} value={profile?.first_name || null} />
              <InfoRow label={t('profile.lastName')} value={profile?.last_name || null} />
              <InfoRow label={t('profile.username')} value={profile?.username ? `@${profile.username}` : null} />
              <InfoRow label={t('profile.language')} value={(profile?.language_code || 'ru').toUpperCase()} />
            </div>
          )}
        </div>

        {/* Work Info (from CRM, read-only) */}
        {crmData && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{t('profile.workData') || 'Рабочие данные'}</h3>
            </div>
            
            <div className="space-y-2">
              <InfoRow label={t('profile.code') || 'Код'} value={crmData.code} />
              <InfoRow label={t('profile.fullInfo') || 'ФИО, Код и Телеграм'} value={crmData.full_info} />
              <InfoRow label={t('profile.hr') || 'HR'} value={crmData.hr} />
              <InfoRow label={t('profile.status') || 'Статус'} value={crmData.status} />
              <InfoRow label={t('profile.rating') || 'Рейтинг'} value={crmData.rating} />
              <InfoRow label={t('profile.contractDate') || 'Дата подписания договора'} value={crmData.contract_date} />
              <InfoRow label={t('profile.contractLink') || 'Ссылка на договор'} value={crmData.contract_link} isLink />
              <InfoRow label={t('profile.businessCard') || 'Ссылка на визитку'} value={crmData.business_card_link} isLink />
              <InfoRow label={t('profile.workStart') || 'Старт работы'} value={crmData.work_start_date} />
              <InfoRow label={t('profile.testsPassed') || 'Пройдено тестов'} value={crmData.tests_passed} />
              <InfoRow label={t('profile.dismissalDate') || 'Дата увольнения'} value={crmData.dismissal_date} />
              <InfoRow label={t('profile.daysWorked') || 'Дней работы'} value={crmData.days_worked?.toString() || null} />
              <InfoRow label={t('profile.waitingPeriod') || 'Срок в ожидании'} value={crmData.waiting_period} />
              <InfoRow label={t('profile.trainingCompleted') || 'Пройдено обучение за'} value={crmData.training_completed} />
            </div>
          </div>
        )}

        {/* Progress Block */}
        {crmData && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{t('profile.progress') || 'Прогресс'}</h3>
            </div>
            
            <div className="space-y-1">
              <ProgressItem label={t('profile.availableSkills') || 'Доступные навыки'} value={crmData.available_skills} />
              <ProgressItem label={t('profile.languageChoice') || 'Выбор языка'} value={crmData.language_choice} />
              <ProgressItem label={t('profile.interview') || 'Интервью'} value={crmData.interview} />
              <ProgressItem label={t('profile.testConditions') || 'Тест Условия'} value={crmData.test_conditions} />
              <ProgressItem label={t('profile.testPortal') || 'Тест Портал'} value={crmData.test_portal} />
              <ProgressItem label={t('profile.testReport') || 'Тест Отчет'} value={crmData.test_report} />
              <ProgressItem label={t('profile.testRobot') || 'Тест Робот'} value={crmData.test_robot} />
              <ProgressItem label={t('profile.contractSigning') || 'Подписание договора'} value={crmData.contract_signing} />
              <ProgressItem label={t('profile.videoCard') || 'Видео-визитка'} value={crmData.video_card} />
              <ProgressItem label={t('profile.workStartProgress') || 'Выход на работу'} value={crmData.work_start} />
              <ProgressItem label={t('profile.projectsMailing') || 'Рассылка проектов'} value={crmData.projects_mailing} />
            </div>
          </div>
        )}

        {/* Resume Block (editable) */}
        <div className="glass-dark rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{t('profile.resume') || 'Резюме'}</h3>
            </div>
            <button
              onClick={() => setIsEditingResume(!isEditingResume)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4 text-accent" />
            </button>
          </div>

          {isEditingResume ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-muted-foreground">{t('profile.phone') || 'Телефон'}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={resumeFormData.phone}
                  onChange={(e) => setResumeFormData({ ...resumeFormData, phone: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <Label htmlFor="birth_date" className="text-muted-foreground">{t('profile.birthDate') || 'Дата рождения'}</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={resumeFormData.birth_date}
                  onChange={(e) => setResumeFormData({ ...resumeFormData, birth_date: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="resume_link" className="text-muted-foreground">{t('profile.resumeLink') || 'Ссылка на резюме'}</Label>
                <Input
                  id="resume_link"
                  type="url"
                  value={resumeFormData.resume_link}
                  onChange={(e) => setResumeFormData({ ...resumeFormData, resume_link: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="resume_text" className="text-muted-foreground">{t('profile.resumeText') || 'Текст резюме'}</Label>
                <Textarea
                  id="resume_text"
                  value={resumeFormData.resume_text}
                  onChange={(e) => setResumeFormData({ ...resumeFormData, resume_text: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white min-h-[100px]"
                  placeholder="Расскажите о себе..."
                />
              </div>

              <Button
                onClick={handleSaveResume}
                disabled={isSavingResume}
                className="w-full bg-accent hover:bg-accent/80 text-primary"
              >
                {isSavingResume ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('profile.save')}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <InfoRow label={t('profile.phone') || 'Телефон'} value={crmData?.phone || resumeFormData.phone || null} />
              <InfoRow label={t('profile.birthDate') || 'Дата рождения'} value={crmData?.birth_date || resumeFormData.birth_date || null} />
              <InfoRow label={t('profile.resumeLink') || 'Ссылка на резюме'} value={crmData?.resume_link || resumeFormData.resume_link || null} isLink />
              <InfoRow label={t('profile.resumeLinkChat') || 'Ссылка на резюме в чате'} value={crmData?.resume_link_chat || null} isLink />
              <ResumeTextRow label={t('profile.resumeText') || 'Текст резюме'} value={crmData?.resume_text || resumeFormData.resume_text || null} />
            </div>
          )}
        </div>

        {isCrmLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent"></div>
          </div>
        )}
      </div>
      
      {showMobileNav && <MobileNavbar />}
    </div>
  );
};

export default Profile;