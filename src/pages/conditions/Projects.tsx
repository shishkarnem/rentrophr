import { ArrowLeft, ExternalLink, FolderKanban, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Projects = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

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
              
              <div className="max-w-2xl mx-auto">
                <motion.h1 
                  className="text-3xl sm:text-4xl font-black text-white mb-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-gradient-gold">{t('projects.selectionTitle')}</span>
                </motion.h1>

                {/* Project Selection Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6 mb-6"
                >
                  <p className="text-white/80 leading-relaxed mb-4">
                    {t('projects.selectionText1')}
                  </p>
                  
                  <a
                    href="https://t.me/rentrop_project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mb-4"
                  >
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-primary font-semibold rounded-xl transition-all hover:scale-105 group"
                    >
                      <FolderKanban className="w-4 h-4 mr-2" />
                      {t('projects.telegramChannel')}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </a>
                  
                  <p className="text-white/80 leading-relaxed mb-4">
                    {t('projects.selectionText2')}
                  </p>
                  
                  <p className="text-white/80 leading-relaxed">
                    {t('projects.selectionText3')}
                  </p>
                </motion.div>

                {/* Team Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6 mb-6"
                >
                  <h2 className="text-xl font-bold text-gold mb-4">{t('projects.teamTitle')}</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    {t('projects.teamIntro')}
                  </p>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex gap-2">
                      <span className="text-gold font-bold">1.</span>
                      <span>{t('projects.teamRop')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-gold font-bold">2.</span>
                      <span>{t('projects.teamDpr')}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-gold font-bold">3.</span>
                      <span>{t('projects.teamManager')}</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Video Card Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card rounded-2xl p-6 mb-6"
                >
                  <h2 className="text-xl font-bold text-gold mb-4">{t('projects.videoCardTitle')}</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    {t('projects.videoCardText')}
                  </p>
                  <p className="text-white/80 leading-relaxed mb-3">
                    {t('projects.videoCardInstruction')}
                  </p>
                  <ul className="space-y-2 text-white/80 list-disc list-inside ml-2">
                    <li>{t('projects.videoCardStep1')}</li>
                    <li>{t('projects.videoCardStep2')}</li>
                    <li>{t('projects.videoCardStep3')}</li>
                  </ul>
                </motion.div>

                {/* Important Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card rounded-2xl p-6 mb-8 border border-gold/20"
                >
                  <h2 className="text-xl font-bold text-gold mb-4">{t('projects.importantTitle')}</h2>
                  <p className="text-white/80 leading-relaxed">
                    {t('projects.importantText')}
                  </p>
                </motion.div>

                {/* Swipe Projects Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <Link to="/projects">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-primary font-semibold px-8 py-6 rounded-2xl shadow-lg shadow-gold/20 transition-all hover:scale-105 group"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t('projects.swipeProjects')}
                      <FolderKanban className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </main>
        </PageTransition>
      </MobileLayout>
    </div>
  );
};

export default Projects;
