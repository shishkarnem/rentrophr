import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, FolderKanban, Users, Video, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects = () => {
  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Назад к разделу Условия
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
              <span className="text-gradient-gold">Проекты</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-primary" />
                  </span>
                  Подбор проектов
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    Подбор проектов открытый. В{' '}
                    <a href="https://t.me/rentrop_project" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">
                      телеграм канале
                    </a>{' '}
                    периодично отдел продаж выкладывает оплаченные проекты, где заказчики ожидают знакомства с РОПом.
                  </p>
                  <p>
                    Проекты размещены в виде поста с контактами ответственных, описанием, регионом, 
                    тарифом, что есть и что нужно сделать.
                  </p>
                  <p>
                    Откликаться можно в комментариях под постом.
                  </p>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </span>
                  Команда проекта
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p className="font-semibold text-white">Проект ведет несколько специалистов:</p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">1.</span>
                      <div>
                        <strong className="text-white">Сам РОП</strong> — его руками выполняется работа и управление.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">2.</span>
                      <div>
                        <strong className="text-white">ДПР</strong> — наставник, разрабатывающий стратегию развития и контролирующий выполнение задач в срок.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">3.</span>
                      <div>
                        <strong className="text-white">Менеджер проекта</strong> — контроль оплат и лояльности заказчиков.
                      </div>
                    </li>
                  </ul>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Video className="w-5 h-5 text-primary" />
                  </span>
                  Видео-визитка
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    Откликаться на Проекты под постом нужно в формате ссылки на видео-визитку.
                  </p>
                  <p className="font-semibold text-white">Инструкция по записи Видео Визитки:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-3">
                      <span className="text-accent">•</span>
                      Подготовка — выберите тихое место с хорошим освещением
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent">•</span>
                      Расскажите о себе, опыте и почему хотите работать с проектом
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent">•</span>
                      Оптимальная длительность — 1-2 минуты
                    </li>
                  </ul>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <div className="flex items-start gap-4 p-4 glass-dark rounded-xl">
                  <Send className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div className="text-white/70">
                    <p className="font-semibold text-white mb-1">Важно!</p>
                    <p>
                      Если РОП понимает, что намерен уйти с проекта, должен доложить об этом ДПРу за 14 дней. 
                      За это время мы найдем подмену и урегулируем на проекте эту рокировку.
                    </p>
                  </div>
                </div>
              </CardGlassDark>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
