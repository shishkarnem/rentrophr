-- Create table for project swipes history
CREATE TABLE public.project_swipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT NOT NULL,
  project_id UUID NOT NULL REFERENCES public.projects_data(id) ON DELETE CASCADE,
  project_code TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('like', 'respond', 'skip', 'pass')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(telegram_id, project_id)
);

-- Enable RLS
ALTER TABLE public.project_swipes ENABLE ROW LEVEL SECURITY;

-- Anyone can read swipes (for telegram users)
CREATE POLICY "Anyone can read project swipes"
  ON public.project_swipes FOR SELECT
  USING (true);

-- Anyone can insert swipes
CREATE POLICY "Anyone can insert project swipes"
  ON public.project_swipes FOR INSERT
  WITH CHECK (true);

-- Users can update their own swipes
CREATE POLICY "Users can update their own swipes"
  ON public.project_swipes FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Users can delete their own swipes
CREATE POLICY "Users can delete their own swipes"
  ON public.project_swipes FOR DELETE
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_project_swipes_telegram_id ON public.project_swipes(telegram_id);
CREATE INDEX idx_project_swipes_action ON public.project_swipes(action);

-- Create trigger for updated_at
CREATE TRIGGER update_project_swipes_updated_at
  BEFORE UPDATE ON public.project_swipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_translations_updated_at();