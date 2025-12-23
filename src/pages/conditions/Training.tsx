import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlass } from '@/components/ui/card';
import { ArrowLeft, GraduationCap, BookOpen, CheckCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const trainingStages = [
  { num: 1, title: 'Условия работы' },
  { num: 2, title: 'Обучающий портал' },
  { num: 3, title: 'Отчетность' },
  { num: 4, title: 'Робот HR' },
];

const Training = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Назад к разделу Условия
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-8">
              <span className="text-gradient-gold">Обучение</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlass className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </span>
                  Поэтапное обучение
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Обучение состоит из текстовых и видео материалов и аттестации в виде теста. 
                    После успешной сдачи теста мы пришлем следующий этап.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground mt-8 mb-4">Всего 4 этапа обучения:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {trainingStages.map((stage) => (
                    <div key={stage.num} className="p-4 glass rounded-xl text-center">
                      <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center mx-auto mb-2">
                        <span className="text-primary font-bold">{stage.num}</span>
                      </div>
                      <p className="text-sm text-foreground font-medium">{stage.title}</p>
                    </div>
                  ))}
                </div>
              </CardGlass>

              <CardGlass className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </span>
                  Группа обучения
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Результаты тестов фиксируются автоматически в группе{' '}
                    <a href="https://t.me/+VROkOiW7pJfh5YV5" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">
                      Обучение [VP]
                    </a>
                  </p>
                  <p>
                    Желательно сразу в нее вступить. Также в ней можно оставлять вопросы 
                    и комментарии по обучению. Обязательно ответим.
                  </p>
                </div>
              </CardGlass>

              <CardGlass className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </span>
                  База знаний
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Обучение самостоятельное. Довольно простое. 
                    Вам нужно изучить всего 5% базовой информации Базы Знаний компании.
                  </p>
                  <p>
                    База знаний активно пополняется более 6 лет нашими экспертами, 
                    новая информация появляется несколько раз в месяц.
                  </p>
                  <div className="flex items-start gap-3 p-4 glass rounded-xl">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p>
                      Доступ ко всей Базе Знаний компании пришлем по итогу прохождения всего обучения.
                    </p>
                  </div>
                </div>
              </CardGlass>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Training;
