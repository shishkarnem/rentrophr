-- Create table for AI chat logs
CREATE TABLE public.ai_chat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  language TEXT DEFAULT 'ru',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (no auth required for logging)
CREATE POLICY "Anyone can insert chat logs"
ON public.ai_chat_logs
FOR INSERT
WITH CHECK (true);

-- Allow public reads for analytics (optional)
CREATE POLICY "Anyone can read chat logs"
ON public.ai_chat_logs
FOR SELECT
USING (true);

-- Create index for faster queries by session
CREATE INDEX idx_ai_chat_logs_session_id ON public.ai_chat_logs(session_id);
CREATE INDEX idx_ai_chat_logs_created_at ON public.ai_chat_logs(created_at DESC);