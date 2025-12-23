import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
        paymentRequired: 'Payment required.',
        aiError: 'AI service error',
        unknownError: 'Unknown error'
      };
    case 'kz':
      return {
        rateLimit: 'Сұраулар тым көп, кейінірек қайталап көріңіз.',
        paymentRequired: 'Төлем қажет.',
        aiError: 'AI қызметінің қатесі',
        unknownError: 'Белгісіз қате'
      };
    default:
      return {
        rateLimit: 'Слишком много запросов, попробуйте позже.',
        paymentRequired: 'Требуется пополнение баланса.',
        aiError: 'Ошибка AI сервиса',
        unknownError: 'Неизвестная ошибка'
      };
  }
};

// Функция для поиска и ранжирования релевантных FAQ
async function findRelevantFAQs(supabase: any, userQuery: string, limit: number = 5): Promise<string> {
  try {
    // Извлекаем ключевые слова для поиска (до 10 слов)
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

    // Формируем OR-условия для каждого ключевого слова
    const orConditions = searchKeywords
      .map(term => `search_keywords.ilike.%${term}%,question.ilike.%${term}%`)
      .join(',');

    // Получаем все потенциальные совпадения (с запасом)
    const { data: faqs, error } = await supabase
      .from('faq_knowledge')
      .select('question, answer, search_keywords')
      .or(orConditions)
      .limit(50); // Берём больше для ранжирования

    if (error) {
      console.error("FAQ search error:", error);
      return "";
    }

    if (!faqs || faqs.length === 0) {
      console.log("No relevant FAQs found");
      return "";
    }

    console.log(`Found ${faqs.length} potential FAQs, ranking by relevance...`);

    // Тип для ранжированного FAQ
    interface RankedFaq {
      question: string;
      answer: string;
      search_keywords: string | null;
      matchCount: number;
      relevanceScore: number;
    }

    // Ранжируем FAQ по количеству совпавших ключевых слов
    const rankedFaqs: RankedFaq[] = faqs
      .map((faq: { question: string; answer: string; search_keywords: string | null }) => {
        const faqText = `${faq.question} ${faq.search_keywords || ''}`.toLowerCase();
        
        // Подсчитываем количество совпавших ключевых слов
        const matchCount = searchKeywords.filter(keyword => 
          faqText.includes(keyword)
        ).length;

        // Бонус за совпадение в начале вопроса
        const startsWithBonus = searchKeywords.some(kw => 
          faq.question.toLowerCase().startsWith(kw)
        ) ? 1 : 0;

        return { 
          ...faq, 
          matchCount,
          relevanceScore: matchCount + startsWithBonus
        };
      })
      .filter((faq: RankedFaq) => faq.matchCount > 0) // Только FAQ с совпадениями
      .sort((a: RankedFaq, b: RankedFaq) => b.relevanceScore - a.relevanceScore) // Сортируем по релевантности
      .slice(0, limit); // Берём топ-N

    if (rankedFaqs.length === 0) {
      console.log("No FAQs matched after ranking");
      return "";
    }

    console.log(`Top ${rankedFaqs.length} FAQs after ranking:`);
    rankedFaqs.forEach((faq: RankedFaq, i: number) => {
      console.log(`  ${i + 1}. Score: ${faq.relevanceScore} (${faq.matchCount} matches) - ${faq.question.substring(0, 50)}...`);
    });

    // Форматируем найденные FAQ
    const faqContext = rankedFaqs
      .map((faq: { question: string; answer: string }) => 
        `Вопрос: ${faq.question}\nОтвет: ${faq.answer}`)
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
    const { messages, language = 'ru' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const errorMessages = getErrorMessages(language);
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Создаем Supabase клиент
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    let faqContext = "";
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Получаем последнее сообщение пользователя для поиска
      const lastUserMessage = messages
        .filter((m: { role: string }) => m.role === 'user')
        .pop();
      
      if (lastUserMessage?.content) {
        faqContext = await findRelevantFAQs(supabase, lastUserMessage.content);
      }
    }

    // Формируем полный системный промпт
    const baseKnowledge = getBaseKnowledge(language);
    const systemPrompt = baseKnowledge + faqContext;

    console.log(`Processing chat request with language: ${language}, messages count: ${messages.length}, FAQ context length: ${faqContext.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error(`AI gateway error: ${response.status}`);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: errorMessages.rateLimit }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: errorMessages.paymentRequired }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error details:", t);
      return new Response(JSON.stringify({ error: errorMessages.aiError }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("AI gateway response received, streaming...");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
