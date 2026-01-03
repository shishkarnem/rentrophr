import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Users, Send, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS } from '@/constants/vacancy';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedSection, AnimatedText, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Community = () => {
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
                    <AnimatedText text={t('community.title')} />
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
                      <Users className="w-5 h-5 text-primary" />
                    </motion.span>
                    {t('community.heading')}
                  </h2>
                  <div className="space-y-6 text-white/70 leading-relaxed">
                    <AnimatedSection variant="fadeUp" delay={0.3}>
                      <p>{t('community.desc')}</p>
                    </AnimatedSection>
                    
                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4" staggerDelay={0.1}>
                      <StaggerItem variant="elasticIn">
                        <motion.a 
                          href={SOCIAL_LINKS.telegram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-3 p-4 glass-dark rounded-xl group"
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Send className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-white">Telegram</span>
                        </motion.a>
                      </StaggerItem>
                      <StaggerItem variant="elasticIn">
                        <motion.a 
                          href={SOCIAL_LINKS.vk} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-3 p-4 glass-dark rounded-xl group"
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.006-1.498-1.143-1.753-1.143-.356 0-.458.102-.458.591v1.561c0 .422-.133.676-1.252.676-1.844 0-3.896-1.117-5.336-3.199-2.164-3.045-2.759-5.336-2.759-5.8 0-.254.102-.491.591-.491h1.744c.44 0 .608.203.778.676.846 2.454 2.27 4.608 2.861 4.608.22 0 .322-.102.322-.66V9.721c-.068-1.186-.692-1.287-.692-1.71 0-.203.169-.406.44-.406h2.743c.372 0 .508.203.508.642v3.455c0 .372.169.508.271.508.22 0 .407-.136.813-.542 1.261-1.406 2.164-3.572 2.164-3.572.119-.254.321-.491.761-.491h1.744c.525 0 .644.27.525.642-.22 1.015-2.37 4.051-2.37 4.051-.186.305-.254.44 0 .779.186.254.778.779 1.186 1.253.744.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/>
                          </svg>
                          <span className="font-semibold text-white">VK</span>
                        </motion.a>
                      </StaggerItem>
                      <StaggerItem variant="elasticIn">
                        <motion.a 
                          href={SOCIAL_LINKS.youtube} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-3 p-4 glass-dark rounded-xl group"
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Youtube className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-white">YouTube</span>
                        </motion.a>
                      </StaggerItem>
                    </StaggerContainer>
                  </div>
                </CardGlassDark>
              </AnimatedSection>
            </div>
          </div>
        </main>
      </MobileLayout>
    </PageTransition>
  );
};

export default Community;
