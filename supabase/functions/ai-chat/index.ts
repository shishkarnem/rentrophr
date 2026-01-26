import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const errorText = await response.text();
    console.error('ProTalk API error:', response.status, errorText);
    throw new Error(`ProTalk API error: ${response.status}`);
  }

  const data = await response.json();
  return data.done || '';
}

// Базовая информация о компании (сокращенная версия)
const BASE_KNOWLEDGE_RU = `
Ты - AI-ассистент компании РентРОП. Отвечай на вопросы кандидатов о вакансии и компании.
Будь дружелюбным и профессиональным. Отвечай кратко и по делу. ВСЕГДА ОТВЕЧАЙ НА РУССКОМ ЯЗЫКЕ.
Используй эмодзи для лучшей читаемости ответов.

=== ОБЩАЯ ИНФОРМАЦИЯ О КОМПАНИИ ===

Основной продукт - Аренда Руководителей Отделов Продаж.
Мы обучаем специалистов и сдаем в Аренду. Специалист работает в нашем штате, но выполняет обязанности РОПа у заказчика. Работает удаленно.

Ответы на ВСЕ популярные вопросы по вакансии Эксперта можно получить на сайте https://rentrophr.lovable.app/

Наши сайты:
- https://rentrop.top
- https://arenda-ropa.com
- https://arenda-rop.ru

Telegram: https://t.me/rentrop
YouTube: https://www.youtube.com/@arendaropa
`;

const BASE_KNOWLEDGE_EN = `
You are the AI assistant for RentROP company. Answer candidates' questions about the vacancy and company.
Be friendly and professional. Keep answers brief and to the point. ALWAYS RESPOND IN ENGLISH.
Use emojis for better readability.

=== GENERAL COMPANY INFORMATION ===

Main product - Rental of Sales Department Heads (ROPs).
We train specialists and rent them out. The specialist works on RentROP's payroll but performs ROP duties for the client. Works remotely.

Answers to ALL popular questions about the Expert vacancy can be found at https://rentrophr.lovable.app/

Websites:
- https://rentrop.top
- https://arenda-ropa.com
- https://arenda-rop.ru

Telegram: https://t.me/rentrop
YouTube: https://www.youtube.com/@arendaropa
`;

const BASE_KNOWLEDGE_KZ = `
Сіз RentROP компаниясының AI-көмекшісісіз. Кандидаттардың бос орын мен компания туралы сұрақтарына жауап беріңіз.
Достық және кәсіби болыңыз. Қысқаша және нақты жауап беріңіз. ӘРҚАШАН ҚАЗАҚ ТІЛІНДЕ ЖАУАП БЕРІҢІЗ.
Оқуға ыңғайлы болу үшін эмодзилерді пайдаланыңыз.

=== КОМПАНИЯ ТУРАЛЫ ЖАЛПЫ АҚПАРАТ ===

Негізгі өнім - Сату бөлімі басшыларын жалға беру (РОП).
Біз мамандарды оқытамыз және жалға береміз. Маман біздің штатта жұмыс істейді, бірақ тапсырыс берушіде РОП міндеттерін орындайды. Қашықтан жұмыс істейді.

Эксперт бос орны туралы БАРЛЫҚ танымал сұрақтардың жауаптарын https://rentrophr.lovable.app/ сайтынан алуға болады

Біздің сайттар:
- https://rentrop.top
- https://arenda-ropa.com
- https://arenda-rop.ru

Telegram: https://t.me/rentrop
YouTube: https://www.youtube.com/@arendaropa
`;

const getBaseKnowledge = (language: string): string => {
  switch (language) {
    case 'en':
      return BASE_KNOWLEDGE_EN;
    case 'kz':
      return BASE_KNOWLEDGE_KZ;
    default:
      return BASE_KNOWLEDGE_RU;
  }
};

const getErrorMessages = (language: string) => {
  switch (language) {
    case 'en':
      return {
        rateLimit: 'Too many requests, please try again later.',
        aiError: 'AI service error',
        unknownError: 'Unknown error'
      };
    case 'kz':
      return {
        rateLimit: 'Сұраулар тым көп, кейінірек қайталап көріңіз.',
        aiError: 'AI қызметінің қатесі',
        unknownError: 'Белгісіз қате'
      };
    default:
      return {
        rateLimit: 'Слишком много запросов, попробуйте позже.',
        aiError: 'Ошибка AI сервиса',
        unknownError: 'Неизвестная ошибка'
      };
  }
};

