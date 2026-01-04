import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SmartSearch from '@/components/SmartSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/RR-Logo.png';

const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const workPages = [
    { name: t('work.arendaRopov'), path: '/work/arenda-ropov' },
    { name: t('work.about'), path: '/work/about' },
    { name: t('work.community'), path: '/work/community' },
    { name: t('work.reports'), path: '/work/reports' },
    { name: t('work.dpr'), path: '/work/dpr' },
    { name: t('work.employees'), path: '/work/employees' },
  ];

  const conditionsPages = [
    { name: t('conditions.motivation'), path: '/conditions/motivation' },
    { name: t('conditions.training'), path: '/conditions/training' },
    { name: t('conditions.projects'), path: '/conditions/projects' },
    { name: t('conditions.registration'), path: '/conditions/registration' },
    { name: t('conditions.payments'), path: '/conditions/payments' },
  ];

  const allPages = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.work'), path: '/work', submenu: workPages },
    { name: t('nav.conditions'), path: '/conditions', submenu: conditionsPages },
    { name: t('nav.wiki'), path: '/wiki' },
    { name: t('nav.profile'), path: '/profile' },
    { name: t('nav.projects') || 'Проекты', path: '/projects' },
  ];

  const handleLogoClick = () => {
    setMenuOpen(true);
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10"
        style={{
          paddingTop: 'env(safe-area-inset-top, 12px)',
        }}
      >
        {/* First row: Logo and title */}
        <div 
          className="flex justify-center items-center gap-3 px-4 py-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img src={logo} alt="RentROP" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-lg">RentROP</span>
        </div>
        
        {/* Second row: Search and Language */}
        <div className="flex justify-center items-center gap-6 px-4 py-3">
          <SmartSearch />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Full-screen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] glass-dark overflow-y-auto"
            style={{
              paddingTop: 'calc(env(safe-area-inset-top, 12px) + 16px)',
            }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t('nav.menu') || 'Меню'}</h2>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              
              <div className="space-y-2">
                {allPages.map((page, index) => (
                  <motion.div
                    key={page.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {page.submenu ? (
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            navigate(page.path);
                            setMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group"
                        >
                          <span className="text-white font-medium">{page.name}</span>
                          <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-gold transition-colors" />
                        </button>
                        <div className="pl-4 space-y-1">
                          {page.submenu.map((subpage) => (
                            <button
                              key={subpage.path}
                              onClick={() => {
                                navigate(subpage.path);
                                setMenuOpen(false);
                              }}
                              className="w-full flex items-center p-3 rounded-xl hover:bg-white/5 transition-all text-white/70 hover:text-white text-left"
                            >
                              <span className="text-sm">{subpage.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          navigate(page.path);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all"
                      >
                        <span className="font-medium">{page.name}</span>
                        <ChevronRight className="w-5 h-5 opacity-50" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileHeader;