import { NextResponse } from "next/server";
import { aiService, getAITrends } from "@/lib/aiService";

export async function POST(request: Request) {
  try {
    const { sector, question } = await request.json();

    if (!sector && !question) {
      return NextResponse.json(
        { error: "Sektör veya soru gereklidir" },
        { status: 400 }
      );
    }

    // n8n'den trend verisi almak için aiAgent kullanılabilir
    // Şimdilik direkt AI servisini kullanıyoruz
    let n8nResponse: { success: boolean; data: any } = { success: false, data: null };
    
    let trends: any[] = [];
    let aiRecommendation = "";

    // n8n'den veri geldiyse kullan
    if (n8nResponse.success && n8nResponse.data) {
      if (Array.isArray(n8nResponse.data)) {
        trends = n8nResponse.data;
      } else if (n8nResponse.data && typeof n8nResponse.data === 'object' && 'trends' in n8nResponse.data) {
        trends = n8nResponse.data.trends || [];
      }
    }

    // AI analizi yap (n8n verisi olsa da, AI önerisi ekle)
    try {
      const aiResult = await getAITrends({
        sector: sector?.trim(),
        question: question?.trim() || sector?.trim(),
      });

      // n8n'den trend gelmediyse AI'dan gelen trendleri kullan
      if (trends.length === 0 && aiResult.trends) {
        trends = aiResult.trends.map((trend: any, index: number) => ({
          id: String(index + 1),
          title: trend.title,
          description: trend.description,
          category: trend.category || sector || "Genel",
          views: Math.floor(Math.random() * 3000000) + 500000,
          likes: Math.floor(Math.random() * 200000) + 50000,
          shares: Math.floor(Math.random() * 60000) + 10000,
          thumbnail_url: `https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=${encodeURIComponent(trend.title.substring(0, 20))}`,
          video_url: "#",
          creator: "AI Assistant",
          created_at: new Date(Date.now() - index * 86400000).toISOString(),
          tags: trend.tags || [sector?.toLowerCase() || "trend", "ai"],
        }));
      }

      aiRecommendation = aiResult.aiRecommendation;
    } catch (aiError) {
      console.error("AI analysis error:", aiError);
      
      // AI hatası durumunda fallback
      if (trends.length === 0) {
        trends = [
          {
            id: "1",
            title: `${sector || 'Sektörünüz'} İçin Trend Önerisi`,
            description: `${question || sector} için trend içerik önerileri.`,
            category: sector || "Genel",
            views: 2500000,
            likes: 150000,
            shares: 45000,
            thumbnail_url: "https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=AI+Trend",
            video_url: "#",
            creator: "AI Assistant",
            created_at: new Date().toISOString(),
            tags: [sector?.toLowerCase() || "trend", "ai", "öneri"],
          },
        ];
      }

      aiRecommendation = `${sector || 'Sektörünüz'} için en güncel trendler: 1) Video içerikleri ön planda, 2) Kısa format içerikler popüler, 3) Etkileşimli içerikler yükselişte.`;
    }

    return NextResponse.json({
      trends,
      aiRecommendation,
      source: trends.length > 0 && trends[0].creator !== "AI Assistant" 
        ? "n8n" 
        : "ai",
    });

  } catch (error) {
    console.error("AI Trends API error:", error);
    return NextResponse.json(
      { error: "AI trend analizi alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
