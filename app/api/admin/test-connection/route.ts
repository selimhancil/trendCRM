import { NextResponse } from "next/server";
import { aiAgent } from "@/lib/aiAgent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, url, token } = body;

    if (type === "ai_agent") {
      // n8n AI Agent'ı test et
      if (!url || !token) {
        return NextResponse.json({
          success: false,
          error: "N8N_AGENT_URL ve N8N_AGENT_TOKEN tanımlı olmalı",
        });
      }

      try {
        // Test için basit bir AI görevi gönder
        const response = await aiAgent.call({
          prompt: "health_check",
          context: { test: true },
          task: "health_check",
        }, {
          timeout: 10000, // 10 saniye timeout
        });

        if (response.success) {
          return NextResponse.json({
            success: true,
            message: "n8n AI Agent bağlantısı başarılı",
          });
        } else {
          return NextResponse.json({
            success: false,
            error: response.error || "n8n AI Agent bağlantı hatası",
          });
        }
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : "n8n AI Agent bağlantı hatası",
        });
      }
    }

    return NextResponse.json(
      { error: "Geçersiz test türü. 'ai_agent' kullanın." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Connection test error:", error);
    return NextResponse.json(
      { error: "Bağlantı testi başarısız oldu" },
      { status: 500 }
    );
  }
}



