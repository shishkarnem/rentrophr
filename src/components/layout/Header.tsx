import { useState } from 'react';
import { ChevronDown, Send, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/RR-Logo.png';
import { SOCIAL_LINKS } from '@/constants/vacancy';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
interface HeaderProps {
  onNavigate: (section: string) => void;
}
const Header = ({
  onNavigate
}: HeaderProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const workPages = [{
    name: t('work.arendaRopov'),
    path: '/work/arenda-ropov'
  }, {
    name: t('work.about'),
    path: '/work/about'
  }, {
    name: t('work.community'),
    path: '/work/community'
  }, {
    name: t('work.reports'),
    path: '/work/reports'
  }, {
    name: t('work.dpr'),
    path: '/work/dpr'
  }, {
    name: t('work.employees'),
    path: '/work/employees'
  }];
  const conditionsPages = [{
    name: t('conditions.motivation'),
    path: '/conditions/motivation'
  }, {
    name: t('conditions.training'),
    path: '/conditions/training'
  }, {
    name: t('conditions.projects'),
    path: '/conditions/projects'
  }, {
    name: t('conditions.registration'),
    path: '/conditions/registration'
  }, {
    name: t('conditions.payments'),
    path: '/conditions/payments'
  }];
  return <header className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={logo} alt="RentROP" className="h-10 w-auto" />
          <span className="text-white font-bold text-xl tracking-tight">
            ​RentROP <span className="text-gradient-gold">HR</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider text-white/70">
          <Link to="/" className="hover:text-accent transition-colors">
            {t('nav.home')}
          </Link>

          {/* Работа Dropdown */}
          <div className="relative" onMouseEnter={() => setActiveDropdown('work')} onMouseLeave={() => setActiveDropdown(null)}>
            <Link to="/work" className="hover:text-accent transition-colors flex items-center gap-1">
              {t('nav.work')}
              <ChevronDown className="w-4 h-4" />
            </Link>
            <div className={`absolute top-full left-0 mt-2 w-48 glass-dark rounded-2xl shadow-2xl py-2 transition-all duration-200 ${activeDropdown === 'work' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              {workPages.map(item => <Link key={item.path} to={item.path} onClick={() => setActiveDropdown(null)} className="block w-full text-left px-4 py-2 text-xs hover:bg-white/5 hover:text-accent transition-colors">
                  {item.name}
                </Link>)}
            </div>
          </div>

          {/* Условия Dropdown */}
          <div className="relative" onMouseEnter={() => setActiveDropdown('conditions')} onMouseLeave={() => setActiveDropdown(null)}>
            <Link to="/conditions" className="hover:text-accent transition-colors flex items-center gap-1">
              {t('nav.conditions')}
              <ChevronDown className="w-4 h-4" />
            </Link>
            <div className={`absolute top-full left-0 mt-2 w-48 glass-dark rounded-2xl shadow-2xl py-2 transition-all duration-200 ${activeDropdown === 'conditions' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              {conditionsPages.map(item => <Link key={item.path} to={item.path} onClick={() => setActiveDropdown(null)} className="block w-full text-left px-4 py-2 text-xs hover:bg-white/5 hover:text-accent transition-colors">
                  {item.name}
                </Link>)}
            </div>
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-accent transition-colors">
            <Send className="w-5 h-5" />
          </a>
          
          {/* Mobile menu button */}
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="lg:hidden glass-dark border-t border-white/10 px-6 py-4">
          <nav className="flex flex-col gap-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-accent transition-colors text-left py-2">
              {t('nav.home')}
            </Link>
            <Link to="/work" onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-accent transition-colors text-left py-2">
              {t('nav.work')}
            </Link>
            <Link to="/conditions" onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-accent transition-colors text-left py-2">
              {t('nav.conditions')}
            </Link>
          </nav>
        </div>}
    </header>;
};
export default Header;