import { useNavigate } from "react-router-dom";
import { useTelegram } from "@/contexts/TelegramContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useCrmData } from "@/hooks/useCrmData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, Circle, FileCheck, GraduationCap, BookOpen, FileText, Bot, Hourglass } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";

const translations: Record<Language, {
  headerTitle: string;
  title: string;
  subtitle: string;
  progress: string;
  testsCompleted: string;
  testConditions: string;
  testConditionsDesc: string;
  testPortal: string;
  testPortalDesc: string;
  testReport: string;
  testReportDesc: string;
  testRobot: string;
  testRobotDesc: string;
  completed: string;
  pending: string;
  notCompleted: string;
  startTest: string;
  viewTest: string;
  locked: string;
  allCompleted: string;
}> = {
  ru: {
    headerTitle: "Обучение",
    title: "Обучение и тесты",
    subtitle: "Пройдите все 4 теста для завершения обучения",
    progress: "Прогресс",
    testsCompleted: "тестов пройдено",
    testConditions: "Тест Условия",
    testConditionsDesc: "Изучите условия работы Эксперта в РентРОП",
    testPortal: "Тест Портал",
    testPortalDesc: "Изучите обучающий портал компании",
    testReport: "Тест Отчет",
    testReportDesc: "Изучите систему отчетности в Telegram",
    testRobot: "Тест Робот",
    testRobotDesc: "Изучите работу с HR-роботом",
    completed: "Пройден",
    pending: "Ожидает",
    notCompleted: "Не пройден",
    startTest: "Пройти",
    viewTest: "Открыть",
    locked: "Заблокировано",
    allCompleted: "🎉 Поздравляем! Все тесты пройдены!"
  },
  en: {
    headerTitle: "Training",
    title: "Training & Tests",
    subtitle: "Complete all 4 tests to finish training",
    progress: "Progress",
    testsCompleted: "tests completed",
    testConditions: "Conditions Test",
    testConditionsDesc: "Learn Expert working conditions at RentROP",
    testPortal: "Portal Test",
    testPortalDesc: "Study the company's training portal",
    testReport: "Report Test",
    testReportDesc: "Learn the reporting system in Telegram",
    testRobot: "Robot Test",
    testRobotDesc: "Learn to work with HR-robot",
    completed: "Completed",
    pending: "Pending",
    notCompleted: "Not completed",
    startTest: "Start",
    viewTest: "Open",
    locked: "Locked",
    allCompleted: "🎉 Congratulations! All tests completed!"
  },
  kz: {
    headerTitle: "Оқыту",
    title: "Оқыту және тесттер",
    subtitle: "Оқытуды аяқтау үшін барлық 4 тестті тапсырыңыз",
    progress: "Прогресс",
    testsCompleted: "тест тапсырылды",
    testConditions: "Шарттар тесті",
    testConditionsDesc: "РентРОП-тағы эксперттің жұмыс шарттарын зерттеңіз",
    testPortal: "Портал тесті",
    testPortalDesc: "Компанияның оқыту порталын зерттеңіз",
    testReport: "Есеп тесті",
    testReportDesc: "Telegram-дағы есеп жүйесін зерттеңіз",
    testRobot: "Робот тесті",
    testRobotDesc: "HR-робот жұмысын зерттеңіз",
    completed: "Тапсырылды",
    pending: "Күтілуде",
    notCompleted: "Тапсырылмады",
    startTest: "Бастау",
    viewTest: "Ашу",
    locked: "Құлыпталған",
    allCompleted: "🎉 Құттықтаймыз! Барлық тесттер тапсырылды!"
  }
};

interface TestCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isPending: boolean;
  isAvailable: boolean;
  completedText: string;
  pendingText: string;
  notCompletedText: string;
  startText: string;
  viewText: string;
  lockedText: string;
  testValue: string | null;
  onClick: () => void;
}

