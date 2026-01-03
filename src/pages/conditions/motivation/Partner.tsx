import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Handshake, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Partner = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  return (
    <div className="min-h-screen hero-gradient">
      <MobileLayout>
        <PageTransition>
          <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Link to="/conditions/motivation" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                  <ArrowLeft className="w-4 h-4" />
                  {t('common.backToMotivation')}
                </Link>
              </motion.div>
              
              <div className="max-w-4xl mx-auto">
                <motion.h1 
                  className="text-4xl sm:text-5xl font-black text-white mb-8"
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <span className="text-gradient-gold">{t('partner.title')}</span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <CardGlassDark className="p-8 space-y-8">
                    <div>
                      <motion.h2 
                        className="text-2xl font-bold text-white mb-4 flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <motion.span 
                          className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Handshake className="w-5 h-5 text-primary" />
                        </motion.span>
                        {t('partner.program')}
                      </motion.h2>
                      <motion.p 
                        className="text-white/80 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {t('partner.programDesc')}
                      </motion.p>
                    </div>

                    <motion.div 
                      className="p-6 gradient-gold rounded-2xl text-center"
                      initial={{ opacity: 0, scale: 0.9, rotateX: 45 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                      transition={{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 100 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <p className="text-sm font-semibold text-primary/70 mb-1">{t('partner.rewardSize')}</p>
                      <motion.p 
                        className="text-3xl font-black text-primary"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                      >
                        {t('partner.rewardPercent')}
                      </motion.p>
                      <p className="text-sm text-primary/70 mt-2">{t('partner.rewardDuration')}</p>
                    </motion.div>

                    <motion.div 
                      className="p-4 glass-dark rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <p className="text-white/80">
                        {t('partner.paymentDetails')}{' '}
                        <motion.a 
                          href="https://t.me/+4-EaFu0bCbw5YTY6" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline inline-flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                        >
                          {t('partner.telegramChannel')}
                          <ExternalLink className="w-4 h-4" />
                        </motion.a>
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

export default Partner;
