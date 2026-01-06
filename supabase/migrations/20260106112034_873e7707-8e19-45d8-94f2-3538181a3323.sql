-- Add new columns for interview data (BX-CB from Google Sheet)
ALTER TABLE public.crm_data
ADD COLUMN IF NOT EXISTS rop_name text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS checklist_answers text,
ADD COLUMN IF NOT EXISTS hr_chat_id text;