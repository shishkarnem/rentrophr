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
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

// Validate Telegram WebApp initData
async function validateTelegramData(initData: string, botToken: string): Promise<TelegramUser | null> {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    
    if (!hash) {
      console.log("No hash found in initData");
      return null;
    }

    // Remove hash from data and sort alphabetically
    urlParams.delete("hash");
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    // Create secret key using Web Crypto API
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

    // Calculate hash
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

    if (calculatedHash !== hash) {
      console.log("Hash validation failed");
      return null;
    }

    // Check auth_date (not older than 24 hours)
    const authDate = urlParams.get("auth_date");
    if (authDate) {
      const authTimestamp = parseInt(authDate, 10);
      const now = Math.floor(Date.now() / 1000);
      if (now - authTimestamp > 86400) {
        console.log("Auth date expired");
        return null;
      }
    }

    // Parse user data
    const userJson = urlParams.get("user");
    if (!userJson) {
      console.log("No user data in initData");
      return null;
    }

    return JSON.parse(userJson) as TelegramUser;
  } catch (error) {
    console.error("Error validating Telegram data:", error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");

    // Get initData from header
    const initData = req.headers.get("x-telegram-init-data");
    
    if (!initData) {
      return new Response(
        JSON.stringify({ error: "Missing Telegram init data" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate Telegram data if bot token is available
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
      // Fallback: parse user from initData without validation (for development)
      // In production, TELEGRAM_BOT_TOKEN should always be set
      try {
        const urlParams = new URLSearchParams(initData);
        const userJson = urlParams.get("user");
        if (userJson) {
          telegramUser = JSON.parse(userJson);
        }
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid user data format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (!telegramUser) {
      return new Response(
        JSON.stringify({ error: "No user data found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action, updates } = body;

    switch (action) {
      case "get": {
        // Get profile by telegram_id
        const { data, error } = await supabase
          .from("telegram_profiles")
          .select("*")
          .eq("telegram_id", telegramUser.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        return new Response(
          JSON.stringify({ profile: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "upsert": {
        // Check if profile exists
        const { data: existing } = await supabase
          .from("telegram_profiles")
          .select("*")
          .eq("telegram_id", telegramUser.id)
          .single();

        if (existing) {
          // Update existing profile
          const { data, error } = await supabase
            .from("telegram_profiles")
            .update({
              username: telegramUser.username || existing.username,
              first_name: telegramUser.first_name || existing.first_name,
              last_name: telegramUser.last_name || existing.last_name,
              language_code: telegramUser.language_code || existing.language_code,
              photo_url: telegramUser.photo_url || existing.photo_url,
              updated_at: new Date().toISOString(),
            })
            .eq("telegram_id", telegramUser.id)
            .select()
            .single();

          if (error) throw error;
          return new Response(
            JSON.stringify({ profile: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          // Create new profile
          const { data, error } = await supabase
            .from("telegram_profiles")
            .insert({
              telegram_id: telegramUser.id,
              username: telegramUser.username,
              first_name: telegramUser.first_name,
              last_name: telegramUser.last_name,
              language_code: telegramUser.language_code || "ru",
              photo_url: telegramUser.photo_url,
            })
            .select()
            .single();

          if (error) throw error;
          return new Response(
            JSON.stringify({ profile: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case "update": {
        // Update profile with custom fields (only own profile)
        const allowedFields = ["username", "first_name", "last_name", "language_code", "photo_url"];
        const sanitizedUpdates: Record<string, unknown> = {};
        
        for (const key of allowedFields) {
          if (updates && key in updates) {
            sanitizedUpdates[key] = updates[key];
          }
        }

        if (Object.keys(sanitizedUpdates).length === 0) {
          return new Response(
            JSON.stringify({ error: "No valid fields to update" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        sanitizedUpdates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
          .from("telegram_profiles")
          .update(sanitizedUpdates)
          .eq("telegram_id", telegramUser.id)
          .select()
          .single();

        if (error) throw error;
        return new Response(
          JSON.stringify({ profile: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error in telegram-profile function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});