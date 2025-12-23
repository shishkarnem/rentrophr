import { CardGlassDark } from '@/components/ui/card';
import { Target, CheckCircle2, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedText, StaggerContainer, StaggerItem, Magnetic } from '@/components/ui/AnimatedSection';

const VacancySection = () => {
  const { t } = useLanguage();

  const responsibilities = [
    t('vacancy.resp1'),
    t('vacancy.resp2'),
    t('vacancy.resp3'),
    t('vacancy.resp4'),
    t('vacancy.resp5'),
    t('vacancy.resp6'),
  ];

  const requirements = [
    t('vacancy.req1'),
    t('vacancy.req2'),
    t('vacancy.req3'),
    t('vacancy.req4'),
    t('vacancy.req5'),
  ];

  const benefits = [
    t('vacancy.ben1'),
    t('vacancy.ben2'),
    t('vacancy.ben3'),
    t('vacancy.ben4'),
    t('vacancy.ben5'),
  ];

  return (
    <section id="vacancy" className="py-24 hero-gradient overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <AnimatedSection variant="blurIn" className="mb-16 text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              <AnimatedText text={t('vacancy.title')} delay={0.1} />
            </h2>
            <motion.div 
              className="h-1 w-24 gradient-gold mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - left side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Responsibilities */}
              <AnimatedSection variant="fadeLeft" delay={0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <CardGlassDark className="p-10">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Target className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('vacancy.yourTasks')}
                    </h3>
                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6" staggerDelay={0.08}>
                      {responsibilities.map((item, i) => (
                        <StaggerItem key={i} variant="fadeUp">
                          <motion.li 
                            className="flex gap-4 text-white/70 text-sm leading-relaxed group list-none"
                            whileHover={{ x: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <motion.div 
                              className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-accent"
                              whileHover={{ scale: 2 }}
                            />
                            {item}
                          </motion.li>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </CardGlassDark>
                </motion.div>
              </AnimatedSection>

              {/* Requirements */}
              <AnimatedSection variant="fadeLeft" delay={0.2}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <CardGlassDark className="p-10">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </motion.span>
                      {t('vacancy.whatWeExpect')}
                    </h3>
                    <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                      {requirements.map((item, i) => (
                        <StaggerItem key={i} variant="fadeUp">
                          <motion.li 
                            className="flex gap-4 text-white/70 text-sm leading-relaxed group list-none"
                            whileHover={{ x: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <motion.div 
                              className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-accent"
                              whileHover={{ scale: 2 }}
                            />
                            {item}
                          </motion.li>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </CardGlassDark>
                </motion.div>
              </AnimatedSection>
            </div>

            {/* Sidebar - right side */}
            <div className="space-y-8">
              {/* Benefits card */}
              <AnimatedSection variant="fadeRight" delay={0.3}>
                <Magnetic>
                  <CardGlassDark className="p-8 sticky top-28">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <motion.span 
                        className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center"
                        animate={{ 
                          boxShadow: [
                            '0 0 0 0 rgba(255,107,107,0)',
                            '0 0 20px 5px rgba(255,107,107,0.3)',
                            '0 0 0 0 rgba(255,107,107,0)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Gift className="w-5 h-5 text-white" />
                      </motion.span>
                      {t('vacancy.whatYouGet')}
                    </h3>
                    <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                      {benefits.map((item, i) => (
                        <StaggerItem key={i} variant="elasticIn">
                          <motion.li 
                            className="flex gap-3 text-sm leading-relaxed group list-none"
                            whileHover={{ x: 5, scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <motion.span 
                              className="text-accent font-bold"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              ✓
                            </motion.span>
                            <span className="text-white/70">{item}</span>
                          </motion.li>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>

                    {/* Salary highlight */}
                    <motion.div 
                      className="mt-8 p-6 gradient-gold rounded-2xl text-center"
                      whileHover={{ scale: 1.03 }}
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 rgba(255,215,0,0)',
                          '0 0 30px 10px rgba(255,215,0,0.2)',
                          '0 0 0 0 rgba(255,215,0,0)'
                        ]
                      }}
                      transition={{ 
                        boxShadow: { duration: 2, repeat: Infinity },
                        scale: { type: 'spring', stiffness: 300 }
                      }}
                    >
                      <p className="text-sm font-semibold text-primary/70 mb-1">{t('vacancy.salary')}</p>
                      <p className="text-2xl font-black text-primary">{t('vacancy.salaryValue')}</p>
                    </motion.div>
                  </CardGlassDark>
                </Magnetic>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VacancySection;
