import { NextResponse } from "next/server";
import { aiService } from "@/lib/aiService";

export async function POST(request: Request) {
  try {
    const { query, sector } = await request.json();

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Hashtag sorgusu en az 2 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // AI ile hashtag önerisi
    let hashtags: string[] = [];
    
    const isReady = await aiService.isReady();
    if (isReady) {
      try {
        hashtags = await aiService.suggestHashtags(query, sector, 20);
      } catch (error) {
        console.error("AI hashtag error:", error);
      }
    }

    // Fallback hashtag'ler
    if (hashtags.length === 0) {
      hashtags = [
        query.toLowerCase(),
        `${query.toLowerCase()}trend`,
        `${query.toLowerCase()}viral`,
        `${query.toLowerCase()}2024`,
        `insta${query.toLowerCase()}`,
      ];
    }

    // Hashtag performans verileri (mock)
    const hashtagData = hashtags.map((tag, idx) => ({
      name: tag,
      posts: Math.floor(Math.random() * 5000000) + 100000,
      rank: idx + 1,
      trend: Math.random() > 0.5 ? "up" : "down",
      growth: (Math.random() * 20 - 10).toFixed(1),
    }));

    return NextResponse.json({
      success: true,
      hashtags: hashtagData,
      query,
      sector: sector || undefined,
    });
  } catch (error) {
    console.error("Hashtag search error:", error);
    return NextResponse.json(
      { error: "Hashtag araması başarısız oldu" },
      { status: 500 }
    );
  }
}




