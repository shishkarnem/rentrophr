import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark, CardGlassDarkHeader, CardGlassDarkContent, CardGlassDarkSubtitle } from '@/components/ui/card';
import { ArrowLeft, FolderKanban, Users, Video, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Projects = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  const cardVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }
    })
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, delay: 0.3 + i * 0.1 }
    })
  };

  return (
    <div className="min-h-screen hero-gradient">
      <MobileLayout>
        <PageTransition>
          <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
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
                  <span className="text-gradient-gold">{t('projects.selection')}</span>
                </motion.h1>
                
                <div className="space-y-8">
                  <motion.div
                    custom={0}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <CardGlassDark className="p-8" hover>
                      <CardGlassDarkHeader icon={FolderKanban} title={t('projects.selection')} />
                      <CardGlassDarkContent>
                        <p>
                          {t('projects.selectionDesc1')}{' '}
                          <motion.a 
                            href="https://t.me/rentrop_project" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-accent hover:underline font-semibold"
                            whileHover={{ scale: 1.05 }}
                          >
                            {t('projects.telegramChannel')}
                          </motion.a>{' '}
                          {t('projects.selectionDesc2')}
                        </p>
                        <p>{t('projects.selectionDesc3')}</p>
                        <p>{t('projects.selectionDesc4')}</p>
                      </CardGlassDarkContent>
                    </CardGlassDark>
                  </motion.div>

                  <motion.div
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <CardGlassDark className="p-8" hover>
                      <CardGlassDarkHeader icon={Users} title={t('projects.team')} />
                      <CardGlassDarkContent>
                        <CardGlassDarkSubtitle>{t('projects.teamDesc')}</CardGlassDarkSubtitle>
                        <ul className="space-y-3">
                          {[
                            { label: t('projects.rop'), desc: t('projects.ropDesc') },
                            { label: t('projects.dpr'), desc: t('projects.dprDesc') },
                            { label: t('projects.projectManager'), desc: t('projects.projectManagerDesc') },
                          ].map((item, i) => (
                            <motion.li 
                              key={i}
                              className="flex gap-3"
                              custom={i}
                              variants={listItemVariants}
                              initial="hidden"
                              animate="visible"
                              whileHover={{ x: 5 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <span className="text-accent font-bold">{i + 1}.</span>
                              <div>
                                <strong className="text-accent">{item.label}</strong> <span className="text-white/70">{item.desc}</span>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      </CardGlassDarkContent>
                    </CardGlassDark>
                  </motion.div>

                  <motion.div
                    custom={2}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <CardGlassDark className="p-8" hover>
                      <CardGlassDarkHeader icon={Video} title={t('projects.videoCard')} />
                      <CardGlassDarkContent>
                        <p>{t('projects.videoCardDesc')}</p>
                        <CardGlassDarkSubtitle>{t('projects.videoInstructions')}</CardGlassDarkSubtitle>
                        <ul className="space-y-2">
                          {[t('projects.videoInstr1'), t('projects.videoInstr2'), t('projects.videoInstr3')].map((item, i) => (
                            <motion.li 
                              key={i}
                              className="flex gap-3"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + i * 0.1 }}
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-accent">•</span>
                              <span className="text-white/70">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardGlassDarkContent>
                    </CardGlassDark>
                  </motion.div>

                  <motion.div
                    custom={3}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <CardGlassDark className="p-8" hover>
                      <motion.div 
                        className="flex items-start gap-4 p-4 glass-dark rounded-xl"
                        whileHover={{ scale: 1.02, x: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <Send className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        </motion.div>
                        <div className="text-white/70">
                          <p className="font-semibold text-accent mb-1">{t('projects.important')}</p>
                          <p>{t('projects.importantDesc')}</p>
                        </div>
                      </motion.div>
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

export default Projects;