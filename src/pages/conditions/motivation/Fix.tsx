import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Clock, MapPin, Briefcase, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import tariffTable from '@/assets/tariff-table.jpg';
import motivationTable from '@/assets/motivation-table.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedSection, AnimatedText, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';

const Fix = () => {
  const { t } = useLanguage();

  return (
    <PageTransition className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <AnimatedSection variant="fadeLeft">
            <Link to="/conditions/motivation" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              {t('common.backToMotivation')}
            </Link>
          </AnimatedSection>
          
          <div className="max-w-4xl mx-auto">
            <AnimatedSection variant="blurIn" className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-black text-white">
                <span className="text-gradient-gold">
                  <AnimatedText text={t('fix.title')} />
                </span>
              </h1>
            </AnimatedSection>
            
            <AnimatedSection variant="morphIn" delay={0.2}>
              <CardGlassDark className="p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <motion.span 
                      className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <DollarSign className="w-5 h-5 text-primary" />
                    </motion.span>
                    {t('fix.fixedPremium')}
                  </h2>
                  <p className="text-white/80 leading-relaxed">
                    {t('fix.fixedPremiumDesc')} <Link to="/work/reports" className="text-accent hover:underline">{t('fix.reportForDay')}</Link>.
                  </p>
                  <p className="text-white/80 leading-relaxed mt-4">
                    {t('fix.premiumSizeDesc')} <span className="text-accent font-semibold">40-55% {t('fix.fromTariff')}</span>.
                  </p>
                </div>

                <AnimatedSection variant="fadeUp" delay={0.1}>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-accent" />
                    {t('fix.workFormats')}
                  </h3>
                  <StaggerContainer className="grid gap-3" staggerDelay={0.08}>
                    {[
                      { title: 'fix.online', desc: 'fix.onlineDesc' },
                      { title: 'fix.offline', desc: 'fix.offlineDesc' },
                      { title: 'fix.combined', desc: 'fix.combinedDesc' },
                    ].map((item, i) => (
                      <StaggerItem key={i} variant="fadeLeft">
                        <motion.div 
                          className="p-4 glass-dark rounded-xl"
                          whileHover={{ x: 5, scale: 1.01 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <span className="font-semibold text-white">{t(item.title)}</span>
                          <p className="text-white/60 text-sm">{t(item.desc)}</p>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-accent" />
                    {t('fix.employment')}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { title: 'fix.hours4', desc: 'fix.hours4Desc' },
                      { title: 'fix.hours8', desc: 'fix.hours8Desc' },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        className="p-4 glass-dark rounded-xl"
                        whileHover={{ y: -3, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <span className="font-semibold text-white">{t(item.title)}</span>
                        <p className="text-white/60 text-sm">{t(item.desc)}</p>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.3}>
                  <h3 className="text-xl font-bold text-white mb-4">{t('fix.tariffTypes')}</h3>
                  <StaggerContainer className="grid gap-3" staggerDelay={0.08}>
                    {[
                      { title: 'fix.entry', desc: 'fix.entryDesc' },
                      { title: 'fix.cold', desc: 'fix.coldDesc' },
                      { title: 'fix.fromScratch', desc: 'fix.fromScratchDesc' },
                    ].map((item, i) => (
                      <StaggerItem key={i} variant="fadeLeft">
                        <motion.div 
                          className="p-4 glass-dark rounded-xl"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <span className="font-semibold text-accent">{t(item.title)}</span>
                          <p className="text-white/60 text-sm">{t(item.desc)}</p>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.4}>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-accent" />
                    {t('fix.regions')}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { title: 'fix.international', desc: 'fix.internationalDesc' },
                      { title: 'fix.rf', desc: 'fix.rfDesc' },
                      { title: 'fix.cis', desc: 'fix.cisDesc' },
                      { title: 'fix.kz', desc: 'fix.kzDesc' },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        className="p-4 glass-dark rounded-xl"
                        whileHover={{ y: -3 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <span className="font-semibold text-white">{t(item.title)}</span>
                        <p className="text-white/60 text-sm">{t(item.desc)}</p>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>

                <AnimatedSection variant="scaleUp" delay={0.5}>
                  <motion.div 
                    className="p-6 border-2 border-accent/50 rounded-2xl bg-accent/10"
                    animate={{ 
                      borderColor: ['rgba(255,107,107,0.5)', 'rgba(255,107,107,0.8)', 'rgba(255,107,107,0.5)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-accent" />
                      {t('fix.vatTitle')}
                    </h3>
                    <div className="space-y-4 text-white/80">
                      <p className="font-semibold text-accent">{t('fix.vatInfo1')}</p>
                      <p>{t('fix.vatInfo2')}</p>
                      <p>{t('fix.vatInfo3')}</p>
                      
                      <div className="p-4 glass-dark rounded-xl">
                        <p className="font-semibold text-white mb-2">{t('fix.vatExample')}</p>
                        <ul className="space-y-2 text-sm">
                          <li>• {t('fix.vatExampleItem1')}</li>
                          <li>• {t('fix.vatExampleItem2')} <span className="text-accent font-semibold">126 000 руб</span></li>
                          <li>• {t('fix.vatExampleItem3')}</li>
                          <li>• {t('fix.vatExampleItem4')} <span className="text-accent font-semibold">120к</span></li>
                          <li>• {t('fix.vatExampleItem5')}</li>
                          <li>• {t('fix.vatExampleItem6')}</li>
                        </ul>
                      </div>
                      
                      <p className="text-sm italic">{t('fix.vatNote')}</p>
                      <p className="text-sm text-accent">{t('fix.vatPs')}</p>
                    </div>
                  </motion.div>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.6}>
                  <h3 className="text-xl font-bold text-white mb-4">{t('fix.tariffGrid')}</h3>
                  <div className="space-y-4">
                    <motion.a 
                      href={tariffTable} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block"
                      whileHover={{ scale: 1.01 }}
                    >
                      <img src={tariffTable} alt="Tariff table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                    </motion.a>
                    <motion.a 
                      href={motivationTable} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block"
                      whileHover={{ scale: 1.01 }}
                    >
                      <img src={motivationTable} alt="Motivation table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                    </motion.a>
                  </div>
                </AnimatedSection>
              </CardGlassDark>
            </AnimatedSection>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Fix;
