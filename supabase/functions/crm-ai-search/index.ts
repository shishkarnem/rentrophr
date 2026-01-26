import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.89.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ProTalk API configuration
const PROTALK_URL = "https://eu1.api.pro-talk.ru/api/v1.0/ask";

const generateChatId = () => `ask${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

async function askProTalk(message: string, token: string, botId: number): Promise<string> {
  const response = await fetch(`${PROTALK_URL}/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bot_id: botId,
      chat_id: generateChatId(),
      message
    })
  });

  if (!response.ok) {
    console.error('ProTalk API error:', response.status);
    throw new Error(`ProTalk API error: ${response.status}`);
  }

  const data = await response.json();
  return data.done || '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, filters, language = 'ru', priorityFields = [] } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build query for CRM data
    let dbQuery = supabase.from('crm_data').select('*');

    if (filters?.status) {
      dbQuery = dbQuery.eq('status', filters.status);
    }
    if (filters?.hr) {
      dbQuery = dbQuery.eq('hr', filters.hr);
    }
    if (filters?.city) {
      dbQuery = dbQuery.eq('city', filters.city);
    }
    if (filters?.region) {
      dbQuery = dbQuery.eq('region', filters.region);
    }
    if (filters?.result) {
      dbQuery = dbQuery.eq('result', filters.result);
    }

    dbQuery = dbQuery.limit(500);

    const { data: crmRecords, error: dbError } = await dbQuery;

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    if (!crmRecords || crmRecords.length === 0) {
      return new Response(
        JSON.stringify({ results: [], aiSummary: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ results: crmRecords, aiSummary: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lowerQuery = query.toLowerCase();

    const defaultPriorityFields = ['resume_text', 'checklist_answers'];
    const activePriorityFields = priorityFields.length > 0 ? priorityFields : defaultPriorityFields;

    const searchResults = crmRecords
      .map((record) => {
        let score = 0;
        let matchedInPriority = false;
        
        for (const field of activePriorityFields) {
          const value = record[field];
          if (value && typeof value === 'string' && value.toLowerCase().includes(lowerQuery)) {
            score += 20;
            matchedInPriority = true;
          }
        }
        
        const otherFields = [
          'code', 'telegram_name', 'full_info', 'status', 'hr', 'result',
          'phone', 'city', 'region', 'rop_name', 'available_skills', 'rating'
        ];

        for (const field of otherFields) {
          const value = record[field];
          if (value && typeof value === 'string') {
            if (value.toLowerCase().includes(lowerQuery)) {
              score += field === 'telegram_name' || field === 'code' ? 10 : 3;
            }
          }
        }

        if (record.telegram_id && record.telegram_id.toString().includes(query)) {
          score += 10;
        }

        return { ...record, score, matched: score > 0, matchedInPriority };
      })
      .filter(record => record.matched)
      .sort((a, b) => {
        if (a.matchedInPriority && !b.matchedInPriority) return -1;
        if (!a.matchedInPriority && b.matchedInPriority) return 1;
        return b.score - a.score;
      })
      .slice(0, 50);

    // Generate AI summary using ProTalk
    let aiSummary = null;

    if (searchResults.length > 0 && query.trim().length >= 3) {
      try {
        const PROTALK_BOT_TOKEN = Deno.env.get('PROTALK_BOT_TOKEN');
        const PROTALK_BOT_ID = Deno.env.get('PROTALK_BOT_ID');

        if (PROTALK_BOT_TOKEN && PROTALK_BOT_ID) {
          const contextText = searchResults.slice(0, 5).map(r => {
            let text = `Имя: ${r.telegram_name || r.full_info || 'Неизвестно'}, ` +
              `Код: ${r.code || '-'}, ` +
              `Статус: ${r.status || '-'}, ` +
              `HR: ${r.hr || '-'}, ` +
              `Город: ${r.city || '-'}, ` +
              `Регион: ${r.region || '-'}, ` +
              `Рейтинг: ${r.rating || '-'}`;
            
            if (r.resume_text && r.resume_text.toLowerCase().includes(lowerQuery)) {
              const snippet = r.resume_text.substring(0, 200);
              text += `, Резюме: "${snippet}..."`;
            }
            
            if (r.checklist_answers && r.checklist_answers.toLowerCase().includes(lowerQuery)) {
              const snippet = r.checklist_answers.substring(0, 200);
              text += `, Ответы: "${snippet}..."`;
            }
            
            return text;
          }).join('\n');

          const langNames: Record<string, string> = {
            'ru': 'русском',
            'en': 'английском', 
            'kz': 'казахском'
          };

          const prompt = `Ты помощник для поиска по CRM данным. Отвечай кратко на ${langNames[language] || 'русском'} языке. Максимум 3 предложения. Подытожь найденные результаты, особенно обращая внимание на содержимое резюме и ответов на чек-лист.

Поиск: "${query}"

Найдено ${searchResults.length} записей:
${contextText}

Кратко опиши найденных сотрудников и что нашлось по запросу.`;

          aiSummary = await askProTalk(prompt, PROTALK_BOT_TOKEN, parseInt(PROTALK_BOT_ID));
        }
      } catch (aiError) {
        console.error('AI summary error:', aiError);
      }
    }

    const cleanResults = searchResults.map(({ score, matched, matchedInPriority, ...rest }) => rest);

    return new Response(
      JSON.stringify({
        results: cleanResults,
        aiSummary,
        totalFound: searchResults.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('CRM search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Search failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
