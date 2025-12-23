import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NAVIGATION_STRUCTURE, SOCIAL_LINKS } from '@/constants/vacancy';
import { ChevronDown, Send, Menu, X } from 'lucide-react';
import logo from '@/assets/RR-Logo.png';

interface HeaderProps {
  onNavigate: (section: string) => void;
}

const Header = ({ onNavigate }: HeaderProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button 
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="RentROP" className="h-10 w-auto" />
          <span className="text-white font-bold text-xl tracking-tight">
            РентРОП <span className="text-gradient-gold">HR</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider text-white/70">
          <button 
            onClick={() => scrollToSection('hero')} 
            className="hover:text-accent transition-colors"
          >
            Главная
          </button>

          {/* Работа Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('work')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="hover:text-accent transition-colors flex items-center gap-1">
              Работа
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className={`absolute top-full left-0 mt-2 w-48 glass-dark rounded-2xl shadow-2xl py-2 transition-all duration-200 ${activeDropdown === 'work' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              {NAVIGATION_STRUCTURE.work.map((item) => (
                <button
                  key={item}
                  onClick={() => { onNavigate(item); setActiveDropdown(null); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 hover:text-accent transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Условия Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('conditions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="hover:text-accent transition-colors flex items-center gap-1">
              Условия
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className={`absolute top-full left-0 mt-2 w-48 glass-dark rounded-2xl shadow-2xl py-2 transition-all duration-200 ${activeDropdown === 'conditions' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              {NAVIGATION_STRUCTURE.conditions.map((item) => (
                <button
                  key={item}
                  onClick={() => { onNavigate(item); setActiveDropdown(null); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 hover:text-accent transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => scrollToSection('vacancy')} 
            className="hover:text-accent transition-colors"
          >
            Вакансия
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <a 
            href={SOCIAL_LINKS.telegram} 
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex text-white/60 hover:text-accent transition-colors"
          >
            <Send className="w-5 h-5" />
          </a>
          <Button 
            variant="cta" 
            size="default"
            onClick={() => scrollToSection('apply')}
            className="hidden sm:flex"
          >
            ОТКЛИК
          </Button>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-dark border-t border-white/10 px-6 py-4">
          <nav className="flex flex-col gap-4">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-white/70 hover:text-accent transition-colors text-left py-2"
            >
              Главная
            </button>
            <button 
              onClick={() => scrollToSection('vacancy')} 
              className="text-white/70 hover:text-accent transition-colors text-left py-2"
            >
              Вакансия
            </button>
            <Button 
              variant="cta" 
              size="lg"
              onClick={() => scrollToSection('apply')}
              className="w-full mt-2"
            >
              ОТКЛИК
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
