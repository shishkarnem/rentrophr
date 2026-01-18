-- Create notification_templates table for storing message templates
CREATE TABLE public.notification_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_key text NOT NULL UNIQUE,
  template_text text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Notification templates are publicly readable"
ON public.notification_templates
FOR SELECT
USING (true);

-- Create policy for admin updates (service role)
CREATE POLICY "Service role can manage notification templates"
ON public.notification_templates
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert default template for project response notification
INSERT INTO public.notification_templates (template_key, template_text, description) VALUES (
  'project_response',
  '👍ОТКЛИК НА ПРОЕКТ👍
Проект: {{project_name}} {{project_code}}
{{region}}

Контакты:
{{full_name}}
{{full_name}} {{user_code}} {{telegram_link}}
{{phone_section}}
Ссылка на Проект: {{project_link}}
Профиль кандидата: {{profile_link}}
Менеджер проекта: {{manager_username}}
ДПР: {{dpr_username}}',
  'Шаблон уведомления при отклике на проект'
);

-- Create trigger for updated_at
CREATE TRIGGER update_notification_templates_updated_at
BEFORE UPDATE ON public.notification_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_faq_updated_at_column();