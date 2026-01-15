import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark, CardGlassDarkHeader } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Percent, Handshake, Settings, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import tariffTable from '@/assets/tariff-table.jpg';
import motivationTable from '@/assets/motivation-table.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedSection, AnimatedText, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Motivation = () => {
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const { t } = useLanguage();

  const motivationItems = [
    { nameKey: 'motivation.fix', descKey: 'motivation.fixDesc', icon: DollarSign, path: '/conditions/motivation/fix' },
    { nameKey: 'motivation.variable', descKey: 'motivation.variableDesc', icon: Percent, path: '/conditions/motivation/variable' },
    { nameKey: 'motivation.partner', descKey: 'motivation.partnerDesc', icon: Handshake, path: '/conditions/motivation/partner' },
    { nameKey: 'motivation.services', descKey: 'motivation.servicesDesc', icon: Settings, path: '/conditions/motivation/services' },
    { nameKey: 'motivation.subpartner', descKey: 'motivation.subpartnerDesc', icon: Users, path: '/conditions/motivation/subpartner' },
  ];

  return (
    <PageTransition className="min-h-screen hero-gradient">
      <MobileLayout>
        <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
          <div className="container mx-auto px-6">
            <AnimatedSection variant="fadeLeft">
              <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                {t('conditions.backToConditions')}
              </Link>
            </AnimatedSection>
          
          <div className="max-w-4xl mx-auto">
            <AnimatedSection variant="blurIn" className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-black text-white">
                <span className="text-gradient-gold">
                  <AnimatedText text={t('motivation.title')} />
                </span>
              </h1>
            </AnimatedSection>
            
            <AnimatedSection variant="morphIn" delay={0.2}>
              <CardGlassDark className="p-8" hover>
                <CardGlassDarkHeader icon={DollarSign} title={t('motivation.paymentSystem')} />
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4" staggerDelay={0.08}>
                  {motivationItems.map((item, i) => (
                    <StaggerItem key={i} variant="fadeUp">
                      <Link to={item.path}>
                        <motion.div
                          className="p-4 glass-dark rounded-xl group"
                          whileHover={{ scale: 1.02, y: -3 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <item.icon className="w-5 h-5 text-accent" />
                              <span className="font-semibold text-accent">{t(item.nameKey)}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="text-white/60 text-sm">{t(item.descKey)}</p>
                        </motion.div>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                
                <AnimatedSection variant="scaleUp" delay={0.4}>
                  <motion.div 
                    className="mt-8 p-6 gradient-gold rounded-2xl text-center"
                    whileHover={{ scale: 1.02 }}
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(255,215,0,0)',
                        '0 0 30px 10px rgba(255,215,0,0.2)',
                        '0 0 0 0 rgba(255,215,0,0)'
                      ]
                    }}
                    transition={{ 
                      boxShadow: { duration: 2, repeat: Infinity },
                      scale: { type: 'spring', stiffness: 300 }
                    }}
                  >
                    <p className="text-sm font-semibold text-primary/70 mb-1">{t('motivation.totalIncome')}</p>
                    <p className="text-2xl font-black text-primary">{t('vacancy.salaryValue')}</p>
                  </motion.div>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.5} className="mt-8">
                  <h3 className="text-xl font-bold text-accent mb-4">{t('motivation.tariffCalc')}</h3>
                  <div className="space-y-4">
                    <motion.a 
                      href={tariffTable} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block"
                      whileHover={{ scale: 1.01 }}
                    >
                      <img src={tariffTable} alt="Tariff table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                    </motion.a>
                    <motion.a 
                      href={motivationTable} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block"
                      whileHover={{ scale: 1.01 }}
                    >
                      <img src={motivationTable} alt="Motivation table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                    </motion.a>
                  </div>
                </AnimatedSection>
              </CardGlassDark>
            </AnimatedSection>
          </div>
        </div>
      </main>
    </MobileLayout>
  </PageTransition>
);
};

export default Motivation;