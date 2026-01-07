import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.89.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Apply filters if provided
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

    // Limit results for performance
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

    // If no search query, just return filtered results
    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ results: crmRecords, aiSummary: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lowerQuery = query.toLowerCase();

    // Priority fields for AI search (resume_text, checklist_answers first)
    const defaultPriorityFields = ['resume_text', 'checklist_answers'];
    const activePriorityFields = priorityFields.length > 0 ? priorityFields : defaultPriorityFields;

    // Search through all records with priority scoring
    const searchResults = crmRecords
      .map((record) => {
        let score = 0;
        let matchedInPriority = false;
        
        // Priority fields get higher score
        for (const field of activePriorityFields) {
          const value = record[field];
          if (value && typeof value === 'string' && value.toLowerCase().includes(lowerQuery)) {
            score += 20; // High priority fields
            matchedInPriority = true;
          }
        }
        
        // Other searchable fields
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

        // Check telegram_id match
        if (record.telegram_id && record.telegram_id.toString().includes(query)) {
          score += 10;
        }

        return { ...record, score, matched: score > 0, matchedInPriority };
      })
      .filter(record => record.matched)
      .sort((a, b) => {
        // Priority matches first, then by score
        if (a.matchedInPriority && !b.matchedInPriority) return -1;
        if (!a.matchedInPriority && b.matchedInPriority) return 1;
        return b.score - a.score;
      })
      .slice(0, 50);

    // Generate AI summary using Lovable AI
    let aiSummary = null;

    if (searchResults.length > 0 && query.trim().length >= 3) {
      try {
        // Include priority field content in context
        const contextText = searchResults.slice(0, 5).map(r => {
          let text = `Имя: ${r.telegram_name || r.full_info || 'Неизвестно'}, ` +
            `Код: ${r.code || '-'}, ` +
            `Статус: ${r.status || '-'}, ` +
            `HR: ${r.hr || '-'}, ` +
            `Город: ${r.city || '-'}, ` +
            `Регион: ${r.region || '-'}, ` +
            `Рейтинг: ${r.rating || '-'}`;
          
          // Add resume snippet if matched
          if (r.resume_text && r.resume_text.toLowerCase().includes(lowerQuery)) {
            const snippet = r.resume_text.substring(0, 200);
            text += `, Резюме: "${snippet}..."`;
          }
          
          // Add checklist snippet if matched
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

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `Ты помощник для поиска по CRM данным. Отвечай кратко на ${langNames[language] || 'русском'} языке. Максимум 3 предложения. Подытожь найденные результаты, особенно обращая внимание на содержимое резюме и ответов на чек-лист.`
              },
              {
                role: 'user',
                content: `Поиск: "${query}"\n\nНайдено ${searchResults.length} записей:\n${contextText}\n\nКратко опиши найденных сотрудников и что нашлось по запросу.`
              }
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiSummary = data.choices?.[0]?.message?.content || null;
        } else if (response.status === 429) {
          console.warn('Rate limit exceeded for AI summary');
        } else if (response.status === 402) {
          console.warn('Payment required for AI summary');
        }
      } catch (aiError) {
        console.error('AI summary error:', aiError);
      }
    }

    // Remove internal fields from response
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
