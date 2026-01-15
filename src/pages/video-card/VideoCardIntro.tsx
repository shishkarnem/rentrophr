import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "@/contexts/TelegramContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useCrmData } from "@/hooks/useCrmData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, ExternalLink, Sparkles, Copy, Check, X, Bot, ChevronDown, Edit2, RefreshCw, Save, FileDown, Languages } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const translations: Record<Language, {
  headerTitle: string;
  back: string;
  title: string;
  preparation: string;
  prepTitle: string;
  prep1: string;
  prep2: string;
  prep3: string;
  prep4: string;
  prep5: string;
  planTitle: string;
  plan1: string;
  plan2: string;
  plan2Detail: string;
  plan3: string;
  plan4: string;
  timing: string;
  aiHelp: string;
  aiButton: string;
  resumeTitle: string;
  noResume: string;
  showAll: string;
  sendToHR: string;
  projectsChannel: string;
  projectsChannelNote: string;
  sundayMailing: string;
  generating: string;
  scriptTitle: string;
  copyButton: string;
  copied: string;
  closeButton: string;
  editButton: string;
  regenerateButton: string;
  saveButton: string;
  errorGenerating: string;
  scriptSaved: string;
  scriptUpdated: string;
  openBot: string;
  exportPdf: string;
  translateButton: string;
  translating: string;
  translateSuccess: string;
}> = {
  ru: {
    headerTitle: "Видео-визитка",
    back: "Назад",
    title: "🎥 Инструкция по записи Видео Визитки 🎥",
    preparation: "Подготовка 💯",
    prepTitle: "",
    prep1: "♨️ Внешний вид - деловой стиль одежды (как говорится дорого! богато!) Встречают по одежке - не забывайте!",
    prep2: "♨️ Скорость речи - золотая середина! Не быстро и не медленно (скорость восприятия информации у всех разная).",
    prep3: "♨️ Качество видео - плюс в вашу копилочку! HD/Full HD.",
    prep4: "♨️ Фон должен быть приближенный к офисному стилю с преобладающим минимализмом.",
    prep5: "♨️ Никаких посторонних звуков или шумов.",
    planTitle: "💢 Примерный план рассказа о себе 💢",
    plan1: "1. Управленческий опыт (сколько по времени) и в каких сферах.",
    plan2: "2. Оцифровано расскажите про каждое место работы в должности РОПа или Коммерческого директора:",
    plan2Detail: "В Стандарте ПРИШЛИ/УШЛИ, какие цифры были на момент вашего прихода в компанию, какие стали на момент вашего увольнения, с помощью каких инструментов достигли таких грандиозных результатов.",
    plan3: "3. Ключевые достижения в карьере и жизни в целом. Чем гордитесь?",
    plan4: "4. Почему должны выбрать вас на проект?",
    timing: "🕐 ПОМНИТЕ, про тайминг 🕐 3-10 минут 🕐",
    aiHelp: "Вы можете использовать ИИ для создания сценария видео-визитки в помощь от нас.",
    aiButton: "ИИ-Сценарий визитки",
    resumeTitle: "Ваше резюме для ИИ:",
    noResume: "Резюме не заполнено. Заполните текст резюме в Профиле.",
    showAll: "Показать всё",
    sendToHR: "Файл с видео отправьте своему HR для получения итоговой ссылки на портфолио. Это ссылка на ваше портфолио в закрытом доступе. Доступ имеют только ДПРы и Менеджеры проектов.",
    projectsChannel: "Канал проектов",
    projectsChannelNote: "С этой ссылкой Вы можете откликаться на проекты в комментариях под постами в телеграм канале. Тут проекты публикуются в моменте, рекомендуем не отключать напоминания)🔔",
    sundayMailing: "Также по воскресеньям приходит рассылка с актуальными проектами в личку в телеграм боте.",
    generating: "Генерация...",
    scriptTitle: "Сценарий видео-визитки",
    copyButton: "Копировать",
    copied: "Скопировано!",
    closeButton: "Закрыть",
    editButton: "Редактировать",
    regenerateButton: "Перегенерировать",
    saveButton: "Сохранить",
    errorGenerating: "Ошибка при генерации",
    scriptSaved: "Сценарий сохранён",
    scriptUpdated: "Сценарий обновлён",
    openBot: "Открыть бота",
    exportPdf: "Экспорт PDF",
    translateButton: "Перевести резюме",
    translating: "Перевод...",
    translateSuccess: "Резюме переведено"
  },
  en: {
    headerTitle: "Video Business Card",
    back: "Back",
    title: "🎥 Video Business Card Recording Instructions 🎥",
    preparation: "Preparation 💯",
    prepTitle: "",
    prep1: "♨️ Appearance - business style clothing (as they say, expensive! rich!) First impressions matter - don't forget!",
    prep2: "♨️ Speech pace - find the golden mean! Not too fast, not too slow (everyone perceives information at different speeds).",
    prep3: "♨️ Video quality - a plus for you! HD/Full HD.",
    prep4: "♨️ Background should be close to office style with minimalism.",
    prep5: "♨️ No background noise or sounds.",
    planTitle: "💢 Approximate Self-Presentation Plan 💢",
    plan1: "1. Management experience (duration) and in which areas.",
    plan2: "2. Provide digitized details about each position as Sales Director or Commercial Director:",
    plan2Detail: "Using the ARRIVED/LEFT standard, what were the figures when you joined the company, what they became when you left, and what tools helped you achieve such great results.",
    plan3: "3. Key achievements in career and life. What are you proud of?",
    plan4: "4. Why should they choose you for the project?",
    timing: "🕐 REMEMBER the timing 🕐 3-10 minutes 🕐",
    aiHelp: "You can use AI to create a video business card script with our help.",
    aiButton: "AI Script Generator",
    resumeTitle: "Your resume for AI:",
    noResume: "Resume not filled in. Fill in the resume text in your Profile.",
    showAll: "Show all",
    sendToHR: "Send the video file to your HR to get the final portfolio link. This is a private link to your portfolio. Only Project Directors and Project Managers have access.",
    projectsChannel: "Projects Channel",
    projectsChannelNote: "With this link, you can apply for projects in the comments under posts in the telegram channel. Projects are published in real-time, we recommend keeping notifications on)🔔",
    sundayMailing: "Also, on Sundays, a mailing with current projects comes to your private messages in the telegram bot.",
    generating: "Generating...",
    scriptTitle: "Video Business Card Script",
    copyButton: "Copy",
    copied: "Copied!",
    closeButton: "Close",
    editButton: "Edit",
    regenerateButton: "Regenerate",
    saveButton: "Save",
    errorGenerating: "Error generating",
    scriptSaved: "Script saved",
    scriptUpdated: "Script updated",
    openBot: "Open Bot",
    exportPdf: "Export PDF",
    translateButton: "Translate resume",
    translating: "Translating...",
    translateSuccess: "Resume translated"
  },
  kz: {
    headerTitle: "Бейне-визитка",
    back: "Артқа",
    title: "🎥 Бейне визитканы жазу нұсқаулығы 🎥",
    preparation: "Дайындық 💯",
    prepTitle: "",
    prep1: "♨️ Сыртқы көрініс - іскерлік киім стилі (қымбат! бай!) Адамды киімімен қарсы алады - ұмытпаңыз!",
    prep2: "♨️ Сөйлеу жылдамдығы - алтын орта! Тым жылдам да, тым баяу да емес (ақпаратты қабылдау жылдамдығы әркімде әртүрлі).",
    prep3: "♨️ Бейне сапасы - сізге плюс! HD/Full HD.",
    prep4: "♨️ Фон минимализммен офис стиліне жақын болуы керек.",
    prep5: "♨️ Бөгде дыбыстар немесе шулар болмауы керек.",
    planTitle: "💢 Өзің туралы әңгіме жоспары 💢",
    plan1: "1. Басқару тәжірибесі (ұзақтығы) және қандай салаларда.",
    plan2: "2. Сату директоры немесе коммерциялық директор ретіндегі әр жұмыс орны туралы сандық мәліметтер беріңіз:",
    plan2Detail: "КЕЛДІ/КЕТТІ стандарты бойынша, компанияға келгенде қандай көрсеткіштер болды, кеткенде қандай болды, қандай құралдармен осындай нәтижелерге жеттіңіз.",
    plan3: "3. Мансаптағы және өмірдегі негізгі жетістіктер. Немен мақтанасыз?",
    plan4: "4. Неге сізді жобаға таңдауы керек?",
    timing: "🕐 Уақыт туралы ұмытпаңыз 🕐 3-10 минут 🕐",
    aiHelp: "Сіз бейне визитка сценарийін жасау үшін AI көмегін пайдалана аласыз.",
    aiButton: "AI сценарий жасаушы",
    resumeTitle: "AI үшін түйіндемеңіз:",
    noResume: "Түйіндеме толтырылмаған. Профильде түйіндеме мәтінін толтырыңыз.",
    showAll: "Барлығын көрсету",
    sendToHR: "Бейне файлын HR-ға жіберіңіз, соңғы портфолио сілтемесін алу үшін. Бұл портфолиоңызға жабық сілтеме. Тек ДПР-лар мен Жоба менеджерлері қол жеткізе алады.",
    projectsChannel: "Жобалар арнасы",
    projectsChannelNote: "Бұл сілтемемен сіз телеграм арнасындағы жазбалардың астында жобаларға өтініш бере аласыз. Жобалар сәтте жарияланады, хабарландыруларды өшірмеуді ұсынамыз)🔔",
    sundayMailing: "Сондай-ақ, жексенбі күндері телеграм ботында жеке хабарламаларға ағымдағы жобалар жіберіледі.",
    generating: "Жасалуда...",
    scriptTitle: "Бейне визитка сценарийі",
    copyButton: "Көшіру",
    copied: "Көшірілді!",
    closeButton: "Жабу",
    editButton: "Өңдеу",
    regenerateButton: "Қайта жасау",
    saveButton: "Сақтау",
    errorGenerating: "Қате",
    scriptSaved: "Сценарий сақталды",
    scriptUpdated: "Сценарий жаңартылды",
    openBot: "Ботты ашу",
    exportPdf: "PDF экспорт",
    translateButton: "Түйіндемені аудару",
    translating: "Аударуда...",
    translateSuccess: "Түйіндеме аударылды"
  }
};

