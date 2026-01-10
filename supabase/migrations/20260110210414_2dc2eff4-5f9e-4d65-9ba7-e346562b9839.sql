-- Update cron job to run every 15 minutes instead of every minute
SELECT cron.unschedule('sync-crm-sheets-every-minute');

SELECT cron.schedule(
  'sync-crm-sheets-every-15-min',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://nlrtpectlljrghutjknp.supabase.co/functions/v1/sync-crm-sheets',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scnRwZWN0bGxqcmdodXRqa25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NTM3MjUsImV4cCI6MjA4MjAyOTcyNX0.cXLohdUAfA2mvVmTW-QXMAb50jj4OOt0jTkLxGx-XHE"}'::jsonb,
    body := '{"source": "cron"}'::jsonb
  ) AS request_id;
  $$
);