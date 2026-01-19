import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import PageTransition from '@/components/PageTransition';
import ProjectStack from '@/components/projects/ProjectStack';
import { useProjects } from '@/hooks/useProjects';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TelegramAccessRestriction from '@/components/TelegramAccessRestriction';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const ProjectsSwipe = () => {
  const { t } = useLanguage();
  const { isTelegram, isLoading: isTelegramLoading } = useTelegram();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const showMobileNav = isTelegram || isMobile;
  const { data: projects = [], isLoading } = useProjects();

  // Show loading while checking Telegram status
  if (isTelegramLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Restrict access if not in Telegram
  if (!isTelegram) {
    return (
      <div 
        className="min-h-screen relative z-10"
        style={{
          background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
        }}
      >
        {/* Header */}
        <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-lg font-semibold text-white">{t('projects.selection') || 'Проекты'}</h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        <main className="container mx-auto px-4 py-10 max-w-md">
          <TelegramAccessRestriction />
        </main>
      </div>
    );
  }

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
                <Link to="/conditions/projects" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                  <ArrowLeft className="w-4 h-4" />
                  {t('projects.backToProjects') || 'Назад к проектам'}
                </Link>
              </motion.div>
              
              <div className="max-w-md mx-auto">
                <motion.h1 
                  className="text-3xl sm:text-4xl font-black text-white mb-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-gradient-gold">{t('projects.selection') || 'Проекты'}</span>
                </motion.h1>

                <ProjectStack projects={projects} isLoading={isLoading} />
              </div>
            </div>
          </main>
        </PageTransition>
      </MobileLayout>
    </div>
  );
};

export default ProjectsSwipe;
