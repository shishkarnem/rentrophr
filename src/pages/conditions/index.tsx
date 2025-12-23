import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowRight, DollarSign, GraduationCap, FolderKanban, FileCheck, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const ConditionsIndex = () => {
  const { t } = useLanguage();

  const conditionsPages = [
    { 
      titleKey: 'conditions.motivation', 
      descKey: 'conditions.motivationDesc',
      icon: DollarSign,
      path: '/conditions/motivation'
    },
    { 
      titleKey: 'conditions.training', 
      descKey: 'conditions.trainingDesc',
      icon: GraduationCap,
      path: '/conditions/training'
    },
    { 
      titleKey: 'conditions.projects', 
      descKey: 'conditions.projectsDesc',
      icon: FolderKanban,
      path: '/conditions/projects'
    },
    { 
      titleKey: 'conditions.registration', 
      descKey: 'conditions.registrationDesc',
      icon: FileCheck,
      path: '/conditions/registration'
    },
    { 
      titleKey: 'conditions.payments', 
      descKey: 'conditions.paymentsDesc',
      icon: Wallet,
      path: '/conditions/payments'
    },
  ];

  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              <span className="text-gradient-gold">{t('conditions.title')}</span>
            </h1>
            <p className="text-xl text-white/70 mb-12">
              {t('conditions.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conditionsPages.map((page) => (
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

export default ConditionsIndex;
