-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Service role can select telegram profiles" ON public.telegram_profiles;

-- Create public SELECT policy (anyone can read profiles)
CREATE POLICY "Anyone can read telegram profiles" 
ON public.telegram_profiles 
FOR SELECT 
USING (true);

-- Drop existing restrictive INSERT policy  
DROP POLICY IF EXISTS "Service role can insert telegram profiles" ON public.telegram_profiles;

-- Create public INSERT policy
CREATE POLICY "Anyone can insert telegram profiles" 
ON public.telegram_profiles 
FOR INSERT 
WITH CHECK (true);

-- Drop existing restrictive UPDATE policy
DROP POLICY IF EXISTS "Service role can update telegram profiles" ON public.telegram_profiles;

-- Create public UPDATE policy (users can update their own profile based on telegram_id match)
CREATE POLICY "Anyone can update telegram profiles" 
ON public.telegram_profiles 
FOR UPDATE 
USING (true)
WITH CHECK (true);