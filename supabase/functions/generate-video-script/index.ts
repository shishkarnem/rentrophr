import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, language, telegramId } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const PROTALK_BOT_TOKEN = Deno.env.get("PROTALK_BOT_TOKEN");
    const PROTALK_BOT_ID = Deno.env.get("PROTALK_BOT_ID");
    
    if (!PROTALK_BOT_TOKEN || !PROTALK_BOT_ID) {
      throw new Error("ProTalk credentials are not configured");
    }

    const languagePrompts: Record<string, string> = {
      ru: "на русском языке",
      en: "in English",
      kz: "на казахском языке"
    };

    const langPrompt = languagePrompts[language] || languagePrompts.ru;

    const prompt = `Ты профессиональный копирайтер и карьерный консультант. Твоя задача - создать сценарий для видео-визитки (видео-презентации) на основе резюме кандидата.

Сценарий должен быть ${langPrompt}.

Структура сценария:
1. Приветствие и представление (имя, должность)
2. Управленческий опыт - сколько лет и в каких сферах
3. Ключевые достижения на каждом месте работы в формате "ПРИШЁЛ-УШЁЛ" с конкретными цифрами (рост продаж, увеличение команды, выполнение планов и т.д.)
4. Какими инструментами пользовался для достижения результатов
5. Главные достижения в карьере и жизни, чем гордится
6. Почему именно этого кандидата стоит выбрать на проект
7. Краткое завершение с призывом к действию

Требования:
- Длительность чтения: 3-5 минут
- Стиль: уверенный, профессиональный, но дружелюбный
- Используй конкретные цифры и факты из резюме
- Добавь эмоциональные акценты
- Текст должен звучать естественно при произнесении вслух
- Используй короткие предложения для удобства чтения с экрана

Формат вывода: готовый текст для чтения, без дополнительных комментариев и пояснений.

Создай сценарий видео-визитки на основе этого резюме:

${resumeText}`;

    const script = await askProTalk(prompt, PROTALK_BOT_TOKEN, parseInt(PROTALK_BOT_ID));

    if (!script) {
      throw new Error("No script generated");
    }

    // Save to database if telegramId provided
    if (telegramId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: updateError } = await supabase
        .from("crm_data")
        .update({ video_script: script })
        .eq("telegram_id", telegramId);

      if (updateError) {
        console.error("Error saving script to database:", updateError);
      }
    }

    return new Response(
      JSON.stringify({ script }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating video script:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
