import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark, CardGlassDarkHeader, CardGlassDarkTitle, CardGlassDarkContent } from '@/components/ui/card';
import { ArrowLeft, Percent, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import tariffTable from '@/assets/tariff-table.jpg';
import motivationTable from '@/assets/motivation-table.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';
import SalaryCalculator from '@/components/salary/SalaryCalculator';

const Variable = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  const calcItemVariants = {
    hidden: { opacity: 0, x: -20, filter: 'blur(5px)' },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.4, delay: 0.3 + i * 0.1 }
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
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <h1 className="text-4xl sm:text-5xl font-black text-white">
                    <span className="text-gradient-gold">{t('variable.title')}</span>
                  </h1>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <CardGlassDark className="p-8 space-y-8" hover>
                    <div>
                      <CardGlassDarkHeader icon={Percent} title={t('variable.variablePremium')} />
                      <CardGlassDarkContent>
                        <p>{t('variable.variablePremiumDesc')}</p>
                      </CardGlassDarkContent>
                    </div>

                    <div>
                      <CardGlassDarkTitle icon={TrendingUp} className="mb-4">
                        {t('variable.howCalculated')}
                      </CardGlassDarkTitle>
                      <div className="space-y-4">
                        {[t('variable.calcDesc1'), t('variable.calcDesc2'), t('variable.calcDesc3')].map((desc, i) => (
                          <motion.div 
                            key={i}
                            className="p-4 glass-dark rounded-xl"
                            custom={i}
                            variants={calcItemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <p className="text-white/70">{desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <motion.div 
                      className="p-6 gradient-gold rounded-2xl text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6, type: 'spring', stiffness: 100 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm font-semibold text-primary/70 mb-1">{t('variable.premiumBased')}</p>
                      <p className="text-xl font-black text-primary">{t('variable.basedOnRevenue')}</p>
                    </motion.div>

                    <div>
                      <h3 className="text-xl font-bold text-accent mb-4">
                        {t('variable.motivationCalc')}
                      </h3>
                      <div className="space-y-4">
                        <motion.a 
                          href={motivationTable} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <img src={motivationTable} alt="Motivation table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                        </motion.a>
                        <motion.a 
                          href={tariffTable} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <img src={tariffTable} alt="Tariff table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                        </motion.a>
                      </div>
                    </div>
                  </CardGlassDark>
                </motion.div>

                {/* Salary Calculator */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-6"
                >
                  <SalaryCalculator />
                </motion.div>
              </div>
            </div>
          </main>
        </PageTransition>
      </MobileLayout>
    </div>
  );
};

export default Variable;
