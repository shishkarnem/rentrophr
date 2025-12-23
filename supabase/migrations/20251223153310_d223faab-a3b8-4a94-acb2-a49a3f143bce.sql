-- Create telegram_profiles table
CREATE TABLE public.telegram_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT NOT NULL UNIQUE,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  language_code TEXT DEFAULT 'ru',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles (needed for public display)
CREATE POLICY "Telegram profiles are publicly readable"
ON public.telegram_profiles
FOR SELECT
USING (true);

-- Anyone can insert their own profile (from telegram webapp)
CREATE POLICY "Anyone can insert telegram profiles"
ON public.telegram_profiles
FOR INSERT
WITH CHECK (true);

-- Anyone can update profiles
CREATE POLICY "Anyone can update telegram profiles"
ON public.telegram_profiles
FOR UPDATE
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_telegram_profiles_updated_at
BEFORE UPDATE ON public.telegram_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_translations_updated_at();

-- Add telegram_user_id column to ai_chat_logs
ALTER TABLE public.ai_chat_logs
ADD COLUMN telegram_user_id BIGINT REFERENCES public.telegram_profiles(telegram_id);

-- Create index for faster queries
CREATE INDEX idx_telegram_profiles_telegram_id ON public.telegram_profiles(telegram_id);
CREATE INDEX idx_ai_chat_logs_telegram_user_id ON public.ai_chat_logs(telegram_user_id);

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Storage policies for profile photos
CREATE POLICY "Profile photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Anyone can upload profile photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Anyone can update profile photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'profile-photos');

CREATE POLICY "Anyone can delete profile photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'profile-photos');