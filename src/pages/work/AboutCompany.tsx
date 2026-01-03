import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, History, Rocket, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedSection, AnimatedText, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const AboutCompany = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  return (
    <PageTransition className="min-h-screen hero-gradient">
      <MobileLayout>
        <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
          <div className="container mx-auto px-6">
            <AnimatedSection variant="fadeLeft">
              <Link to="/work" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                {t('work.backToWork')}
              </Link>
            </AnimatedSection>
            
            <div className="max-w-4xl mx-auto">
              <AnimatedSection variant="blurIn">
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
                  <span className="text-gradient-gold">
                    <AnimatedText text={t('about.title')} />
                  </span>
                </h1>
              </AnimatedSection>
              
              <AnimatedSection variant="morphIn" delay={0.2}>
                <CardGlassDark className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <motion.span 
                      className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <History className="w-5 h-5 text-primary" />
                    </motion.span>
                    {t('about.history')}
                  </h2>
                  <StaggerContainer className="space-y-6 text-white/70 leading-relaxed" staggerDelay={0.1}>
                    <StaggerItem variant="fadeUp">
                      <p>{t('about.historyText1')}</p>
                    </StaggerItem>
                    
                    <StaggerItem variant="fadeLeft">
                      <motion.div 
                        className="flex items-start gap-4 p-4 glass-dark rounded-xl"
                        whileHover={{ x: 5, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Rocket className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <p>{t('about.academyText')}</p>
                      </motion.div>
                    </StaggerItem>

                    <StaggerItem variant="fadeLeft">
                      <motion.div 
                        className="flex items-start gap-4 p-4 glass-dark rounded-xl"
                        whileHover={{ x: 5, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Award className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <p>{t('about.firstProjectText')}</p>
                      </motion.div>
                    </StaggerItem>

                    <StaggerItem variant="fadeUp">
                      <p>{t('about.flagshipText')}</p>
                    </StaggerItem>

                    <StaggerItem variant="scaleUp">
                      <motion.a 
                        href="https://drive.google.com/file/d/1mcyPf2E2O6p-We319szojHy8aAcYvjh-/view" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-accent hover:underline font-semibold"
                        whileHover={{ x: 5 }}
                      >
                        {t('about.viewCases')}
                      </motion.a>
                    </StaggerItem>
                  </StaggerContainer>
                </CardGlassDark>
              </AnimatedSection>
            </div>
          </div>
        </main>
      </MobileLayout>
    </PageTransition>
  );
};

export default AboutCompany;
