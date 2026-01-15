import { useNavigate } from "react-router-dom";
import { useTelegram } from "@/contexts/TelegramContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCheck, ExternalLink } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";

const translations: Record<Language, {
  headerTitle: string;
  back: string;
  title: string;
  intro: string;
  step1: string;
  studyInfo: string;
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
}> = {
  ru: {
    headerTitle: "Тест Условия",
    back: "Назад",
    title: "Тест Условия",
    intro: "1️⃣ Сначала проходим первое обучение (из четырех) по",
    step1: "Условиям работы Эксперта в компании РентРОП",
    studyInfo: "Изучаем информацию на текущем сайте в разделе Меню. Изучаем как пользоваться навигацией по сайту, изучаем все страницы сайта и личный кабинет.",
    afterStudy: "После изучения информации проходим тест по Условиям работы по кнопке:",
    testButton: "Пройти Тест Условия",
    testNote: "Тест является элементом обучения",
    requirement1: "✅ Необходимо набрать максимальное количество баллов 21/21.",
    requirement2: "✅ Каждый раз показывает неверные ответы для повтора.",
    requirement3: "✅ Сдавать тест можно неограниченное количество раз.",
    requirement4: "✅ Следующий этап пришлем сразу после прохождения теста на максимальный балл.",
    resultsNote: "Результаты публикуются в чате",
    chatButton: "Чат результатов",
    chatNote: "и отправляются в личку."
  },
  en: {
    headerTitle: "Conditions Test",
    back: "Back",
    title: "Conditions Test",
    intro: "1️⃣ First, complete the first training (out of four) on",
    step1: "Expert Working Conditions at RentROP Company",
    studyInfo: "Study the information on this website in the Menu section. Learn how to navigate the site, explore all pages and your personal account.",
    afterStudy: "After studying the information, take the Conditions test using the button:",
    testButton: "Take Conditions Test",
    testNote: "The test is a learning element",
    requirement1: "✅ You need to score the maximum points 21/21.",
    requirement2: "✅ Shows incorrect answers for review each time.",
    requirement3: "✅ You can take the test unlimited times.",
    requirement4: "✅ The next stage will be sent immediately after passing the test with maximum score.",
    resultsNote: "Results are published in the chat",
    chatButton: "Results Chat",
    chatNote: "and sent to private messages."
  },
  kz: {
    headerTitle: "Шарттар тесті",
    back: "Артқа",
    title: "Шарттар тесті",
    intro: "1️⃣ Алдымен бірінші оқытудан (төрттен) өтеміз",
    step1: "РентРОП компаниясындағы эксперттің жұмыс шарттары",
    studyInfo: "Осы сайттағы мәзір бөліміндегі ақпаратты зерттейміз. Сайтты пайдалануды, барлық беттерді және жеке кабинетті зерттейміз.",
    afterStudy: "Ақпаратты зерттегеннен кейін түйме арқылы шарттар бойынша тесттен өтеміз:",
    testButton: "Шарттар тестін тапсыру",
    testNote: "Тест оқыту элементі болып табылады",
    requirement1: "✅ Максималды ұпай жинау қажет 21/21.",
    requirement2: "✅ Қате жауаптарды қайталау үшін көрсетеді.",
    requirement3: "✅ Тестті шексіз рет тапсыруға болады.",
    requirement4: "✅ Келесі кезең максималды ұпаймен тесттен өткеннен кейін бірден жіберіледі.",
    resultsNote: "Нәтижелер чатта жарияланады",
    chatButton: "Нәтижелер чаты",
    chatNote: "және жеке хабарламаларға жіберіледі."
  }
};

const TestConditionsIntro = () => {
  const navigate = useNavigate();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const showMobileNav = isTelegram || isMobile;
  
  const t = translations[language];

  const handleOpenChat = () => {
    window.open('https://t.me/+VROkOiW7pJfh5YV5', '_blank');
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
            
            <p>{t.afterStudy}</p>
            
            <Button
              onClick={() => navigate('/tests/conditions/form')}
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
                onClick={handleOpenChat}
                variant="gold"
                size="lg"
                className="w-full gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                {t.chatButton}
              </Button>
              
              <p className="text-center text-sm">{t.chatNote}</p>
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

export default TestConditionsIntro;
