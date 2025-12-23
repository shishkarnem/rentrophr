-- Создаем функцию для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION public.update_faq_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Создаем таблицу для хранения FAQ из Google Sheets
CREATE TABLE public.faq_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  search_keywords TEXT,
  row_hash TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.faq_knowledge ENABLE ROW LEVEL SECURITY;

-- Политика для публичного чтения (нужно для AI-чата)
CREATE POLICY "FAQ is publicly readable"
ON public.faq_knowledge
FOR SELECT
USING (true);

-- Индекс для полнотекстового поиска по русским ключевым словам
CREATE INDEX idx_faq_search_keywords ON public.faq_knowledge 
USING gin(to_tsvector('russian', coalesce(search_keywords, '') || ' ' || coalesce(question, '')));

-- Триггер для обновления updated_at
CREATE TRIGGER update_faq_knowledge_updated_at
BEFORE UPDATE ON public.faq_knowledge
FOR EACH ROW
EXECUTE FUNCTION public.update_faq_updated_at_column();