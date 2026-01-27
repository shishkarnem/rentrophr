import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

function createRowHash(telegramId: string): string {
  let hash = 0;
  for (let i = 0; i < telegramId.length; i++) {
    hash = ((hash << 5) - hash) + telegramId.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(16);
}

function parseDate(dateStr: string): string | null {
  if (!dateStr?.trim()) return null;
  const ddmmyyyy = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, '0')}-${ddmmyyyy[1].padStart(2, '0')}`;
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) return dateStr;
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
  } catch { /* ignore */ }
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
    row_hash: createRowHash(telegramId),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Parse pagination params
  let offset = 0;
  let limit = 1500; // Process 1500 rows per call (smaller chunks)
  
  try {
    const url = new URL(req.url);
    offset = parseInt(url.searchParams.get('offset') || '0', 10);
    limit = parseInt(url.searchParams.get('limit') || '1500', 10);
  } catch {
    try {
      const body = await req.json();
      offset = body.offset || 0;
      limit = body.limit || 1500;
    } catch { /* use defaults */ }
  }

  console.log(`[sync-crm-sheets] Starting chunk: offset=${offset}, limit=${limit}`);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch CSV
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    
    const csvText = await response.text();
    const lines = csvText.split(/\r?\n/).filter(line => line.trim());
    const totalRows = lines.length - 1; // Exclude header
    
    console.log(`[sync-crm-sheets] Total rows: ${totalRows}, processing ${offset}-${offset + limit}`);

    // If first chunk (offset=0), return total for frontend to orchestrate
    const isFirstChunk = offset === 0;
    const isLastChunk = offset + limit >= totalRows;

    // Process only this chunk
    const startIdx = 1 + offset; // +1 to skip header
    const endIdx = Math.min(startIdx + limit, lines.length);
    
    let upsertedCount = 0;
    let batch: ReturnType<typeof mapRowToCrmData>[] = [];
    const BATCH_SIZE = 100;
    
    for (let i = startIdx; i < endIdx; i++) {
      const row = parseCSVLine(lines[i]);
      const crmData = mapRowToCrmData(row);
      
      if (crmData) {
        batch.push(crmData);
        
        if (batch.length >= BATCH_SIZE) {
          const { error } = await supabase
            .from('crm_data')
            .upsert(batch, { onConflict: 'telegram_id', ignoreDuplicates: false });
          
          if (!error) upsertedCount += batch.length;
          else console.error('[sync-crm-sheets] Batch error:', error.message);
          
          batch = [];
        }
      }
    }
    
    // Process remaining
    if (batch.length > 0) {
      const { error } = await supabase
        .from('crm_data')
        .upsert(batch, { onConflict: 'telegram_id', ignoreDuplicates: false });
      if (!error) upsertedCount += batch.length;
    }

    console.log(`[sync-crm-sheets] Chunk done. Upserted: ${upsertedCount}`);

    return new Response(JSON.stringify({
      success: true,
      chunk: { offset, limit, processed: upsertedCount },
      total: totalRows,
      hasMore: !isLastChunk,
      nextOffset: isLastChunk ? null : offset + limit,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[sync-crm-sheets] Error:', errorMessage);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
