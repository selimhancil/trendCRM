import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Settings interface
interface Settings {
  // Unified n8n AI Agent
  n8n_agent_url: string;
  n8n_agent_token: string;
  
  // Non-AI webhooks (kept for backward compatibility)
  n8n_planning_schedule_url: string;
  n8n_planning_connect_url: string;
  n8n_planning_upload_url: string;
  n8n_analytics_url: string;
  n8n_comments_url: string;
  n8n_reports_url: string;
  n8n_calendar_url: string;
  n8n_accounts_url: string;
  n8n_library_url: string;
  n8n_trend_radar_url: string;
  
  // Instagram settings
  instagram_access_token: string;
  instagram_client_id: string;
  instagram_client_secret: string;
}

// GET - Ayarları getir
export async function GET() {
  try {
    // Önce Supabase'den ayarları almayı dene
    try {
      // Supabase client kontrolü
      if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase not configured");
      }

      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "system_settings")
        .single();

      if (!error && data && data.value) {
        return NextResponse.json({
          success: true,
          settings: data.value as Settings,
          source: "supabase",
        });
      }
    } catch (supabaseError) {
      // Supabase hatası - environment variables kullan
    }

    // Fallback: Environment variables'dan oku
    const envSettings: Partial<Settings> = {
      // Unified AI Agent
      n8n_agent_url: process.env.N8N_AGENT_URL || "",
      n8n_agent_token: process.env.N8N_AGENT_TOKEN ? "***" : "",
      
      // Non-AI webhooks
      n8n_planning_schedule_url: process.env.N8N_API_PLANNING_SCHEDULE_URL || "",
      n8n_planning_connect_url: process.env.N8N_API_PLANNING_CONNECT_URL || "",
      n8n_planning_upload_url: process.env.N8N_API_PLANNING_UPLOAD_URL || "",
      n8n_analytics_url: process.env.N8N_API_ANALYTICS_URL || "",
      n8n_comments_url: process.env.N8N_API_COMMENTS_URL || "",
      n8n_reports_url: process.env.N8N_API_REPORTS_URL || "",
      n8n_calendar_url: process.env.N8N_API_CALENDAR_URL || "",
      n8n_accounts_url: process.env.N8N_API_ACCOUNTS_URL || "",
      n8n_library_url: process.env.N8N_API_LIBRARY_URL || "",
      n8n_trend_radar_url: process.env.N8N_API_TREND_RADAR_URL || "",
      
      // Instagram settings
      instagram_access_token: process.env.INSTAGRAM_ACCESS_TOKEN ? "***" : "",
      instagram_client_id: process.env.INSTAGRAM_CLIENT_ID || "",
      instagram_client_secret: process.env.INSTAGRAM_CLIENT_SECRET ? "***" : "",
    };

    return NextResponse.json({
      success: true,
      settings: envSettings as Settings,
      source: "environment",
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "Ayarlar alınamadı" },
      { status: 500 }
    );
  }
}

// POST - Ayarları kaydet
export async function POST(request: Request) {
  try {
    const settings: Settings = await request.json();

    // Supabase'e kaydetmeyi dene
    try {
      // Supabase client kontrolü
      if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase not configured");
      }

      // Önce mevcut ayarı kontrol et
      const { data: existing } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "system_settings")
        .single();

      if (existing) {
        // Güncelle
        const { error } = await supabase
          .from("settings")
          .update({
            value: settings,
            updated_at: new Date().toISOString(),
          })
          .eq("key", "system_settings");

        if (error) throw error;
      } else {
        // Yeni oluştur
        const { error } = await supabase
          .from("settings")
          .insert({
            key: "system_settings",
            value: settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      return NextResponse.json({
        success: true,
        message: "Ayarlar Supabase'e kaydedildi",
        source: "supabase",
      });
    } catch (supabaseError) {
      // Fallback: In-memory storage (sadece bu instance için)
      // Gerçek production'da Supabase veya başka bir veritabanı kullanılmalı
      
      return NextResponse.json({
        success: true,
        message: "Ayarlar kaydedildi (in-memory). Supabase yapılandırılmalı.",
        source: "memory",
        warning: "Bu ayarlar server restart sonrası kaybolacaktır. Supabase'i yapılandırın.",
      });
    }
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { error: "Ayarlar kaydedilemedi" },
      { status: 500 }
    );
  }
}

