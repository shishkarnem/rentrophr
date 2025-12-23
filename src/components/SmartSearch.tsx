import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchItem {
  title: string;
  path: string;
  category: string;
  keywords: string[];
}

const SmartSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Define searchable pages
  const searchItems: SearchItem[] = useMemo(() => [
    // Work pages
    { title: t('work.arendaRopov'), path: '/work/arenda-ropov', category: t('nav.work'), keywords: ['аренда', 'ропы', 'rent', 'ropes', 'жалдау'] },
    { title: t('work.about'), path: '/work/about', category: t('nav.work'), keywords: ['о компании', 'about', 'company', 'компания жайлы'] },
    { title: t('work.community'), path: '/work/community', category: t('nav.work'), keywords: ['сообщество', 'community', 'team', 'қауымдастық'] },
    { title: t('work.reports'), path: '/work/reports', category: t('nav.work'), keywords: ['отчеты', 'reports', 'analytics', 'есептер'] },
    { title: t('work.dpr'), path: '/work/dpr', category: t('nav.work'), keywords: ['дпр', 'dpr', 'правила'] },
    { title: t('work.employees'), path: '/work/employees', category: t('nav.work'), keywords: ['сотрудники', 'employees', 'staff', 'қызметкерлер'] },
    
    // Conditions pages
    { title: t('conditions.motivation'), path: '/conditions/motivation', category: t('nav.conditions'), keywords: ['мотивация', 'motivation', 'бонусы', 'bonus', 'мотивация'] },
    { title: t('conditions.training'), path: '/conditions/training', category: t('nav.conditions'), keywords: ['обучение', 'training', 'курсы', 'courses', 'оқыту'] },
    { title: t('conditions.projects'), path: '/conditions/projects', category: t('nav.conditions'), keywords: ['проекты', 'projects', 'объекты', 'жобалар'] },
    { title: t('conditions.registration'), path: '/conditions/registration', category: t('nav.conditions'), keywords: ['регистрация', 'registration', 'документы', 'тіркеу'] },
    { title: t('conditions.payments'), path: '/conditions/payments', category: t('nav.conditions'), keywords: ['выплаты', 'payments', 'зарплата', 'salary', 'төлемдер'] },
    
    // Motivation sub-pages
    { title: t('motivation.fix'), path: '/conditions/motivation/fix', category: t('conditions.motivation'), keywords: ['фикс', 'fix', 'оклад', 'salary'] },
    { title: t('motivation.variable'), path: '/conditions/motivation/variable', category: t('conditions.motivation'), keywords: ['переменная', 'variable', 'бонус'] },
    { title: t('motivation.partner'), path: '/conditions/motivation/partner', category: t('conditions.motivation'), keywords: ['партнер', 'partner', 'серіктес'] },
    { title: t('motivation.services'), path: '/conditions/motivation/services', category: t('conditions.motivation'), keywords: ['услуги', 'services', 'сервис', 'қызметтер'] },
    { title: t('motivation.subpartner'), path: '/conditions/motivation/subpartner', category: t('conditions.motivation'), keywords: ['субпартнер', 'subpartner'] },
    
    // Main pages
    { title: t('nav.home'), path: '/', category: t('nav.home'), keywords: ['главная', 'home', 'main', 'басты'] },
    { title: t('nav.work'), path: '/work', category: t('nav.work'), keywords: ['работа', 'work', 'job', 'жұмыс'] },
    { title: t('nav.conditions'), path: '/conditions', category: t('nav.conditions'), keywords: ['условия', 'conditions', 'terms', 'шарттар'] },
  ], [t]);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return searchItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const categoryMatch = item.category.toLowerCase().includes(lowerQuery);
      const keywordMatch = item.keywords.some(kw => kw.toLowerCase().includes(lowerQuery));
      
      return titleMatch || categoryMatch || keywordMatch;
    }).slice(0, 8); // Limit to 8 results
  }, [query, searchItems]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        // Open search with Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          if (filteredResults[selectedIndex]) {
            navigate(filteredResults[selectedIndex].path);
            setIsOpen(false);
            setQuery('');
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, navigate]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  const handleResultClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
        aria-label={t('search.placeholder')}
      >
        <Search className="w-5 h-5" />
        <span className="hidden md:inline text-xs font-medium">{t('search.button')}</span>
        <kbd className="hidden md:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40">
          ⌘K
        </kbd>
      </button>

      {/* Search modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            />

            {/* Search container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
            >
              <div className="glass-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                  <Search className="w-5 h-5 text-white/40" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-base"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="text-white/40 hover:text-white/60 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto">
                  {query && filteredResults.length === 0 ? (
                    <div className="px-4 py-8 text-center text-white/40 text-sm">
                      {t('search.noResults')}
                    </div>
                  ) : (
                    <div className="py-2">
                      {filteredResults.map((item, index) => (
                        <button
                          key={item.path}
                          onClick={() => handleResultClick(item.path)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            index === selectedIndex
                              ? 'bg-accent/20 text-white'
                              : 'text-white/70 hover:bg-white/5'
                          }`}
                        >
                          <Search className="w-4 h-4 text-white/40" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.title}</div>
                            <div className="text-xs text-white/40 truncate">{item.category}</div>
                          </div>
                          {index === selectedIndex && (
                            <span className="text-xs text-white/40">↵</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                {filteredResults.length > 0 && (
                  <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-[10px] text-white/30">
                    <span className="flex items-center gap-1">
                      <kbd className="bg-white/10 px-1 rounded">↑↓</kbd> {t('search.navigate')}
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="bg-white/10 px-1 rounded">↵</kbd> {t('search.select')}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;
