import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, FileText, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedSection, AnimatedText, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Reports = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  return (
    <PageTransition className="min-h-screen hero-gradient">
      <MobileLayout>
        <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
          <div className="container mx-auto px-6">
            <AnimatedSection variant="fadeLeft">
              <Link to="/work" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                {t('work.backToWork')}
              </Link>
            </AnimatedSection>
            
            <div className="max-w-4xl mx-auto">
              <AnimatedSection variant="blurIn">
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
                  <span className="text-gradient-gold">
                    <AnimatedText text={t('reports.title')} />
                  </span>
                </h1>
              </AnimatedSection>
              
              <StaggerContainer className="space-y-8" staggerDelay={0.15}>
                <StaggerItem variant="fadeUp">
                  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <CardGlassDark className="p-8">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <motion.span 
                          className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          <FileText className="w-5 h-5 text-primary" />
                        </motion.span>
                        {t('reports.daily')}
                      </h2>
                      <div className="space-y-4 text-white/70 leading-relaxed">
                        <p>{t('reports.dailyDesc')}</p>
                        <p className="font-semibold text-white">{t('reports.regularReport')}</p>
                        <ul className="space-y-2 ml-4">
                          <motion.li 
                            className="flex gap-3"
                            whileHover={{ x: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <span className="text-accent font-bold">а)</span>{t('reports.dailyTasksA')}
                          </motion.li>
                          <motion.li 
                            className="flex gap-3"
                            whileHover={{ x: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <span className="text-accent font-bold">б)</span>{t('reports.dailyTasksB')}
                          </motion.li>
                        </ul>
                      </div>
                    </CardGlassDark>
                  </motion.div>
                </StaggerItem>

                <StaggerItem variant="fadeUp">
                  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <CardGlassDark className="p-8">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <motion.span 
                          className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          <Calendar className="w-5 h-5 text-primary" />
                        </motion.span>
                        {t('reports.weekly')}
                      </h2>
                      <div className="space-y-4 text-white/70 leading-relaxed">
                        <p>{t('reports.weeklyDesc1')}</p>
                        <p>{t('reports.weeklyDesc2')}</p>
                        <p>{t('reports.weeklyDesc3')}</p>
                      </div>
                    </CardGlassDark>
                  </motion.div>
                </StaggerItem>

                <StaggerItem variant="fadeUp">
                  <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <CardGlassDark className="p-8">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <motion.span 
                          className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          <BarChart3 className="w-5 h-5 text-primary" />
                        </motion.span>
                        {t('reports.transparency')}
                      </h2>
                      <div className="space-y-4 text-white/70 leading-relaxed">
                        <p>{t('reports.transparencyDesc')}</p>
                      </div>
                    </CardGlassDark>
                  </motion.div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </main>
      </MobileLayout>
    </PageTransition>
  );
};

export default Reports;
