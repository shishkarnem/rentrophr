import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Users, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const SubPartner = () => {
  const { t } = useLanguage();

  const bonusVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, delay: 0.5 + i * 0.15, type: 'spring', stiffness: 100 }
    })
  };

  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <PageTransition>
        <main className="pt-24 pb-16">
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
                <span className="text-gradient-gold">{t('subpartner.title')}</span>
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
                        <Users className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('subpartner.amoPartnership')}
                    </motion.h2>
                    <motion.p 
                      className="text-white/80 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {t('subpartner.amoDesc')} <span className="text-accent font-semibold">{t('subpartner.amoPercent')}</span>.
                    </motion.p>
                  </div>

                  <motion.div 
                    className="p-6 gradient-gold rounded-2xl text-center"
                    initial={{ opacity: 0, scale: 0.9, rotateX: 45 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ duration: 0.6, delay: 0.45, type: 'spring', stiffness: 100 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <p className="text-sm font-semibold text-primary/70 mb-1">{t('subpartner.additionalEarnings')}</p>
                    <motion.p 
                      className="text-3xl font-black text-primary"
                      initial={{ scale: 0.5 }}
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Gift className="w-5 h-5 text-accent" />
                      </motion.div>
                      {t('subpartner.clientBonuses')}
                    </motion.h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { title: t('subpartner.additionalLicenses'), desc: t('subpartner.additionalLicensesDesc') },
                        { title: t('subpartner.bonusMonths'), desc: t('subpartner.bonusMonthsDesc') },
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          className="p-4 glass-dark rounded-xl"
                          custom={i}
                          variants={bonusVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ scale: 1.03, y: -3 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <span className="font-semibold text-white">{item.title}</span>
                          <p className="text-white/60 text-sm">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div 
                    className="p-4 glass-dark rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02, x: 5 }}
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
      <Footer />
    </div>
  );
};

export default SubPartner;
