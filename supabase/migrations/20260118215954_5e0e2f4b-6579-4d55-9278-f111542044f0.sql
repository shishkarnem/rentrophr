-- Add profile_link column to crm_data
ALTER TABLE public.crm_data 
ADD COLUMN IF NOT EXISTS profile_link text;

-- Create function to auto-generate profile link
CREATE OR REPLACE FUNCTION public.generate_profile_link()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.telegram_id IS NOT NULL AND (NEW.profile_link IS NULL OR NEW.profile_link = '') THEN
    NEW.profile_link := 'https://hr.rent-rop.com/' || NEW.telegram_id::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for new inserts and updates
DROP TRIGGER IF EXISTS set_profile_link_on_insert ON public.crm_data;
CREATE TRIGGER set_profile_link_on_insert
  BEFORE INSERT ON public.crm_data
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_profile_link();

DROP TRIGGER IF EXISTS set_profile_link_on_update ON public.crm_data;
CREATE TRIGGER set_profile_link_on_update
  BEFORE UPDATE ON public.crm_data
  FOR EACH ROW
  WHEN (OLD.telegram_id IS DISTINCT FROM NEW.telegram_id OR NEW.profile_link IS NULL OR NEW.profile_link = '')
  EXECUTE FUNCTION public.generate_profile_link();