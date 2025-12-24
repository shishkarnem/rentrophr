import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, X, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  title: string;
  path: string;
  category: string;
  snippet?: string;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [aiResults, setAiResults] = useState<SearchResult[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // FAQ items from database
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string; search_keywords: string | null }[]>([]);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const { data } = await supabase
          .from('faq_knowledge')
          .select('question, answer, search_keywords');
        if (data) setFaqItems(data);
      } catch (error) {
        console.error('Error fetching FAQ for search:', error);
      }
    };
    fetchFaq();
  }, []);

  // Local search items for instant results
  const searchItems: SearchItem[] = useMemo(() => [
    { title: t('work.arendaRopov'), path: '/work/arenda-ropov', category: t('nav.work'), keywords: ['аренда', 'ропы', 'rent', 'ropes', 'жалдау'] },
    { title: t('work.about'), path: '/work/about', category: t('nav.work'), keywords: ['о компании', 'about', 'company', 'компания жайлы'] },
    { title: t('work.community'), path: '/work/community', category: t('nav.work'), keywords: ['сообщество', 'community', 'team', 'қауымдастық'] },
    { title: t('work.reports'), path: '/work/reports', category: t('nav.work'), keywords: ['отчеты', 'reports', 'analytics', 'есептер'] },
    { title: t('work.dpr'), path: '/work/dpr', category: t('nav.work'), keywords: ['дпр', 'dpr', 'правила'] },
    { title: t('work.employees'), path: '/work/employees', category: t('nav.work'), keywords: ['сотрудники', 'employees', 'staff', 'қызметкерлер'] },
    { title: t('conditions.motivation'), path: '/conditions/motivation', category: t('nav.conditions'), keywords: ['мотивация', 'motivation', 'бонусы', 'bonus'] },
    { title: t('conditions.training'), path: '/conditions/training', category: t('nav.conditions'), keywords: ['обучение', 'training', 'курсы', 'courses', 'оқыту'] },
    { title: t('conditions.projects'), path: '/conditions/projects', category: t('nav.conditions'), keywords: ['проекты', 'projects', 'объекты', 'жобалар'] },
    { title: t('conditions.registration'), path: '/conditions/registration', category: t('nav.conditions'), keywords: ['регистрация', 'registration', 'документы', 'тіркеу'] },
    { title: t('conditions.payments'), path: '/conditions/payments', category: t('nav.conditions'), keywords: ['выплаты', 'payments', 'зарплата', 'salary', 'төлемдер'] },
    { title: t('motivation.fix'), path: '/conditions/motivation/fix', category: t('conditions.motivation'), keywords: ['фикс', 'fix', 'оклад', 'salary', 'тариф', 'ндс'] },
    { title: t('motivation.variable'), path: '/conditions/motivation/variable', category: t('conditions.motivation'), keywords: ['переменная', 'variable', 'бонус', 'процент'] },
    { title: t('motivation.partner'), path: '/conditions/motivation/partner', category: t('conditions.motivation'), keywords: ['партнер', 'partner', 'серіктес'] },
    { title: t('motivation.services'), path: '/conditions/motivation/services', category: t('conditions.motivation'), keywords: ['услуги', 'services', 'сервис', 'қызметтер'] },
    { title: t('motivation.subpartner'), path: '/conditions/motivation/subpartner', category: t('conditions.motivation'), keywords: ['субпартнер', 'subpartner'] },
    { title: t('nav.home'), path: '/', category: t('nav.home'), keywords: ['главная', 'home', 'main', 'басты'] },
    { title: t('nav.work'), path: '/work', category: t('nav.work'), keywords: ['работа', 'work', 'job', 'жұмыс'] },
    { title: t('nav.conditions'), path: '/conditions', category: t('nav.conditions'), keywords: ['условия', 'conditions', 'terms', 'шарттар'] },
    { title: 'Вики / FAQ', path: '/wiki', category: 'База знаний', keywords: ['вики', 'wiki', 'faq', 'вопросы', 'ответы', 'база знаний'] },
    // Add FAQ items dynamically
    ...faqItems.map(faq => ({
      title: faq.question,
      path: '/wiki',
      category: 'FAQ',
      keywords: faq.search_keywords ? faq.search_keywords.split(',').map(k => k.trim()) : [faq.question.toLowerCase()]
    }))
  ], [t, faqItems]);

  // Local search for instant results
  const localResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return searchItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const categoryMatch = item.category.toLowerCase().includes(lowerQuery);
      const keywordMatch = item.keywords.some(kw => kw.toLowerCase().includes(lowerQuery));
      
      return titleMatch || categoryMatch || keywordMatch;
    }).slice(0, 6);
  }, [query, searchItems]);

  // AI search with debounce
  const performAiSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setAiResults([]);
      setAiSummary(null);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query: searchQuery, language }
      });

      if (error) throw error;

      if (data) {
        setAiResults(data.results || []);
        setAiSummary(data.aiSummary || null);
      }
    } catch (error) {
      console.error('AI search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Debounced AI search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        performAiSearch(query);
      }, 500);
    } else {
      setAiResults([]);
      setAiSummary(null);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performAiSearch]);

  // Combine results - AI results take priority if available
  const displayResults: SearchResult[] = useMemo(() => {
    if (aiResults.length > 0) {
      return aiResults;
    }
    return localResults.map(item => ({
      title: item.title,
      path: item.path,
      category: item.category,
      snippet: undefined,
    }));
  }, [aiResults, localResults]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
        setAiSummary(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
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
          setAiSummary(null);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, displayResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          if (displayResults[selectedIndex]) {
            navigate(displayResults[selectedIndex].path);
            setIsOpen(false);
            setQuery('');
            setAiSummary(null);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, displayResults, selectedIndex, navigate]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [displayResults]);

  const handleResultClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
    setAiSummary(null);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center text-white/60 hover:text-accent transition-colors p-2 rounded-lg hover:bg-white/5"
        aria-label="Поиск"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[420px] glass-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-[100]"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-accent flex-shrink-0 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-accent flex-shrink-0" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по сайту..."
                className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-sm"
              />
              {query ? (
                <button
                  onClick={() => {
                    setQuery('');
                    setAiSummary(null);
                  }}
                  className="text-white/40 hover:text-white/60 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 flex-shrink-0">
                  ESC
                </kbd>
              )}
            </div>

            {/* AI Summary */}
            <AnimatePresence>
              {aiSummary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-white/10"
                >
                  <div className="px-4 py-3 bg-accent/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="text-xs font-semibold text-accent">AI ответ</span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">{aiSummary}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto custom-scrollbar">
              {!query.trim() ? (
                <div className="px-4 py-6 text-center text-white/40 text-sm">
                  <Sparkles className="w-5 h-5 mx-auto mb-2 text-accent/50" />
                  Умный поиск с AI
                </div>
              ) : displayResults.length === 0 && !isLoading ? (
                <div className="px-4 py-6 text-center text-white/40 text-sm">
                  Ничего не найдено
                </div>
              ) : (
                <div className="py-1">
                  {displayResults.map((item, index) => (
                    <button
                      key={item.path}
                      onClick={() => handleResultClick(item.path)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        index === selectedIndex
                          ? 'bg-accent/20 text-white'
                          : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Search className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        <div className="text-xs text-white/40 truncate">
                          {item.snippet || item.category}
                        </div>
                      </div>
                      {index === selectedIndex && (
                        <span className="text-xs text-accent">↵</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/30">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/10 px-1 rounded">↑↓</kbd> навигация
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/10 px-1 rounded">↵</kbd> выбрать
                </span>
              </div>
              <div className="flex items-center gap-1 text-accent/50">
                <Sparkles className="w-3 h-3" />
                <span>AI powered</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;
