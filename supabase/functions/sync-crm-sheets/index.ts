import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SHEET_ID = '1-krk7YGzZPfMC9gYYvzAO_ln3utynfOyhPppye7Ut0o';
const GID = '1282056892';

// Parse CSV handling quotes and commas properly
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      if (char === '\r') i++;
    } else {
      currentCell += char;
    }
  }
  
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell !== '')) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

// Create hash from telegram_id for deduplication
function createRowHash(telegramId: string): string {
  let hash = 0;
  const str = telegramId || '';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// Parse full_info to extract username
// Format: "Фамилия Имя Отчество 102 @username" or "167892 Name Surname (@username) lang code"
function parseFullInfo(fullInfo: string): { firstName?: string; lastName?: string; username?: string } {
  if (!fullInfo) return {};
  
  const result: { firstName?: string; lastName?: string; username?: string } = {};
  
  // Try to extract username with @
  const usernameMatch = fullInfo.match(/@(\w+)/);
  if (usernameMatch) {
    result.username = usernameMatch[1];
  }
  
  // Try to extract username in parentheses (@username)
  const parenMatch = fullInfo.match(/\((@?\w+)\)/);
  if (parenMatch) {
    result.username = parenMatch[1].replace('@', '');
  }
  
  // Remove username, parentheses, numbers at start/end for name parsing
  let cleanedInfo = fullInfo
    .replace(/\([@\w]+\)/g, '') // Remove (@username)
    .replace(/@\w+/g, '') // Remove @username
    .replace(/^\d+\s+/, '') // Remove leading numbers
    .replace(/\s+\d+$/, '') // Remove trailing numbers
    .replace(/\s+(ru|en|kk|kz)\s+/gi, ' ') // Remove language codes
    .trim();
  
  // Split by spaces and take first two as last_name and first_name
  const nameParts = cleanedInfo.split(/\s+/).filter(p => p.length > 0);
  if (nameParts.length >= 2) {
    result.lastName = nameParts[0];
    result.firstName = nameParts[1];
  } else if (nameParts.length === 1) {
    result.firstName = nameParts[0];
  }
  
  return result;
}

// Parse date from various formats
function parseDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') return null;
  
  // Try DD.MM.YYYY format
  const ddmmyyyy = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (ddmmyyyy) {
    return `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, '0')}-${ddmmyyyy[1].padStart(2, '0')}`;
  }
  
  // Try YYYY-MM-DD format
  const yyyymmdd = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyymmdd) {
    return dateStr;
  }
  
  // Try to parse as JS Date
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch {
    // ignore
  }
  
  return null;
}

// Parse boolean from various formats
function parseBoolean(value: string): boolean {
  if (!value) return false;
  const lower = value.toLowerCase().trim();
  return lower === 'true' || lower === '1' || lower === 'да' || lower === 'yes' || lower === 'вкл';
}

// Parse integer
function parseInteger(value: string): number | null {
  if (!value || value.trim() === '') return null;
  const num = parseInt(value.trim(), 10);
  return isNaN(num) ? null : num;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[sync-crm-sheets] Starting CRM sync...');

  try {
    // Fetch CSV from Google Sheets
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
    console.log('[sync-crm-sheets] Fetching from:', csvUrl);
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('[sync-crm-sheets] CSV fetched, length:', csvText.length);
    
    const rows = parseCSV(csvText);
    console.log('[sync-crm-sheets] Parsed rows:', rows.length);
    
    if (rows.length < 2) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No data rows found',
        stats: { total: 0, upserted: 0, deleted: 0 }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Skip header row
    const dataRows = rows.slice(1);
    
    // Map rows to CRM data
    const crmData = dataRows
      .filter(row => row[0] && row[0].trim() !== '') // Filter rows with telegram_id
      .map(row => {
        const telegramId = row[0]?.trim();
        const fullInfo = row[4] || ''; // E column - ФИО, Код и Телеграм
        const parsedInfo = parseFullInfo(fullInfo);
        
        return {
          telegram_id: parseInt(telegramId, 10) || null,
          code: row[1] || null,
          telegram_name: row[2] || null,
          full_info: fullInfo || null,
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
          row_hash: createRowHash(telegramId),
        };
      })
      .filter(item => item.telegram_id !== null);

    console.log('[sync-crm-sheets] Valid CRM records:', crmData.length);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get existing telegram_ids
    const { data: existingData, error: fetchError } = await supabase
      .from('crm_data')
      .select('telegram_id');
    
    if (fetchError) {
      throw new Error(`Failed to fetch existing data: ${fetchError.message}`);
    }

    const existingIds = new Set((existingData || []).map(r => r.telegram_id));
    const newIds = new Set(crmData.map(r => r.telegram_id));
    
    // Find IDs to delete (in DB but not in sheet)
    const idsToDelete = [...existingIds].filter(id => !newIds.has(id));
    
    let deletedCount = 0;
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('crm_data')
        .delete()
        .in('telegram_id', idsToDelete);
      
      if (deleteError) {
        console.error('[sync-crm-sheets] Delete error:', deleteError);
      } else {
        deletedCount = idsToDelete.length;
        console.log('[sync-crm-sheets] Deleted obsolete records:', deletedCount);
      }
    }

    // Upsert in batches
    const batchSize = 100;
    let upsertedCount = 0;
    
    for (let i = 0; i < crmData.length; i += batchSize) {
      const batch = crmData.slice(i, i + batchSize);
      
      const { error: upsertError } = await supabase
        .from('crm_data')
        .upsert(batch, { 
          onConflict: 'telegram_id',
          ignoreDuplicates: false 
        });
      
      if (upsertError) {
        console.error('[sync-crm-sheets] Upsert error for batch:', i, upsertError);
      } else {
        upsertedCount += batch.length;
      }
    }

    console.log('[sync-crm-sheets] Sync complete. Upserted:', upsertedCount, 'Deleted:', deletedCount);

    return new Response(JSON.stringify({
      success: true,
      message: 'CRM sync completed',
      stats: {
        total: crmData.length,
        upserted: upsertedCount,
        deleted: deletedCount
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[sync-crm-sheets] Error:', errorMessage);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
