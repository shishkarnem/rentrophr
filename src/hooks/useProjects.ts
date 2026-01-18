import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  project_code: string;
  region: string | null;
  description: string | null;
  project_manager: string | null;
  dpr: string | null;
  project_status: string | null;
  availability: string | null;
  manager_link: string | null;
  dpr_link: string | null;
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects_data')
        .select('*')
        .eq('availability', 'Ok')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });
};
