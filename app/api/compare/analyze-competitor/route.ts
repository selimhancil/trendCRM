import { NextResponse } from "next/server";
import { aiService } from "@/lib/aiService";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: "Kullanıcı adı gereklidir" },
        { status: 400 }
      );
    }

    const cleanUsername = username.replace("@", "").trim();

    // Önce n8n'den rakip hesap verisi almayı dene (non-AI webhook kullanılabilir)
    let competitorData = null;
    // NOTE: analyzeInstagram removed - use non-AI webhook if needed

    // n8n'den veri gelmediyse mock data oluştur (gerçek implementasyonda Instagram API kullanılacak)
    const accountData = competitorData || {
      username: cleanUsername,
      followers: Math.floor(Math.random() * 500000) + 10000,
      posts_count: Math.floor(Math.random() * 500) + 50,
      following: Math.floor(Math.random() * 2000) + 100,
      verified: Math.random() > 0.7,
      profile_pic: `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${cleanUsername && cleanUsername.length > 0 ? cleanUsername.charAt(0).toUpperCase() : 'U'}`,
      bio: `@${cleanUsername} hesabı`,
      engagement: (Math.random() * 8 + 2).toFixed(1) + '%',
      avg_likes: Math.floor(Math.random() * 100000) + 5000,
      avg_comments: Math.floor(Math.random() * 5000) + 100,
    };

    // Yüksek etkileşimli içerikler (mock - gerçek implementasyonda Instagram API'den gelecek)
    const topPosts = [
      {
        id: "1",
        type: "reel",
        caption: "🔥 Bu haftanın en popüler içeriği!",
        likes: Math.floor(accountData.avg_likes * 1.5),
        comments: Math.floor(accountData.avg_comments * 1.5),
        views: Math.floor(accountData.avg_likes * 10),
        engagement_rate: (Math.random() * 10 + 8).toFixed(1),
        posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        hashtags: ["viral", "trend", "reels"],
        media_url: `https://via.placeholder.com/1080x1920/4F46E5/FFFFFF?text=Top+Reel`,
      },
      {
        id: "2",
        type: "post",
        caption: "✨ Yeni koleksiyon tanıtımı",
        likes: Math.floor(accountData.avg_likes * 1.2),
        comments: Math.floor(accountData.avg_comments * 1.2),
        engagement_rate: (Math.random() * 8 + 6).toFixed(1),
        posted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        hashtags: ["collection", "new", "fashion"],
        media_url: `https://via.placeholder.com/1080x1080/10B981/FFFFFF?text=Top+Post`,
      },
      {
        id: "3",
        type: "reel",
        caption: "💡 İpucu ve tavsiyeler",
        likes: Math.floor(accountData.avg_likes * 1.3),
        comments: Math.floor(accountData.avg_comments * 1.3),
        views: Math.floor(accountData.avg_likes * 8),
        engagement_rate: (Math.random() * 9 + 7).toFixed(1),
        posted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        hashtags: ["tips", "advice", "viral"],
        media_url: `https://via.placeholder.com/1080x1920/EF4444/FFFFFF?text=Top+Reel+2`,
      },
    ];

    // AI ile detaylı analiz ve tavsiyeler (unified n8n AI Agent üzerinden)
    let aiAnalysis = "";
    let aiRecommendations: Array<{ title: string; description: string; priority: "high" | "medium" | "low" }> = [];

    try {
      // Unified n8n AI Agent üzerinden rakip analizi yap
      const competitorAccount = {
        username: cleanUsername,
        followers: accountData.followers,
        posts: accountData.posts_count,
        engagement: parseFloat(accountData.engagement),
        avgLikes: accountData.avg_likes,
        avgComments: accountData.avg_comments,
        hashtags: topPosts.flatMap(p => p.hashtags),
        topPosts: topPosts,
      };

      const analysisPrompt = `Analyze competitor Instagram account @${cleanUsername} with ${accountData.followers} followers, ${accountData.posts_count} posts, and ${accountData.engagement}% engagement rate. Provide detailed analysis and recommendations.`;
      const analysisText = await aiService.generateText(analysisPrompt);
      
      if (analysisText && analysisText.trim()) {
        aiAnalysis = analysisText;
      }
    } catch (aiError) {
      console.error("AI analysis error:", aiError);
    }

    // Eğer AI'dan yeterli öneri gelmediyse default öneriler
    if (aiRecommendations.length < 3) {
      aiRecommendations = [
        {
          title: "Yüksek Etkileşimli İçerik Türlerini Kullanın",
          description: "Bu hesap reel içeriklerde çok başarılı. Reel formatında düzenli içerik paylaşın.",
          priority: "high",
        },
        {
          title: "Hashtag Stratejisini Optimize Edin",
          description: "Başarılı hashtag kombinasyonlarını analiz edip benzer stratejiler uygulayın.",
          priority: "high",
        },
        {
          title: "Post Zamanlamasını Optimize Edin",
          description: "En yüksek etkileşim alan içeriklerin paylaşım zamanlarını analiz edin.",
          priority: "medium",
        },
        {
          title: "İçerik Formatını Çeşitlendirin",
          description: "Farklı içerik türlerini deneyerek hangisinin daha iyi çalıştığını öğrenin.",
          priority: "medium",
        },
      ];
    }

    return NextResponse.json({
      success: true,
      account: accountData,
      topPosts,
      aiAnalysis: aiAnalysis || "Hesap analizi tamamlandı",
      recommendations: aiRecommendations,
    });
  } catch (error) {
    console.error("Competitor analysis error:", error);
    return NextResponse.json(
      { error: "Rakip hesap analizi yapılamadı" },
      { status: 500 }
    );
  }
}


