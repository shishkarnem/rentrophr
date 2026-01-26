-- ============================================
-- RentROP HR Portal - Seed Data
-- Run this script after 01-schema.sql
-- ============================================

-- ============================================
-- 1. NOTIFICATION TEMPLATES
-- ============================================

INSERT INTO public.notification_templates (template_key, template_text, description) VALUES
('project_response', '👍ОТКЛИК НА ПРОЕКТ👍
Проект: {{project_name}} {{project_code}}
{{region}}

РОП: {{full_name}} {{user_code}} {{telegram_link}} {{phone_section}}
Ссылка на Проект: {{project_link}}
Профиль кандидата: {{profile_link}}
Менеджер проекта: {{manager_username}}
ДПР: {{dpr_username}}', 'Шаблон уведомления при отклике на проект');

-- ============================================
-- 2. SALARY CALCULATOR PARAMS
-- ============================================

INSERT INTO public.salary_calculator_params (param_key, param_value, description, category) VALUES
-- Tariffs
('tariff_online_4h', '{"international": 225000, "rf_cis": 120000, "management": true}', 'Онлайн 4 часа - базовые тарифы', 'tariffs'),
('tariff_online_8h', '{"international": 345000, "rf_cis": 170000, "management": true}', 'Онлайн 8 часов - базовые тарифы', 'tariffs'),
('tariff_combined_4h', '{"international": 150000, "rf_cis": null, "management": true}', 'Комбинированный 4 часа', 'tariffs'),
('tariff_combined_8h', '{"international": 210000, "rf_cis": null, "management": true}', 'Комбинированный 8 часов', 'tariffs'),
('tariff_no_dpr_4h', '{"international": 195000, "rf_cis": 90000, "management": true}', 'Онлайн Без ДПРа 4 часа', 'tariffs'),
('tariff_no_dpr_8h', '{"international": 325000, "rf_cis": 140000, "management": true}', 'Онлайн Без ДПРа 8 часов', 'tariffs'),
('tariff_startup_4h', '{"international": 285000, "rf_cis": 150000, "management": false}', 'Тариф Стартап 4 часа', 'tariffs'),
('tariff_startup_8h', '{"international": 420000, "rf_cis": 200000, "management": false}', 'Тариф Стартап 8 часов', 'tariffs'),

-- Fix percentages
('fix_percent_4h_2proj', '{"up_to_1_month": 40, "2_to_6_months": 45, "7_to_12_months": 50, "over_12_months": 55}', 'Процент фикса 4 часа 2 проекта', 'fix_percent'),
('fix_percent_4h_no_dpr_2proj', '{"up_to_1_month": 50, "2_to_6_months": 55, "7_to_12_months": 60, "over_12_months": 65}', 'Процент фикса 4ч без ДПР 2 проекта', 'fix_percent'),
('fix_percent_8h_1proj', '{"up_to_1_month": 45, "2_to_6_months": 50, "7_to_12_months": 55, "over_12_months": 60}', 'Процент фикса 8 часов 1 проект', 'fix_percent'),

-- Variable percentages
('variable_percent_8h_1proj', '{"up_to_60k": 51, "60_to_120k": 53, "120k_plus": 55}', 'Процент переменки 8ч 1 проект до 1 мес', 'variable_percent'),
('variable_by_age_4h_2proj', '{"up_to_1_month": {"up_to_60k": 50, "60_to_120k": 52, "120k_plus": 54}, "2_to_6_months": {"up_to_60k": 52, "60_to_120k": 54, "120k_plus": 56}, "7_to_12_months": {"up_to_60k": 54, "60_to_120k": 56, "120k_plus": 58}, "over_12_months": {"up_to_60k": 56, "60_to_120k": 58, "120k_plus": 60}}', 'Переменная по сроку проекта 4ч 2 проекта', 'variable_percent'),
('variable_by_age_4h_no_dpr_2proj', '{"up_to_1_month": {"up_to_60k": 60, "60_to_120k": 62, "120k_plus": 64}, "2_to_6_months": {"up_to_60k": 62, "60_to_120k": 64, "120k_plus": 66}, "7_to_12_months": {"up_to_60k": 64, "60_to_120k": 66, "120k_plus": 68}, "over_12_months": {"up_to_60k": 66, "60_to_120k": 68, "120k_plus": 70}}', 'Переменная по сроку проекта 4ч без ДПР 2 проекта', 'variable_percent'),
('variable_by_age_8h_1proj', '{"up_to_1_month": {"up_to_60k": 51, "60_to_120k": 53, "120k_plus": 55}, "2_to_6_months": {"up_to_60k": 53, "60_to_120k": 55, "120k_plus": 57}, "7_to_12_months": {"up_to_60k": 55, "60_to_120k": 57, "120k_plus": 60}, "over_12_months": {"up_to_60k": 57, "60_to_120k": 60, "120k_plus": 62}}', 'Переменная по сроку проекта 8ч 1 проект', 'variable_percent'),

-- Other settings
('currency_rates', '{"tenge_rate": 7, "usd_rate": 75, "eur_rate": 85}', 'Курсы валют: Тенге 1 к 7, $ = 75, Евро = 85', 'rates'),
('special_roles', '{"mentor_x2": {"rub": 60000, "tenge": 420000, "usd": 800, "eur": 706}, "methodologist": {"rub": 120000, "tenge": 840000, "usd": 1600, "eur": 1412}}', 'Наставник x2 и Методолог', 'roles'),
('deposit_info', '{"months": 1.5, "applies_to": ["startup"]}', 'Депозит на 1,5 месяца', 'other'),
('kpi_bonus', '{"applies_to": ["online", "no_dpr"], "description": "% / KPI бонус"}', 'KPI бонус', 'other');

-- ============================================
-- 3. TRANSLATIONS & FAQ DATA
-- ============================================

-- NOTE: Translations (517 records), FAQ (119 records), and Contract FAQ (50 records) 
-- are too large to include inline. Export them using one of these methods:

-- Option A: Export from Lovable Cloud UI
-- 1. Go to Cloud tab → Database → Tables
-- 2. Select 'translations' table
-- 3. Click Export button to download CSV
-- 4. Repeat for 'faq_knowledge' and 'contract_faq'
-- 5. Import CSVs into new Supabase project via Table Editor → Import CSV

-- Option B: Use psql COPY command (if you have direct DB access)
-- COPY translations TO '/tmp/translations.csv' WITH CSV HEADER;
-- COPY faq_knowledge TO '/tmp/faq_knowledge.csv' WITH CSV HEADER;
-- COPY contract_faq TO '/tmp/contract_faq.csv' WITH CSV HEADER;

-- Option C: Use Supabase CLI backup/restore
-- supabase db dump --data-only -t translations -f translations_data.sql

-- ============================================
-- 4. STORAGE BUCKET
-- ============================================

-- Create profile-photos bucket (run in SQL Editor):
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public access
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Anyone can upload profile photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Anyone can update profile photos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'profile-photos');

-- ============================================
-- DATA SYNC NOTES
-- ============================================

-- The following tables are auto-synced from Google Sheets 
-- and do NOT need manual data migration:
-- - crm_data (syncs via sync-crm-sheets edge function)
-- - projects_data (syncs via sync-projects-sheets edge function)
-- - faq_knowledge (syncs via sync-google-sheets edge function)

-- After deploying edge functions, trigger sync by:
-- 1. Opening the app (auto-syncs on load)
-- 2. Or manually calling the edge functions via curl

-- ============================================
-- Migration complete!
-- ============================================
