import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Users, GraduationCap, Scale, TrendingUp, Handshake, FolderKanban, Settings, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useOptimizedAnimations } from '@/hooks/useOptimizedAnimations';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Employees = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  
  // Отключаем backdrop-filter на мобильной версии для лучшей производительности
  const mobileOptimizedClass = showMobileNav ? 'mobile-optimized' : '';
  const { 
    cardVariants, 
    containerVariants, 
    itemVariants, 
    iconHover,
    hoverScale,
    shouldAnimate,
    isMobile: isOptMobile,
    duration,
    ease
  } = useOptimizedAnimations();

  const departments = [
    { nameKey: 'employees.trainingDept', icon: GraduationCap },
    { nameKey: 'employees.legalDept', icon: Scale },
    { nameKey: 'employees.salesDept', icon: TrendingUp },
    { nameKey: 'employees.partnerDept', icon: Handshake },
    { nameKey: 'employees.projectDept', icon: FolderKanban },
    { nameKey: 'employees.techDept', icon: Settings },
    { nameKey: 'employees.marketingDept', icon: Megaphone },
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
                <Link to="/work" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                  <ArrowLeft className="w-4 h-4" />
                  {t('work.backToWork')}
                </Link>
              </motion.div>
              
              <div className="max-w-4xl mx-auto">
                <motion.h1 
                  className="text-4xl sm:text-5xl font-black text-white mb-8"
                  initial={shouldAnimate ? { opacity: 0, y: 30 } : undefined}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration, ease }}
                >
                  <span className="text-gradient-gold">{t('employees.title')}</span>
                </motion.h1>
                
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
                      transition={{ duration, delay: 0.3 }}
                    >
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                        whileHover={iconHover}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Users className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('employees.structure')}
                    </motion.h2>
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {departments.map((dept, i) => (
                        <motion.div 
                          key={i} 
                          className="flex items-center gap-4 p-4 glass-dark rounded-xl"
                          variants={itemVariants}
                          whileHover={isOptMobile ? undefined : { ...hoverScale, x: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <motion.div
                            whileHover={isOptMobile ? undefined : { rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <dept.icon className="w-6 h-6 text-accent flex-shrink-0" />
                          </motion.div>
                          <span className="text-white font-medium">{t(dept.nameKey)}</span>
                        </motion.div>
                      ))}
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

export default Employees;
