# SQL Migration Scripts for External Supabase

This folder contains SQL scripts for migrating to an external Supabase project.

## Files

1. **01-schema.sql** - Database schema (tables, RLS policies, functions, triggers)
2. **02-data.sql** - Seed data for static tables (translations, FAQ, calculator params)

## Migration Steps

1. Create a new Supabase project at https://supabase.com/dashboard
2. Go to SQL Editor
3. Run `01-schema.sql` first
4. Run `02-data.sql` second
5. Create storage bucket "profile-photos" with public access
6. Add secrets in Edge Functions settings:
   - `PROTALK_BOT_TOKEN`
   - `PROTALK_BOT_ID`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_PROJECTS_CHAT_ID`
7. Deploy Edge Functions via Supabase CLI

## Edge Functions Deployment

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy ai-chat
supabase functions deploy ai-search
supabase functions deploy wiki-ai-search
supabase functions deploy crm-ai-search
supabase functions deploy generate-video-script
supabase functions deploy translate-resume
supabase functions deploy sync-google-sheets
supabase functions deploy sync-crm-sheets
supabase functions deploy sync-projects-sheets
supabase functions deploy notify-project-response
```

## Update Environment Variables

After migration, update your `.env` file:

```
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_KEY"
VITE_SUPABASE_PROJECT_ID="YOUR_PROJECT_ID"
```
