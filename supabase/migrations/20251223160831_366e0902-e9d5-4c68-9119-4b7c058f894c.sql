-- ============================================
-- SECURITY FIX: Restrict telegram_profiles access
-- ============================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Telegram profiles are publicly readable" ON public.telegram_profiles;
DROP POLICY IF EXISTS "Anyone can insert telegram profiles" ON public.telegram_profiles;
DROP POLICY IF EXISTS "Anyone can update telegram profiles" ON public.telegram_profiles;

-- Create restrictive policy: Only allow SELECT for service role (edge functions)
-- The service role key is used by our edge functions to perform all CRUD operations
-- This effectively blocks direct client access and forces all operations through validated edge functions
CREATE POLICY "Service role can select telegram profiles"
ON public.telegram_profiles
FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role can insert telegram profiles"
ON public.telegram_profiles
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update telegram profiles"
ON public.telegram_profiles
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can delete telegram profiles"
ON public.telegram_profiles
FOR DELETE
TO service_role
USING (true);

-- ============================================
-- SECURITY FIX: Restrict profile-photos storage access
-- ============================================

-- Drop existing permissive policies on storage
DROP POLICY IF EXISTS "Anyone can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Profile photos are publicly accessible" ON storage.objects;

-- Keep photos publicly readable (for displaying in app)
-- But restrict all write operations to service role only
CREATE POLICY "Profile photos are publicly readable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-photos');

-- Only service role can upload (our edge function uses service role)
CREATE POLICY "Service role can upload profile photos"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Service role can update profile photos"
ON storage.objects
FOR UPDATE
TO service_role
USING (bucket_id = 'profile-photos');

CREATE POLICY "Service role can delete profile photos"
ON storage.objects
FOR DELETE
TO service_role
USING (bucket_id = 'profile-photos');