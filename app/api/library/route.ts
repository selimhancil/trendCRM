import { NextResponse } from "next/server";
import { n8nClient } from "@/lib/n8nClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";
    const accountId = searchParams.get("accountId");

    // Önce n8n'den kütüphane verisi almayı dene
    const n8nResponse = await n8nClient.libraryAction({
      action: "get",
      filter,
      accountId: accountId || undefined,
    });

    let libraryItems = null;
    if (n8nResponse.success && n8nResponse.data) {
      libraryItems = Array.isArray(n8nResponse.data)
        ? n8nResponse.data
        : n8nResponse.data.items || [];
    }

    // Mock library items - Gerçek implementasyonda Supabase Storage'dan gelecek veya n8n'den
    const allItems = [
      {
        id: "1",
        type: "image" as const,
        url: "https://via.placeholder.com/1080x1080/4F46E5/FFFFFF?text=Image+1",
        thumbnail: "https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Image+1",
        caption: "Yeni koleksiyon tanıtım görseli",
        tags: ["koleksiyon", "tanıtım", "moda"],
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        accountId: "account1",
      },
      {
        id: "2",
        type: "video" as const,
        url: "https://via.placeholder.com/1080x1920/10B981/FFFFFF?text=Video+1",
        thumbnail: "https://via.placeholder.com/400x400/10B981/FFFFFF?text=Video+1",
        caption: "Reel içerik - Trend dans",
        tags: ["reel", "dans", "trend"],
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        accountId: "account1",
      },
      {
        id: "3",
        type: "image" as const,
        url: "https://via.placeholder.com/1080x1080/EF4444/FFFFFF?text=Image+2",
        thumbnail: "https://via.placeholder.com/400x400/EF4444/FFFFFF?text=Image+2",
        caption: "Ürün fotoğrafı",
        tags: ["ürün", "fotoğraf"],
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        accountId: "account1",
      },
    ];

    // Filter by type
    let filteredItems = allItems;
    if (filter === "image") {
      filteredItems = allItems.filter(item => item.type === "image");
    } else if (filter === "video") {
      filteredItems = allItems.filter(item => item.type === "video");
    }

    // Filter by account if provided
    if (accountId) {
      filteredItems = filteredItems.filter(item => item.accountId === accountId);
    }

    // n8n'den veri gelmediyse mock data kullan
    let finalItems = libraryItems || filteredItems;

    // Filter by type if not already filtered
    if (libraryItems && filter !== "all") {
      if (filter === "image") {
        finalItems = libraryItems.filter((item: any) => item.type === "image");
      } else if (filter === "video") {
        finalItems = libraryItems.filter((item: any) => item.type === "video");
      }
    }

    return NextResponse.json({
      success: true,
      items: finalItems,
      total: finalItems.length,
      source: libraryItems ? "n8n" : "mock",
    });
  } catch (error) {
    console.error("Library API error:", error);
    return NextResponse.json(
      { error: "Kütüphane verileri alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string;
    const tags = formData.get("tags") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya yüklenmedi" },
        { status: 400 }
      );
    }

    // n8n ile dosya yükleme dene
    const fileBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    const n8nResponse = await n8nClient.libraryAction({
      action: "upload",
      file: {
        filename: file.name,
        contentType: file.type,
        size: file.size,
        data: base64Data,
      },
    });

    if (n8nResponse.success && n8nResponse.data) {
      return NextResponse.json({
        success: true,
        item: n8nResponse.data.item || n8nResponse.data,
        message: "Dosya başarıyla yüklendi",
        source: "n8n",
      });
    }

    // Fallback - Mock file upload
    const fileType = file.type.startsWith("image/") ? "image" : "video";
    
    return NextResponse.json({
      success: true,
      item: {
        id: `item_${Date.now()}`,
        type: fileType,
        url: URL.createObjectURL(file),
        caption: caption || "",
        tags: tags ? tags.split(",").map(t => t.trim()) : [],
        uploadedAt: new Date().toISOString(),
      },
      message: "Dosya başarıyla yüklendi",
      source: "mock",
    });
  } catch (error) {
    console.error("Library upload error:", error);
    return NextResponse.json(
      { error: "Dosya yükleme başarısız oldu" },
      { status: 500 }
    );
  }
}


