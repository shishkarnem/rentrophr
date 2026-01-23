-- Create contract FAQ table for questions and answers about contracts
CREATE TABLE public.contract_faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  question_en TEXT,
  question_kz TEXT,
  answer_en TEXT,
  answer_kz TEXT,
  category TEXT DEFAULT 'Общее'::text,
  sort_order INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.contract_faq ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Contract FAQ is publicly readable" 
ON public.contract_faq 
FOR SELECT 
USING (true);

-- Create trigger for updating updated_at
CREATE TRIGGER update_contract_faq_updated_at
BEFORE UPDATE ON public.contract_faq
FOR EACH ROW
EXECUTE FUNCTION public.update_faq_updated_at_column();