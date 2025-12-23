import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlass } from '@/components/ui/card';
import { ArrowRight, Building2, History, Users, FileText, UserCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const workPages = [
  { 
    title: 'Аренда РОПов', 
    description: 'Основной продукт компании — аренда руководителей отделов продаж',
    icon: Building2,
    path: '/work/arenda-ropov'
  },
  { 
    title: 'О компании', 
    description: 'История компании с 2017 года и наши достижения',
    icon: History,
    path: '/work/about'
  },
  { 
    title: 'Сообщество', 
    description: 'Первое сообщество про продажи для РОПов и предпринимателей',
    icon: Users,
    path: '/work/community'
  },
  { 
    title: 'Отчеты', 
    description: 'Система ежедневной и еженедельной отчетности',
    icon: FileText,
    path: '/work/reports'
  },
  { 
    title: 'ДПР', 
    description: 'Директора по развитию — наставники для РОПов',
    icon: UserCheck,
    path: '/work/dpr'
  },
  { 
    title: 'Сотрудники', 
    description: 'Структура отделов компании',
    icon: UsersRound,
    path: '/work/employees'
  },
];

const WorkIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
              <span className="text-gradient-gold">Работа</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Узнайте больше о работе в РентРОП
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workPages.map((page) => (
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

export default WorkIndex;
