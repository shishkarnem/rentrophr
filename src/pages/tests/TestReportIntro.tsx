import { useNavigate } from "react-router-dom";
import { useTelegram } from "@/contexts/TelegramContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCheck, ExternalLink, Youtube, Play, FileSpreadsheet } from "lucide-react";
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
  templateTitle: string;
  templateButton: string;
  moreVideos: string;
  reportPlaylist: string;
  salesPlaylist: string;
  salesRutubePlaylist: string;
}> = {
  ru: {
    headerTitle: "Тест Отчет",
    back: "Назад",
    title: "Тест Отчет",
    intro: "3️⃣ Проходим третье обучение (из четырех) по",
    step1: "Отчетности в телеграм",
    studyInfo: "Изучаем видео на YouTube.",
    youtubeLink: "3️⃣ Обучение на YouTube",
    altText: "Если не работает YouTube, то есть перезалив:",
    rutubeLink: "RuTube",
    vkLink: "VK Video",
    afterStudy: "После изучения видео проходим Тест по Отчетности по кнопке:",
    testButton: "Третья Аттестация",
    testNote: "Тест является элементом обучения",
    requirement1: "✅ Необходимо набрать максимальное количество баллов 10/10.",
    requirement2: "✅ Каждый раз показывает неверные ответы для повтора.",
    requirement3: "✅ Сдавать тест можно неограниченное количество раз.",
    requirement4: "✅ Следующий этап пришлем сразу после прохождения теста на максимальный балл.",
    resultsNote: "Результаты публикуются в чате",
    chatButton: "Чат обучения",
    chatNote: "и отправляются в личку.",
    templateTitle: "Ссылка на шаблон отчетности",
    templateButton: "Шаблон Таблицы отчетности",
    moreVideos: "Больше видео по теме можно посмотреть в наших плейлистах на YouTube:",
    reportPlaylist: "📹 Еще видео по Отчетности",
    salesPlaylist: "📹 Продажи YouTube",
    salesRutubePlaylist: "📹 Продажи RuTube"
  },
  en: {
    headerTitle: "Report Test",
    back: "Back",
    title: "Report Test",
    intro: "3️⃣ We are undergoing the third training (out of four) on",
    step1: "Reporting in telegram",
    studyInfo: "We are studying videos on YouTube.",
    youtubeLink: "📹 Training on YouTube",
    altText: "",
    rutubeLink: "RuTube",
    vkLink: "VK Video",
    afterStudy: "After studying the video, we take the Reporting test:",
    testButton: "Take Reporting Test",
    testNote: "The test is an element of learning",
    requirement1: "✅ It is necessary to score a maximum of 10/10 points.",
    requirement2: "✅ Each time it shows incorrect answers for repetition.",
    requirement3: "✅ You can take the test an unlimited number of times.",
    requirement4: "✅ We will send the next stage immediately after passing the maximum score test.",
    resultsNote: "The results are published in the chat",
    chatButton: "Training Chat",
    chatNote: "and they are sent to the personal account.",
    templateTitle: "Link to the reporting template",
    templateButton: "Reporting Template",
    moreVideos: "More videos on the topic can be viewed in our playlists on YouTube:",
    reportPlaylist: "📹 Reporting system",
    salesPlaylist: "📹 Sales techniques",
    salesRutubePlaylist: "📹 Sales RuTube"
  },
  kz: {
    headerTitle: "Есеп тесті",
    back: "Артқа",
    title: "Есеп тесті",
    intro: "3️⃣ Үшінші оқытудан (төрттен) өтеміз",
    step1: "Telegram-дағы есеп беру",
    studyInfo: "YouTube-тегі бейнені зерттейміз.",
    youtubeLink: "3️⃣ YouTube-та оқыту",
    altText: "YouTube жұмыс істемесе, қайта жүктеу бар:",
    rutubeLink: "RuTube",
    vkLink: "VK Video",
    afterStudy: "Бейнені көргеннен кейін Есеп бойынша тесттен өтеміз:",
    testButton: "Үшінші аттестация",
    testNote: "Тест оқыту элементі болып табылады",
    requirement1: "✅ Максималды ұпай жинау қажет 10/10.",
    requirement2: "✅ Қате жауаптарды қайталау үшін көрсетеді.",
    requirement3: "✅ Тестті шексіз рет тапсыруға болады.",
    requirement4: "✅ Келесі кезең максималды ұпаймен тесттен өткеннен кейін бірден жіберіледі.",
    resultsNote: "Нәтижелер чатта жарияланады",
    chatButton: "Оқыту чаты",
    chatNote: "және жеке хабарламаларға жіберіледі.",
    templateTitle: "Есеп үлгісіне сілтеме",
    templateButton: "Есеп кестесінің үлгісі",
    moreVideos: "Тақырып бойынша көбірек бейнелерді біздің YouTube плейлисттерінен көруге болады:",
    reportPlaylist: "📹 Есеп бойынша қосымша бейнелер",
    salesPlaylist: "📹 Сату YouTube",
    salesRutubePlaylist: "📹 Сату RuTube"
  }
};

