/**
 * Settings Management
 * Admin panelinden yapılandırılan ayarları yönetir
 */

interface SystemSettings {
  // Unified n8n AI Agent (replaces all separate AI webhooks)
  n8n_agent_url?: string;
  n8n_agent_token?: string;
  
  // Non-AI webhooks (planning, analytics, etc. - kept for backward compatibility)
  n8n_planning_schedule_url?: string;
  n8n_planning_connect_url?: string;
  n8n_planning_upload_url?: string;
  n8n_analytics_url?: string;
  n8n_comments_url?: string;
  n8n_reports_url?: string;
  n8n_calendar_url?: string;
  n8n_accounts_url?: string;
  n8n_library_url?: string;
  n8n_trend_radar_url?: string;
}

// Cache for settings (in-memory)
let settingsCache: SystemSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

/**
 * Ayarları getir (cache'den veya environment'dan)
 */
export async function getSettings(): Promise<SystemSettings> {
  // Cache kontrolü
  const now = Date.now();
  if (settingsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return settingsCache;
  }

  try {
    // API'den ayarları almayı dene
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/settings`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.settings) {
        settingsCache = data.settings;
        cacheTimestamp = now;
        return settingsCache as SystemSettings;
      }
    }
  } catch (error) {
    console.log("Settings API fetch failed, using environment variables");
  }

  // Fallback: Environment variables
  const envSettings: SystemSettings = {
    // Unified AI Agent
    n8n_agent_url: process.env.N8N_AGENT_URL,
    n8n_agent_token: process.env.N8N_AGENT_TOKEN,
    
    // Non-AI webhooks (kept for backward compatibility)
    n8n_planning_schedule_url: process.env.N8N_API_PLANNING_SCHEDULE_URL,
    n8n_planning_connect_url: process.env.N8N_API_PLANNING_CONNECT_URL,
    n8n_planning_upload_url: process.env.N8N_API_PLANNING_UPLOAD_URL,
    n8n_analytics_url: process.env.N8N_API_ANALYTICS_URL,
    n8n_comments_url: process.env.N8N_API_COMMENTS_URL,
    n8n_reports_url: process.env.N8N_API_REPORTS_URL,
    n8n_calendar_url: process.env.N8N_API_CALENDAR_URL,
    n8n_accounts_url: process.env.N8N_API_ACCOUNTS_URL,
    n8n_library_url: process.env.N8N_API_LIBRARY_URL,
    n8n_trend_radar_url: process.env.N8N_API_TREND_RADAR_URL,
  };

  settingsCache = envSettings;
  cacheTimestamp = now;
  return envSettings;
}

/**
 * Belirli bir ayarı getir
 */
export async function getSetting(key: keyof SystemSettings): Promise<string | undefined> {
  const settings = await getSettings();
  return settings[key] as string | undefined;
}

/**
 * Cache'i temizle (ayarlar güncellendiğinde)
 */
export function clearSettingsCache() {
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Server-side için ayarları getir (API route'lardan kullanılır)
 */
export async function getSettingsServer(): Promise<SystemSettings> {
  // Server-side'da direkt Supabase'den oku (timeout ile)
  try {
    // Timeout mekanizması ekle (2 saniye)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Settings fetch timeout")), 2000);
    });

    const fetchPromise = (async () => {
      try {
        const { supabase } = await import("@/lib/supabaseClient");
        
        // Supabase URL kontrolü ve client kontrolü
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
          throw new Error("Supabase not configured");
        }

        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "system_settings")
          .single();

        if (!error && data && data.value) {
          return data.value as SystemSettings;
        }
        throw new Error(error?.message || "Settings not found");
      } catch (err) {
        throw err;
      }
    })();

    // Race condition: timeout veya fetch
    try {
      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (raceError) {
      // Timeout veya fetch hatası - environment'a fallback
      throw raceError;
    }
  } catch (error) {
    // Supabase hatası veya timeout - environment variables kullan
    // console.log hatası gösterme çünkü bu normal bir durum olabilir
  }

  // Fallback: Environment variables
  return {
    // Unified AI Agent
    n8n_agent_url: process.env.N8N_AGENT_URL,
    n8n_agent_token: process.env.N8N_AGENT_TOKEN,
    
    // Non-AI webhooks (kept for backward compatibility)
    n8n_planning_schedule_url: process.env.N8N_API_PLANNING_SCHEDULE_URL,
    n8n_planning_connect_url: process.env.N8N_API_PLANNING_CONNECT_URL,
    n8n_planning_upload_url: process.env.N8N_API_PLANNING_UPLOAD_URL,
    n8n_analytics_url: process.env.N8N_API_ANALYTICS_URL,
    n8n_comments_url: process.env.N8N_API_COMMENTS_URL,
    n8n_reports_url: process.env.N8N_API_REPORTS_URL,
    n8n_calendar_url: process.env.N8N_API_CALENDAR_URL,
    n8n_accounts_url: process.env.N8N_API_ACCOUNTS_URL,
    n8n_library_url: process.env.N8N_API_LIBRARY_URL,
    n8n_trend_radar_url: process.env.N8N_API_TREND_RADAR_URL,
  };
}

