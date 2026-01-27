

## План: Обновление .env для внешнего Supabase

### Что будет сделано

Обновление файла `.env` в корне проекта с новыми учётными данными вашего внешнего Supabase проекта.

---

### Изменения в файле `.env`

**Было (Lovable Cloud):**
```
VITE_SUPABASE_PROJECT_ID="nlrtpectlljrghutjknp"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scnRwZWN0bGxqcmdodXRqa25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NTM3MjUsImV4cCI6MjA4MjAyOTcyNX0.cXLohdUAfA2mvVmTW-QXMAb50jj4OOt0jTkLxGx-XHE"
VITE_SUPABASE_URL="https://nlrtpectlljrghutjknp.supabase.co"
```

**Станет (ваш внешний Supabase):**
```
VITE_SUPABASE_PROJECT_ID="lguqidhowklnrfirinrp"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndXFpZGhvd2tsbnJmaXJpbnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NjQ4NzAsImV4cCI6MjA4NTA0MDg3MH0.I9bjxRsuoWmoqBhvoafrESf-9YuKi9Z0VZRMYnYSQM8"
VITE_SUPABASE_URL="https://lguqidhowklnrfirinrp.supabase.co"
```

---

### Результат

После этого изменения ваш фронтенд будет подключаться к вашему внешнему Supabase проекту вместо Lovable Cloud.

