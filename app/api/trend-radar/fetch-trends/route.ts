import { NextResponse } from "next/server";
import { n8nClient } from "@/lib/n8nClient";

export async function POST(request: Request) {
  try {
    const { sector } = await request.json();

    if (!sector) {
      return NextResponse.json(
        { error: "Sektör seçimi gereklidir" },
        { status: 400 }
      );
    }

    // n8n'den trend verilerini çek
    const n8nResponse = await n8nClient.getTrendRadar(sector);

    let trends = [];
    let lastUpdated = new Date().toISOString();

    if (n8nResponse.success && n8nResponse.data) {
      // n8n'den gelen veriyi kullan
      const data = n8nResponse.data;
      trends = data.trends || [];
      lastUpdated = data.lastUpdated || data.updated_at || lastUpdated;
    } else {
      // Mock data (n8n yoksa veya hata varsa)
      trends = [
        {
          sound: "CapCut - Viral Pop Beat",
          visualStyle: "Soft pastel tones with cinematic blur",
          concept: "Before/After transformations",
          engagement: 92,
          soundUrl: "#",
          thumbnailUrl: "https://via.placeholder.com/400x225/6366F1/FFFFFF?text=Trend+Style",
        },
        {
          sound: "TikTok Original Sound - Dance",
          visualStyle: "High contrast with neon accents",
          concept: "Product showcase with transitions",
          engagement: 88,
          soundUrl: "#",
          thumbnailUrl: "https://via.placeholder.com/400x225/EC4899/FFFFFF?text=Trend+Style",
        },
        {
          sound: "Instagram Reels Audio - Trending",
          visualStyle: "Minimalist with bold typography",
          concept: "Day in the life format",
          engagement: 85,
          soundUrl: "#",
          thumbnailUrl: "https://via.placeholder.com/400x225/10B981/FFFFFF?text=Trend+Style",
        },
      ];
    }

    return NextResponse.json({
      success: true,
      sector,
      trends,
      lastUpdated,
      message: n8nResponse.success 
        ? "Trend verileri başarıyla alındı" 
        : "Mock veriler gösteriliyor (n8n bağlantısı yok)",
    });
  } catch (error: any) {
    console.error("Trend Radar fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Trend verileri alınırken hata oluştu",
      },
      { status: 500 }
    );
  }
}

