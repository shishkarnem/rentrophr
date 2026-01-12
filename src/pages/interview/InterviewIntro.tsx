import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';

const InterviewIntro = () => {
  const navigate = useNavigate();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

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
          <div className="container mx-auto px-4 py-4 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-semibold text-white ml-4">Интервью</h1>
          </div>
        </div>
      )}

      <main className={`container mx-auto px-4 py-8 max-w-lg ${showMobileNav ? 'pt-20 pb-24' : ''}`}>
        {/* Back button for mobile */}
        {showMobileNav && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
        )}

        <div className="glass-dark rounded-2xl p-6 space-y-6">
          {/* Robot icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot className="w-10 h-10 text-accent" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white text-center">
            Прохождение интервью
          </h2>

          {/* Description */}
          <div className="text-white/80 text-sm leading-relaxed space-y-4">
            <p>
              Интервью пройдет в виде опроса робота с искусственным интеллектом🤖
            </p>
            <p>
              Робот сам даст оценку Вашим ответам и примет решение о приеме на работу к нам.
            </p>
            <p>
              Робот был сделан экспертами нашей компании на основании опыта проведения более 4000 интервью.
            </p>
            <p className="font-medium text-white">
              Ему мы доверяем больше чем себе, так как он никогда не ошибается.
            </p>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-400">🔹</span>
                <span>
                  В случае успешного решения роботом, Вы сразу же будете добавлены в штат компании и на обучение к нам.
                  <br />
                  <span className="text-white/60">(Экономите свое время ⏳).</span>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-orange-400">🔹</span>
                <span>
                  В случае отказа роботом, Вы можете повторно пройти интервью с Вашим HR лично.
                </span>
              </p>
            </div>

            <p className="text-accent font-medium">
              Перед самим интервью, просьба посмотреть Имя и Фамилию вашего HR в приглашении на интервью. 
              Также запомните ваш код, который прислали ранее. Пригодится в дальнейшем.
            </p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate('/interview/form')}
            className="w-full bg-accent hover:bg-accent/80 text-primary font-semibold py-6 text-lg"
          >
            Пройти Интервью
          </Button>
        </div>
      </main>

      {showMobileNav && <MobileNavbar />}
    </div>
  );
};

export default InterviewIntro;
