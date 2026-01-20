-- Create table for salary calculator parameters
CREATE TABLE public.salary_calculator_params (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  param_key TEXT NOT NULL UNIQUE,
  param_value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general'
);

-- Enable Row Level Security
ALTER TABLE public.salary_calculator_params ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Calculator params are publicly readable" 
ON public.salary_calculator_params 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage calculator params" 
ON public.salary_calculator_params 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Insert default calculator parameters based on tariff tables
INSERT INTO public.salary_calculator_params (param_key, param_value, description, category) VALUES
-- Currency rates
('currency_rates', '{"tenge_rate": 7, "usd_rate": 75, "eur_rate": 85}', 'Курсы валют: Тенге 1 к 7, $ = 75, Евро = 85', 'rates'),

-- Base tariffs for Online format
('tariff_online_4h', '{"international": 225000, "rf_cis": 120000, "management": true}', 'Онлайн 4 часа - базовые тарифы', 'tariffs'),
('tariff_online_8h', '{"international": 345000, "rf_cis": 170000, "management": true}', 'Онлайн 8 часов - базовые тарифы', 'tariffs'),

-- Base tariffs for Combined format
('tariff_combined_4h', '{"international": 150000, "rf_cis": null, "management": true}', 'Комбинированный 4 часа', 'tariffs'),
('tariff_combined_8h', '{"international": 210000, "rf_cis": null, "management": true}', 'Комбинированный 8 часов', 'tariffs'),

-- Startup tariffs
('tariff_startup_4h', '{"international": 285000, "rf_cis": 150000, "management": false}', 'Тариф Стартап 4 часа', 'tariffs'),
('tariff_startup_8h', '{"international": 420000, "rf_cis": 200000, "management": false}', 'Тариф Стартап 8 часов', 'tariffs'),

-- Online without DPR tariffs
('tariff_no_dpr_4h', '{"international": 195000, "rf_cis": 90000, "management": true}', 'Онлайн Без ДПРа 4 часа', 'tariffs'),
('tariff_no_dpr_8h', '{"international": 325000, "rf_cis": 140000, "management": true}', 'Онлайн Без ДПРа 8 часов', 'tariffs'),

-- Fix percentages by project duration (8 hours online, 1 project)
('fix_percent_8h_1proj', '{"up_to_1_month": 45, "2_to_6_months": 50, "7_to_12_months": 55, "over_12_months": 60}', 'Процент фикса 8 часов 1 проект', 'fix_percent'),

-- Variable percentages by revenue (8 hours online, 1 project)
('variable_percent_8h_1proj', '{"up_to_60k": 51, "60_to_120k": 53, "120k_plus": 55}', 'Процент переменки 8ч 1 проект до 1 мес', 'variable_percent'),

-- Variable by project age for 8h 1 project
('variable_by_age_8h_1proj', '{"up_to_1_month": {"up_to_60k": 51, "60_to_120k": 53, "120k_plus": 55}, "2_to_6_months": {"up_to_60k": 53, "60_to_120k": 55, "120k_plus": 57}, "7_to_12_months": {"up_to_60k": 55, "60_to_120k": 57, "120k_plus": 60}, "over_12_months": {"up_to_60k": 57, "60_to_120k": 60, "120k_plus": 62}}', 'Переменная по сроку проекта 8ч 1 проект', 'variable_percent'),

-- Fix percentages for 4h 2 projects
('fix_percent_4h_2proj', '{"up_to_1_month": 40, "2_to_6_months": 45, "7_to_12_months": 50, "over_12_months": 55}', 'Процент фикса 4 часа 2 проекта', 'fix_percent'),

-- Variable by project age for 4h 2 projects
('variable_by_age_4h_2proj', '{"up_to_1_month": {"up_to_60k": 50, "60_to_120k": 52, "120k_plus": 54}, "2_to_6_months": {"up_to_60k": 52, "60_to_120k": 54, "120k_plus": 56}, "7_to_12_months": {"up_to_60k": 54, "60_to_120k": 56, "120k_plus": 58}, "over_12_months": {"up_to_60k": 56, "60_to_120k": 58, "120k_plus": 60}}', 'Переменная по сроку проекта 4ч 2 проекта', 'variable_percent'),

-- Fix percentages for 4h no DPR 2 projects
('fix_percent_4h_no_dpr_2proj', '{"up_to_1_month": 50, "2_to_6_months": 55, "7_to_12_months": 60, "over_12_months": 65}', 'Процент фикса 4ч без ДПР 2 проекта', 'fix_percent'),

-- Variable by project age for 4h no DPR 2 projects  
('variable_by_age_4h_no_dpr_2proj', '{"up_to_1_month": {"up_to_60k": 60, "60_to_120k": 62, "120k_plus": 64}, "2_to_6_months": {"up_to_60k": 62, "60_to_120k": 64, "120k_plus": 66}, "7_to_12_months": {"up_to_60k": 64, "60_to_120k": 66, "120k_plus": 68}, "over_12_months": {"up_to_60k": 66, "60_to_120k": 68, "120k_plus": 70}}', 'Переменная по сроку проекта 4ч без ДПР 2 проекта', 'variable_percent'),

-- Special roles
('special_roles', '{"mentor_x2": {"rub": 60000, "tenge": 420000, "usd": 800, "eur": 706}, "methodologist": {"rub": 120000, "tenge": 840000, "usd": 1600, "eur": 1412}}', 'Наставник x2 и Методолог', 'roles'),

-- Deposit info
('deposit_info', '{"months": 1.5, "applies_to": ["startup"]}', 'Депозит на 1,5 месяца', 'other'),

-- KPI bonus info
('kpi_bonus', '{"applies_to": ["online", "no_dpr"], "description": "% / KPI бонус"}', 'KPI бонус', 'other');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_salary_params_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_salary_params_updated_at
BEFORE UPDATE ON public.salary_calculator_params
FOR EACH ROW
EXECUTE FUNCTION public.update_salary_params_updated_at();