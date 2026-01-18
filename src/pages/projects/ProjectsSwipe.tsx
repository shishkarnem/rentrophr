import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import PageTransition from '@/components/PageTransition';
import ProjectStack from '@/components/projects/ProjectStack';
import { useProjects } from '@/hooks/useProjects';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const ProjectsSwipe = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const { data: projects = [], isLoading } = useProjects();

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
