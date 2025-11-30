import { NextResponse } from "next/server";
import { aiService } from "@/lib/aiService";
import { n8nClient } from "@/lib/n8nClient";

export async function POST(request: Request) {
  try {
    const { username, sector, goal } = await request.json();
    
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (!sector) {
      return NextResponse.json(
        { error: "Sector is required" },
        { status: 400 }
      );
    }

    if (!goal) {
      return NextResponse.json(
        { error: "Goal is required" },
        { status: 400 }
      );
    }

    // Önce n8n'den Instagram verisi almayı dene
    let instagramData = null;
    const n8nResponse = await n8nClient.analyzeInstagram(username, sector, goal);
    
    if (n8nResponse.success && n8nResponse.data) {
      instagramData = n8nResponse.data;
    }

    // n8n'den veri gelmediyse mock data kullan
    const accountData = instagramData || {
      username: username,
      followers: Math.floor(Math.random() * 500000) + 5000,
      posts_count: Math.floor(Math.random() * 500) + 20,
      following: Math.floor(Math.random() * 2000) + 100,
      verified: Math.random() > 0.8,
      profile_pic: `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${username && username.length > 0 ? username.charAt(0).toUpperCase() : 'U'}`,
      bio: `${sector} sektöründe uzman. ${goal}`,
      engagement: (Math.random() * 5 + 1).toFixed(1) + '%'
    };

    // AI ile detaylı analiz (n8n AI Agent üzerinden)
    let detailedAnalysis = null;
    let recommendation = "";

    const isReady = await aiService.isReady();
    if (isReady) {
      try {
        const aiAnalysis = await aiService.analyzeInstagramAccount({
          username: accountData.username,
          followers: accountData.followers || 0,
          posts: accountData.posts_count || 0,
          engagement: accountData.engagement,
          sector: sector,
          goal: goal,
        });

        recommendation = aiAnalysis.recommendation || "";
        detailedAnalysis = aiAnalysis.detailedAnalysis || null;
      } catch (aiError) {
        console.error("AI analysis error:", aiError);
        // Fallback
        recommendation = `${sector} sektöründe ${goal} hedefiniz için öneriler: Düzenli içerik paylaşımı yapın, sektörünüze özel hashtag'ler kullanın, etkileşim oranınızı artırmak için sorular sorun ve topluluk oluşturun.`;
      }
    } else {
      // Demo mode - no AI
      recommendation = `${sector} sektöründe ${goal} hedefiniz için özel öneriler:\n\n1. İçerik Stratejisi: Sektörünüze özel değerli içerikler paylaşın\n2. Post Takvimi: Haftada 3-5 kez düzenli paylaşım yapın\n3. Hashtag: Sektörünüze özel hashtag'ler kullanın\n4. Etkileşim: Yorumlara hızlıca yanıt verin\n5. Analiz: Haftalık performans analizi yapın`;
      
      detailedAnalysis = {
        contentStrategy: `${sector} sektöründe ${goal} için en etkili içerik türleri: Eğitici içerikler, başarı hikayeleri, ürün/hizmet tanıtımları ve kullanıcı testimonialleri.`,
        postingSchedule: "Optimal paylaşım zamanları: Pazartesi-Salı-Perşembe saat 18:00-20:00 arası. Haftada minimum 3-4 post.",
        hashtagStrategy: `${sector} için özel hashtag'ler + genel trend hashtag'ler. Her postta 5-7 hashtag kullanın.`,
        audienceInsights: "Hedef kitleniz ${sector} ile ilgilenen kişiler. İçeriklerinizi bu kitleye göre özelleştirin.",
        improvementAreas: [
          "İçerik kalitesini artırın",
          "Etkileşim oranını yükseltin",
          "Düzenli paylaşım yapın"
        ],
        competitiveAdvantage: `${sector} sektöründe ${goal} hedefinize ulaşmak için benzersiz değer öneriniz üzerine odaklanın.`
      };
    }

    return NextResponse.json({
      ...accountData,
      sector: sector,
      goal: goal,
      recommendation: recommendation,
      detailedAnalysis: detailedAnalysis,
      source: instagramData ? "n8n" : "mock"
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze Instagram account" },
      { status: 500 }
    );
  }
}