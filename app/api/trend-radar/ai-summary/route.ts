import { NextResponse } from "next/server";
import { aiService } from "@/lib/aiService";

export async function POST(request: Request) {
  try {
    const { trends, sector } = await request.json();

    if (!trends || !Array.isArray(trends) || trends.length === 0) {
      return NextResponse.json(
        { error: "Trend verileri gereklidir" },
        { status: 400 }
      );
    }

    // AI ile özet oluştur
    let aiSummary = "";
    
    try {
      // Trend verilerini AI'ya gönder
      const trendsText = trends.map((t: any, i: number) => 
        `${i + 1}. Ses: ${t.sound}, Görsel: ${t.visualStyle}, Konsept: ${t.concept}, Engagement: ${t.engagement}%`
      ).join("\n");

      const prompt = `Aşağıdaki ${sector || 'genel'} sektörü için trend verilerini analiz et ve kısa bir özet hazırla (maksimum 200 kelime). Türkçe yanıt ver.

Trend Verileri:
${trendsText}

Bu trendlerin sektör için ne anlama geldiğini, hangi fırsatların olduğunu ve önerilerinizi açıkla.`;

      aiSummary = await aiService.generateText(prompt, {
        maxTokens: 300,
        temperature: 0.7,
      });
    } catch (aiError: any) {
      console.error("AI summary error:", aiError);
      
      // Fallback: Basit bir özet
      aiSummary = `${sector || 'Bu'} sektöründe son trendler oldukça ilgi çekici. ` +
        `En yüksek engagement oranına sahip trendler ${trends
          .map((t: any) => t.sound)
          .slice(0, 2)
          .join(" ve ")} sesleri ile görsel stillerinde yoğunlaşıyor. ` +
        `Bu trendleri içerik stratejinize entegre ederek daha geniş bir kitleye ulaşabilirsiniz.`;
    }

    return NextResponse.json({
      success: true,
      summary: aiSummary,
      insights: trends.map((t: any) => ({
        trend: t.sound,
        insight: `${t.visualStyle} görsel stili ile ${t.concept} konsepti ${t.engagement}% engagement oranına sahip.`,
      })),
    });
  } catch (error: any) {
    console.error("AI Summary error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "AI özeti oluşturulurken hata oluştu",
      },
      { status: 500 }
    );
  }
}

