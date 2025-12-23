import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlass } from '@/components/ui/card';
import { ArrowLeft, FileText, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/work" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Назад к разделу Работа
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-8">
              <span className="text-gradient-gold">Отчеты</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlass className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </span>
                  Ежедневная отчетность
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Каждый день РОП отчитывается о проделанной работе в чаты 
                    (отчетность закреплена в виде ссылки в соответствующем чате).
                  </p>
                  <p className="font-semibold text-foreground">Регулярный отчет в конце рабочего дня:</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">а)</span>
                      описываем задачи на день;
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">б)</span>
                      результаты работы дня — что получилось и почему не получилось. 
                      Важны именно результаты за прошедший день.
                    </li>
                  </ul>
                </div>
              </CardGlass>

              <CardGlass className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </span>
                  Еженедельные встречи
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Есть гугл-документ «проджект-менеджмент». На еженедельных встречах собственник 
                    видит демонстрацию экрана и заполнение задачи на будущую неделю и принимает задачи прошедшей недели.
                  </p>
                  <p>
                    Принимает работу, вместе проставляйте галочки у выполненных задач.
                  </p>
                  <p>
                    Если на неделе от собственника прилетают новые задачи — прописываем их в проджекте 
                    и на еженедельных встречах проговариваем, что фрейм сместился из-за этих срочных важных задач.
                  </p>
                </div>
              </CardGlass>

              <CardGlass className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </span>
                  Прозрачность результатов
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Система отчетности позволяет отслеживать прогресс и результаты в реальном времени, 
                    обеспечивая полную прозрачность работы для всех участников проекта.
                  </p>
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

export default Reports;
