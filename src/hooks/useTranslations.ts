import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language, translations as fallbackTranslations } from '@/contexts/LanguageContext';

interface Translation {
  key: string;
  text_ru: string;
  text_en: string;
  text_kz: string;
}

export const useTranslations = () => {
  const [translations, setTranslations] = useState<Record<string, Translation>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('key, text_ru, text_en, text_kz');

        if (error) {
          console.error('Error fetching translations:', error);
          return;
        }

        if (data) {
          const translationsMap: Record<string, Translation> = {};
          data.forEach((item) => {
            translationsMap[item.key] = item;
          });
          setTranslations(translationsMap);
        }
      } catch (err) {
        console.error('Failed to fetch translations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('translations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newData = payload.new as Translation;
            setTranslations(prev => ({
              ...prev,
              [newData.key]: newData
            }));
          } else if (payload.eventType === 'DELETE') {
            const oldData = payload.old as { key: string };
            setTranslations(prev => {
              const updated = { ...prev };
              delete updated[oldData.key];
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getTranslation = (key: string, language: Language): string => {
    const dbTranslation = translations[key];
    
    if (dbTranslation) {
      switch (language) {
        case 'ru':
          return dbTranslation.text_ru || key;
        case 'en':
          return dbTranslation.text_en || dbTranslation.text_ru || key;
        case 'kz':
          return dbTranslation.text_kz || dbTranslation.text_ru || key;
        default:
          return dbTranslation.text_ru || key;
      }
    }

    // Fallback to hardcoded translations
    return fallbackTranslations[language]?.[key] || fallbackTranslations.ru?.[key] || key;
  };

  return { translations, loading, getTranslation };
};
