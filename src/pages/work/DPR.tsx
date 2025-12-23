import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, UserCheck, MessageSquare, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedSection, AnimatedText, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';

const DPR = () => {
  const { t } = useLanguage();

  return (
    <PageTransition className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
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
                  <AnimatedText text={t('dpr.title')} />
                </span>
              </h1>
            </AnimatedSection>
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <p className="text-xl text-white/70 mb-8">{t('dpr.subtitle')}</p>
            </AnimatedSection>
            
            <StaggerContainer className="space-y-8" staggerDelay={0.15}>
              <StaggerItem variant="fadeUp">
                <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <CardGlassDark className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <UserCheck className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('dpr.mentorship')}
                    </h2>
                    <div className="space-y-4 text-white/70 leading-relaxed">
                      <p>{t('dpr.mentorshipDesc')}</p>
                    </div>
                  </CardGlassDark>
                </motion.div>
              </StaggerItem>

              <StaggerItem variant="fadeUp">
                <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <CardGlassDark className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('dpr.support')}
                    </h2>
                    <div className="space-y-4 text-white/70 leading-relaxed">
                      <p>{t('dpr.supportDesc')}</p>
                    </div>
                  </CardGlassDark>
                </motion.div>
              </StaggerItem>

              <StaggerItem variant="fadeUp">
                <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <CardGlassDark className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <Target className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('dpr.weeklyMeetings')}
                    </h2>
                    <div className="space-y-4 text-white/70 leading-relaxed">
                      <p>{t('dpr.weeklyMeetingsDesc')}</p>
                    </div>
                  </CardGlassDark>
                </motion.div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default DPR;
