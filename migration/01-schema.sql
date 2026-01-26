-- ============================================
-- RentROP HR Portal - Database Schema
-- Run this script first in your new Supabase project
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLES
-- ============================================

-- Telegram Profiles
CREATE TABLE public.telegram_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  username text,
  first_name text,
  last_name text,
  language_code text DEFAULT 'ru'::text,
  photo_url text
);

-- CRM Data
CREATE TABLE public.crm_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  telegram_id bigint,
  telegram_name text,
  code text,
  full_info text,
  full_info_manual text,
  status text,
  status_manual text,
  result text,
  result_manual text,
  hr text,
  hr_manual text,
  hr_comment text,
  hr_robot text,
  hr_chat_id text,
  phone text,
  rf_phone text,
  city text,
  region text,
  birth_date date,
  birth_date_manual date,
  birthday_enabled boolean DEFAULT false,
  birthday_enabled_manual boolean DEFAULT false,
  language text,
  language_choice text,
  rating text,
  level text,
  level_manual text,
  available_skills text,
  progress text,
  conditions text,
  portal text,
  reporting text,
  tests_passed text,
  tests_manual text,
  interview text,
  interview_date date,
  test_conditions text,
  test_portal text,
  test_report text,
  test_robot text,
  contract_signing text,
  contract_date date,
  contract_date_manual date,
  contract_link text,
  contract_link_chat text,
  video_card text,
  video_script text,
  business_card_link text,
  photo_link text,
  profile_link text,
  resume_link text,
  resume_link_chat text,
  resume_text text,
  work_start text,
  work_start_date date,
  projects_mailing text,
  projects_in_work integer,
  add_to_experts text,
  to_experts text,
  to_experts_manual text,
  training_completed text,
  days_worked integer,
  dismissal_date date,
  rejection_date date,
  rejection_date_manual date,
  rejection_id text,
  feedback_date date,
  waiting_period text,
  sending text,
  rop_name text,
  protalk_id text,
  block_id text,
  checklist_answers text,
  row_hash text,
  start_date timestamptz,
  in_app boolean DEFAULT false,
  reminders_disabled boolean DEFAULT false,
  disabled_n boolean DEFAULT false,
  disabled_y boolean DEFAULT false,
  disabled_aa boolean DEFAULT false,
  disabled_ac boolean DEFAULT false,
  disabled_ae boolean DEFAULT false
);

-- Projects Data
CREATE TABLE public.projects_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  project_code text NOT NULL UNIQUE,
  region text,
  description text,
  project_manager text,
  dpr text,
  project_status text,
  availability text,
  manager_link text,
  dpr_link text,
  row_hash text
);

-- Project Swipes
CREATE TABLE public.project_swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  telegram_id bigint NOT NULL,
  project_id uuid NOT NULL REFERENCES public.projects_data(id),
  project_code text NOT NULL,
  action text NOT NULL
);

-- AI Chat Logs
CREATE TABLE public.ai_chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  telegram_user_id bigint REFERENCES public.telegram_profiles(telegram_id),
  session_id text NOT NULL,
  user_message text NOT NULL,
  assistant_response text NOT NULL,
  language text DEFAULT 'ru'::text
);

-- FAQ Knowledge
CREATE TABLE public.faq_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  question text NOT NULL,
  answer text NOT NULL,
  question_en text,
  question_kz text,
  answer_en text,
  answer_kz text,
  category text DEFAULT 'Общее'::text,
  search_keywords text,
  row_hash text
);

-- Contract FAQ
CREATE TABLE public.contract_faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  question text NOT NULL,
  answer text NOT NULL,
  question_en text,
  question_kz text,
  answer_en text,
  answer_kz text,
  category text DEFAULT 'Общее'::text,
  sort_order integer DEFAULT 0
);

-- Translations
CREATE TABLE public.translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  key text NOT NULL UNIQUE,
  text_ru text NOT NULL DEFAULT ''::text,
  text_en text NOT NULL DEFAULT ''::text,
  text_kz text NOT NULL DEFAULT ''::text,
  category text
);

-- Notification Templates
CREATE TABLE public.notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  template_key text NOT NULL UNIQUE,
  template_text text NOT NULL,
  description text
);

