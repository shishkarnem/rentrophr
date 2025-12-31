-- Create CRM data table for Google Sheets sync
CREATE TABLE public.crm_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT UNIQUE, -- chat_id (A column)
  code TEXT, -- КОД (B)
  telegram_name TEXT, -- Телеграм Клиента (C)
  full_info TEXT, -- ФИО, Код и Телеграм (E)
  hr_comment TEXT, -- Комментарий HR (F)
  hr TEXT, -- HR (G)
  hr_manual TEXT, -- HR вручную (H)
  full_info_manual TEXT, -- ФИО, Код и телега вручную (I)
  resume_link TEXT, -- Ссылка на резюме (J)
  resume_link_chat TEXT, -- Ссылка на резюме в чате (K)
  resume_text TEXT, -- Текст Резюме (L)
  start_date TIMESTAMP WITH TIME ZONE, -- Дата старта (M)
  disabled_n BOOLEAN DEFAULT FALSE, -- Выкл (N)
  rejection_date DATE, -- Дата отказа (O)
  rejection_date_manual DATE, -- Дата отказа вручную (P)
  interview_date DATE, -- Дата интервью (Q)
  level TEXT, -- Уровень (R)
  level_manual TEXT, -- Уровень вручную (S)
  rating TEXT, -- Рейтинг (T)
  result TEXT, -- Результат (U)
  result_manual TEXT, -- Результат вручную (V)
  conditions TEXT, -- Условия (W)
  reminders_disabled BOOLEAN DEFAULT FALSE, -- Выкл напоминий (X)
  disabled_y BOOLEAN DEFAULT FALSE, -- Выкл (Y)
  portal TEXT, -- Портал (Z)
  disabled_aa BOOLEAN DEFAULT FALSE, -- Выкл (AA)
  reporting TEXT, -- Отчетность (AB)
  disabled_ac BOOLEAN DEFAULT FALSE, -- Выкл (AC)
  hr_robot TEXT, -- Робот HR (AD)
  disabled_ae BOOLEAN DEFAULT FALSE, -- Выкл (AE)
  tests_passed TEXT, -- Пройдено тестов (AF)
  tests_manual TEXT, -- Тестов вручную (AG)
  add_to_experts TEXT, -- Добавить в эксперты (AH)
  to_experts_manual TEXT, -- В Эксперты вручную (AI)
  contract_date_manual DATE, -- Дата подписания договора вручную (AJ)
  contract_link_chat TEXT, -- Ссылка на договор из чата (AK)
  contract_date DATE, -- Дата подписания договора (AL)
  contract_link TEXT, -- Ссылка на договор (AM)
  business_card_link TEXT, -- Ссылка на визитку (AN)
  work_start_date DATE, -- Старт работы (AO)
  dismissal_date DATE, -- Дата увольнения (AP)
  status TEXT, -- Статус (AQ)
  status_manual TEXT, -- Статус вручную (AR)
  birth_date DATE, -- Дата рождения (AS)
  birth_date_manual DATE, -- Дата рождения вручную (AT)
  birthday_enabled BOOLEAN DEFAULT FALSE, -- Вкл ДР (AU)
  birthday_enabled_manual BOOLEAN DEFAULT FALSE, -- Вкл ДР вручную (AV)
  days_worked INTEGER, -- Дней работы (AW)
  language TEXT, -- Язык (AX)
  to_experts TEXT, -- В Эксперты (AY)
  photo_link TEXT, -- Ссылка Фото (AZ)
  feedback_date DATE, -- Дата обратной связи (BA)
  waiting_period TEXT, -- Срок в ожидании (BB)
  training_completed TEXT, -- Пройдено обучение за (BC)
  projects_in_work INTEGER, -- Проектов В работе (BD)
  sending TEXT, -- Отправка (BE)
  phone TEXT, -- Телефон (BF)
  rejection_id TEXT, -- ID Отказа (BG)
  rf_phone TEXT, -- РФтелефон (BH)
  available_skills TEXT, -- Доступные навыки (BI)
  progress TEXT, -- Прогресс (BJ)
  language_choice TEXT, -- Выбор языка (BK)
  interview TEXT, -- Интервью (BL)
  test_conditions TEXT, -- Тест Условия (BM)
  test_portal TEXT, -- Тест Портал (BN)
  test_report TEXT, -- Тест Отчет (BO)
  test_robot TEXT, -- Тест Робот (BP)
  contract_signing TEXT, -- Подписание договора (BQ)
  video_card TEXT, -- Видео-визитка (BR)
  work_start TEXT, -- Выход на работу (BS)
  projects_mailing TEXT, -- Рассылка проектов (BT)
  protalk_id TEXT, -- ID ProTalk (BU)
  in_app BOOLEAN DEFAULT FALSE, -- В аппке (BV)
  block_id TEXT, -- ID Блока (BW)
  row_hash TEXT, -- For tracking changes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.crm_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read
CREATE POLICY "CRM data is publicly readable"
ON public.crm_data
FOR SELECT
USING (true);

-- Create policy for service role to insert/update
CREATE POLICY "Service role can manage CRM data"
ON public.crm_data
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index on telegram_id for fast lookups
CREATE INDEX idx_crm_data_telegram_id ON public.crm_data(telegram_id);
CREATE INDEX idx_crm_data_row_hash ON public.crm_data(row_hash);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_crm_data_updated_at
BEFORE UPDATE ON public.crm_data
FOR EACH ROW
EXECUTE FUNCTION public.update_faq_updated_at_column();