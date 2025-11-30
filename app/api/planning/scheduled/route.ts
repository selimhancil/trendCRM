import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mock data - Gerçek implementasyonda veritabanından çekilecek
    const posts = [
      {
        id: "1",
        content: "Bu haftanın en önemli trendlerini sizlerle paylaşıyorum! 🔥 #trend #instagram",
        scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: "scheduled",
        account: "example_account",
        hashtags: ["trend", "instagram", "marketing"],
        post_type: "post",
        media_url: "https://via.placeholder.com/1080x1080/4F46E5/FFFFFF?text=Post+1",
      },
      {
        id: "2",
        content: "Yeni reel içeriğimiz hazır! Videoyu izlemeyi unutmayın 🎬",
        scheduled_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        account: "example_account",
        hashtags: ["reel", "video", "content"],
        post_type: "reel",
        media_url: "https://via.placeholder.com/1080x1920/EC4899/FFFFFF?text=Reel+1",
      },
    ];

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled posts" },
      { status: 500 }
    );
  }
}




