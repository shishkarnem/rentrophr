import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  search_keywords: string | null;
}

const Wiki = () => {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const { data, error } = await supabase
          .from('faq_knowledge')
          .select('id, question, answer, search_keywords')
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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredItems = faqItems.filter(item => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      (item.search_keywords && item.search_keywords.toLowerCase().includes(query))
    );
  });

  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
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
              Вики / FAQ
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              База знаний с ответами на часто задаваемые вопросы
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по вопросам..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          </motion.div>

          {/* FAQ List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60">Загрузка...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 glass-dark rounded-2xl"
              >
                <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">
                  {searchQuery ? 'Ничего не найдено' : 'Пока нет вопросов в базе знаний'}
                </p>
              </motion.div>
            ) : (
              filteredItems.map((item, index) => (
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
                      <span className="text-white font-medium pr-4">{item.question}</span>
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
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
