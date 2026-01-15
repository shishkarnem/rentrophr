import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';

const InterviewIntro = () => {
  const navigate = useNavigate();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const showMobileNav = isTelegram || isMobile;

  // Translations for interview intro page
  const translations = {
    ru: {
      title: 'Прохождение интервью',
      back: 'Назад',
      headerTitle: 'Интервью',
      intro: 'Интервью пройдет в виде опроса робота с искусственным интеллектом🤖',
      evaluation: 'Робот сам даст оценку Вашим ответам и примет решение о приеме на работу к нам.',
      experience: 'Робот был сделан экспертами нашей компании на основании опыта проведения более 4000 интервью.',
      trust: 'Ему мы доверяем больше чем себе, так как он никогда не ошибается.',
      success: 'В случае успешного решения роботом, Вы сразу же будете добавлены в штат компании и на обучение к нам.',
      timeSave: '(Экономите свое время ⏳).',
      retry: 'В случае отказа роботом, Вы можете повторно пройти интервью с Вашим HR лично.',
      reminder: 'Перед самим интервью, просьба посмотреть Имя и Фамилию вашего HR в приглашении на интервью. Также запомните ваш код, который прислали ранее. Пригодится в дальнейшем.',
      button: 'Пройти Интервью',
      gdprNotice: 'Отправляя свои данные через данную форму, вы подтверждаете согласие на передачу ваших персональных данных иностранному сервису Google (Google LLC, США) в соответствии с ФЗ-152 «О персональных данных».',
    },
    en: {
      title: 'Taking the Interview',
      back: 'Back',
      headerTitle: 'Interview',
      intro: 'The interview will be conducted by an AI-powered robot🤖',
      evaluation: 'The robot will evaluate your answers and make a decision about hiring you.',
      experience: 'The robot was created by our company experts based on the experience of conducting more than 4000 interviews.',
      trust: 'We trust it more than ourselves because it never makes mistakes.',
      success: 'If the robot approves you, you will immediately be added to the company staff and enrolled in our training.',
      timeSave: '(Save your time ⏳).',
      retry: 'If the robot rejects you, you can retake the interview with your HR personally.',
      reminder: 'Before the interview, please check the name of your HR in the interview invitation. Also remember your code that was sent earlier. It will be useful later.',
      button: 'Start Interview',
      gdprNotice: 'By submitting your data through this form, you confirm your consent to the transfer of your personal data to a foreign service Google (Google LLC, USA).',
    },
    kz: {
      title: 'Сұхбаттан өту',
      back: 'Артқа',
      headerTitle: 'Сұхбат',
      intro: 'Сұхбат жасанды интеллект робот сауалнамасы түрінде өтеді🤖',
      evaluation: 'Робот жауаптарыңызға баға береді және бізге жұмысқа қабылдау туралы шешім қабылдайды.',
      experience: 'Робот 4000-нан астам сұхбат өткізу тәжірибесі негізінде біздің компания сарапшылары жасаған.',
      trust: 'Біз оған өзімізден көп сенеміз, өйткені ол ешқашан қателеспейді.',
      success: 'Робот оң шешім қабылдаған жағдайда, сіз бірден компания штатына қосыласыз және біздің оқуға жіберілесіз.',
      timeSave: '(Уақытыңызды үнемдейсіз ⏳).',
      retry: 'Робот бас тартқан жағдайда, сіз HR-мен жеке сұхбаттан қайта өте аласыз.',
      reminder: 'Сұхбаттан бұрын, HR-дің аты-жөнін сұхбатқа шақыруда қараңыз. Сондай-ақ бұрын жіберілген кодыңызды есте сақтаңыз. Болашақта қажет болады.',
      button: 'Сұхбатты бастау',
      gdprNotice: 'Осы форма арқылы деректеріңізді жіберу кезінде, сіз дербес деректеріңізді Google (Google LLC, АҚШ) шетелдік сервисіне беруге келісім бересіз.',
    },
  };

  const t = translations[language];

  return (
    <div 
      className="min-h-screen relative z-10"
      style={{
        background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
      }}
    >
      {/* Header - only show on desktop */}
      {!showMobileNav && (
        <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-semibold text-white ml-4">{t.headerTitle}</h1>
          </div>
        </div>
      )}

      <main className={`container mx-auto px-4 py-8 max-w-lg ${showMobileNav ? 'pt-28 pb-32' : ''}`}>

        <div className="glass-dark rounded-2xl p-6 space-y-6">
          {/* Robot icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot className="w-10 h-10 text-accent" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white text-center">
            {t.title}
          </h2>

          {/* Description */}
          <div className="text-white/80 text-sm leading-relaxed space-y-4">
            <p>{t.intro}</p>
            <p>{t.evaluation}</p>
            <p>{t.experience}</p>
            <p className="font-medium text-white">{t.trust}</p>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-400">🔹</span>
                <span>
                  {t.success}
                  <br />
                  <span className="text-white/60">{t.timeSave}</span>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-orange-400">🔹</span>
                <span>{t.retry}</span>
              </p>
            </div>

            <p className="text-accent font-medium">{t.reminder}</p>

            {/* GDPR Notice */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-400">🔒</span>
                <p className="text-white/70 text-xs leading-relaxed">{t.gdprNotice}</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate('/interview/form')}
            className="w-full bg-accent hover:bg-accent/80 text-primary font-semibold py-6 text-lg"
          >
            {t.button}
          </Button>
        </div>
      </main>

      {showMobileNav && (
        <>
          <MobileHeader />
          <MobileNavbar />
        </>
      )}
    </div>
  );
};

export default InterviewIntro;
