import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ID Google таблицы и gid листа "Проекты"
const SHEET_ID = "1vAmbAeCdw12b8DXSu4Qa8r6CV_Z0mWU_n-abAhZCzzs";
const SHEET_GID = "731976891";

// Функция для парсинга CSV
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentField.trim());
        if (currentRow.length > 0 && currentRow.some(cell => cell.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
        if (char === '\r') i++;
      } else if (char !== '\r') {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Функция для создания хеша строки
function createRowHash(projectCode: string, region: string, description: string): string {
  const str = `${projectCode}|${region}|${description}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting Projects Google Sheets sync...");

    // Получаем CSV из Google Sheets с указанием листа
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
    console.log(`Fetching CSV from: ${csvUrl}`);
    
    const csvResponse = await fetch(csvUrl);
    if (!csvResponse.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${csvResponse.status}`);
    }
    
    const csvText = await csvResponse.text();
    console.log(`Received CSV, length: ${csvText.length} characters`);
    
    // Парсим CSV
    const rows = parseCSV(csvText);
    console.log(`Parsed ${rows.length} rows from CSV`);
    
    if (rows.length < 2) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No data rows found in spreadsheet",
        rowsProcessed: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Первая строка - заголовки, пропускаем
    const dataRows = rows.slice(1);
    console.log(`Processing ${dataRows.length} data rows`);

    // Создаем Supabase клиент с service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Подготавливаем данные для upsert
    // Колонки: A(0) - Код проекта, B(1) - Регион, C(2) - Описание, D(3) - Менеджер,
    // E(4) - ДПР, F(5) - Статус, G(6) - Наличие, H(7) - Ссылка менеджера, I(8) - Ссылка ДПР
    const projectsData = dataRows
      .filter(row => row[0]) // Фильтруем строки без кода проекта
      .map(row => {
        const projectCode = row[0] || "";
        const region = row[1] || "";
        const description = row[2] || "";
        const projectManager = row[3] || "";
        const dpr = row[4] || "";
        const projectStatus = row[5] || "";
        const availability = row[6] || "";
        const managerLink = row[7] || "";
        const dprLink = row[8] || "";
        
        const rowHash = createRowHash(projectCode, region, description);
        
        return {
          project_code: projectCode,
          region,
          description,
          project_manager: projectManager,
          dpr,
          project_status: projectStatus,
          availability,
          manager_link: managerLink,
          dpr_link: dprLink,
          row_hash: rowHash,
          updated_at: new Date().toISOString()
        };
      });

    console.log(`Prepared ${projectsData.length} project records for upsert`);

    if (projectsData.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No valid project data found",
        rowsProcessed: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Получаем текущие хеши из БД
    const { data: existingRows, error: selectError } = await supabase
      .from('projects_data')
      .select('row_hash');
    
    if (selectError) {
      console.error("Error fetching existing rows:", selectError);
      throw selectError;
    }

    const existingHashes = new Set(existingRows?.map(r => r.row_hash) || []);
    const newHashes = new Set(projectsData.map(r => r.row_hash));

    // Определяем какие записи удалить
    const hashesToDelete = [...existingHashes].filter(h => !newHashes.has(h));
    
    if (hashesToDelete.length > 0) {
      console.log(`Deleting ${hashesToDelete.length} obsolete records`);
      const { error: deleteError } = await supabase
        .from('projects_data')
        .delete()
        .in('row_hash', hashesToDelete);
      
      if (deleteError) {
        console.error("Error deleting obsolete rows:", deleteError);
      }
    }

    // Upsert записей
    const { error: upsertError } = await supabase
      .from('projects_data')
      .upsert(projectsData, { 
        onConflict: 'row_hash',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      console.error("Error upserting project data:", upsertError);
      throw upsertError;
    }

    console.log(`Successfully synced ${projectsData.length} project records`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Synced ${projectsData.length} project records, deleted ${hashesToDelete.length} obsolete records`,
      rowsProcessed: projectsData.length,
      rowsDeleted: hashesToDelete.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Sync error:", e);
    return new Response(JSON.stringify({ 
      success: false, 
      error: e instanceof Error ? e.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
