import { useNavigate } from "react-router-dom";
import { useTelegram } from "@/contexts/TelegramContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCheck, ExternalLink, Youtube, Play, FileSpreadsheet, Bot, Users } from "lucide-react";
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
  vacancyTitle: string;
  vacancyButton: string;
  moreVideos: string;
  reportPlaylist: string;
  salesPlaylist: string;
  managerPlaylist: string;
  additionalPlaylist: string;
}> = {
  ru: {
    headerTitle: "Тест Робот",
    back: "Назад",
    title: "Тест Робот",
    intro: "4️⃣ Проходим четвертое обучение (из четырех) по",
    step1: "HR-Роботу",
    studyInfo: "Изучаем видео в плейлисте YouTube.",
    youtubeLink: "4️⃣ Плейлист ROBOT HR",
    altText: "Если не работает YouTube, то есть перезалив:",
    rutubeLink: "RuTube",
    vkLink: "VK Video",
    afterStudy: "После изучения видео проходим Тест HR-Робота по кнопке:",
    testButton: "Четвертая Аттестация",
    testNote: "Тест является элементом обучения",
    requirement1: "✅ Необходимо набрать максимальное количество баллов 12/12.",
    requirement2: "✅ Он показывает неправильные ответы при каждом повторении.",
    requirement3: "✅ Вы можете проходить тест неограниченное количество раз.",
    requirement4: "✅ Мы отправим инструкции на следующий этап сразу после прохождения теста с максимальным количеством баллов.",
    resultsNote: "Результаты публикуются в чате",
    chatButton: "Чат обучения",
    chatNote: "и отправляются в личный кабинет.",
    templateTitle: "Ссылка на шаблон робота",
    templateButton: "Шаблон Робота",
    vacancyTitle: "Ссылка на вакансию РОПа",
    vacancyButton: "Пример Вакансии",
    moreVideos: "Больше видео по теме можно посмотреть в наших плейлистах на YouTube:",
    reportPlaylist: "📹 Отчеты в Телеге",
    salesPlaylist: "📹 Техники Продаж",
    managerPlaylist: "📹 Обучение менеджеров",
    additionalPlaylist: "📹 Еще видео по Найму"
  },
  en: {
    headerTitle: "Robot Test",
    back: "Back",
    title: "Robot Test",
    intro: "4️⃣ We are undergoing the fourth training (out of four) on the",
    step1: "HR Robot",
    studyInfo: "We are studying videos in a YouTube playlist.",
    youtubeLink: "📹 Playlist ROBOT HR",
    altText: "",
    rutubeLink: "RuTube",
    vkLink: "VK Video",
    afterStudy: "After studying the video, we take the HR Robot test:",
    testButton: "Take HR Robot Test",
    testNote: "The test is an element of learning",
    requirement1: "✅ It is necessary to score the maximum number of points 12/12.",
    requirement2: "✅ It shows incorrect answers each time to repeat.",
    requirement3: "✅ You can take the test an unlimited number of times.",
    requirement4: "✅ We will send the next stage immediately after passing the maximum score test.",
    resultsNote: "The results are published in the chat",
    chatButton: "Training Chat",
    chatNote: "and they are sent to the personal account.",
    templateTitle: "Link to the robot template",
    templateButton: "Robot Template",
    vacancyTitle: "Link to the ROP vacancy",
    vacancyButton: "Vacancy Example",
    moreVideos: "More videos on the topic can be viewed in our playlists on YouTube:",
    reportPlaylist: "📹 Reporting + Telegram",
    salesPlaylist: "📹 Sales techniques",
    managerPlaylist: "📹 Training of managers",
    additionalPlaylist: "📹 Additional videos for hire"
  },
  kz: {
    headerTitle: "Робот тесті",
    back: "Артқа",
    title: "Робот тесті",
    intro: "4️⃣ Төртінші оқытудан (төрттен) өтеміз",
    step1: "HR-Робот",
    studyInfo: "YouTube плейлистіндегі бейнелерді зерттейміз.",
    youtubeLink: "4️⃣ ROBOT HR плейлисті",
    altText: "YouTube жұмыс істемесе, қайта жүктеу бар:",
    rutubeLink: "RuTube",
    vkLink: "VK Video",
    afterStudy: "Бейнені көргеннен кейін HR-Робот тестінен өтеміз:",
    testButton: "Төртінші аттестация",
    testNote: "Тест оқыту элементі болып табылады",
    requirement1: "✅ Максималды ұпай жинау қажет 12/12.",
    requirement2: "✅ Қате жауаптарды қайталау үшін көрсетеді.",
    requirement3: "✅ Тестті шексіз рет тапсыруға болады.",
    requirement4: "✅ Келесі кезең максималды ұпаймен тесттен өткеннен кейін бірден жіберіледі.",
    resultsNote: "Нәтижелер чатта жарияланады",
    chatButton: "Оқыту чаты",
    chatNote: "және жеке кабинетке жіберіледі.",
    templateTitle: "Робот үлгісіне сілтеме",
    templateButton: "Робот үлгісі",
    vacancyTitle: "РОП бос орнына сілтеме",
    vacancyButton: "Бос орын мысалы",
    moreVideos: "Тақырып бойынша көбірек бейнелерді біздің YouTube плейлисттерінен көруге болады:",
    reportPlaylist: "📹 Telegram-да есеп беру",
    salesPlaylist: "📹 Сату техникалары",
    managerPlaylist: "📹 Менеджерлерді оқыту",
    additionalPlaylist: "📹 Жалдау бойынша қосымша бейнелер"
  }
};

