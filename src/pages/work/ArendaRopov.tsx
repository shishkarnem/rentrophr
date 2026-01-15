import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark, CardGlassDarkHeader, CardGlassDarkContent, CardGlassDarkSubtitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Percent, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedSection, AnimatedText, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const ArendaRopov = () => {
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
                    <AnimatedText text={t('arenda.title')} />
                  </span>
                </h1>
              </AnimatedSection>
              
              <StaggerContainer className="space-y-8" staggerDelay={0.15}>
                <StaggerItem variant="fadeUp">
                  <CardGlassDark className="p-8" hover>
                    <CardGlassDarkHeader 
                      icon={Building2} 
                      title={t('arenda.product')} 
                    />
                    <CardGlassDarkContent>
                      <CardGlassDarkSubtitle>{t('arenda.productTitle')}</CardGlassDarkSubtitle>
                      <p>{t('arenda.productDesc')}</p>
                    </CardGlassDarkContent>
                  </CardGlassDark>
                </StaggerItem>

                <StaggerItem variant="fadeUp">
                  <CardGlassDark className="p-8" hover>
                    <CardGlassDarkHeader 
                      icon={DollarSign} 
                      title={t('arenda.payment')} 
                    />
                    <CardGlassDarkContent>
                      <p>{t('arenda.paymentDesc')}</p>
                      <ul className="space-y-4">
                        <motion.li 
                          className="flex gap-3"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <span className="text-accent font-bold">1.</span>
                          <div>
                            <Link to="/conditions/motivation" className="text-accent hover:underline font-semibold">{t('arenda.fixedPremium')}</Link> {t('arenda.fixedPremiumDesc')}
                          </div>
                        </motion.li>
                        <motion.li 
                          className="flex gap-3"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <span className="text-accent font-bold">2.</span>
                          <div>
                            <Link to="/conditions/motivation" className="text-accent hover:underline font-semibold">{t('arenda.variablePremium')}</Link> {t('arenda.variablePremiumDesc')}
                          </div>
                        </motion.li>
                      </ul>
                    </CardGlassDarkContent>
                  </CardGlassDark>
                </StaggerItem>

                <StaggerItem variant="fadeUp">
                  <CardGlassDark className="p-8" hover>
                    <CardGlassDarkHeader 
                      icon={Percent} 
                      title={t('arenda.variablePart')} 
                    />
                    <CardGlassDarkContent>
                      <p>{t('arenda.variablePartDesc1')}</p>
                      <p>{t('arenda.variablePartDesc2')}</p>
                      <p>{t('arenda.variablePartDesc3')}</p>
                      <p className="mt-4">
                        {t('arenda.moreDetails')}{' '}
                        <a href="https://arenda-ropa.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                          arenda-ropa.com
                        </a>
                      </p>
                    </CardGlassDarkContent>
                  </CardGlassDark>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </main>
      </MobileLayout>
    </PageTransition>
  );
};

export default ArendaRopov;