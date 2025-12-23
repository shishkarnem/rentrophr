import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Wallet, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const Payments = () => {
  const { t } = useLanguage();

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
              <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                {t('conditions.backToConditions')}
              </Link>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <motion.h1 
                className="text-4xl sm:text-5xl font-black text-white mb-8"
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span className="text-gradient-gold">{t('payments.title')}</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <CardGlassDark className="p-8">
                  <motion.h2 
                    className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <motion.span 
                      className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Wallet className="w-5 h-5 text-primary" />
                    </motion.span>
                    {t('payments.schedule')}
                  </motion.h2>
                  <div className="space-y-6 text-white/70 leading-relaxed">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {t('payments.scheduleDesc')}
                    </motion.p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div 
                        className="p-6 glass-dark rounded-xl text-center"
                        initial={{ opacity: 0, y: 30, rotateY: 45 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        transition={{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 100 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -5,
                          transition: { type: 'spring', stiffness: 400 }
                        }}
                      >
                        <motion.div 
                          className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center mx-auto mb-3"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Calendar className="w-6 h-6 text-primary" />
                        </motion.div>
                        <p className="text-2xl font-bold text-white mb-1">{t('payments.day30')}</p>
                        <p className="text-sm">{t('payments.day30Desc')}</p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-6 glass-dark rounded-xl text-center"
                        initial={{ opacity: 0, y: 30, rotateY: -45 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        transition={{ duration: 0.6, delay: 0.6, type: 'spring', stiffness: 100 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -5,
                          transition: { type: 'spring', stiffness: 400 }
                        }}
                      >
                        <motion.div 
                          className="w-12 h-12 rounded-full gradient-cta flex items-center justify-center mx-auto mb-3"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <CreditCard className="w-6 h-6 text-white" />
                        </motion.div>
                        <p className="text-2xl font-bold text-white mb-1">{t('payments.day15')}</p>
                        <p className="text-sm">{t('payments.day15Desc')}</p>
                      </motion.div>
                    </div>
                  </div>
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

export default Payments;
