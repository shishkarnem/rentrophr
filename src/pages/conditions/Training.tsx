import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, GraduationCap, BookOpen, CheckCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const Training = () => {
  const { t } = useLanguage();

  const trainingStages = [
    { num: 1, titleKey: 'training.stage1' },
    { num: 2, titleKey: 'training.stage2' },
    { num: 3, titleKey: 'training.stage3' },
    { num: 4, titleKey: 'training.stage4' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }
    })
  };

  const stageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: 45 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.5, delay: 0.4 + i * 0.1, type: 'spring', stiffness: 100 }
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
                <span className="text-gradient-gold">{t('training.title')}</span>
              </motion.h1>
              
              <div className="space-y-8">
                <motion.div
                  custom={0}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CardGlassDark className="p-8">
                    <motion.h2 
                      className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('training.stepByStep')}
                    </motion.h2>
                    <div className="space-y-4 text-white/70 leading-relaxed">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {t('training.stepByStepDesc')}
                      </motion.p>
                    </div>

                    <motion.h3 
                      className="text-lg font-semibold text-white mt-8 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                    >
                      {t('training.stages')}
                    </motion.h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {trainingStages.map((stage, i) => (
                        <motion.div 
                          key={stage.num} 
                          className="p-4 glass-dark rounded-xl text-center"
                          custom={i}
                          variants={stageVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ 
                            scale: 1.05, 
                            y: -5,
                            transition: { type: 'spring', stiffness: 400 }
                          }}
                        >
                          <motion.div 
                            className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center mx-auto mb-2"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <span className="text-primary font-bold">{stage.num}</span>
                          </motion.div>
                          <p className="text-sm text-white font-medium">{t(stage.titleKey)}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardGlassDark>
                </motion.div>

                <motion.div
                  custom={1}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CardGlassDark className="p-8">
                    <motion.h2 
                      className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.35 }}
                    >
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Send className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('training.group')}
                    </motion.h2>
                    <div className="space-y-4 text-white/70 leading-relaxed">
                      <p>
                        {t('training.groupDesc1')}{' '}
                        <motion.a 
                          href="https://t.me/+VROkOiW7pJfh5YV5" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-accent hover:underline font-semibold"
                          whileHover={{ scale: 1.05 }}
                        >
                          {t('training.groupName')}
                        </motion.a>
                      </p>
                      <p>{t('training.groupDesc2')}</p>
                    </div>
                  </CardGlassDark>
                </motion.div>

                <motion.div
                  custom={2}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CardGlassDark className="p-8">
                    <motion.h2 
                      className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <BookOpen className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('training.knowledgeBase')}
                    </motion.h2>
                    <div className="space-y-4 text-white/70 leading-relaxed">
                      <p>{t('training.knowledgeBaseDesc1')}</p>
                      <p>{t('training.knowledgeBaseDesc2')}</p>
                      <motion.div 
                        className="flex items-start gap-3 p-4 glass-dark rounded-xl"
                        whileHover={{ scale: 1.02, x: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <p>{t('training.accessNote')}</p>
                      </motion.div>
                    </div>
                  </CardGlassDark>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Training;
