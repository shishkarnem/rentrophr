import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark, CardGlassDarkHeader, CardGlassDarkContent } from '@/components/ui/card';
import { ArrowLeft, Wallet, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useOptimizedAnimations } from '@/hooks/useOptimizedAnimations';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Payments = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  
  const mobileOptimizedClass = showMobileNav ? 'mobile-optimized' : '';
  const { 
    cardVariants, 
    scaleVariants, 
    iconSpin, 
    hoverLift,
    shouldAnimate,
    isMobile: isOptMobile,
    duration,
    ease
  } = useOptimizedAnimations();

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
                <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                  <ArrowLeft className="w-4 h-4" />
                  {t('conditions.backToConditions')}
                </Link>
              </motion.div>
              
              <div className="max-w-4xl mx-auto">
                <motion.h1 
                  className="text-4xl sm:text-5xl font-black text-white mb-8"
                  initial={shouldAnimate ? { opacity: 0, y: 30 } : undefined}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration, ease }}
                >
                  <span className="text-gradient-gold">{t('payments.title')}</span>
                </motion.h1>
                
                <motion.div
                  custom={0}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CardGlassDark className="p-8" hover>
                    <CardGlassDarkHeader icon={Wallet} title={t('payments.schedule')} />
                    <CardGlassDarkContent>
                      <p>{t('payments.scheduleDesc')}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <motion.div 
                          className="p-6 glass-dark rounded-xl text-center"
                          custom={0}
                          variants={scaleVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={isOptMobile ? undefined : hoverLift}
                        >
                          <motion.div 
                            className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center mx-auto mb-3"
                            whileHover={isOptMobile ? undefined : iconSpin}
                          >
                            <Calendar className="w-6 h-6 text-primary" />
                          </motion.div>
                          <p className="text-2xl font-bold text-accent mb-1">{t('payments.day30')}</p>
                          <p className="text-sm text-white/60">{t('payments.day30Desc')}</p>
                        </motion.div>
                        
                        <motion.div 
                          className="p-6 glass-dark rounded-xl text-center"
                          custom={1}
                          variants={scaleVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={isOptMobile ? undefined : hoverLift}
                        >
                          <motion.div 
                            className="w-12 h-12 rounded-full gradient-cta flex items-center justify-center mx-auto mb-3"
                            whileHover={isOptMobile ? undefined : iconSpin}
                          >
                            <CreditCard className="w-6 h-6 text-white" />
                          </motion.div>
                          <p className="text-2xl font-bold text-accent mb-1">{t('payments.day15')}</p>
                          <p className="text-sm text-white/60">{t('payments.day15Desc')}</p>
                        </motion.div>
                      </div>
                    </CardGlassDarkContent>
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

export default Payments;