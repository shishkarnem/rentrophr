import { useNavigate } from "react-router-dom";
import { useTelegram } from "@/contexts/TelegramContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCheck, ExternalLink, Youtube, Play } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";

const translations: Record<Language, {
  headerTitle: string;
  back: string;
  title: string;
  intro: string;
  step1: string;
  studyInfo: string;
  youtubeLink: string;
  altText: string;
  rutubeLink: string;
  vkLink: string;
  afterStudy: string;
  testButton: string;
  testNote: string;
  requirement1: string;
  requirement2: string;
  requirement3: string;
  requirement4: string;
  resultsNote: string;
  chatButton: string;
  chatNote: string;
  moreVideos: string;
  portalPlaylist: string;
  scriptsPlaylist: string;
  notionPlaylist: string;
  codeNote: string;
}> = {
  ru: {
    headerTitle: "Тест Портал",
    back: "Назад",
    title: "Тест Портал",
    intro: "2️⃣ Проходим второе обучение (из четырех) по",
    step1: "Обучающему порталу",
    studyInfo: "Изучаем видео в плейлисте на YouTube.",
    youtubeLink: "📹 Обучение на YouTube",
    altText: "Если не работает YouTube, то есть перезалив:",
    rutubeLink: "RuTube",
    vkLink: "VK Video",
    afterStudy: "После изучения видео проходим Тест по Порталу по кнопке:",
    testButton: "Пройти Тест Портал",
    testNote: "Тест является элементом обучения",
    requirement1: "✅ Необходимо набрать максимальное количество баллов 21/21.",
    requirement2: "✅ Каждый раз показывает неверные ответы для повтора.",
    requirement3: "✅ Сдавать тест можно неограниченное количество раз.",
    requirement4: "✅ Следующий этап пришлем сразу после прохождения теста на максимальный балл.",
    resultsNote: "Результаты публикуются в чате",
    chatButton: "Чат результатов",
    chatNote: "и отправляются в личку.",
    moreVideos: "Больше видео по теме можно посмотреть в наших плейлистах на YouTube:",
    portalPlaylist: "📹 Обучающий портал",
    scriptsPlaylist: "📹 Скрипты продаж",
    notionPlaylist: "📹 Notion",
    codeNote: "⚠️ ВАМ ОБЯЗАТЕЛЬНО НУЖНО БУДЕТ ВВЕСТИ ВАШ КОД"
  },
  en: {
    headerTitle: "Portal Test",
    back: "Back",
    title: "Portal Test",
    intro: "2️⃣ Complete the second training (out of four) on",
    step1: "Training Portal",
    studyInfo: "Study the videos in the YouTube playlist.",
    youtubeLink: "📹 Training on YouTube",
    altText: "If YouTube doesn't work, there are mirrors:",
    rutubeLink: "RuTube",
    vkLink: "VK Video",
    afterStudy: "After watching the videos, take the Portal Test:",
    testButton: "Take Portal Test",
    testNote: "The test is a learning element",
    requirement1: "✅ You need to score the maximum points 21/21.",
    requirement2: "✅ Shows incorrect answers for review each time.",
    requirement3: "✅ You can take the test unlimited times.",
    requirement4: "✅ The next stage will be sent immediately after passing the test with maximum score.",
    resultsNote: "Results are published in the chat",
    chatButton: "Results Chat",
    chatNote: "and sent to private messages.",
    moreVideos: "More videos on the topic can be found in our YouTube playlists:",
    portalPlaylist: "📹 Training Portal",
    scriptsPlaylist: "📹 Sales Scripts",
    notionPlaylist: "📹 Notion",
    codeNote: "⚠️ YOU WILL NEED TO ENTER YOUR CODE"
  },
  kz: {
    headerTitle: "Портал тесті",
    back: "Артқа",
    title: "Портал тесті",
    intro: "2️⃣ Екінші оқытудан (төрттен) өтеміз",
    step1: "Оқыту порталы",
    studyInfo: "YouTube плейлистіндегі видеоларды зерттейміз.",
    youtubeLink: "📹 YouTube-та оқыту",
    altText: "YouTube жұмыс істемесе, қайта жүктеу бар:",
    rutubeLink: "RuTube",
    vkLink: "VK Video",
    afterStudy: "Видеоларды көргеннен кейін Портал бойынша тесттен өтеміз:",
    testButton: "Портал тестін тапсыру",
    testNote: "Тест оқыту элементі болып табылады",
    requirement1: "✅ Максималды ұпай жинау қажет 21/21.",
    requirement2: "✅ Қате жауаптарды қайталау үшін көрсетеді.",
    requirement3: "✅ Тестті шексіз рет тапсыруға болады.",
    requirement4: "✅ Келесі кезең максималды ұпаймен тесттен өткеннен кейін бірден жіберіледі.",
    resultsNote: "Нәтижелер чатта жарияланады",
    chatButton: "Нәтижелер чаты",
    chatNote: "және жеке хабарламаларға жіберіледі.",
    moreVideos: "Тақырып бойынша көбірек бейнелерді біздің YouTube плейлисттерінен көруге болады:",
    portalPlaylist: "📹 Оқыту порталы",
    scriptsPlaylist: "📹 Сату сценарийлері",
    notionPlaylist: "📹 Notion",
    codeNote: "⚠️ СІЗГЕ МІНДЕТТІ ТҮРДЕ КОДТЫ ЕНГІЗУ КЕРЕК"
  }
};

