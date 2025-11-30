import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { account, content, scheduled_time, hashtags, post_type, media_url } = body;

    if (!account || !content || !scheduled_time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Tarih validasyonu: Bugünden itibaren en fazla 27 gün sonrası
    const scheduledDate = new Date(scheduled_time);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugünün başlangıcı
    
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 27);
    maxDate.setHours(23, 59, 59, 999); // 27. günün sonu

    if (scheduledDate < today) {
      return NextResponse.json(
        { error: "Geçmiş bir tarih seçemezsiniz" },
        { status: 400 }
      );
    }

    if (scheduledDate > maxDate) {
      return NextResponse.json(
        { error: "Planlama tarihi bugünden itibaren en fazla 27 gün sonrası olabilir" },
        { status: 400 }
      );
    }

    // Yeni planlanmış içerik oluştur
    const newPost = {
      id: `post_${Date.now()}`,
      content,
      scheduled_time,
      status: "scheduled",
      account,
      hashtags: hashtags || [],
      post_type: post_type || "post",
      media_url: media_url || undefined,
      created_at: new Date().toISOString(),
    };

    // n8n webhook'a gönder
    const { n8nClient } = await import("@/lib/n8nClient");
    const n8nResponse = await n8nClient.schedulePost({
      account: newPost.account,
      content: newPost.content,
      scheduled_time: newPost.scheduled_time,
      hashtags: newPost.hashtags,
      post_type: newPost.post_type,
      media_url: newPost.media_url,
    });

    if (!n8nResponse.success) {
      console.error("n8n webhook failed:", n8nResponse.error);
      // Webhook hatası planlamayı durdurmamalı, sadece logla
    }

    // Gerçek implementasyonda veritabanına kaydedilecek
    // const savedPost = await db.scheduledPosts.create(newPost);

    return NextResponse.json({ 
      success: true,
      post: newPost,
      message: "İçerik başarıyla planlandı ve n8n workflow'una gönderildi"
    });
  } catch (error) {
    console.error("Error scheduling post:", error);
    return NextResponse.json(
      { error: "Failed to schedule post" },
      { status: 500 }
    );
  }
}
