import { NextResponse } from "next/server";
import { n8nClient } from "@/lib/n8nClient";
import { aiService } from "@/lib/aiService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";
    const accountId = searchParams.get("accountId");

    // Önce n8n'den yorumları almayı dene
    let n8nComments = null;
    const n8nResponse = await n8nClient.getComments({
      accountId: accountId || undefined,
      filter: filter,
    });

    if (n8nResponse.success && n8nResponse.data) {
      n8nComments = Array.isArray(n8nResponse.data) 
        ? n8nResponse.data 
        : n8nResponse.data.comments || [];
    }

    // Mock comments data - Gerçek implementasyonda Instagram API'den gelecek veya n8n'den
    const allComments: Array<{
      id: string;
      postId: string;
      postUrl: string;
      username: string;
      avatar: string;
      text: string;
      likes: number;
      timestamp: string;
      isReply: boolean;
      parentId: null;
      sentiment: "positive" | "neutral" | "negative";
      read: boolean;
    }> = [
      {
        id: "1",
        postId: "post1",
        postUrl: "https://instagram.com/p/example1",
        username: "kullanici1",
        avatar: "",
        text: "Harika bir içerik! 👏 Çok beğendim.",
        likes: 15,
        timestamp: new Date().toISOString(),
        isReply: false,
        parentId: null,
        sentiment: "positive",
        read: false,
      },
      {
        id: "2",
        postId: "post1",
        postUrl: "https://instagram.com/p/example1",
        username: "kullanici2",
        avatar: "",
        text: "Ne zaman yayınlanacak? Merakla bekliyorum.",
        likes: 3,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isReply: false,
        parentId: null,
        sentiment: "neutral",
        read: false,
      },
      {
        id: "3",
        postId: "post2",
        postUrl: "https://instagram.com/p/example2",
        username: "kullanici3",
        avatar: "",
        text: "Fiyat bilgisi alabilir miyim?",
        likes: 8,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isReply: false,
        parentId: null,
        sentiment: "neutral",
        read: true,
      },
      {
        id: "4",
        postId: "post2",
        postUrl: "https://instagram.com/p/example2",
        username: "kullanici4",
        avatar: "",
        text: "Bu ürün beklentileri karşılamadı.",
        likes: 2,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        isReply: false,
        parentId: null,
        sentiment: "negative",
        read: false,
      },
    ];

    // n8n'den veri gelmediyse mock data kullan
    let commentsToProcess = n8nComments || allComments;

    // AI ile sentiment analizi yap (henüz sentiment yoksa)
    // Not: Her yorum için ayrı ayrı AI çağrısı yapmak yerine batch işlem yapılabilir
    // Şimdilik sadece sentiment yoksa analiz yap
    const isReady = await aiService.isReady();
    if (isReady) {
      for (const comment of commentsToProcess) {
        if (!comment.sentiment || comment.sentiment === "neutral") {
          try {
            const sentimentResult = await aiService.analyzeSentiment(comment.text);
            comment.sentiment = sentimentResult.sentiment;
          } catch (error) {
            console.error("Sentiment analysis error:", error);
            // Fallback sentiment
            comment.sentiment = "neutral";
          }
        }
      }
    }

    // Filter comments
    let filteredComments = commentsToProcess;
    if (filter === "positive") {
      filteredComments = commentsToProcess.filter((c: any) => c.sentiment === "positive");
    } else if (filter === "negative") {
      filteredComments = commentsToProcess.filter((c: any) => c.sentiment === "negative");
    } else if (filter === "unread") {
      filteredComments = commentsToProcess.filter((c: any) => !c.read);
    }

    return NextResponse.json({
      success: true,
      comments: filteredComments,
      total: filteredComments.length,
      unread: commentsToProcess.filter((c: any) => !c.read).length,
      source: n8nComments ? "n8n" : "mock",
    });
  } catch (error) {
    console.error("Comments API error:", error);
    return NextResponse.json(
      { error: "Yorumlar alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, commentId, replyText } = await request.json();

    // n8n ile yorum işlemi
    const n8nResponse = await n8nClient.commentAction({
      action: action as "reply" | "delete" | "approve",
      commentId,
      replyText,
    });

    if (n8nResponse.success) {
      return NextResponse.json({
        success: true,
        message: n8nResponse.data?.message || "İşlem başarılı",
        replyId: n8nResponse.data?.replyId || (action === "reply" ? `reply_${Date.now()}` : undefined),
        source: "n8n",
      });
    }

    // Fallback - Mock action handling
    if (action === "reply") {
      return NextResponse.json({
        success: true,
        message: "Yanıt gönderildi",
        replyId: `reply_${Date.now()}`,
        source: "mock",
      });
    }

    if (action === "delete") {
      return NextResponse.json({
        success: true,
        message: "Yorum silindi",
        source: "mock",
      });
    }

    if (action === "approve") {
      return NextResponse.json({
        success: true,
        message: "Yorum onaylandı",
        source: "mock",
      });
    }

    return NextResponse.json(
      { error: "Geçersiz işlem" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Comment action error:", error);
    return NextResponse.json(
      { error: "İşlem başarısız oldu" },
      { status: 500 }
    );
  }
}
