import { NextResponse } from "next/server";
import { n8nClient } from "@/lib/n8nClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const accountId = searchParams.get("accountId");

    // Önce n8n'den takvim verisi almayı dene
    const n8nResponse = await n8nClient.getCalendarPosts({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      accountId: accountId || undefined,
    });

    let calendarPosts = null;
    if (n8nResponse.success && n8nResponse.data) {
      calendarPosts = Array.isArray(n8nResponse.data)
        ? n8nResponse.data
        : n8nResponse.data.posts || [];
    }

    // Mock scheduled posts - Gerçek implementasyonda Supabase'den gelecek veya n8n'den
    const scheduledPosts = [
      {
        id: "1",
        account: "@hesap1",
        content: "Yeni koleksiyon tanıtımı",
        scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        post_type: "post" as const,
        hashtags: ["yeni", "koleksiyon", "moda"],
        media_url: "",
        status: "scheduled" as const,
      },
      {
        id: "2",
        account: "@hesap1",
        content: "Haftalık trend içerik",
        scheduled_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        post_type: "reel" as const,
        hashtags: ["trend", "viral"],
        media_url: "",
        status: "scheduled" as const,
      },
      {
        id: "3",
        account: "@hesap1",
        content: "Müşteri testimonial",
        scheduled_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        post_type: "post" as const,
        hashtags: ["testimonial", "müşteri"],
        media_url: "",
        status: "scheduled" as const,
      },
    ];

    // n8n'den veri gelmediyse mock data kullan
    const finalPosts = calendarPosts || scheduledPosts;

    return NextResponse.json({
      success: true,
      posts: finalPosts,
      count: finalPosts.length,
      source: calendarPosts ? "n8n" : "mock",
    });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Takvim verileri alınamadı" },
      { status: 500 }
    );
  }
}


