import { NextResponse } from "next/server";
import { aiService } from "@/lib/aiService";

export async function POST(request: Request) {
  try {
    const { content, tone, sector } = await request.json();

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "İçerik açıklaması en az 10 karakter olmalıdır" },
        { status: 400 }
      );
    }

    let caption = "";
    let hashtags: string[] = [];

    // Unified n8n AI Agent üzerinden caption oluştur
    try {
      const captionPrompt = `Generate an Instagram caption for: "${content}". Tone: ${tone || "professional"}. Sector: ${sector || "General"}.`;
      const captionText = await aiService.generateText(captionPrompt);
      
      if (captionText && captionText.trim()) {
        caption = captionText;
      }

      // Hashtag'ler için ayrı istek
      if (sector) {
        hashtags = await aiService.suggestHashtags(content, sector, 10);
      }
    } catch (error) {
      console.error("AI caption generation error:", error);
    }

    // Fallback caption
    if (!caption) {
      const toneEmojis: { [key: string]: string } = {
        fun: "🎉✨",
        professional: "💼📊",
        friendly: "👋💙",
      };
      
      caption = `${toneEmojis[tone || "professional"]} ${content}\n\n✨ Detaylı bilgi için profilimizi ziyaret edin!\n\n💬 Yorumlarınızı bekliyoruz!`;
    }

    // Add hashtags to caption if available
    if (hashtags.length > 0) {
      caption += `\n\n${hashtags.map(tag => `#${tag}`).join(" ")}`;
    }

    return NextResponse.json({
      success: true,
      caption,
      hashtags,
      tone: tone || "professional",
      characterCount: caption.length,
    });
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json(
      { error: "Caption oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}




