import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlass } from '@/components/ui/card';
import { ArrowRight, DollarSign, GraduationCap, FolderKanban, FileCheck, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const conditionsPages = [
  { 
    title: 'Мотивация', 
    description: 'Система оплаты труда: фикс, переменка, партнерка',
    icon: DollarSign,
    path: '/conditions/motivation'
  },
  { 
    title: 'Обучение', 
    description: 'Поэтапное обучение с аттестацией и доступом к базе знаний',
    icon: GraduationCap,
    path: '/conditions/training'
  },
  { 
    title: 'Проекты', 
    description: 'Открытый подбор проектов через телеграм канал',
    icon: FolderKanban,
    path: '/conditions/projects'
  },
  { 
    title: 'Оформление', 
    description: 'Договора для России и Казахстана, ИП и самозанятых',
    icon: FileCheck,
    path: '/conditions/registration'
  },
  { 
    title: 'Выплаты', 
    description: 'Выплаты дважды в месяц на расчетный счет',
    icon: Wallet,
    path: '/conditions/payments'
  },
];

const ConditionsIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
              <span className="text-gradient-gold">Условия</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Условия работы в компании РентРОП
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conditionsPages.map((page) => (
                <Link key={page.path} to={page.path}>
                  <CardGlass className="p-6 h-full hover:scale-[1.02] transition-transform cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
                        <page.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors flex items-center gap-2">
                          {page.title}
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-muted-foreground text-sm">{page.description}</p>
                      </div>
                    </div>
                  </CardGlass>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConditionsIndex;
