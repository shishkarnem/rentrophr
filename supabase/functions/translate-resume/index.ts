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
    const { resumeText, targetLanguage, telegramId } = await req.json();

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

    const languageNames: Record<string, string> = {
      ru: "русский",
      en: "английский (English)",
      kz: "казахский (қазақ тілі)"
    };

    const targetLang = languageNames[targetLanguage] || languageNames.ru;

    const prompt = `Ты профессиональный переводчик. Переведи текст резюме на ${targetLang}.

Требования:
- Сохраняй структуру и форматирование оригинала
- Профессиональная терминология должна быть корректной
- Названия компаний и имена оставляй в оригинале
- Даты и цифры не меняй
- Если текст уже на нужном языке - верни его без изменений с небольшими улучшениями стиля

Верни только переведённый текст без дополнительных комментариев.

Текст резюме для перевода:

${resumeText}`;

    const translatedText = await askProTalk(prompt, PROTALK_BOT_TOKEN, parseInt(PROTALK_BOT_ID));

    if (!translatedText) {
      throw new Error("No translation generated");
    }

    // Save to database if telegramId provided
    if (telegramId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: updateError } = await supabase
        .from("crm_data")
        .update({ resume_text: translatedText })
        .eq("telegram_id", telegramId);

      if (updateError) {
        console.error("Error saving translated resume to database:", updateError);
      }
    }

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error translating resume:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
