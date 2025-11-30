import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    // Mock notifications - Gerçek implementasyonda Supabase'den gelecek
    const allNotifications = [
      {
        id: "1",
        type: "success" as const,
        title: "İçerik başarıyla planlandı",
        message: "@hesap1 için içerik 15 Ocak 18:00'de yayınlanacak",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        actionUrl: "/planning",
      },
      {
        id: "2",
        type: "info" as const,
        title: "Yeni yorum",
        message: "@kullanici1 bir gönderinize yorum yaptı",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        actionUrl: "/comments",
      },
      {
        id: "3",
        type: "warning" as const,
        title: "Takipçi artışı",
        message: "Son 24 saatte +250 yeni takipçi kazandınız!",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        actionUrl: "/analytics",
      },
    ];

    const notifications = unreadOnly
      ? allNotifications.filter(n => !n.read)
      : allNotifications;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: allNotifications.filter(n => !n.read).length,
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { error: "Bildirimler alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, notificationId } = await request.json();

    if (action === "markAsRead") {
      return NextResponse.json({
        success: true,
        message: "Bildirim okundu olarak işaretlendi",
      });
    }

    if (action === "markAllAsRead") {
      return NextResponse.json({
        success: true,
        message: "Tüm bildirimler okundu olarak işaretlendi",
      });
    }

    return NextResponse.json(
      { error: "Geçersiz işlem" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Notification action error:", error);
    return NextResponse.json(
      { error: "İşlem başarısız oldu" },
      { status: 500 }
    );
  }
}




