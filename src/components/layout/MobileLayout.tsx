import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileHeader from '@/components/MobileHeader';
import MobileNavbar from '@/components/MobileNavbar';

interface MobileLayoutProps {
  children: React.ReactNode;
  onNavigate?: () => void;
}

const MobileLayout = ({ children, onNavigate = () => {} }: MobileLayoutProps) => {
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  return (
    <>
      {showMobileNav ? <MobileHeader /> : <Header onNavigate={onNavigate} />}
      {children}
      {showMobileNav ? <MobileNavbar /> : <Footer />}
    </>
  );
};

export default MobileLayout;
