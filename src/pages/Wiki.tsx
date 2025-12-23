import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Search, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  question_en: string | null;
  question_kz: string | null;
  answer_en: string | null;
  answer_kz: string | null;
  category: string | null;
  search_keywords: string | null;
}

// Function to render text with clickable links
const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0; // Reset regex state
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent/80 underline break-all transition-colors"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const Wiki = () => {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [aiSearchResult, setAiSearchResult] = useState<string | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const { data, error } = await supabase
          .from('faq_knowledge')
          .select('id, question, answer, question_en, question_kz, answer_en, answer_kz, category, search_keywords')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setFaqItems(data || []);
      } catch (error) {
        console.error('Error fetching FAQ:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaq();
  }, []);

  // Get translated question
  const getQuestion = (item: FaqItem): string => {
    if (language === 'en' && item.question_en) return item.question_en;
    if (language === 'kz' && item.question_kz) return item.question_kz;
    return item.question;
  };

  // Get translated answer
  const getAnswer = (item: FaqItem): string => {
    if (language === 'en' && item.answer_en) return item.answer_en;
    if (language === 'kz' && item.answer_kz) return item.answer_kz;
    return item.answer;
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(faqItems.map(item => item.category || 'Общее'));
    return Array.from(cats).sort();
  }, [faqItems]);

  // AI Search function
  const performAiSearch = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setAiSearchResult(null);
      return;
    }

    setIsAiSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('wiki-ai-search', {
        body: { query, language, faqItems: faqItems.map(f => ({ question: getQuestion(f), answer: getAnswer(f), category: f.category })) }
      });

      if (error) throw error;
      setAiSearchResult(data?.aiResponse || null);
    } catch (error) {
      console.error('AI search error:', error);
      setAiSearchResult(null);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Debounced AI search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        performAiSearch(searchQuery);
      } else {
        setAiSearchResult(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, language]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter items by search and category
  const filteredItems = useMemo(() => {
    return faqItems.filter(item => {
      // Category filter
      if (selectedCategory && (item.category || 'Общее') !== selectedCategory) {
        return false;
      }

      // Search filter
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      const question = getQuestion(item).toLowerCase();
      const answer = getAnswer(item).toLowerCase();
      const keywords = item.search_keywords?.toLowerCase() || '';
      
      return question.includes(query) || answer.includes(query) || keywords.includes(query);
    });
  }, [faqItems, searchQuery, selectedCategory, language]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, FaqItem[]> = {};
    filteredItems.forEach(item => {
      const category = item.category || 'Общее';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
  };

  const getCategoryLabel = (cat: string): string => {
    if (language === 'en') {
      const translations: Record<string, string> = {
        'Общее': 'General',
        'Работа': 'Work',
        'Оплата': 'Payment',
        'Обучение': 'Training',
      };
      return translations[cat] || cat;
    }
    if (language === 'kz') {
      const translations: Record<string, string> = {
        'Общее': 'Жалпы',
        'Работа': 'Жұмыс',
        'Оплата': 'Төлем',
        'Обучение': 'Оқыту',
      };
      return translations[cat] || cat;
    }
    return cat;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/90">
      <Header onNavigate={handleNavigate} />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-6">
              <BookOpen className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {language === 'ru' ? 'Вики / FAQ' : language === 'en' ? 'Wiki / FAQ' : 'Вики / FAQ'}
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              {language === 'ru' 
                ? 'База знаний с ответами на часто задаваемые вопросы'
                : language === 'en'
                ? 'Knowledge base with answers to frequently asked questions'
                : 'Жиі қойылатын сұрақтарға жауаптары бар білім базасы'}
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ru' ? 'Поиск по вопросам...' : language === 'en' ? 'Search questions...' : 'Сұрақтарды іздеу...'}
                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 transition-colors"
              />
              {isAiSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent animate-spin" />
              )}
            </div>
          </motion.div>

          {/* AI Search Result */}
          <AnimatePresence>
            {aiSearchResult && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="max-w-2xl mx-auto mb-6"
              >
                <div className="glass-dark rounded-xl p-4 border border-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-accent text-sm font-medium">
                      {language === 'ru' ? 'AI-ответ' : language === 'en' ? 'AI Answer' : 'AI жауабы'}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {renderTextWithLinks(aiSearchResult)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-accent text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {language === 'ru' ? 'Все' : language === 'en' ? 'All' : 'Барлығы'}
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-accent text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ List */}
          <div className="max-w-3xl mx-auto space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60">
                  {language === 'ru' ? 'Загрузка...' : language === 'en' ? 'Loading...' : 'Жүктелуде...'}
                </p>
              </div>
            ) : Object.keys(groupedItems).length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 glass-dark rounded-2xl"
              >
                <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">
                  {searchQuery 
                    ? (language === 'ru' ? 'Ничего не найдено' : language === 'en' ? 'Nothing found' : 'Ештеңе табылмады')
                    : (language === 'ru' ? 'Пока нет вопросов в базе знаний' : language === 'en' ? 'No questions in knowledge base yet' : 'Білім базасында әлі сұрақтар жоқ')}
                </p>
              </motion.div>
            ) : (
              Object.entries(groupedItems).map(([category, items], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <h2 className="text-lg font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    {getCategoryLabel(category)}
                    <span className="text-white/40 text-sm font-normal">({items.length})</span>
                  </h2>

                  {/* Category Items */}
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="glass-dark rounded-xl overflow-hidden border border-white/10 hover:border-accent/30 transition-colors">
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                          >
                            <span className="text-white font-medium pr-4">{getQuestion(item)}</span>
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              {expandedId === item.id ? (
                                <ChevronUp className="w-5 h-5 text-accent" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-white/60" />
                              )}
                            </span>
                          </button>
                          
                          <AnimatePresence>
                            {expandedId === item.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0">
                                  <div className="pt-4 border-t border-white/10">
                                    <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                                      {renderTextWithLinks(getAnswer(item))}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wiki;
