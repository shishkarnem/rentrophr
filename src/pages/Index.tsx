import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import VideoSection from '@/components/sections/VideoSection';
import VacancySection from '@/components/sections/VacancySection';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSyncProjects } from '@/hooks/useSyncProjects';

const Index = () => {
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const { syncOnAppLoad } = useSyncProjects();

  // Sync projects on app load
  useEffect(() => {
    syncOnAppLoad();
  }, [syncOnAppLoad]);

  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
  };

  return (
    <div className="min-h-screen hero-gradient">
      {showMobileNav ? <MobileHeader /> : <Header onNavigate={handleNavigate} />}
      <main className={showMobileNav ? 'pb-20' : ''}>
        <HeroSection />
        <VideoSection />
        <VacancySection />
      </main>
      {showMobileNav ? <MobileNavbar /> : <Footer />}
    </div>
  );
};

export default Index;
