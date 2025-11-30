import { NextResponse } from "next/server";
import { n8nClient } from "@/lib/n8nClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const accountId = searchParams.get("accountId") || "";

    // Önce n8n'den analytics verisi almayı dene
    const n8nResponse = await n8nClient.getAnalytics({
      accountId: accountId || undefined,
      period,
    });

    let analyticsData = null;
    if (n8nResponse.success && n8nResponse.data) {
      analyticsData = n8nResponse.data;
    }

    // Mock analytics data - Gerçek implementasyonda Supabase'den gelecek veya n8n'den
    const mockAnalyticsData = {
      followers: 45230,
      followersGrowth: 12.5,
      postsCount: 156,
      avgEngagement: 4.8,
      totalLikes: 1245000,
      totalComments: 45600,
      engagementRate: 5.2,
      bestPostTime: "18:00 - 20:00",
      weeklyStats: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          followers: 45230 - (6 - i) * 200,
          likes: 15000 + Math.random() * 5000,
          comments: 500 + Math.random() * 200,
        };
      }),
      topPosts: [
        {
          id: "1",
          caption: "🎯 Bu haftanın en popüler içeriği!",
          likes: 15230,
          comments: 890,
          date: new Date().toISOString(),
        },
        {
          id: "2",
          caption: "✨ Yeni koleksiyon tanıtımı",
          likes: 12450,
          comments: 650,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          caption: "🔥 Trend içerik #viral",
          likes: 11200,
          comments: 540,
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };

    // n8n'den veri gelmediyse mock data kullan
    const finalData = analyticsData || mockAnalyticsData;

    return NextResponse.json({
      success: true,
      data: finalData,
      period,
      accountId: accountId || "all",
      source: analyticsData ? "n8n" : "mock",
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Analytics verileri alınamadı" },
      { status: 500 }
    );
  }
}


