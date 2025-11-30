import { NextResponse } from "next/server";
import { n8nClient } from "@/lib/n8nClient";

export async function GET(request: Request) {
  try {
    // Önce n8n'den hesapları almayı dene
    const n8nResponse = await n8nClient.getAccounts();

    let accounts = null;
    if (n8nResponse.success && n8nResponse.data) {
      accounts = Array.isArray(n8nResponse.data)
        ? n8nResponse.data
        : n8nResponse.data.accounts || [];
    }

    // Mock accounts - Gerçek implementasyonda Supabase'den gelecek veya n8n'den
    const mockAccounts = [
      {
        id: "1",
        username: "hesap1",
        displayName: "Hesap 1",
        followers: 45230,
        following: 1234,
        posts: 156,
        engagement: 5.2,
        avatar: "",
        connected: true,
        connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        username: "hesap2",
        displayName: "Hesap 2",
        followers: 28900,
        following: 890,
        posts: 98,
        engagement: 4.8,
        avatar: "",
        connected: true,
        connectedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastSync: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // n8n'den veri gelmediyse mock data kullan
    const finalAccounts = accounts || mockAccounts;

    return NextResponse.json({
      success: true,
      accounts: finalAccounts,
      count: finalAccounts.length,
      source: accounts ? "n8n" : "mock",
    });
  } catch (error) {
    console.error("Accounts API error:", error);
    return NextResponse.json(
      { error: "Hesaplar alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, accountId, username } = await request.json();

    if (action === "connect") {
      // Instagram OAuth connection logic
      return NextResponse.json({
        success: true,
        message: "Hesap bağlantısı başlatıldı",
        authUrl: "/api/planning/connect",
      });
    }

    if (action === "disconnect") {
      return NextResponse.json({
        success: true,
        message: "Hesap bağlantısı kesildi",
      });
    }

    if (action === "sync") {
      return NextResponse.json({
        success: true,
        message: "Hesap verileri senkronize edildi",
        lastSync: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Geçersiz işlem" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Account action error:", error);
    return NextResponse.json(
      { error: "İşlem başarısız oldu" },
      { status: 500 }
    );
  }
}


