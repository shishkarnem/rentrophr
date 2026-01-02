import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, MessageCircle, FolderKanban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/RR-Logo.png';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  action?: () => void;
}

const MobileNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useTelegram();
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

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
    setTimeout(() => setActiveItem(null), 300);
  };

  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: <img src={logo} alt="RentROP" className="w-6 h-6 object-contain" />,
      label: t('nav.home'),
      path: '/',
    },
    {
      id: 'menu',
      icon: menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />,
      label: t('nav.menu') || 'Меню',
      action: () => setMenuOpen(!menuOpen),
    },
    {
      id: 'profile',
      icon: profile?.photo_url ? (
        <img 
          src={profile.photo_url} 
          alt="Profile" 
          className="w-7 h-7 rounded-full object-cover border-2 border-gold/50"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center text-xs font-bold text-gold">
          {profile?.first_name?.[0] || '?'}
        </div>
      ),
      label: t('nav.profile'),
      path: '/profile',
    },
    {
      id: 'projects',
      icon: <FolderKanban className="w-6 h-6" />,
      label: t('nav.projects') || 'Проекты',
      path: '/projects',
    },
    {
      id: 'chat',
      icon: <MessageCircle className="w-6 h-6" />,
      label: t('nav.aiChat') || 'ИИ Чат',
      path: '/wiki',
      action: () => {
        navigate('/wiki?openChat=true');
      },
    },
  ];

  const isActive = (path?: string) => path && location.pathname === path;

  return (
    <>
      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/10 safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                handleNavClick(item.id);
                if (item.action) {
                  item.action();
                } else if (item.path) {
                  navigate(item.path);
                  setMenuOpen(false);
                }
              }}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                isActive(item.path) || (item.id === 'menu' && menuOpen)
                  ? 'text-gold'
                  : 'text-white/60 hover:text-white/90'
              }`}
              whileTap={{ scale: 0.9 }}
              animate={activeItem === item.id ? { scale: 1.5 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {/* Wave animation background */}
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                initial={false}
                animate={activeItem === item.id || isActive(item.path) ? { opacity: 1 } : { opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent"
                  animate={activeItem === item.id ? {
                    background: [
                      'radial-gradient(circle at 50% 100%, hsla(45, 74%, 65%, 0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 50% 50%, hsla(45, 74%, 65%, 0.4) 0%, transparent 70%)',
                      'radial-gradient(circle at 50% 100%, hsla(45, 74%, 65%, 0.3) 0%, transparent 50%)',
                    ],
                  } : {}}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
              
              <motion.div
                className="relative z-10"
                animate={activeItem === item.id ? { scale: 1.5, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {item.icon}
              </motion.div>
              
              <motion.span 
                className="text-[10px] mt-1 font-medium relative z-10"
                animate={activeItem === item.id ? { opacity: 0 } : { opacity: 1 }}
              >
                {item.label}
              </motion.span>
              
              {/* Active indicator */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Full-screen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 glass-dark overflow-y-auto pb-20"
            style={{
              paddingTop: 'env(safe-area-inset-top, 60px)',
            }}
          >
            <div className="p-6 pt-16">
              <h2 className="text-2xl font-bold text-white mb-6">{t('nav.menu') || 'Меню'}</h2>
              
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
                        <Link
                          to={page.path}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group"
                        >
                          <span className="text-white font-medium">{page.name}</span>
                          <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-gold transition-colors" />
                        </Link>
                        <div className="pl-4 space-y-1">
                          {page.submenu.map((subpage) => (
                            <Link
                              key={subpage.path}
                              to={subpage.path}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-all text-white/70 hover:text-white"
                            >
                              <span className="text-sm">{subpage.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={page.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                          location.pathname === page.path
                            ? 'bg-gold/20 text-gold'
                            : 'bg-white/5 hover:bg-white/10 text-white'
                        }`}
                      >
                        <span className="font-medium">{page.name}</span>
                        <ChevronRight className="w-5 h-5 opacity-50" />
                      </Link>
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

export default MobileNavbar;
