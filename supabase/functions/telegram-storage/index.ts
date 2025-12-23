import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encode as encodeHexBytes } from "https://deno.land/std@0.168.0/encoding/hex.ts";

function encodeHex(data: Uint8Array): string {
  return new TextDecoder().decode(encodeHexBytes(data));
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-telegram-init-data",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

// Validate Telegram WebApp initData
async function validateTelegramData(initData: string, botToken: string): Promise<TelegramUser | null> {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    
    if (!hash) return null;

    urlParams.delete("hash");
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const encoder = new TextEncoder();
    const keyData = encoder.encode("WebAppData");
    const secretKeyData = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const secretKey = await crypto.subtle.sign(
      "HMAC",
      secretKeyData,
      encoder.encode(botToken)
    );

    const hmacKey = await crypto.subtle.importKey(
      "raw",
      secretKey,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      hmacKey,
      encoder.encode(dataCheckString)
    );
    const calculatedHash = encodeHex(new Uint8Array(signature));

    if (calculatedHash !== hash) return null;

    const authDate = urlParams.get("auth_date");
    if (authDate) {
      const authTimestamp = parseInt(authDate, 10);
      const now = Math.floor(Date.now() / 1000);
      if (now - authTimestamp > 86400) return null;
    }

    const userJson = urlParams.get("user");
    if (!userJson) return null;

    return JSON.parse(userJson) as TelegramUser;
  } catch {
    return null;
  }
}

function parseTelegramUser(initData: string): TelegramUser | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const userJson = urlParams.get("user");
    if (userJson) {
      return JSON.parse(userJson);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");

    const initData = req.headers.get("x-telegram-init-data");
    
    if (!initData) {
      return new Response(
        JSON.stringify({ error: "Missing Telegram init data" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let telegramUser: TelegramUser | null = null;
    
    if (telegramBotToken) {
      telegramUser = await validateTelegramData(initData, telegramBotToken);
      if (!telegramUser) {
        return new Response(
          JSON.stringify({ error: "Invalid Telegram authentication" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      telegramUser = parseTelegramUser(initData);
    }

    if (!telegramUser) {
      return new Response(
        JSON.stringify({ error: "No user data found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === "POST") {
      // Upload photo
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return new Response(
          JSON.stringify({ error: "No file provided" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: "File too large. Maximum size is 5MB" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create file path with user's telegram_id as folder
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${telegramUser.id}/${Date.now()}.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return new Response(
          JSON.stringify({ error: "Failed to upload file" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(fileName);

      // Update profile with new photo URL
      await supabase
        .from("telegram_profiles")
        .update({ photo_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("telegram_id", telegramUser.id);

      return new Response(
        JSON.stringify({ url: publicUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "DELETE") {
      const body = await req.json();
      const { filePath } = body;

      if (!filePath) {
        return new Response(
          JSON.stringify({ error: "No file path provided" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify the file belongs to this user (path should start with telegram_id)
      const userFolder = `${telegramUser.id}/`;
      if (!filePath.startsWith(userFolder)) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: deleteError } = await supabase.storage
        .from("profile-photos")
        .remove([filePath]);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        return new Response(
          JSON.stringify({ error: "Failed to delete file" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in telegram-storage function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});