import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowRight, Building2, History, Users, FileText, UserCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedSection, AnimatedText, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const WorkIndex = () => {
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
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
    <PageTransition className="min-h-screen hero-gradient">
      <MobileLayout>
        <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection variant="fadeUp">
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                  <span className="text-gradient-gold">
                    <AnimatedText text={t('work.title')} />
                  </span>
                </h1>
              </AnimatedSection>
              <AnimatedSection variant="fadeUp" delay={0.1}>
                <p className="text-xl text-white/70 mb-12">
                  {t('work.subtitle')}
                </p>
              </AnimatedSection>
              
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
                {workPages.map((page) => (
                  <StaggerItem key={page.path} variant="elasticIn">
                    <Link to={page.path}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <CardGlassDark className="p-6 h-full cursor-pointer group" hover>
                          <div className="flex items-start gap-4">
                            <motion.div 
                              className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0"
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <page.icon className="w-6 h-6 text-primary" />
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-accent mb-2 group-hover:text-accent/80 transition-colors flex items-center gap-2">
                                {t(page.titleKey)}
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </h3>
                              <p className="text-white/60 text-sm">{t(page.descKey)}</p>
                            </div>
                          </div>
                        </CardGlassDark>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </main>
      </MobileLayout>
    </PageTransition>
  );
};

export default WorkIndex;