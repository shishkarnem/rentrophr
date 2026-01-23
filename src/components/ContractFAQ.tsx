import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CardGlassDark, CardGlassDarkHeader } from '@/components/ui/card';

interface ContractFaqItem {
  id: string;
  question: string;
  answer: string;
  question_en: string | null;
  question_kz: string | null;
  answer_en: string | null;
  answer_kz: string | null;
  category: string | null;
  sort_order: number;
}

const translations = {
  ru: {
    title: 'Вопросы по договору',
    subtitle: 'Ответы на часто задаваемые вопросы о договоре',
    loading: 'Загрузка...',
    noItems: 'Вопросы не найдены',
    allCategories: 'Все',
  },
  en: {
    title: 'Contract FAQ',
    subtitle: 'Answers to frequently asked questions about the contract',
    loading: 'Loading...',
    noItems: 'No questions found',
    allCategories: 'All',
  },
  kz: {
    title: 'Шарт бойынша сұрақтар',
    subtitle: 'Шарт туралы жиі қойылатын сұрақтарға жауаптар',
    loading: 'Жүктелуде...',
    noItems: 'Сұрақтар табылмады',
    allCategories: 'Барлығы',
  }
};

const ContractFAQ = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ru;
  const [items, setItems] = useState<ContractFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaq = async () => {
      const { data, error } = await supabase
        .from('contract_faq')
        .select('*')
        .order('sort_order');
      
      if (!error && data) {
        setItems(data as ContractFaqItem[]);
      }
      setLoading(false);
    };
    fetchFaq();
  }, []);

  const getQuestion = (item: ContractFaqItem) => {
    if (language === 'en' && item.question_en) return item.question_en;
    if (language === 'kz' && item.question_kz) return item.question_kz;
    return item.question;
  };

  const getAnswer = (item: ContractFaqItem) => {
    if (language === 'en' && item.answer_en) return item.answer_en;
    if (language === 'kz' && item.answer_kz) return item.answer_kz;
    return item.answer;
  };

  const categories = useMemo(() => {
    const cats = [...new Set(items.map(item => item.category).filter(Boolean))];
    return cats as string[];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, ContractFaqItem[]> = {};
    filteredItems.forEach(item => {
      const cat = item.category || 'Общее';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [filteredItems]);

  if (loading) {
    return (
      <CardGlassDark className="p-8">
        <div className="text-white/60 text-center">{t.loading}</div>
      </CardGlassDark>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <CardGlassDark className="p-8" hover>
        <CardGlassDarkHeader icon={HelpCircle} title={t.title} />
        <p className="text-white/60 mb-6">{t.subtitle}</p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              !selectedCategory
                ? 'bg-accent text-primary font-semibold'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-accent text-primary font-semibold'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="mb-6">
            <h3 className="text-accent font-semibold mb-3">{category}</h3>
            <Accordion type="single" collapsible className="space-y-2">
              {categoryItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-white/10 bg-white/5 rounded-xl px-4"
                >
                  <AccordionTrigger className="text-white/90 hover:text-white hover:no-underline text-left">
                    {getQuestion(item)}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70">
                    {getAnswer(item)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-white/50 text-center py-8">{t.noItems}</p>
        )}
      </CardGlassDark>
    </motion.div>
  );
};

export default ContractFAQ;
