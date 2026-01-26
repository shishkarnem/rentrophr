import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { query, language = 'ru', faqItems = [] } = await req.json();

    if (!query || query.trim().length < 3) {
      return new Response(
        JSON.stringify({ aiResponse: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const PROTALK_BOT_TOKEN = Deno.env.get('PROTALK_BOT_TOKEN');
    const PROTALK_BOT_ID = Deno.env.get('PROTALK_BOT_ID');
    
    if (!PROTALK_BOT_TOKEN || !PROTALK_BOT_ID) {
      throw new Error('ProTalk credentials are not configured');
    }

    // Build context from FAQ items
    const faqContext = faqItems
      .slice(0, 20)
      .map((item: { question: string; answer: string; category: string | null }, index: number) => 
        `${index + 1}. [${item.category || 'Общее'}] Вопрос: ${item.question}\nОтвет: ${item.answer}`
      )
      .join('\n\n');

    const languageInstructions: Record<string, string> = {
      ru: 'Отвечай на русском языке.',
      en: 'Answer in English.',
      kz: 'Қазақ тілінде жауап беріңіз.',
    };

    const prompt = `Ты умный помощник по базе знаний FAQ. Твоя задача - найти релевантную информацию и дать точный, полезный ответ на вопрос пользователя.

Правила:
- Отвечай только на основе предоставленного контекста FAQ
- Если точного ответа нет в базе, скажи об этом честно и предложи посмотреть похожие вопросы
- Будь кратким, но информативным (максимум 3-4 предложения)
- Если есть ссылки в ответах FAQ, обязательно включи их в ответ
- ${languageInstructions[language] || languageInstructions.ru}

База знаний FAQ:

${faqContext}

---

Вопрос пользователя: "${query}"

Найди наиболее релевантный ответ из базы знаний и сформулируй краткий полезный ответ.`;

    const aiResponse = await askProTalk(prompt, PROTALK_BOT_TOKEN, parseInt(PROTALK_BOT_ID));

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
