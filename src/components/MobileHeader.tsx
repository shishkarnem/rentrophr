import LanguageSwitcher from '@/components/LanguageSwitcher';
import SmartSearch from '@/components/SmartSearch';

const MobileHeader = () => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center gap-6 px-4 py-3 glass-dark border-b border-white/10"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 12px) + 44px)',
      }}
    >
      <SmartSearch />
      <LanguageSwitcher />
    </header>
  );
};

export default MobileHeader;
