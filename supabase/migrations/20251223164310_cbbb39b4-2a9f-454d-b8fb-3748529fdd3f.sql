-- Add category column to faq_knowledge table
ALTER TABLE public.faq_knowledge 
ADD COLUMN category text DEFAULT 'Общее';

-- Add multilingual columns for FAQ
ALTER TABLE public.faq_knowledge
ADD COLUMN question_en text,
ADD COLUMN question_kz text,
ADD COLUMN answer_en text,
ADD COLUMN answer_kz text;

-- Create index for category for faster filtering
CREATE INDEX idx_faq_knowledge_category ON public.faq_knowledge(category);