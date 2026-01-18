import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  projectId: string;
  projectCode: string;
  telegramId: number;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, projectCode, telegramId }: NotifyRequest = await req.json();

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_PROJECTS_CHAT_ID");

    if (!botToken || !chatId) {
      console.error("Missing Telegram credentials");
      return new Response(
        JSON.stringify({ error: "Missing Telegram credentials" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch project data
    const { data: project, error: projectError } = await supabase
      .from("projects_data")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      console.error("Project not found:", projectError);
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user data from telegram_profiles
    const { data: telegramProfile } = await supabase
      .from("telegram_profiles")
      .select("*")
      .eq("telegram_id", telegramId)
      .single();

    // Fetch CRM data
    const { data: crmData } = await supabase
      .from("crm_data")
      .select("*")
      .eq("telegram_id", telegramId)
      .single();

    // Build user info
    const firstName = telegramProfile?.first_name || crmData?.telegram_name?.split(" ")[0] || "";
    const lastName = telegramProfile?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Не указано";
    const username = telegramProfile?.username;
    const userCode = crmData?.code || "—";

    // Build Telegram link
    const telegramLink = username 
      ? `https://t.me/${username}`
      : `tg://user?id=${telegramId}`;

    // Build profile and project links
    const domain = "https://rentrophr.lovable.app";
    const profileLink = `${domain}/${telegramId}`;
    const projectLink = `${domain}/projects/${projectCode}`;

    // Build message
    const message = `👍ОТКЛИК НА ПРОЕКТ👍

${project.description || project.project_code}

${project.region || "Регион не указан"}

Код проекта: ${project.project_code}

Контакты:

${fullName}, код: ${userCode}, @${username || telegramId}

${telegramLink}

Проект: ${projectLink}

Профиль кандидата: ${profileLink}

Менеджер проекта: ${project.manager_link || "Не указан"}

ДПР: ${project.dpr_link || "Не указан"}`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramResult);
      return new Response(
        JSON.stringify({ error: "Failed to send Telegram message", details: telegramResult }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Telegram notification sent successfully");
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in notify-project-response:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
