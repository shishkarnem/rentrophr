-- Add video_script column to crm_data for storing AI-generated video business card scripts
ALTER TABLE public.crm_data ADD COLUMN IF NOT EXISTS video_script text;