import { NextResponse } from "next/server";
import { aiService } from "@/lib/aiService";

export async function POST(request: Request) {
  try {
    const { goal, budget, targetAudience, sector, duration } = await request.json();

    if (!goal || !budget || !targetAudience) {
      return NextResponse.json(
        { error: "Hedef, bütçe ve hedef kitle gereklidir" },
        { status: 400 }
      );
    }

    // AI ile kampanya önerisi (aiService üzerinden)
    let aiResult = null;
    try {
      aiResult = await aiService.suggestCampaign({
        goal,
        budget,
        targetAudience,
        sector,
        duration,
      });
    } catch (error) {
      console.error("AI campaign suggestion error:", error);
    }

    // Fallback
    let aiSuggestion = aiResult?.suggestion || "";
    let campaignStrategy: {
      name: string;
      description: string;
      budget: number;
      duration: number;
      platforms: string[];
      adTypes: string[];
      targeting: string[];
      metrics: string[];
    } | null = aiResult?.strategy || null;

    // Fallback öneri
    if (!campaignStrategy) {
      campaignStrategy = {
        name: `${goal} Kampanyası`,
        description: `${goal} hedefi için optimize edilmiş Instagram reklam kampanyası`,
        budget: budget,
        duration: duration || 30,
        platforms: ["Instagram Feed", "Instagram Stories"],
        adTypes: ["Video", "Görsel"],
        targeting: [
          "Yaş: 18-45",
          "İlgi Alanları: " + (sector || "Genel"),
          "Lokasyon: Türkiye",
        ],
        metrics: ["Erişim", "Etkileşim", "Tıklama Oranı"],
      };
    }

    return NextResponse.json({
      success: true,
      suggestion: aiSuggestion || aiResult?.suggestion || "Kampanya önerisi hazırlandı",
      strategy: campaignStrategy,
      source: aiResult ? "aiService" : "fallback",
    });
  } catch (error) {
    console.error("Campaign suggestion error:", error);
    return NextResponse.json(
      { error: "Kampanya önerisi oluşturulamadı" },
      { status: 500 }
    );
  }
}


