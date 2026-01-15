import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languagePrompts: Record<string, string> = {
      ru: "на русском языке",
      en: "in English",
      kz: "на казахском языке"
    };

    const langPrompt = languagePrompts[language] || languagePrompts.ru;

    const systemPrompt = `Ты профессиональный копирайтер и карьерный консультант. Твоя задача - создать сценарий для видео-визитки (видео-презентации) на основе резюме кандидата.

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

Формат вывода: готовый текст для чтения, без дополнительных комментариев и пояснений.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Создай сценарий видео-визитки на основе этого резюме:\n\n${resumeText}` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов. Попробуйте позже." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Превышен лимит использования AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content;

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