const TestPortalIntro = () => {
  const navigate = useNavigate();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const showMobileNav = isTelegram || isMobile;
  
  const t = translations[language];

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  const content = (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
      }}
    >
      {/* Header */}
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

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="glass-dark rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-bold text-white">{t.title}</h2>
          
          <div className="space-y-4 text-white/80">
            <p>
              {t.intro} <strong className="text-white">{t.step1}</strong>
            </p>
            
            <p>{t.studyInfo}</p>
            
            {/* YouTube link */}
            <Button
              onClick={() => handleOpenLink('https://www.youtube.com/playlist?list=PLk6E8i0IuOgXkY-xu0VgjXsIaikMNU6VD')}
              variant="gold"
              size="lg"
              className="w-full gap-2"
            >
              <Youtube className="w-5 h-5" />
              {t.youtubeLink}
            </Button>
            
            {/* Alternative links */}
            <p className="text-sm">{t.altText}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleOpenLink('https://rutube.ru/plst/480133')}
                variant="outline"
                size="sm"
                className="flex-1 gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <Play className="w-4 h-4" />
                {t.rutubeLink}
              </Button>
              <Button
                onClick={() => handleOpenLink('https://vk.com/video/playlist/-157196671_69')}
                variant="outline"
                size="sm"
                className="flex-1 gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <Play className="w-4 h-4" />
                {t.vkLink}
              </Button>
            </div>
            
            <p className="pt-4">{t.afterStudy}</p>
            
            <Button
              onClick={() => navigate('/tests/portal/form')}
              variant="gold"
              size="lg"
              className="w-full gap-2"
            >
              <FileCheck className="w-5 h-5" />
              {t.testButton}
            </Button>
            
            <p className="text-center">
              <strong className="text-white">{t.testNote}</strong>
            </p>
            
            <div className="space-y-2 pt-4">
              <p>{t.requirement1}</p>
              <p>{t.requirement2}</p>
              <p>{t.requirement3}</p>
              <p>{t.requirement4}</p>
            </div>
            
            <div className="pt-4 space-y-3">
              <p>
                <strong className="text-white">{t.resultsNote}</strong>
              </p>
              
              <Button
                onClick={() => handleOpenLink('https://t.me/+VROkOiW7pJfh5YV5')}
                variant="gold"
                size="lg"
                className="w-full gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                {t.chatButton}
              </Button>
              
              <p className="text-center text-sm">{t.chatNote}</p>
            </div>
            
            {/* More playlists */}
            <div className="pt-6 space-y-3">
              <p className="text-white font-medium">{t.moreVideos}</p>
              
              <div className="space-y-2">
                <Button
                  onClick={() => handleOpenLink('https://www.youtube.com/playlist?list=PLGx5ZBGKgHELG2FeFSju0i4QTWjXJqH5h')}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  {t.portalPlaylist}
                </Button>
                <Button
                  onClick={() => handleOpenLink('https://www.youtube.com/playlist?list=PLGx5ZBGKgHEIFVxSLo7Lcty0dTnETl_F5')}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  {t.scriptsPlaylist}
                </Button>
                <Button
                  onClick={() => handleOpenLink('https://www.youtube.com/playlist?list=PLGx5ZBGKgHEIh-NGZhftwsATls34doLlZ')}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  {t.notionPlaylist}
                </Button>
              </div>
            </div>
            
            {/* Code warning */}
            <div className="pt-4 p-4 bg-accent/20 rounded-lg border border-accent/30">
              <p className="text-center text-accent font-semibold">{t.codeNote}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showMobileNav) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  return content;
};

export default TestPortalIntro;
