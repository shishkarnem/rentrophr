-- Update function to use correct domain
CREATE OR REPLACE FUNCTION public.generate_profile_link()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.telegram_id IS NOT NULL AND (NEW.profile_link IS NULL OR NEW.profile_link = '') THEN
    NEW.profile_link := 'https://rentrophr.lovable.app/' || NEW.telegram_id::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;