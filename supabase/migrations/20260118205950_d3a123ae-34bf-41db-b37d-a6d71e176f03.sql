-- Create projects table
CREATE TABLE public.projects_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  project_code TEXT NOT NULL,
  region TEXT,
  description TEXT,
  project_manager TEXT,
  dpr TEXT,
  project_status TEXT,
  availability TEXT,
  manager_link TEXT,
  dpr_link TEXT,
  row_hash TEXT UNIQUE
);

-- Enable RLS
ALTER TABLE public.projects_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Projects data is publicly readable" 
ON public.projects_data 
FOR SELECT 
USING (true);

-- Create policy for service role to manage data
CREATE POLICY "Service role can manage projects data" 
ON public.projects_data 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_projects_project_code ON public.projects_data(project_code);
CREATE INDEX idx_projects_row_hash ON public.projects_data(row_hash);