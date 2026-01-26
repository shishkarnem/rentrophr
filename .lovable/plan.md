
# План миграции на бесплатный Supabase с ProTalk AI

## Обзор

Этот план описывает полную миграцию проекта с Lovable Cloud на бесплатный тариф Supabase.com с заменой:
- **Lovable AI** → **ProTalk AI** (6 Edge Functions)
- **pg_cron** → **Синхронизация при входе в приложение** (3 функции)

---

## Часть 1: Экспорт данных и схемы

### 1.1 SQL-скрипт создания таблиц

Будет создан полный SQL-скрипт включающий:

```text
10 таблиц:
├── faq_knowledge (119 записей) - FAQ база знаний
├── contract_faq (50 записей) - FAQ по договорам
├── crm_data (6922 записи) - CRM данные сотрудников
├── projects_data (22 записи) - Данные проектов
├── project_swipes (68 записей) - Свайпы по проектам
├── telegram_profiles (175 записей) - Профили Telegram
├── notification_templates (1 запись) - Шаблоны уведомлений
├── salary_calculator_params (19 записей) - Параметры калькулятора
├── translations (517 записей) - Переводы UI
└── ai_chat_logs (109 записей) - Логи AI чата
```

Скрипт включит:
- CREATE TABLE с правильными типами и дефолтами
- RLS политики для каждой таблицы
- Функции и триггеры (3 штуки)
- Storage bucket `profile-photos`

### 1.2 SQL-скрипт экспорта данных

Отдельный скрипт с INSERT-ами для:
- `notification_templates` (1 запись)
- `salary_calculator_params` (19 записей)
- `translations` (517 записей) - критически важно
- `contract_faq` (50 записей)
- `faq_knowledge` (119 записей)

Данные CRM, проектов и свайпов синхронизируются автоматически из Google Sheets.

---

## Часть 2: Замена Cron на синхронизацию при входе

### 2.1 Создание хука useSyncFaq

Новый файл: `src/hooks/useSyncFaq.ts`

```typescript
// Структура аналогична useSyncCrm и useSyncProjects
// Throttle: 60 минут
// Вызывает sync-google-sheets Edge Function
```

### 2.2 Обновление App.tsx

Добавить useEffect в AppContent для автозапуска синхронизации:

```typescript
import { useSyncCrm } from '@/hooks/useSyncCrm';
import { useSyncProjects } from '@/hooks/useSyncProjects';
import { useSyncFaq } from '@/hooks/useSyncFaq'; // новый

const AppContent = () => {
  const { syncOnAppLoad: syncCrm } = useSyncCrm();
  const { syncOnAppLoad: syncProjects } = useSyncProjects();
  const { syncOnAppLoad: syncFaq } = useSyncFaq();
  
  useEffect(() => {
    // Запуск всех синхронизаций при загрузке
    syncFaq();
    syncCrm();
    syncProjects();
  }, []);
  
  // ... остальной код
};
```

---

## Часть 3: Рефакторинг Edge Functions для ProTalk AI

### 3.1 Конфигурация ProTalk

