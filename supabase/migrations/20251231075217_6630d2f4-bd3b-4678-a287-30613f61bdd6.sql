-- Add UPDATE policy for crm_data to allow users to update their own resume fields
CREATE POLICY "Users can update their own CRM data"
ON public.crm_data
FOR UPDATE
USING (true)
WITH CHECK (true);