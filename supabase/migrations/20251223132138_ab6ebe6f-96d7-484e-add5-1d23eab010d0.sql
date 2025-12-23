-- Create translations table for all text elements
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  text_ru TEXT NOT NULL DEFAULT '',
  text_en TEXT NOT NULL DEFAULT '',
  text_kz TEXT NOT NULL DEFAULT '',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (translations should be readable by everyone)
CREATE POLICY "Translations are publicly readable" 
ON public.translations 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to update (for admin purposes)
CREATE POLICY "Authenticated users can update translations" 
ON public.translations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert translations" 
ON public.translations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_translations_updated_at();

-- Create index for faster key lookups
CREATE INDEX idx_translations_key ON public.translations(key);
CREATE INDEX idx_translations_category ON public.translations(category);