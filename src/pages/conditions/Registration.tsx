import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark, CardGlassDarkHeader, CardGlassDarkContent } from '@/components/ui/card';
import { ArrowLeft, FileCheck, Download, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';
const Registration = () => {
  const {
    t
  } = useLanguage();
  const {
    isTelegram
  } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: 'blur(10px)'
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        delay: i * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    })
  };
  const stepVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: 0.5 + i * 0.1
      }
    })
  };
  return <div className="min-h-screen hero-gradient">
      <MobileLayout>
        <PageTransition>
          <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
            <div className="container mx-auto px-6">
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.4
            }}>
                <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                  <ArrowLeft className="w-4 h-4" />
                  {t('conditions.backToConditions')}
                </Link>
              </motion.div>
              
              <div className="max-w-4xl mx-auto">
                <motion.h1 className="text-4xl sm:text-5xl font-black text-white mb-8" initial={{
                opacity: 0,
                y: 30,
                filter: 'blur(10px)'
              }} animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)'
              }} transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}>
                  <span className="text-gradient-gold">{t('registration.title')}</span>
                </motion.h1>
                
                <div className="space-y-8">
                  <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                    <CardGlassDark className="p-8" hover>
                      <CardGlassDarkHeader icon={FileCheck} title={t('registration.contractTerms')} />
                      <CardGlassDarkContent>
                        <p>{t('registration.contractDesc1')}</p>
                        
                        <motion.div className="p-4 glass-dark rounded-xl" whileHover={{
                        scale: 1.02,
                        x: 5
                      }} transition={{
                        type: 'spring',
                        stiffness: 400
                      }}>
                          <p className="font-semibold text-accent mb-2">{t('registration.tkContract')}</p>
                          <p className="text-white/70">{t('registration.tkContractDesc')}</p>
                          <ul className="mt-2 space-y-1">
                            <motion.li className="flex gap-2 text-white/70" initial={{
                            opacity: 0,
                            x: -10
                          }} animate={{
                            opacity: 1,
                            x: 0
                          }} transition={{
                            delay: 0.4
                          }}>
                              <span className="text-accent">•</span>
                              26% — {t('registration.kzTax')}
                            </motion.li>
                            <motion.li className="flex gap-2 text-white/70" initial={{
                            opacity: 0,
                            x: -10
                          }} animate={{
                            opacity: 1,
                            x: 0
                          }} transition={{
                            delay: 0.5
                          }}>
                              <span className="text-accent">•</span>
                              43% — {t('registration.rfTax')}
                            </motion.li>
                          </ul>
                        </motion.div>
                      </CardGlassDarkContent>
                    </CardGlassDark>
                  </motion.div>

                  <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
                    <CardGlassDark className="p-8" hover>
                      <CardGlassDarkHeader icon={Download} title={t('registration.downloadContracts')} />
                      <div className="space-y-4">
                        <motion.div className="p-4 glass-dark rounded-xl" whileHover={{
                        scale: 1.02
                      }} transition={{
                        type: 'spring',
                        stiffness: 400
                      }}>
                          <div className="flex items-center gap-3 mb-3">
                            <motion.div animate={{
                            rotate: [0, 360]
                          }} transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear'
                          }}>
                              <Globe className="w-5 h-5 text-accent" />
                            </motion.div>
                            <span className="font-semibold text-accent">{t('registration.kzTax')}</span>
                          </div>
                          <motion.a href="https://docs.google.com/document/d/1xZ4DUBOOdOegt4UTHmMP1oe9ZsC23ZoRjrHTFqlPyLw/export?format=pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent hover:underline" whileHover={{
                          scale: 1.05,
                          x: 5
                        }}>
                            <Download className="w-4 h-4" />
                            {t('registration.contractKzIp')}
                          </motion.a>
                        </motion.div>

                        <motion.div className="p-4 glass-dark rounded-xl" whileHover={{
                        scale: 1.02
                      }} transition={{
                        type: 'spring',
                        stiffness: 400
                      }}>
                          <div className="flex items-center gap-3 mb-3">
                            <motion.div animate={{
                            rotate: [0, 360]
                          }} transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear'
                          }}>
                              <Globe className="w-5 h-5 text-accent" />
                            </motion.div>
                            <span className="font-semibold text-accent">{t('registration.rfTax')}</span>
                          </div>
                          <div className="space-y-2">
                            <motion.a href="https://docs.google.com/document/d/10ipPClfoTGD30UdkrFvI4hnxSuWctTCB5w5sUvIe07w/export?format=pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline" whileHover={{
                            scale: 1.05,
                            x: 5
                          }}>
                              <Download className="w-4 h-4" />
                              {t('registration.contractRfSz')}
                            </motion.a>
                            <motion.a href="https://docs.google.com/document/d/1kxVKx4tsJiyqbdFnq_n3iGJcoxKvzMasSV6w5b4OIpo/export?format=pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline" whileHover={{
                            scale: 1.05,
                            x: 5
                          }}>
                              <Download className="w-4 h-4" />
                              {t('registration.contractRfIp')}
                            </motion.a>
                          </div>
                        </motion.div>

                        <motion.div className="p-4 glass-dark rounded-xl" whileHover={{
                        scale: 1.02
                      }} transition={{
                        type: 'spring',
                        stiffness: 400
                      }}>
                          <div className="flex items-center gap-3 mb-3">
                            <motion.div animate={{
                            rotate: [0, 360]
                          }} transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear'
                          }}>
                              <Globe className="w-5 h-5 text-accent" />
                            </motion.div>
                            <span className="font-semibold text-accent">{t('registration.worldTax')}</span>
                          </div>
                          <motion.a href="https://drive.google.com/file/d/15z-5IIqbKd38kneIi3khDtLU3MVOpkF8/view" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent hover:underline" whileHover={{
                          scale: 1.05,
                          x: 5
                        }}>
                            <Download className="w-4 h-4" />
                            {t('registration.contractWorldIp')}
                          </motion.a>
                        </motion.div>
                      </div>
                    </CardGlassDark>
                  </motion.div>

                  <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                    <CardGlassDark className="p-8" hover>
                      <h2 className="text-xl font-bold mb-4 text-accent">
                        {t('registration.procedure')}
                      </h2>
                      <ul className="space-y-3 text-white/70">
                        {[t('registration.step1'), t('registration.step2'), t('registration.step3'), t('registration.step4')].map((step, i) => <motion.li key={i} className="flex gap-3" custom={i} variants={stepVariants} initial="hidden" animate="visible" whileHover={{
                        x: 5
                      }} transition={{
                        type: 'spring',
                        stiffness: 400
                      }}>
                            <span className="text-accent font-bold">{i + 1}.</span>
                            {step}
                          </motion.li>)}
                      </ul>
                    </CardGlassDark>
                  </motion.div>
                </div>
              </div>
            </div>
          </main>
        </PageTransition>
      </MobileLayout>
    </div>;
};
export default Registration;