// Функция для поиска и ранжирования релевантных FAQ
async function findRelevantFAQs(supabase: any, userQuery: string, limit: number = 5): Promise<string> {
  try {
    const searchKeywords = userQuery
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2)
      .slice(0, 10);

    if (searchKeywords.length === 0) {
      console.log("No valid search terms extracted");
      return "";
    }

    console.log(`Searching FAQ with terms: ${searchKeywords.join(' | ')}`);

    const orConditions = searchKeywords
      .map(term => `search_keywords.ilike.%${term}%,question.ilike.%${term}%`)
      .join(',');

    const { data: faqs, error } = await supabase
      .from('faq_knowledge')
      .select('question, answer, search_keywords')
      .or(orConditions)
      .limit(50);

    if (error) {
      console.error("FAQ search error:", error);
    }

    const contractOrConditions = searchKeywords
      .map(term => `question.ilike.%${term}%,answer.ilike.%${term}%`)
      .join(',');

    const { data: contractFaqs, error: contractError } = await supabase
      .from('contract_faq')
      .select('question, answer, category')
      .or(contractOrConditions)
      .limit(30);

    if (contractError) {
      console.error("Contract FAQ search error:", contractError);
    }

    interface RankedFaq {
      question: string;
      answer: string;
      search_keywords?: string | null;
      category?: string | null;
      matchCount: number;
      relevanceScore: number;
      source: 'faq' | 'contract';
    }

    const allFaqs: RankedFaq[] = [];

    if (faqs && faqs.length > 0) {
      faqs.forEach((faq: { question: string; answer: string; search_keywords: string | null }) => {
        const faqText = `${faq.question} ${faq.search_keywords || ''}`.toLowerCase();
        const matchCount = searchKeywords.filter(keyword => faqText.includes(keyword)).length;
        const startsWithBonus = searchKeywords.some(kw => faq.question.toLowerCase().startsWith(kw)) ? 1 : 0;
        
        if (matchCount > 0) {
          allFaqs.push({
            ...faq,
            matchCount,
            relevanceScore: matchCount + startsWithBonus,
            source: 'faq'
          });
        }
      });
    }

    if (contractFaqs && contractFaqs.length > 0) {
      contractFaqs.forEach((faq: { question: string; answer: string; category: string | null }) => {
        const faqText = `${faq.question} ${faq.answer} ${faq.category || ''}`.toLowerCase();
        const matchCount = searchKeywords.filter(keyword => faqText.includes(keyword)).length;
        const startsWithBonus = searchKeywords.some(kw => faq.question.toLowerCase().startsWith(kw)) ? 1 : 0;
        const contractBonus = searchKeywords.some(kw => 
          ['договор', 'контракт', 'contract', 'шарт', 'оплата', 'payment', 'санкц', 'штраф'].includes(kw)
        ) ? 2 : 0;
        
        if (matchCount > 0) {
          allFaqs.push({
            ...faq,
            matchCount,
            relevanceScore: matchCount + startsWithBonus + contractBonus,
            source: 'contract'
          });
        }
      });
    }

    if (allFaqs.length === 0) {
      console.log("No FAQs matched after ranking");
      return "";
    }

    const rankedFaqs = allFaqs
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    console.log(`Top ${rankedFaqs.length} FAQs after ranking`);

    const faqContext = rankedFaqs
      .map(faq => `Вопрос: ${faq.question}\nОтвет: ${faq.answer}`)
      .join('\n\n---\n\n');

    return `\n\n=== РЕЛЕВАНТНЫЕ FAQ ИЗ БАЗЫ ЗНАНИЙ ===\n\n${faqContext}`;

  } catch (e) {
    console.error("Error in findRelevantFAQs:", e);
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages = body.messages;
    const language = body.language || 'ru';
    
    const PROTALK_BOT_TOKEN = Deno.env.get("PROTALK_BOT_TOKEN");
    const PROTALK_BOT_ID = Deno.env.get("PROTALK_BOT_ID");
    const errorMessages = getErrorMessages(language);
    
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid request: messages is missing or not an array");
      return new Response(JSON.stringify({ error: "Invalid request: messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    if (!PROTALK_BOT_TOKEN || !PROTALK_BOT_ID) {
      throw new Error("ProTalk credentials are not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    let faqContext = "";
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const userMessages = messages.filter((m: { role: string }) => m.role === 'user');
      const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
      
      if (lastUserMessage?.content) {
        faqContext = await findRelevantFAQs(supabase, lastUserMessage.content);
      }
    }

    // Build full prompt with context and conversation history
    const baseKnowledge = getBaseKnowledge(language);
    const systemPrompt = baseKnowledge + faqContext;

    // Format conversation history for context
    const conversationHistory = messages
      .map((m: { role: string; content: string }) => 
        m.role === 'user' ? `Пользователь: ${m.content}` : `Ассистент: ${m.content}`
      )
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\n=== ИСТОРИЯ ДИАЛОГА ===\n${conversationHistory}\n\n=== ЗАДАЧА ===\nОтветь на последнее сообщение пользователя, учитывая контекст диалога и базу знаний.`;

    console.log(`Processing chat request with language: ${language}, messages count: ${messages.length}`);

    const aiResponse = await askProTalk(fullPrompt, PROTALK_BOT_TOKEN, parseInt(PROTALK_BOT_ID));

    if (!aiResponse) {
      return new Response(JSON.stringify({ error: errorMessages.aiError }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("ProTalk response received");

    // Return JSON response (no streaming with ProTalk)
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
