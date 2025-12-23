import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowRight, Building2, History, Users, FileText, UserCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const WorkIndex = () => {
  const { t } = useLanguage();

  const workPages = [
    { 
      titleKey: 'work.arendaRopov', 
      descKey: 'work.arendaRopovDesc',
      icon: Building2,
      path: '/work/arenda-ropov'
    },
    { 
      titleKey: 'work.about', 
      descKey: 'work.aboutDesc',
      icon: History,
      path: '/work/about'
    },
    { 
      titleKey: 'work.community', 
      descKey: 'work.communityDesc',
      icon: Users,
      path: '/work/community'
    },
    { 
      titleKey: 'work.reports', 
      descKey: 'work.reportsDesc',
      icon: FileText,
      path: '/work/reports'
    },
    { 
      titleKey: 'work.dpr', 
      descKey: 'work.dprDesc',
      icon: UserCheck,
      path: '/work/dpr'
    },
    { 
      titleKey: 'work.employees', 
      descKey: 'work.employeesDesc',
      icon: UsersRound,
      path: '/work/employees'
    },
  ];

  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              <span className="text-gradient-gold">{t('work.title')}</span>
            </h1>
            <p className="text-xl text-white/70 mb-12">
              {t('work.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workPages.map((page) => (
                <Link key={page.path} to={page.path}>
                  <CardGlassDark className="p-6 h-full hover:scale-[1.02] transition-transform cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
                        <page.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors flex items-center gap-2">
                          {t(page.titleKey)}
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-white/60 text-sm">{t(page.descKey)}</p>
                      </div>
                    </div>
                  </CardGlassDark>
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
