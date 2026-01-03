import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Settings, Users, Wallet, FileText, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Services = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  const services = [
    t('services.hiring'),
    t('services.automation'),
    t('services.scripts'),
    t('services.accounting'),
    t('services.other')
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: -20, filter: 'blur(5px)' },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.4, delay: 0.2 + i * 0.08 }
    })
  };

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
                  <span className="text-gradient-gold">{t('services.title')}</span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <CardGlassDark className="p-8 space-y-8">
                    <motion.div 
                      className="p-6 gradient-gold rounded-2xl text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-2xl font-black text-primary">{t('services.officialSidejob')}</p>
                      <p className="text-primary/80 mt-2">{t('services.officialSidejobDesc')}</p>
                    </motion.div>

                    <div>
                      <motion.h2 
                        className="text-2xl font-bold text-white mb-4 flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                      >
                        <motion.span 
                          className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Settings className="w-5 h-5 text-primary" />
                        </motion.span>
                        {t('services.whatServices')}
                      </motion.h2>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {services.map((service, i) => (
                          <motion.div 
                            key={i} 
                            className="p-4 glass-dark rounded-xl"
                            custom={i}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <span className="font-semibold text-white">{i + 1}. {service}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <motion.h3 
                        className="text-xl font-bold text-white mb-4 flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Users className="w-5 h-5 text-accent" />
                        {t('services.toWhom')}
                      </motion.h3>
                      <div className="grid gap-3">
                        {[t('services.newClients'), t('services.existingClients'), t('services.helpRops')].map((item, i) => (
                          <motion.div 
                            key={i}
                            className="p-4 glass-dark rounded-xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.55 + i * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                          >
                            <span className="font-semibold text-white">{i + 1}. {item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <motion.h3 
                        className="text-xl font-bold text-white mb-4 flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.65 }}
                      >
                        <Wallet className="w-5 h-5 text-accent" />
                        {t('services.atWhoseExpense')}
                      </motion.h3>
                      <div className="grid gap-3">
                        {[t('services.expense1'), t('services.expense2'), t('services.expense3')].map((item, i) => (
                          <motion.div 
                            key={i}
                            className="p-4 glass-dark rounded-xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                          >
                            <span className="text-white/80">{i + 1}. {item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <motion.h3 
                        className="text-xl font-bold text-white mb-4 flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <FileText className="w-5 h-5 text-accent" />
                        {t('services.howPriceAgreed')}
                      </motion.h3>
                      <div className="space-y-3">
                        <motion.div 
                          className="p-4 glass-dark rounded-xl"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.85 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <p className="text-white/80">
                            1. {t('services.priceDesc1')} <span className="text-accent font-semibold">{t('services.priceRange')}</span> {t('services.priceDesc1End')}
                          </p>
                        </motion.div>
                        <motion.div 
                          className="p-4 glass-dark rounded-xl"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <p className="text-white/80">2. {t('services.priceDesc2')}</p>
                        </motion.div>
                        <motion.div 
                          className="p-4 glass-dark rounded-xl"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.95 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <p className="text-white/80">3. {t('services.priceDesc3')}</p>
                        </motion.div>
                      </div>
                    </div>

                    <div>
                      <motion.h3 
                        className="text-xl font-bold text-white mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        {t('services.howMuchPay')}
                      </motion.h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <motion.div 
                          className="p-4 glass-dark rounded-xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.05 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <p className="text-white/80">{t('services.payLtv')}</p>
                        </motion.div>
                        <motion.div 
                          className="p-4 glass-dark rounded-xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <p className="text-white/80">{t('services.payOneTime')} <span className="text-accent font-semibold">{t('services.payOneTimePercent')}</span> {t('services.payOneTimeEnd')}</p>
                        </motion.div>
                      </div>
                    </div>

                    <div>
                      <motion.h3 
                        className="text-xl font-bold text-white mb-4 flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.15 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                          <Star className="w-5 h-5 text-accent" />
                        </motion.div>
                        {t('services.ps')}
                      </motion.h3>
                      <motion.div 
                        className="p-4 glass-dark rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <p className="text-white/80">{t('services.psDesc')}</p>
                      </motion.div>
                    </div>
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

export default Services;
