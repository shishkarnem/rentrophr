import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CrmData {
  id: string;
  telegram_id: number | null;
  code: string | null;
  telegram_name: string | null;
  full_info: string | null;
  status: string | null;
  rating: string | null;
  result: string | null;
  contract_date: string | null;
  contract_link: string | null;
  business_card_link: string | null;
  work_start_date: string | null;
  tests_passed: string | null;
  dismissal_date: string | null;
  days_worked: number | null;
  waiting_period: string | null;
  training_completed: string | null;
  phone: string | null;
  birth_date: string | null;
  resume_link: string | null;
  resume_text: string | null;
  available_skills: string | null;
  progress: string | null;
  language_choice: string | null;
  interview: string | null;
  test_conditions: string | null;
  test_portal: string | null;
  test_report: string | null;
  test_robot: string | null;
  contract_signing: string | null;
  video_card: string | null;
  work_start: string | null;
  projects_mailing: string | null;
  hr: string | null;
  photo_link: string | null;
  resume_link_chat: string | null;
  // New interview fields
  rop_name: string | null;
  city: string | null;
  region: string | null;
  checklist_answers: string | null;
  hr_chat_id: string | null;
}

export const useCrmData = (telegramId: number | null) => {
  const [crmData, setCrmData] = useState<CrmData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCrmData = async () => {
    if (!telegramId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('crm_data')
        .select('*')
        .eq('telegram_id', telegramId)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setCrmData(data);
    } catch (err) {
      console.error('Error fetching CRM data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCrmData = async (updates: Partial<Pick<CrmData, 'phone' | 'birth_date' | 'resume_link' | 'resume_text'>>) => {
    if (!telegramId) return null;

    try {
      const { data, error: updateError } = await supabase
        .from('crm_data')
        .update(updates)
        .eq('telegram_id', telegramId)
        .select()
        .maybeSingle();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        setCrmData(data);
      }
      return data;
    } catch (err) {
      console.error('Error updating CRM data:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCrmData();
  }, [telegramId]);

  return { crmData, isLoading, error, refetch: fetchCrmData, updateCrmData };
};