const TestCard = ({
  title,
  description,
  icon,
  isCompleted,
  isPending,
  isAvailable,
  completedText,
  pendingText,
  notCompletedText,
  startText,
  viewText,
  lockedText,
  testValue,
  onClick
}: TestCardProps) => {
  return (
    <div 
      className={`glass-dark rounded-xl p-4 border transition-all ${
        isCompleted 
          ? 'border-green-500/30 bg-green-500/5' 
          : isAvailable 
            ? 'border-accent/30 hover:border-accent/50 cursor-pointer' 
            : 'border-white/10 opacity-60'
      }`}
      onClick={isAvailable ? onClick : undefined}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${
          isCompleted 
            ? 'bg-green-500/20 text-green-400' 
            : isAvailable 
              ? 'bg-accent/20 text-accent' 
              : 'bg-white/10 text-white/40'
        }`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white truncate">{title}</h3>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : isPending ? (
              <Hourglass className="w-5 h-5 text-accent flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-white/30 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-white/60 mt-1">{description}</p>
          
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs px-2 py-1 rounded-full ${
              isCompleted 
                ? 'bg-green-500/20 text-green-400' 
                : isPending
                  ? 'bg-accent/20 text-accent'
                  : 'bg-white/10 text-white/60'
            }`}>
              {isCompleted ? `${completedText}: ${testValue}` : isPending ? pendingText : notCompletedText}
            </span>
            
            {isAvailable && (
              <Button
                variant={isCompleted ? "ghost" : "gold"}
                size="sm"
                className={isCompleted ? "text-accent" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                {isCompleted ? viewText : startText}
              </Button>
            )}
            
            {!isAvailable && (
              <span className="text-xs text-white/40">{lockedText}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TrainingDashboard = () => {
  const navigate = useNavigate();
  const { isTelegram, profile } = useTelegram();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const showMobileNav = isTelegram || isMobile;
  
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData, isLoading } = useCrmData(telegramId);
  
  const t = translations[language];

  // Check if test is pending (⏳ / ⌛️ means waiting, not completed)
  const isTestPending = (value: string | null): boolean => {
    return !!value && (value.includes('⌛') || value.includes('⌛️') || value.includes('⏳'));
  };

  // Check if test is completed
  const isTestCompleted = (value: string | null): boolean => {
    if (!value || value === '' || value === '0') return false;
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'нет' || isTestPending(value)) return false;
    return true;
  };

  // Check if test is available
  const isTestAvailable = (skill: string): boolean => {
    if (!crmData?.available_skills) return false;
    return crmData.available_skills.toLowerCase().includes(skill.toLowerCase());
  };

  // Calculate progress
  const tests = [
    { key: 'conditions', value: crmData?.test_conditions, skill: 'тест условия' },
    { key: 'portal', value: crmData?.test_portal, skill: 'тест портал' },
    { key: 'report', value: crmData?.test_report, skill: 'тест отчет' },
    { key: 'robot', value: crmData?.test_robot, skill: 'тест робот' },
  ];
  
  const completedCount = tests.filter(t => isTestCompleted(t.value)).length;
  const progressPercent = (completedCount / 4) * 100;

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
              onClick={() => navigate('/profile')}
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
        {/* Hero Section */}
        <div className="glass-dark rounded-2xl p-6 text-center">
          <GraduationCap className="w-16 h-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
          <p className="text-white/70">{t.subtitle}</p>
        </div>

        {/* Progress Section */}
        <div className="glass-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{t.progress}</h3>
            <span className="text-accent font-bold">{completedCount}/4</span>
          </div>
          
          <Progress value={progressPercent} className="h-3 mb-3" />
          
          <p className="text-center text-white/60 text-sm">
            {completedCount} {t.testsCompleted}
          </p>
          
          {completedCount === 4 && (
            <p className="text-center text-green-400 font-semibold mt-4">
              {t.allCompleted}
            </p>
          )}
        </div>

        {/* Tests Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <TestCard
              title={t.testConditions}
              description={t.testConditionsDesc}
              icon={<FileCheck className="w-6 h-6" />}
              isCompleted={isTestCompleted(crmData?.test_conditions)}
              isPending={isTestPending(crmData?.test_conditions)}
              isAvailable={isTestAvailable('тест условия')}
              completedText={t.completed}
              pendingText={t.pending}
              notCompletedText={t.notCompleted}
              startText={t.startTest}
              viewText={t.viewTest}
              lockedText={t.locked}
              testValue={crmData?.test_conditions}
              onClick={() => navigate('/tests/conditions')}
            />
            
            <TestCard
              title={t.testPortal}
              description={t.testPortalDesc}
              icon={<BookOpen className="w-6 h-6" />}
              isCompleted={isTestCompleted(crmData?.test_portal)}
              isPending={isTestPending(crmData?.test_portal)}
              isAvailable={isTestAvailable('тест портал')}
              completedText={t.completed}
              pendingText={t.pending}
              notCompletedText={t.notCompleted}
              startText={t.startTest}
              viewText={t.viewTest}
              lockedText={t.locked}
              testValue={crmData?.test_portal}
              onClick={() => navigate('/tests/portal')}
            />
            
            <TestCard
              title={t.testReport}
              description={t.testReportDesc}
              icon={<FileText className="w-6 h-6" />}
              isCompleted={isTestCompleted(crmData?.test_report)}
              isPending={isTestPending(crmData?.test_report)}
              isAvailable={isTestAvailable('тест отчет')}
              completedText={t.completed}
              pendingText={t.pending}
              notCompletedText={t.notCompleted}
              startText={t.startTest}
              viewText={t.viewTest}
              lockedText={t.locked}
              testValue={crmData?.test_report}
              onClick={() => navigate('/tests/report')}
            />
            
            <TestCard
              title={t.testRobot}
              description={t.testRobotDesc}
              icon={<Bot className="w-6 h-6" />}
              isCompleted={isTestCompleted(crmData?.test_robot)}
              isPending={isTestPending(crmData?.test_robot)}
              isAvailable={isTestAvailable('тест робот')}
              completedText={t.completed}
              pendingText={t.pending}
              notCompletedText={t.notCompleted}
              startText={t.startTest}
              viewText={t.viewTest}
              lockedText={t.locked}
              testValue={crmData?.test_robot}
              onClick={() => navigate('/tests/robot')}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (showMobileNav) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  return content;
};

export default TrainingDashboard;