```typescript
// Общий helper для всех AI функций
const PROTALK_URL = "https://eu1.api.pro-talk.ru/api/v1.0/ask";
const PROTALK_BOT_TOKEN = Deno.env.get("PROTALK_BOT_TOKEN")!; // AU7oLWczg0Z7Eg9NhFlIdQy6RCOAzVkn
const PROTALK_BOT_ID = parseInt(Deno.env.get("PROTALK_BOT_ID")!); // 55030

const generateChatId = () => `ask${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

async function askProTalk(message: string): Promise<string> {
  const response = await fetch(`${PROTALK_URL}/${PROTALK_BOT_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bot_id: PROTALK_BOT_ID,
      chat_id: generateChatId(),
      message
    })
  });
  
  const data = await response.json();
  return data.done || '';
}
```

### 3.2 Изменения в ai-chat/index.ts

**Было:**
```typescript
// Streaming через Lovable AI Gateway
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  body: JSON.stringify({ model: "google/gemini-2.5-flash", stream: true, ... })
});
return new Response(response.body, { headers: { "Content-Type": "text/event-stream" }});
```

**Станет:**
```typescript
// Полный ответ через ProTalk (без streaming)
const fullPrompt = `${systemPrompt}\n\nИстория диалога:\n${historyContext}\n\nВопрос: ${userMessage}`;
const aiResponse = await askProTalk(fullPrompt);
return new Response(JSON.stringify({ response: aiResponse }), { ... });
```

### 3.3 Изменения в остальных AI функциях

| Функция | Изменения |
|---------|-----------|
| `ai-search/index.ts` | Заменить endpoint на ProTalk, убрать streaming |
| `wiki-ai-search/index.ts` | Промпт FAQ в message, ответ через `data.done` |
| `crm-ai-search/index.ts` | AI summary через ProTalk |
| `generate-video-script/index.ts` | Полный промпт в message |
| `translate-resume/index.ts` | Промпт перевода в message |

### 3.4 Обновление AIAssistant.tsx

**Критическое изменение:** ProTalk не поддерживает streaming!

```typescript
// Было: парсинг SSE stream
const reader = response.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  // ... парсинг delta content
}

// Станет: один ответ
const data = await response.json();
const assistantContent = data.response;
setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
```

---

## Часть 4: Новые секреты Supabase

Добавить в новом проекте Supabase → Settings → Edge Functions → Secrets:

| Секрет | Значение |
|--------|----------|
| `PROTALK_BOT_TOKEN` | `AU7oLWczg0Z7Eg9NhFlIdQy6RCOAzVkn` |
| `PROTALK_BOT_ID` | `55030` |
| `TELEGRAM_BOT_TOKEN` | (перенести из текущего проекта) |
| `TELEGRAM_PROJECTS_CHAT_ID` | (перенести из текущего проекта) |

---

## Часть 5: Пошаговая инструкция миграции

### Шаг 1: Создать проект на Supabase.com
1. Зайти на https://supabase.com/dashboard
2. New Project → выбрать регион (EU West)
3. Записать URL и anon key

### Шаг 2: Выполнить SQL-скрипт схемы
1. Supabase Dashboard → SQL Editor
2. Вставить скрипт создания таблиц (я подготовлю)
3. Run

### Шаг 3: Выполнить SQL-скрипт данных
1. SQL Editor → вставить INSERT-ы
2. Run

### Шаг 4: Настроить Storage
1. Storage → Create bucket "profile-photos"
2. Policies → Enable public access

### Шаг 5: Добавить секреты
1. Settings → Edge Functions → Manage Secrets
2. Добавить все секреты из таблицы выше

### Шаг 6: Задеплоить Edge Functions
```bash
# Установить Supabase CLI
npm install -g supabase

# Войти
supabase login

# Связать с проектом
supabase link --project-ref YOUR_PROJECT_REF

# Задеплоить все функции
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

### Шаг 7: Обновить .env в проекте
```env
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_KEY"
VITE_SUPABASE_PROJECT_ID="YOUR_PROJECT_ID"
```

### Шаг 8: Тестирование
1. Проверить синхронизацию при входе
2. Проверить AI-ассистент
3. Проверить свайпы проектов
4. Проверить Telegram-уведомления

---

## Файлы для изменения/создания

| Файл | Действие |
|------|----------|
| `src/hooks/useSyncFaq.ts` | Создать новый |
| `src/App.tsx` | Добавить auto-sync всех функций |
| `supabase/functions/ai-chat/index.ts` | Рефакторинг для ProTalk |
| `supabase/functions/ai-search/index.ts` | Рефакторинг для ProTalk |
| `supabase/functions/wiki-ai-search/index.ts` | Рефакторинг для ProTalk |
| `supabase/functions/crm-ai-search/index.ts` | Рефакторинг для ProTalk |
| `supabase/functions/generate-video-script/index.ts` | Рефакторинг для ProTalk |
| `supabase/functions/translate-resume/index.ts` | Рефакторинг для ProTalk |
| `src/components/AIAssistant.tsx` | Убрать streaming, получать полный ответ |

---

## Ограничения после миграции

1. **Нет streaming в AI-чате** — ответы появляются целиком после задержки
2. **Синхронизация по требованию** — не каждый час, а при входе пользователя
3. **Один AI-бот** — все функции используют один ProTalk bot_id
4. **Зависимость от ProTalk** — лимиты и доступность ProTalk API

---

## Следующий шаг

После утверждения плана я подготовлю:
1. Полный SQL-скрипт создания схемы
2. SQL-скрипт с INSERT-ами данных
3. Рефакторинг всех Edge Functions для ProTalk
4. Обновление frontend-компонентов

