import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language = 'ru', faqItems = [] } = await req.json();

    if (!query || query.trim().length < 3) {
      return new Response(
        JSON.stringify({ aiResponse: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context from FAQ items
    const faqContext = faqItems
      .slice(0, 20) // Limit to prevent token overflow
      .map((item: { question: string; answer: string; category: string | null }, index: number) => 
        `${index + 1}. [${item.category || 'Общее'}] Вопрос: ${item.question}\nОтвет: ${item.answer}`
      )
      .join('\n\n');

    const languageInstructions = {
      ru: 'Отвечай на русском языке.',
      en: 'Answer in English.',
      kz: 'Қазақ тілінде жауап беріңіз.',
    };

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Ты умный помощник по базе знаний FAQ. Твоя задача - найти релевантную информацию и дать точный, полезный ответ на вопрос пользователя.

Правила:
- Отвечай только на основе предоставленного контекста FAQ
- Если точного ответа нет в базе, скажи об этом честно и предложи посмотреть похожие вопросы
- Будь кратким, но информативным (максимум 3-4 предложения)
- Если есть ссылки в ответах FAQ, обязательно включи их в ответ
- ${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.ru}`
          },
          {
            role: 'user',
            content: `База знаний FAQ:\n\n${faqContext}\n\n---\n\nВопрос пользователя: "${query}"\n\nНайди наиболее релевантный ответ из базы знаний и сформулируй краткий полезный ответ.`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again later.', aiResponse: null }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required', aiResponse: null }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || null;

    return new Response(
      JSON.stringify({ aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Wiki AI search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Search failed';
    return new Response(
      JSON.stringify({ error: errorMessage, aiResponse: null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