const TestReportIntro = () => {
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
          <h2 className="text-2xl font-bold text-white">{t.title}</h2>
          
          <div className="space-y-4 text-white/80">
            <p>
              {t.intro} <strong className="text-white">{t.step1}</strong>
            </p>
            
            <p>{t.studyInfo}</p>
            
            {/* YouTube link */}
            <Button
              onClick={() => handleOpenLink(language === 'en' ? 'https://www.youtube.com/playlist?list=PL05Wr7vQtmzFYFpdvHUdUtQi_6mWCdlhK' : 'https://youtu.be/fIqwwAOf_tg?si=dybBhT96QmA33uP9')}
              variant="gold"
              size="lg"
              className="w-full gap-2"
            >
              <Youtube className="w-5 h-5" />
              {t.youtubeLink}
            </Button>
            
            {/* Alternative links - only show for non-English */}
            {language !== 'en' && (
              <>
                <p className="text-sm">{t.altText}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleOpenLink('https://rutube.ru/video/690762e4bec04c1323a8a2607ded1aac/')}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <Play className="w-4 h-4" />
                    {t.rutubeLink}
                  </Button>
                  <Button
                    onClick={() => handleOpenLink('https://vk.com/video-157196671_456239608')}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <Play className="w-4 h-4" />
                    {t.vkLink}
                  </Button>
                </div>
              </>
            )}
            
            <p className="pt-4">{t.afterStudy}</p>
            
            <Button
              onClick={() => navigate('/tests/report/form')}
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
            
            {/* Template link */}
            <div className="pt-4 space-y-3">
              <p className="text-white font-medium">{t.templateTitle}</p>
              <Button
                onClick={() => handleOpenLink(language === 'en' ? 'https://docs.google.com/spreadsheets/d/1LcQfzGLXq-bzL4j8q_83RV2dQOTwF5SW_6Rt9FpNTag/copy' : 'https://docs.google.com/spreadsheets/d/1LT6xyI8GSdTq7guJjiu-IzPJul67sxmWxtbG5nvVLyU/copy')}
                variant="gold"
                size="lg"
                className="w-full gap-2"
              >
                <FileSpreadsheet className="w-5 h-5" />
                {t.templateButton}
              </Button>
            </div>
            
            {/* More playlists */}
            <div className="pt-6 space-y-3">
              <p className="text-white font-medium">{t.moreVideos}</p>
              
              <div className="space-y-2">
                <Button
                  onClick={() => handleOpenLink('https://youtube.com/playlist?list=PLGx5ZBGKgHELuXGPUZSHKysuqBVrKtywo&si=bCP1hnkWKyQ2OFGm')}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  {t.reportPlaylist}
                </Button>
                <Button
                  onClick={() => handleOpenLink('https://www.youtube.com/playlist?list=PLk6E8i0IuOgURDaaeM7uUF-2_tnvu5do2')}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  {t.salesPlaylist}
                </Button>
                <Button
                  onClick={() => handleOpenLink('https://rutube.ru/plst/480128')}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  {t.salesRutubePlaylist}
                </Button>
              </div>
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

export default TestReportIntro;
