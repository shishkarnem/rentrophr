import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, ArrowLeft, Edit2, FileText, Briefcase, CheckCircle2, ExternalLink, ChevronDown, X, MessageCircle, Settings, RefreshCw, FileCheck, GraduationCap, Hourglass, FileSignature, Video, Copy, Check, FileDown, Languages } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCrmData } from '@/hooks/useCrmData';
import { useSyncCrm } from '@/hooks/useSyncCrm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

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
const ProgressItem = ({ 
  label, 
  value, 
  onClick 
}: { 
  label: string; 
  value: string | null; 
  onClick?: () => void;
}) => {
  const { language } = useLanguage();

  const pendingLabels: Record<Language, string> = {
    ru: 'Ожидает',
    en: 'Pending',
    kz: 'Күтілуде',
  };

  const isPending = !!value && (value.includes('⌛') || value.includes('⌛️') || value.includes('⏳'));
  const isCompleted = !!value && value.toLowerCase() !== 'нет' && value !== '0' && value !== '' && !isPending;
  const isClickable = !!onClick;

  const displayValue = isPending ? pendingLabels[language] : (value || '—');
  
  return (
    <div 
      className={`flex items-center justify-between py-2 border-b border-white/10 last:border-b-0 ${
        isClickable ? 'cursor-pointer hover:bg-white/5 -mx-2 px-2 rounded transition-colors' : ''
      }`}
      onClick={onClick}
    >
      <span className={`text-sm ${isClickable ? 'text-accent' : 'text-muted-foreground'}`}>
        {label}
        {isClickable && ' →'}
      </span>
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

// Resume text with expandable popup
const ResumeTextRow = ({ label, value, showAllText }: { label: string; value: string | null; showAllText?: string }) => {
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

const Profile = () => {
  const navigate = useNavigate();
  const { isTelegram, profile, isLoading, updateProfile, uploadPhoto } = useTelegram();
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get telegram_id from profile
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData, isLoading: isCrmLoading, updateCrmData, refetch: refetchCrmData } = useCrmData(telegramId);
  
  // Sync functionality
  const { isSyncing, syncNow, syncOnAppLoad, formatLastSyncTime, canSync } = useSyncCrm();
  
  // Script dialog state
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [editedScript, setEditedScript] = useState('');
  const [isSavingScript, setIsSavingScript] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Translation state
  const [isTranslatingResume, setIsTranslatingResume] = useState(false);
  
  // Auto-sync on app load
  useEffect(() => {
    if (isTelegram && telegramId) {
      syncOnAppLoad();
    }
  }, [isTelegram, telegramId, syncOnAppLoad]);
  
  // Handle manual sync
  const handleSync = async () => {
    const result = await syncNow(false);
    if (result.success) {
      toast.success(`${result.message} (обновлено: ${result.synced || 0})`);
      // Refetch CRM data after sync
      refetchCrmData();
    } else {
      toast.error(result.message);
    }
  };
  
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

  // Script management functions
  const handleShowScript = () => {
    if (crmData?.video_script) {
      setEditedScript(crmData.video_script);
      setIsEditingScript(false);
      setShowScriptDialog(true);
    }
  };

  const handleCopyScript = async () => {
    const textToCopy = editedScript;
    if (!textToCopy) return;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      toast.success(t('profile.copied') || 'Скопировано!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  const handleExportPdf = () => {
    const textToExport = editedScript;
    if (!textToExport) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${t('profile.scriptTitle') || 'Сценарий видео-визитки'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 { 
              color: #333; 
              border-bottom: 2px solid #d4af37;
              padding-bottom: 10px;
            }
            p { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>${t('profile.scriptTitle') || 'Сценарий видео-визитки'}</h1>
          <p>${textToExport}</p>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSaveScript = async () => {
    if (!telegramId || !editedScript.trim()) return;
    
    setIsSavingScript(true);
    try {
      const { error } = await supabase
        .from('crm_data')
        .update({ video_script: editedScript })
        .eq('telegram_id', telegramId);

      if (error) throw error;
      
      setIsEditingScript(false);
      toast.success(t('profile.scriptUpdated') || 'Сценарий обновлён');
      refetchCrmData();
    } catch (error) {
      console.error('Error saving script:', error);
      toast.error(t('profile.saveError'));
    } finally {
      setIsSavingScript(false);
    }
  };

  const handleRegenerateScript = async () => {
    if (!crmData?.resume_text) {
      toast.error(t('profile.noResume') || 'Резюме не заполнено');
      return;
    }
    
    setIsGeneratingScript(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-video-script', {
        body: { 
          resumeText: crmData.resume_text,
          language: language,
          telegramId: telegramId
        }
      });

      if (error) throw error;
      
      if (data?.script) {
        setEditedScript(data.script);
        setIsEditingScript(false);
        toast.success(t('profile.scriptSaved') || 'Сценарий сохранён');
        refetchCrmData();
      }
    } catch (error) {
      console.error('Error generating script:', error);
      toast.error(t('profile.saveError'));
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleTranslateResume = async () => {
    if (!crmData?.resume_text) {
      toast.error(t('profile.noResume') || 'Резюме не заполнено');
      return;
    }

    setIsTranslatingResume(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-resume', {
        body: { 
          resumeText: crmData.resume_text,
          targetLanguage: language,
          telegramId: telegramId
        }
      });

      if (error) throw error;
      
      if (data?.translatedText) {
        toast.success(t('profile.translateSuccess') || 'Резюме переведено');
        refetchCrmData();
      }
    } catch (error) {
      console.error('Error translating resume:', error);
      toast.error(t('profile.saveError'));
    } finally {
      setIsTranslatingResume(false);
    }
  };

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

  // Translation labels
  const scriptLabels: Record<Language, {
    scriptTitle: string;
    showAll: string;
    copyButton: string;
    copied: string;
    editButton: string;
    saveButton: string;
    regenerateButton: string;
    exportPdf: string;
    closeButton: string;
    translateButton: string;
    translating: string;
  }> = {
    ru: {
      scriptTitle: 'Сценарий видео-визитки',
      showAll: 'Показать всё',
      copyButton: 'Копировать',
      copied: 'Скопировано!',
      editButton: 'Редактировать',
      saveButton: 'Сохранить',
      regenerateButton: 'Перегенерировать',
      exportPdf: 'Экспорт PDF',
      closeButton: 'Закрыть',
      translateButton: 'Перевести',
      translating: 'Перевод...'
    },
    en: {
      scriptTitle: 'Video Business Card Script',
      showAll: 'Show all',
      copyButton: 'Copy',
      copied: 'Copied!',
      editButton: 'Edit',
      saveButton: 'Save',
      regenerateButton: 'Regenerate',
      exportPdf: 'Export PDF',
      closeButton: 'Close',
      translateButton: 'Translate',
      translating: 'Translating...'
    },
    kz: {
      scriptTitle: 'Бейне визитка сценарийі',
      showAll: 'Барлығын көрсету',
      copyButton: 'Көшіру',
      copied: 'Көшірілді!',
      editButton: 'Өңдеу',
      saveButton: 'Сақтау',
      regenerateButton: 'Қайта жасау',
      exportPdf: 'PDF экспорт',
      closeButton: 'Жабу',
      translateButton: 'Аудару',
      translating: 'Аударуда...'
    }
  };

  const sl = scriptLabels[language];

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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-white">{t('profile.workData') || 'Рабочие данные'}</h3>
              </div>
              <Button
                onClick={handleSync}
                disabled={isSyncing || !canSync}
                variant="cta"
                size="sm"
                className="gap-1.5"
                title={canSync ? (t('profile.syncData') || 'Обновить данные') : 'Подождите 5 минут'}
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {t('profile.refresh') || 'Обновить'}
              </Button>
            </div>
            
            <div className="space-y-2">
              <InfoRow label={t('profile.code') || 'Код'} value={crmData.code} />
              <InfoRow label={t('profile.fullInfo') || 'ФИО, Код и Телеграм'} value={crmData.full_info} />
              <InfoRow label={t('profile.hr') || 'HR'} value={crmData.hr} />
              {/* Status row with admin button */}
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-muted-foreground text-sm">{t('profile.status') || 'Статус'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">{crmData.status || '—'}</span>
                  {crmData.status && ['ДПР', 'HR', 'Чат или канал', 'Менеджер'].includes(crmData.status) && (
                    <button
                      onClick={() => navigate('/admin/crm')}
                      className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                      title={t('admin.title') || 'Админ-панель CRM'}
                    >
                      <Settings className="w-4 h-4 text-accent" />
                    </button>
                  )}
                </div>
              </div>
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

        {/* Video Script Preview */}
        {crmData?.video_script && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-white">{sl.scriptTitle}</h3>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 max-h-32 overflow-hidden">
              <p className="text-white/80 text-sm whitespace-pre-wrap">
                {crmData.video_script.split('\n').slice(0, 5).join('\n')}
                {crmData.video_script.split('\n').length > 5 && '...'}
              </p>
            </div>
            
            <Button
              onClick={handleShowScript}
              variant="gold"
              size="sm"
              className="w-full gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              {sl.showAll}
            </Button>
          </div>
        )}

        {/* Progress Block */}
        {crmData && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{t('profile.progress') || 'Прогресс'}</h3>
            </div>
            
            {/* Tests Progress Visualization */}
            {(() => {
              const tests = [
                { key: 'conditions', value: crmData.test_conditions },
                { key: 'portal', value: crmData.test_portal },
                { key: 'report', value: crmData.test_report },
                { key: 'robot', value: crmData.test_robot },
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
                <div className="mb-4 p-4 bg-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">{t('profile.testsProgress') || 'Прогресс тестов'}</span>
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
              );
            })()}
            
            <div className="space-y-1">
              <ProgressItem label={t('profile.availableSkills') || 'Доступные навыки'} value={crmData.available_skills} />
              <ProgressItem label={t('profile.languageChoice') || 'Выбор языка'} value={crmData.language_choice} />
              
              {/* Interview row with data + optional button */}
              <ProgressItem label={t('profile.interview') || 'Интервью'} value={crmData.interview} />
              <div className="py-2">
                <Button
                  onClick={() => navigate('/interview')}
                  variant="gold"
                  size="lg"
                  className="w-full gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('profile.interviewButton') || 'Пройти Интервью'}
                  {crmData.interview && crmData.interview.toLowerCase() !== 'нет' && crmData.interview !== '0' && crmData.interview !== '' && !crmData.interview.includes('⌛') && !crmData.interview.includes('⌛️') && !crmData.interview.includes('⏳') && (
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                  )}
                </Button>
              </div>
              
              {/* Training Dashboard Button */}
              <div className="py-3">
                <Button
                  onClick={() => navigate('/training')}
                  variant="cta"
                  size="lg"
                  className="w-full gap-2"
                >
                  <GraduationCap className="w-5 h-5" />
                  {t('profile.trainingButton') || 'Обучение и тесты'}
                </Button>
              </div>
              
              {/* Test Conditions row with data + optional button */}
              <ProgressItem label={t('profile.testConditions') || 'Тест Условия'} value={crmData.test_conditions} />
              {crmData.available_skills && crmData.available_skills.toLowerCase().includes('тест условия') && (
                <div className="py-2">
                  <Button
                    onClick={() => navigate('/tests/conditions')}
                    variant="gold"
                    size="lg"
                    className="w-full gap-2"
                  >
                    <FileCheck className="w-5 h-5" />
                    {t('profile.testConditionsButton') || 'Пройти Тест Условия'}
                    {crmData.test_conditions && crmData.test_conditions.toLowerCase() !== 'нет' && crmData.test_conditions !== '0' && crmData.test_conditions !== '' && !crmData.test_conditions.includes('⌛') && !crmData.test_conditions.includes('⌛️') && !crmData.test_conditions.includes('⏳') && (
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                    )}
                  </Button>
                </div>
              )}
              <ProgressItem label={t('profile.testPortal') || 'Тест Портал'} value={crmData.test_portal} />
              {crmData.available_skills && crmData.available_skills.toLowerCase().includes('тест портал') && (
                <div className="py-2">
                  <Button
                    onClick={() => navigate('/tests/portal')}
                    variant="gold"
                    size="lg"
                    className="w-full gap-2"
                  >
                    <FileCheck className="w-5 h-5" />
                    {t('profile.testPortalButton') || 'Пройти Тест Портал'}
                    {crmData.test_portal && crmData.test_portal.toLowerCase() !== 'нет' && crmData.test_portal !== '0' && crmData.test_portal !== '' && !crmData.test_portal.includes('⌛') && !crmData.test_portal.includes('⌛️') && !crmData.test_portal.includes('⏳') && (
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                    )}
                  </Button>
                </div>
              )}
              <ProgressItem label={t('profile.testReport') || 'Тест Отчет'} value={crmData.test_report} />
              {crmData.available_skills && crmData.available_skills.toLowerCase().includes('тест отчет') && (
                <div className="py-2">
                  <Button
                    onClick={() => navigate('/tests/report')}
                    variant="gold"
                    size="lg"
                    className="w-full gap-2"
                  >
                    <FileCheck className="w-5 h-5" />
                    {t('profile.testReportButton') || 'Пройти Тест Отчет'}
                    {crmData.test_report && crmData.test_report.toLowerCase() !== 'нет' && crmData.test_report !== '0' && crmData.test_report !== '' && !crmData.test_report.includes('⌛') && !crmData.test_report.includes('⌛️') && !crmData.test_report.includes('⏳') && (
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                    )}
                  </Button>
                </div>
              )}
              <ProgressItem label={t('profile.testRobot') || 'Тест Робот'} value={crmData.test_robot} />
              {crmData.available_skills && crmData.available_skills.toLowerCase().includes('тест робот') && (
                <div className="py-2">
                  <Button
                    onClick={() => navigate('/tests/robot')}
                    variant="gold"
                    size="lg"
                    className="w-full gap-2"
                  >
                    <FileCheck className="w-5 h-5" />
                    {t('profile.testRobotButton') || 'Пройти Тест Робот'}
                    {crmData.test_robot && crmData.test_robot.toLowerCase() !== 'нет' && crmData.test_robot !== '0' && crmData.test_robot !== '' && !crmData.test_robot.includes('⌛') && !crmData.test_robot.includes('⌛️') && !crmData.test_robot.includes('⏳') && (
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                    )}
                  </Button>
                </div>
              )}
              <ProgressItem label={t('profile.contractSigning') || 'Подписание договора'} value={crmData.contract_signing} />
              {crmData.available_skills && crmData.available_skills.toLowerCase().includes('создание договора') && (
                <div className="py-2">
                  <Button
                    onClick={() => navigate('/contract')}
                    variant="gold"
                    size="lg"
                    className="w-full gap-2"
                  >
                    <FileSignature className="w-5 h-5" />
                    {t('profile.contractButton') || 'Создание договора'}
                    {crmData.contract_signing && crmData.contract_signing.toLowerCase() !== 'нет' && crmData.contract_signing !== '0' && crmData.contract_signing !== '' && !crmData.contract_signing.includes('⌛') && !crmData.contract_signing.includes('⌛️') && !crmData.contract_signing.includes('⏳') && (
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                    )}
                  </Button>
                </div>
              )}
              <ProgressItem label={t('profile.videoCard') || 'Видео-визитка'} value={crmData.video_card} />
              {crmData.available_skills && crmData.available_skills.toLowerCase().includes('подбор проекта') && (
                <div className="py-2">
                  <Button
                    onClick={() => navigate('/video-card')}
                    variant="gold"
                    size="lg"
                    className="w-full gap-2"
                  >
                    <Video className="w-5 h-5" />
                    {t('profile.videoCardButton') || 'Создать Видео-визитку'}
                    {crmData.video_card && crmData.video_card.toLowerCase() !== 'нет' && crmData.video_card !== '0' && crmData.video_card !== '' && !crmData.video_card.includes('⌛') && !crmData.video_card.includes('⌛️') && !crmData.video_card.includes('⏳') && (
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                    )}
                  </Button>
                </div>
              )}
              <ProgressItem label={t('profile.workStartProgress') || 'Выход на работу'} value={crmData.work_start} />
              <ProgressItem label={t('profile.projectsMailing') || 'Рассылка проектов'} value={crmData.projects_mailing} />
            </div>
          </div>
        )}

        {/* Interview Block (read-only) */}
        {crmData && (crmData.rop_name || crmData.city || crmData.region || crmData.checklist_answers) && (
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">{t('profile.interviewSection') || 'Интервью'}</h3>
            </div>
            
            <div className="space-y-2">
              <InfoRow label={t('profile.ropName') || 'РОП (ФИО)'} value={crmData.rop_name} />
              <InfoRow label={t('profile.city') || 'Город'} value={crmData.city} />
              <InfoRow label={t('profile.region') || 'Регион'} value={crmData.region} />
              <ResumeTextRow label={t('profile.checklistAnswers') || 'Ответы на чек-лист'} value={crmData.checklist_answers} showAllText={t('profile.showAll') || 'Показать всё'} />
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
            <div className="flex items-center gap-2">
              {crmData?.resume_text && !isEditingResume && (
                <button
                  onClick={handleTranslateResume}
                  disabled={isTranslatingResume}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                  title={sl.translateButton}
                >
                  {isTranslatingResume ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-accent"></div>
                  ) : (
                    <Languages className="w-4 h-4 text-accent" />
                  )}
                </button>
              )}
              <button
                onClick={() => setIsEditingResume(!isEditingResume)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Edit2 className="w-4 h-4 text-accent" />
              </button>
            </div>
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
              <ResumeTextRow label={t('profile.resumeText') || 'Текст резюме'} value={crmData?.resume_text || resumeFormData.resume_text || null} showAllText={t('profile.showAll') || 'Показать всё'} />
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

      {/* Script Dialog */}
      <Dialog open={showScriptDialog} onOpenChange={(open) => {
        setShowScriptDialog(open);
        if (!open) setIsEditingScript(false);
      }}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[80vh] glass-dark border-white/10 flex flex-col p-4 sm:p-6">
          <DialogHeader className="flex-shrink-0 pb-2">
            <DialogTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              {sl.scriptTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0 pr-1">
            {isEditingScript ? (
              <Textarea
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                className="w-full min-h-[35vh] bg-white/5 border-white/10 text-white/90 resize-none text-sm"
                placeholder={sl.scriptTitle}
              />
            ) : (
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <p className="text-white/90 whitespace-pre-wrap leading-relaxed text-sm">
                  {editedScript}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0 pt-3 space-y-2">
            {isEditingScript ? (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleSaveScript}
                  disabled={isSavingScript}
                  variant="gold"
                  size="sm"
                  className="gap-1"
                >
                  {isSavingScript ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {sl.saveButton}
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditingScript(false);
                    setEditedScript(crmData?.video_script || '');
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <X className="w-4 h-4" />
                  {sl.closeButton}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={handleCopyScript}
                    variant="gold"
                    size="sm"
                    className="gap-1"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{isCopied ? sl.copied : sl.copyButton}</span>
                  </Button>
                  <Button
                    onClick={() => setIsEditingScript(true)}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{sl.editButton}</span>
                  </Button>
                  <Button
                    onClick={handleExportPdf}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <FileDown className="w-4 h-4" />
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleRegenerateScript}
                    disabled={isGeneratingScript}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    {isGeneratingScript ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-accent"></div>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        {sl.regenerateButton}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowScriptDialog(false)}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <X className="w-4 h-4" />
                    {sl.closeButton}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