const VideoCardIntro = () => {
  const navigate = useNavigate();
  const { isTelegram, profile } = useTelegram();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const showMobileNav = isTelegram || isMobile;
  
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData, refetch: refetchCrmData } = useCrmData(telegramId);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showScriptDialog, setShowScriptDialog] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [editedScript, setEditedScript] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  
  const t = translations[language];

  const handleOpenChannel = () => {
    window.open('https://t.me/rentrop_project', '_blank');
  };

  const handleOpenBot = () => {
    window.open('https://t.me/RentROP_HR_bot', '_blank');
  };

  const handleTranslateResume = async () => {
    if (!crmData?.resume_text) {
      toast.error(t.noResume);
      return;
    }

    setIsTranslating(true);
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
        toast.success(t.translateSuccess);
        refetchCrmData();
      }
    } catch (error) {
      console.error('Error translating resume:', error);
      toast.error(t.errorGenerating);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!crmData?.resume_text) {
      toast.error(t.noResume);
      return;
    }

    setIsGenerating(true);
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
        setGeneratedScript(data.script);
        setEditedScript(data.script);
        setIsEditing(false);
        setShowScriptDialog(true);
        toast.success(t.scriptSaved);
        refetchCrmData();
      }
    } catch (error) {
      console.error('Error generating script:', error);
      toast.error(t.errorGenerating);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyScript = async () => {
    const textToCopy = isEditing ? editedScript : generatedScript;
    if (!textToCopy) return;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      toast.success(t.copied);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  const handleExportPdf = () => {
    const textToExport = isEditing ? editedScript : generatedScript;
    if (!textToExport) return;
    
    // Create PDF using browser print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${t.scriptTitle}</title>
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
          <h1>${t.scriptTitle}</h1>
          <p>${textToExport}</p>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Check if there's a saved script
  const handleShowSavedScript = () => {
    if (crmData?.video_script) {
      setGeneratedScript(crmData.video_script);
      setEditedScript(crmData.video_script);
      setIsEditing(false);
      setShowScriptDialog(true);
    }
  };

  // Handle regeneration
  const handleRegenerate = async () => {
    if (!crmData?.resume_text) {
      toast.error(t.noResume);
      return;
    }
    setIsEditing(false);
    setIsGenerating(true);
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
        setGeneratedScript(data.script);
        setEditedScript(data.script);
        toast.success(t.scriptSaved);
        refetchCrmData();
      }
    } catch (error) {
      console.error('Error generating script:', error);
      toast.error(t.errorGenerating);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle save edited script
  const handleSaveEditedScript = async () => {
    if (!telegramId || !editedScript.trim()) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('crm_data')
        .update({ video_script: editedScript })
        .eq('telegram_id', telegramId);

      if (error) throw error;
      
      setGeneratedScript(editedScript);
      setIsEditing(false);
      toast.success(t.scriptUpdated);
      refetchCrmData();
    } catch (error) {
      console.error('Error saving script:', error);
      toast.error(t.errorGenerating);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle edit mode
  const handleStartEditing = () => {
    setEditedScript(generatedScript || '');
    setIsEditing(true);
  };

  const content = (
    <div 
      className="min-h-screen"
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

      {/* Content */}
      <div className={`max-w-2xl mx-auto px-4 py-8 space-y-6 ${showMobileNav ? 'pt-28 pb-32' : ''}`}>
        <div className="glass-dark rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">{t.title}</h2>
          
          {/* Preparation */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-accent">{t.preparation}</h3>
            <div className="space-y-3 text-white/80">
              <p>{t.prep1}</p>
              <p>{t.prep2}</p>
              <p>{t.prep3}</p>
              <p>{t.prep4}</p>
              <p>{t.prep5}</p>
            </div>
          </div>

          {/* Plan */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-accent">{t.planTitle}</h3>
            <div className="space-y-3 text-white/80">
              <p>{t.plan1}</p>
              <p>{t.plan2}</p>
              <p className="pl-4 text-white/60 italic">{t.plan2Detail}</p>
              <p>{t.plan3}</p>
              <p>{t.plan4}</p>
            </div>
          </div>

          {/* Timing */}
          <div className="text-center py-4">
            <p className="text-xl font-bold text-accent">{t.timing}</p>
          </div>

          {/* AI Help Section */}
          <div className="bg-white/5 rounded-xl p-4 space-y-4">
            <p className="text-white/80">{t.aiHelp}</p>
            
            {/* Resume preview with Show All and Translate */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-white/60 text-sm">{t.resumeTitle}</p>
                <div className="flex items-center gap-2">
                  {crmData?.resume_text && (
                    <button 
                      onClick={handleTranslateResume}
                      disabled={isTranslating}
                      className="text-accent hover:text-accent/80 flex items-center gap-1 text-xs disabled:opacity-50"
                    >
                      {isTranslating ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-t border-accent"></div>
                      ) : (
                        <Languages className="w-3 h-3" />
                      )}
                      {isTranslating ? t.translating : t.translateButton}
                    </button>
                  )}
                  {crmData?.resume_text && crmData.resume_text.split('\n').length > 5 && (
                    <button 
                      onClick={() => setShowResumeDialog(true)}
                      className="text-accent hover:text-accent/80 flex items-center gap-1 text-xs"
                    >
                      {t.showAll} <ChevronDown className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              {crmData?.resume_text ? (
                <div className="bg-white/5 rounded-lg p-3 max-h-32 overflow-hidden">
                  <p className="text-white/80 text-sm whitespace-pre-wrap">
                    {crmData.resume_text.split('\n').slice(0, 5).join('\n')}
                    {crmData.resume_text.split('\n').length > 5 && '...'}
                  </p>
                </div>
              ) : (
                <p className="text-red-400 text-sm">{t.noResume}</p>
              )}
            </div>

            {/* Buttons stacked vertically */}
            <div className="space-y-3">
              <Button
                onClick={handleGenerateScript}
                disabled={isGenerating || !crmData?.resume_text}
                variant="gold"
                size="lg"
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                    {t.generating}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t.aiButton}
                  </>
                )}
              </Button>
              
              {crmData?.video_script && (
                <Button
                  onClick={handleShowSavedScript}
                  variant="outline"
                  size="lg"
                  className="w-full gap-2"
                >
                  <Video className="w-5 h-5" />
                  {t.scriptTitle}
                </Button>
              )}
            </div>
          </div>

          {/* Send to HR */}
          <div className="space-y-4 text-white/80">
            <p>{t.sendToHR}</p>
            
            <Button
              onClick={handleOpenChannel}
              variant="gold"
              size="lg"
              className="w-full gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              {t.projectsChannel}
            </Button>
            
            <p className="text-sm text-center">{t.projectsChannelNote}</p>
            
            <p className="text-center">{t.sundayMailing}</p>
            
            <Button
              onClick={handleOpenBot}
              variant="outline"
              size="lg"
              className="w-full gap-2"
            >
              <Bot className="w-5 h-5" />
              {t.openBot}
            </Button>
          </div>
        </div>
      </div>

      {/* Script Dialog - Fixed for mobile centering */}
      <Dialog open={showScriptDialog} onOpenChange={(open) => {
        setShowScriptDialog(open);
        if (!open) setIsEditing(false);
      }}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[80vh] glass-dark border-white/10 flex flex-col p-4 sm:p-6">
          <DialogHeader className="flex-shrink-0 pb-2">
            <DialogTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              {t.scriptTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0 pr-1">
            {isEditing ? (
              <Textarea
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                className="w-full min-h-[35vh] bg-white/5 border-white/10 text-white/90 resize-none text-sm"
                placeholder={t.scriptTitle}
              />
            ) : (
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <p className="text-white/90 whitespace-pre-wrap leading-relaxed text-sm">
                  {generatedScript}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0 pt-3 space-y-2">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleSaveEditedScript}
                  disabled={isSaving}
                  variant="gold"
                  size="sm"
                  className="gap-1"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {t.saveButton}
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedScript(generatedScript || '');
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <X className="w-4 h-4" />
                  {t.closeButton}
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
                    <span className="hidden sm:inline">{isCopied ? t.copied : t.copyButton}</span>
                  </Button>
                  <Button
                    onClick={handleStartEditing}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.editButton}</span>
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
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-accent"></div>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        {t.regenerateButton}
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
                    {t.closeButton}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Resume Full Dialog */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[80vh] glass-dark border-white/10 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-base sm:text-lg">{t.resumeTitle}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            <p className="text-white text-sm whitespace-pre-wrap">{crmData?.resume_text}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (showMobileNav) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  return content;
};

export default VideoCardIntro;