const TestRobotIntro = () => {
  const navigate = useNavigate();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const showMobileNav = isTelegram || isMobile;
  const t = translations[language];

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  // Language-specific URLs
  const youtubeUrl = language === 'en' 
    ? 'https://www.youtube.com/playlist?list=PL05Wr7vQtmzHUFq-XTFfOKfy10V2HeBkn'
    : 'https://www.youtube.com/playlist?list=PLk6E8i0IuOgVEHD0baYoKb8m_04cyjTOt';

  const templateUrl = language === 'en'
    ? 'https://docs.google.com/spreadsheets/d/1sW4IX0X3ZMBRl8x8CRTj4UONWyGbQ6mFQ6IgNmc6WVo/copy'
    : 'https://docs.google.com/spreadsheets/d/1uSi63W_VqHsLklF6D6JMdE0pdb8aJ-rP53XEO3HQ-Is/copy';

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
      <div className={`max-w-2xl mx-auto px-4 py-8 space-y-6 ${showMobileNav ? 'pt-4' : ''}`}>
        <div className="glass-dark rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-bold text-white">{t.title}</h2>
          
          <div className="space-y-4 text-white/80">
            <p>
              {t.intro} <strong className="text-white">{t.step1}</strong>
            </p>
            
            <p>{t.studyInfo}</p>
            
            {/* YouTube link */}
            <Button
              onClick={() => handleOpenLink(youtubeUrl)}
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
                    onClick={() => handleOpenLink('https://rutube.ru/plst/480135')}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <Play className="w-4 h-4" />
                    {t.rutubeLink}
                  </Button>
                  <Button
                    onClick={() => handleOpenLink('https://vk.com/video/playlist/-157196671_68')}
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
              onClick={() => navigate('/tests/robot/form')}
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
                onClick={() => handleOpenLink(templateUrl)}
                variant="gold"
                size="lg"
                className="w-full gap-2"
              >
                <Bot className="w-5 h-5" />
                {t.templateButton}
              </Button>
            </div>
            
            {/* Vacancy link */}
            <div className="pt-2 space-y-3">
              <p className="text-white font-medium">{t.vacancyTitle}</p>
              <Button
                onClick={() => handleOpenLink('https://sites.google.com/view/headrent/')}
                variant="gold"
                size="lg"
                className="w-full gap-2"
              >
                <Users className="w-5 h-5" />
                {t.vacancyButton}
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
                  onClick={() => handleOpenLink('https://www.youtube.com/playlist?list=PLk6E8i0IuOgXkY-xu0VgjXsIaikMNU6VD')}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  {t.managerPlaylist}
                </Button>
                <Button
                  onClick={() => handleOpenLink('https://youtube.com/playlist?list=PLGx5ZBGKgHEJuN2sxpfrsAC_2QtgvKGEY&si=pHUjrK60zMQgBLvj')}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  {t.additionalPlaylist}
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

export default TestRobotIntro;
