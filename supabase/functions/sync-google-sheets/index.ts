import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ID вашей Google таблицы
const SHEET_ID = "1bJBKQOTc3xnuNWeSZpyFVEakPdyZ6tstJMhiy-tyouM";

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
        i++; // Skip escaped quote
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
        if (char === '\r') i++; // Skip \n after \r
      } else if (char !== '\r') {
        currentField += char;
      }
    }
  }

  // Handle last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Функция для создания хеша строки
function createRowHash(question: string, answer: string, keywords: string): string {
  const str = `${question}|${answer}|${keywords}`;
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
    console.log("Starting Google Sheets sync...");

    // Получаем CSV из Google Sheets
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
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
    const faqData = dataRows
      .filter(row => row[0] && row[1]) // Фильтруем строки без вопроса или ответа
      .map(row => {
        const question = row[0] || "";
        const answer = row[1] || "";
        const searchKeywords = row[2] || "";
        const rowHash = createRowHash(question, answer, searchKeywords);
        
        return {
          question,
          answer,
          search_keywords: searchKeywords,
          row_hash: rowHash,
          updated_at: new Date().toISOString()
        };
      });

    console.log(`Prepared ${faqData.length} FAQ records for upsert`);

    if (faqData.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No valid FAQ data found",
        rowsProcessed: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Получаем текущие хеши из БД
    const { data: existingRows, error: selectError } = await supabase
      .from('faq_knowledge')
      .select('row_hash');
    
    if (selectError) {
      console.error("Error fetching existing rows:", selectError);
      throw selectError;
    }

    const existingHashes = new Set(existingRows?.map(r => r.row_hash) || []);
    const newHashes = new Set(faqData.map(r => r.row_hash));

    // Определяем какие записи удалить (есть в БД, но нет в таблице)
    const hashesToDelete = [...existingHashes].filter(h => !newHashes.has(h));
    
    if (hashesToDelete.length > 0) {
      console.log(`Deleting ${hashesToDelete.length} obsolete records`);
      const { error: deleteError } = await supabase
        .from('faq_knowledge')
        .delete()
        .in('row_hash', hashesToDelete);
      
      if (deleteError) {
        console.error("Error deleting obsolete rows:", deleteError);
      }
    }

    // Upsert новых/обновленных записей
    const { error: upsertError } = await supabase
      .from('faq_knowledge')
      .upsert(faqData, { 
        onConflict: 'row_hash',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      console.error("Error upserting FAQ data:", upsertError);
      throw upsertError;
    }

    console.log(`Successfully synced ${faqData.length} FAQ records`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Synced ${faqData.length} FAQ records, deleted ${hashesToDelete.length} obsolete records`,
      rowsProcessed: faqData.length,
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
