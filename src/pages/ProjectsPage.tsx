import { ExternalLink, FolderKanban, Construction } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { Button } from '@/components/ui/button';
import MobileNavbar from '@/components/MobileNavbar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const ProjectsPage = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
  };

  return (
    <div className="min-h-screen hero-gradient">
      {/* Mobile: Only language switcher at top center */}
      {showMobileNav ? (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center py-4 safe-area-top">
          <LanguageSwitcher />
        </header>
      ) : (
        <Header onNavigate={handleNavigate} />
      )}

      <main className={`flex flex-col items-center justify-center min-h-screen px-6 ${showMobileNav ? 'pb-24 pt-20' : 'pt-24'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20"
          >
            <Construction className="w-12 h-12 text-gold" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-4"
          >
            {t('projects.title') || 'Страница в разработке'}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 mb-8 leading-relaxed"
          >
            {t('projects.description') || 'Проекты можно посмотреть в телеграм канале'}
          </motion.p>

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
              className="inline-block"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-primary font-semibold px-8 py-6 rounded-2xl shadow-lg shadow-gold/20 transition-all hover:scale-105 group"
              >
                <FolderKanban className="w-5 h-5 mr-2" />
                {t('projects.viewInTelegram') || 'Смотреть проекты'}
                <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </a>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </main>

      {showMobileNav ? <MobileNavbar /> : <Footer />}
    </div>
  );
};

export default ProjectsPage;