-- Salary Calculator Params
CREATE TABLE public.salary_calculator_params (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  param_key text NOT NULL UNIQUE,
  param_value jsonb NOT NULL,
  description text,
  category text DEFAULT 'general'::text
);

-- ============================================
-- 2. FUNCTIONS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_translations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_faq_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_salary_params_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Generate profile link function
CREATE OR REPLACE FUNCTION public.generate_profile_link()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.telegram_id IS NOT NULL AND (NEW.profile_link IS NULL OR NEW.profile_link = '') THEN
    NEW.profile_link := 'https://rentrophr.lovable.app/' || NEW.telegram_id::text;
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================
-- 3. TRIGGERS
-- ============================================

CREATE TRIGGER update_translations_timestamp
  BEFORE UPDATE ON public.translations
  FOR EACH ROW EXECUTE FUNCTION public.update_translations_updated_at();

CREATE TRIGGER update_faq_timestamp
  BEFORE UPDATE ON public.faq_knowledge
  FOR EACH ROW EXECUTE FUNCTION public.update_faq_updated_at_column();

CREATE TRIGGER update_salary_params_timestamp
  BEFORE UPDATE ON public.salary_calculator_params
  FOR EACH ROW EXECUTE FUNCTION public.update_salary_params_updated_at();

CREATE TRIGGER generate_crm_profile_link
  BEFORE INSERT OR UPDATE ON public.crm_data
  FOR EACH ROW EXECUTE FUNCTION public.generate_profile_link();

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.telegram_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_calculator_params ENABLE ROW LEVEL SECURITY;

-- Telegram Profiles Policies
CREATE POLICY "Anyone can read telegram profiles" ON public.telegram_profiles
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert telegram profiles" ON public.telegram_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update telegram profiles" ON public.telegram_profiles
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete telegram profiles" ON public.telegram_profiles
  FOR DELETE USING (true);

-- CRM Data Policies
CREATE POLICY "CRM data is publicly readable" ON public.crm_data
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own CRM data" ON public.crm_data
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage CRM data" ON public.crm_data
  FOR ALL USING (true) WITH CHECK (true);

-- Projects Data Policies
CREATE POLICY "Projects data is publicly readable" ON public.projects_data
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage projects data" ON public.projects_data
  FOR ALL USING (true) WITH CHECK (true);

-- Project Swipes Policies
CREATE POLICY "Anyone can read project swipes" ON public.project_swipes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert project swipes" ON public.project_swipes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own swipes" ON public.project_swipes
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete their own swipes" ON public.project_swipes
  FOR DELETE USING (true);

-- AI Chat Logs Policies
CREATE POLICY "Anyone can read chat logs" ON public.ai_chat_logs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert chat logs" ON public.ai_chat_logs
  FOR INSERT WITH CHECK (true);

-- FAQ Knowledge Policies
CREATE POLICY "FAQ is publicly readable" ON public.faq_knowledge
  FOR SELECT USING (true);

-- Contract FAQ Policies
CREATE POLICY "Contract FAQ is publicly readable" ON public.contract_faq
  FOR SELECT USING (true);

-- Translations Policies
CREATE POLICY "Translations are publicly readable" ON public.translations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert translations" ON public.translations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update translations" ON public.translations
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Notification Templates Policies
CREATE POLICY "Notification templates are publicly readable" ON public.notification_templates
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage notification templates" ON public.notification_templates
  FOR ALL USING (true) WITH CHECK (true);

-- Salary Calculator Params Policies
CREATE POLICY "Calculator params are publicly readable" ON public.salary_calculator_params
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage calculator params" ON public.salary_calculator_params
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 5. INDEXES
-- ============================================

CREATE INDEX idx_crm_data_telegram_id ON public.crm_data(telegram_id);
CREATE INDEX idx_crm_data_status ON public.crm_data(status);
CREATE INDEX idx_project_swipes_telegram_id ON public.project_swipes(telegram_id);
CREATE INDEX idx_project_swipes_project_id ON public.project_swipes(project_id);
CREATE INDEX idx_translations_key ON public.translations(key);
CREATE INDEX idx_faq_knowledge_category ON public.faq_knowledge(category);

-- ============================================
-- Schema creation complete!
-- Now run 02-data.sql to seed the data
-- ============================================
