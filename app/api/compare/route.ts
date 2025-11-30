import { NextResponse } from "next/server";
import { aiService } from "@/lib/aiService";

interface AccountComparison {
  yourAccount: {
    username: string;
    followers: number;
    posts: number;
    engagement: number;
    avgLikes: number;
    avgComments: number;
    hashtags: string[];
  };
  competitorAccounts: Array<{
    username: string;
    followers: number;
    posts: number;
    engagement: number;
    avgLikes: number;
    avgComments: number;
    hashtags: string[];
  }>;
}

export async function POST(request: Request) {
  try {
    const { yourAccount, competitorAccounts }: AccountComparison = await request.json();

    if (!yourAccount || !competitorAccounts || competitorAccounts.length === 0) {
      return NextResponse.json(
        { error: "Hesap bilgileri gereklidir" },
        { status: 400 }
      );
    }

    // AI ile detaylı karşılaştırma analizi (n8n AI Agent üzerinden)
    let analysis = null;
    let recommendations: string[] = [];
    let strengths: string[] = [];
    let weaknesses: string[] = [];
    let actionSteps: Array<{ step: number; title: string; description: string; priority: "high" | "medium" | "low" }> = [];

    try {
      // Unified n8n AI Agent üzerinden karşılaştırma analizi yap
      const competitorUsernames = competitorAccounts.map(c => `@${c.username}`).join(", ");
      const analysisPrompt = `Compare Instagram accounts. Your account: @${yourAccount.username} (${yourAccount.followers} followers, ${yourAccount.engagement}% engagement). Competitors: ${competitorUsernames}. Provide detailed comparison analysis, strengths, weaknesses, and action steps.`;
      const analysisText = await aiService.generateText(analysisPrompt);
      
      if (analysisText && analysisText.trim()) {
        analysis = analysisText;
      }
    } catch (aiError) {
      console.error("AI analysis error:", aiError);
    }

    // Fallback analiz
    if (!analysis) {
      const avgCompetitorFollowers = competitorAccounts.reduce((sum, c) => sum + c.followers, 0) / competitorAccounts.length;
      const avgCompetitorEngagement = competitorAccounts.reduce((sum, c) => sum + c.engagement, 0) / competitorAccounts.length;

      strengths = [
        yourAccount.followers > avgCompetitorFollowers ? "Takipçi sayınız rakiplerden yüksek" : "",
        yourAccount.engagement > avgCompetitorEngagement ? "Etkileşim oranınız iyi durumda" : "",
      ].filter(Boolean);

      weaknesses = [
        yourAccount.followers < avgCompetitorFollowers ? "Takipçi sayınız rakiplerden düşük" : "",
        yourAccount.engagement < avgCompetitorEngagement ? "Etkileşim oranınızı artırmanız gerekiyor" : "",
        yourAccount.posts < competitorAccounts[0].posts ? "Post sayınızı artırmanız gerekiyor" : "",
      ].filter(Boolean);

      actionSteps = [
        {
          step: 1,
          title: "İçerik Sıklığını Artırın",
          description: "Rakip hesaplar daha sık post paylaşıyor. Haftada en az 3-4 post hedefleyin.",
          priority: "high",
        },
        {
          step: 2,
          title: "Etkileşim Oranını Artırın",
          description: "İçeriklerinize sorular ekleyin, yorumlara hızlıca yanıt verin, story'lere etkileşim ekleyin.",
          priority: "high",
        },
        {
          step: 3,
          title: "Hashtag Stratejisini Geliştirin",
          description: "Rakip hesapların kullandığı hashtag'leri analiz edin ve benzer popüler hashtag'ler kullanın.",
          priority: "medium",
        },
        {
          step: 4,
          title: "Post Zamanlamasını Optimize Edin",
          description: "Rakip hesapların en aktif olduğu saatleri analiz edin ve benzer zamanlarda post paylaşın.",
          priority: "medium",
        },
      ];
    }

    return NextResponse.json({
      success: true,
      analysis: analysis || "Karşılaştırma analizi tamamlandı",
      strengths,
      weaknesses,
      actionSteps,
      metrics: {
        followerDiff: competitorAccounts.map(c => ({
          username: c.username,
          diff: c.followers - yourAccount.followers,
          percentage: ((c.followers - yourAccount.followers) / yourAccount.followers * 100).toFixed(1),
        })),
        engagementDiff: competitorAccounts.map(c => ({
          username: c.username,
          diff: (c.engagement - yourAccount.engagement).toFixed(1),
        })),
      },
    });
  } catch (error) {
    console.error("Comparison API error:", error);
    return NextResponse.json(
      { error: "Karşılaştırma analizi yapılamadı" },
      { status: 500 }
    );
  }
}
