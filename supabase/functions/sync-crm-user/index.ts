import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Same sheet as sync-crm-sheets
const SHEET_ID = '1-krk7YGzZPfMC9gYYvzAO_ln3utynfOyhPppye7Ut0o';
const GID = '1282056892';

// Parse CSV line handling quotes
function parseCSVLine(line: string): string[] {
  const cells: string[] = [];
  let currentCell = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      cells.push(currentCell.trim());
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  cells.push(currentCell.trim());
  return cells;
}

function parseDate(dateStr: string): string | null {
  if (!dateStr?.trim()) return null;
  const ddmmyyyy = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, '0')}-${ddmmyyyy[1].padStart(2, '0')}`;
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) return dateStr;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString().split('T')[0];
  }
  return null;
}

function parseBoolean(value: string): boolean {
  if (!value) return false;
  const lower = value.toLowerCase().trim();
  return ['true', '1', 'да', 'yes', 'вкл'].includes(lower);
}

function parseInteger(value: string): number | null {
  if (!value?.trim()) return null;
  const num = parseInt(value.trim(), 10);
  return isNaN(num) ? null : num;
}

function mapRowToCrmData(row: string[]) {
  const telegramId = row[0]?.trim();
  if (!telegramId) return null;
  const telegramIdNum = parseInt(telegramId, 10);
  if (isNaN(telegramIdNum)) return null;

  return {
    telegram_id: telegramIdNum,
    code: row[1] || null,
    telegram_name: row[2] || null,
    full_info: row[4] || null,
    hr_comment: row[5] || null,
    hr: row[6] || null,
    hr_manual: row[7] || null,
    full_info_manual: row[8] || null,
    resume_link: row[9] || null,
    resume_link_chat: row[10] || null,
    resume_text: row[11] || null,
    start_date: row[12] ? parseDate(row[12]) : null,
    disabled_n: parseBoolean(row[13]),
    rejection_date: parseDate(row[14]),
    rejection_date_manual: parseDate(row[15]),
    interview_date: parseDate(row[16]),
    level: row[17] || null,
    level_manual: row[18] || null,
    rating: row[19] || null,
    result: row[20] || null,
    result_manual: row[21] || null,
    conditions: row[22] || null,
    reminders_disabled: parseBoolean(row[23]),
    disabled_y: parseBoolean(row[24]),
    portal: row[25] || null,
    disabled_aa: parseBoolean(row[26]),
    reporting: row[27] || null,
    disabled_ac: parseBoolean(row[28]),
    hr_robot: row[29] || null,
    disabled_ae: parseBoolean(row[30]),
    tests_passed: row[31] || null,
    tests_manual: row[32] || null,
    add_to_experts: row[33] || null,
    to_experts_manual: row[34] || null,
    contract_date_manual: parseDate(row[35]),
    contract_link_chat: row[36] || null,
    contract_date: parseDate(row[37]),
    contract_link: row[38] || null,
    business_card_link: row[39] || null,
    work_start_date: parseDate(row[40]),
    dismissal_date: parseDate(row[41]),
    status: row[42] || null,
    status_manual: row[43] || null,
    birth_date: parseDate(row[44]),
    birth_date_manual: parseDate(row[45]),
    birthday_enabled: parseBoolean(row[46]),
    birthday_enabled_manual: parseBoolean(row[47]),
    days_worked: parseInteger(row[48]),
    language: row[49] || null,
    to_experts: row[50] || null,
    photo_link: row[51] || null,
    feedback_date: parseDate(row[52]),
    waiting_period: row[53] || null,
    training_completed: row[54] || null,
    projects_in_work: parseInteger(row[55]),
    sending: row[56] || null,
    phone: row[57] || null,
    rejection_id: row[58] || null,
    rf_phone: row[59] || null,
    available_skills: row[60] || null,
    progress: row[61] || null,
    language_choice: row[62] || null,
    interview: row[63] || null,
    test_conditions: row[64] || null,
    test_portal: row[65] || null,
    test_report: row[66] || null,
    test_robot: row[67] || null,
    contract_signing: row[68] || null,
    video_card: row[69] || null,
    work_start: row[70] || null,
    projects_mailing: row[71] || null,
    protalk_id: row[72] || null,
    in_app: parseBoolean(row[73]),
    block_id: row[74] || null,
    rop_name: row[75] || null,
    city: row[76] || null,
    region: row[77] || null,
    checklist_answers: row[78] || null,
    hr_chat_id: row[79] || null,
    updated_at: new Date().toISOString(),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { telegramId } = await req.json();

    if (!telegramId) {
      return new Response(
        JSON.stringify({ error: "telegramId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetId = String(telegramId);
    console.log(`[sync-crm-user] Syncing user with telegram_id: ${targetId}`);

    // Fetch CRM sheet
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
    const csvResponse = await fetch(csvUrl);
    
    if (!csvResponse.ok) {
      console.error(`[sync-crm-user] Failed to fetch CSV: ${csvResponse.status}`);
      throw new Error(`Failed to fetch CSV: ${csvResponse.status}`);
    }
    
    const csvText = await csvResponse.text();
    const lines = csvText.split("\n").filter(line => line.trim());
    
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ success: false, message: "No data in sheet" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Skip header row, find matching user
    let foundRow: string[] | null = null;
    
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      const rowTelegramId = row[0]?.trim();
      
      if (rowTelegramId === targetId) {
        foundRow = row;
        console.log(`[sync-crm-user] Found user at row ${i}`);
        break;
      }
    }

    if (!foundRow) {
      console.log(`[sync-crm-user] User with telegram_id ${targetId} not found in sheet`);
      return new Response(
        JSON.stringify({ success: true, message: "User not found in CRM sheet", updated: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map row to CRM data
    const crmRecord = mapRowToCrmData(foundRow);
    
    if (!crmRecord) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to parse user data" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: upsertError } = await supabase
      .from("crm_data")
      .upsert(crmRecord, { onConflict: "telegram_id" });

    if (upsertError) {
      console.error("[sync-crm-user] Upsert error:", upsertError);
      throw upsertError;
    }

    console.log(`[sync-crm-user] Successfully synced user ${targetId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "User data synced successfully",
        updated: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[sync-crm-user] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
