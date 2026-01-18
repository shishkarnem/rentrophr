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
              
              <div className="max-w-md mx-auto text-center">
                <motion.h1 
                  className="text-3xl sm:text-4xl font-black text-white mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-gradient-gold">{t('projects.selection') || 'Проекты'}</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/70 mb-8 leading-relaxed"
                >
                  {t('projects.description') || 'Проекты можно посмотреть в телеграм канале или выбрать в нашем приложении'}
                </motion.p>

                {/* Swipe Projects Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <Link to="/projects">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-primary font-semibold px-8 py-6 rounded-2xl shadow-lg shadow-gold/20 transition-all hover:scale-105 group"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t('projects.swipeProjects') || 'Выбрать проект'}
                      <FolderKanban className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>

                {/* Telegram Channel Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <a
                    href="https://t.me/rentrop_project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-gold/30 text-gold hover:bg-gold/10 font-semibold px-8 py-6 rounded-2xl transition-all hover:scale-105 group"
                    >
                      <FolderKanban className="w-5 h-5 mr-2" />
                      {t('projects.viewInTelegram') || 'Смотреть в Telegram'}
                      <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </a>
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
