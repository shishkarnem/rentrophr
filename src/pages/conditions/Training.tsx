import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, GraduationCap, BookOpen, CheckCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useOptimizedAnimations } from '@/hooks/useOptimizedAnimations';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Training = () => {
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
    ease,
    staggerDelay
  } = useOptimizedAnimations();

  const trainingStages = [
    { num: 1, titleKey: 'training.stage1' },
    { num: 2, titleKey: 'training.stage2' },
    { num: 3, titleKey: 'training.stage3' },
    { num: 4, titleKey: 'training.stage4' },
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
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration, delay: 0.2 }}
                      >
                        <motion.span 
                          className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                          whileHover={iconHover}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <GraduationCap className="w-5 h-5 text-primary" />
                        </motion.span>
                        {t('training.stepByStep')}
                      </motion.h2>
                      <div className="space-y-4 text-white/70 leading-relaxed">
                        <motion.p
                          initial={shouldAnimate ? { opacity: 0 } : undefined}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {t('training.stepByStepDesc')}
                        </motion.p>
                      </div>

                      <motion.h3 
                        className="text-lg font-semibold text-white mt-8 mb-4"
                        initial={shouldAnimate ? { opacity: 0 } : undefined}
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
                            variants={scaleVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={isOptMobile ? undefined : hoverLift}
                          >
                            <motion.div 
                              className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center mx-auto mb-2"
                              whileHover={isOptMobile ? undefined : { rotate: 360 }}
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
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration, delay: 0.35 }}
                      >
                        <motion.span 
                          className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                          whileHover={iconHover}
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
                            whileHover={isOptMobile ? undefined : { scale: 1.05 }}
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
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration, delay: 0.5 }}
                      >
                        <motion.span 
                          className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                          whileHover={iconHover}
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
                          whileHover={isOptMobile ? undefined : hoverScale}
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
      </MobileLayout>
    </div>
  );
};

export default Training;
