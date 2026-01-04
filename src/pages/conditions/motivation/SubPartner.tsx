import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Users, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useOptimizedAnimations } from '@/hooks/useOptimizedAnimations';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const SubPartner = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  
  // Отключаем backdrop-filter на мобильной версии для лучшей производительности
  const mobileOptimizedClass = showMobileNav ? 'mobile-optimized' : '';
  const { 
    cardVariants, 
    scaleVariants, 
    iconHover,
    hoverLift,
    hoverScale,
    shouldAnimate,
    isMobile: isOptMobile,
    duration,
    ease
  } = useOptimizedAnimations();

  const bonuses = [
    { title: t('subpartner.additionalLicenses'), desc: t('subpartner.additionalLicensesDesc') },
    { title: t('subpartner.bonusMonths'), desc: t('subpartner.bonusMonthsDesc') },
  ];

  return (
    <div className={`min-h-screen hero-gradient ${mobileOptimizedClass}`}>
      <MobileLayout>
        <PageTransition>
          <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
            <div className="container mx-auto px-6">
              <motion.div
                initial={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: duration * 0.8 }}
              >
                <Link to="/conditions/motivation" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                  <ArrowLeft className="w-4 h-4" />
                  {t('common.backToMotivation')}
                </Link>
              </motion.div>
              
              <div className="max-w-4xl mx-auto">
                <motion.h1 
                  className="text-4xl sm:text-5xl font-black text-white mb-8"
                  initial={shouldAnimate ? { opacity: 0, y: 30 } : undefined}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration, ease }}
                >
                  <span className="text-gradient-gold">{t('subpartner.title')}</span>
                </motion.h1>
                
                <motion.div
                  custom={0}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CardGlassDark className="p-8 space-y-8">
                    <div>
                      <motion.h2 
                        className="text-2xl font-bold text-white mb-4 flex items-center gap-3"
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration, delay: 0.3 }}
                      >
                        <motion.span 
                          className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                          whileHover={iconHover}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Users className="w-5 h-5 text-primary" />
                        </motion.span>
                        {t('subpartner.amoPartnership')}
                      </motion.h2>
                      <motion.p 
                        className="text-white/80 leading-relaxed"
                        initial={shouldAnimate ? { opacity: 0 } : undefined}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {t('subpartner.amoDesc')} <span className="text-accent font-semibold">{t('subpartner.amoPercent')}</span>.
                      </motion.p>
                    </div>

                    <motion.div 
                      className="p-6 gradient-gold rounded-2xl text-center"
                      custom={0}
                      variants={scaleVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={isOptMobile ? undefined : hoverLift}
                    >
                      <p className="text-sm font-semibold text-primary/70 mb-1">{t('subpartner.additionalEarnings')}</p>
                      <motion.p 
                        className="text-3xl font-black text-primary"
                        initial={shouldAnimate ? { scale: 0.5 } : undefined}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                      >
                        20%
                      </motion.p>
                      <p className="text-sm text-primary/70 mt-2">{t('subpartner.fromDifference')}</p>
                    </motion.div>

                    <div>
                      <motion.h3 
                        className="text-xl font-bold text-white mb-4 flex items-center gap-3"
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration, delay: 0.5 }}
                      >
                        <motion.div
                          animate={isOptMobile ? undefined : { scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Gift className="w-5 h-5 text-accent" />
                        </motion.div>
                        {t('subpartner.clientBonuses')}
                      </motion.h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {bonuses.map((item, i) => (
                          <motion.div 
                            key={i}
                            className="p-4 glass-dark rounded-xl"
                            custom={i + 1}
                            variants={scaleVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={isOptMobile ? undefined : hoverLift}
                          >
                            <span className="font-semibold text-white">{item.title}</span>
                            <p className="text-white/60 text-sm">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <motion.div 
                      className="p-4 glass-dark rounded-xl"
                      initial={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={isOptMobile ? undefined : hoverScale}
                    >
                      <p className="text-white/80">
                        {t('subpartner.otherSystems')} <span className="text-accent font-semibold">{t('subpartner.systemsCount')}</span> {t('subpartner.systemsEnd')}
                      </p>
                    </motion.div>
                  </CardGlassDark>
                </motion.div>
              </div>
            </div>
          </main>
        </PageTransition>
      </MobileLayout>
    </div>
  );
};

export default SubPartner;
