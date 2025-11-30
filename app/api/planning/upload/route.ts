import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const accountId = formData.get("accountId") as string || "default";

    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadı" },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Geçersiz dosya tipi. Sadece görsel (JPG, PNG, GIF, WEBP) ve video (MP4, MOV) desteklenir." },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dosya çok büyük. Maksimum 100MB." },
        { status: 400 }
      );
    }

    // Dosya adını oluştur
    const fileExt = file.name.split('.').pop();
    const fileName = `${accountId}_${Date.now()}.${fileExt}`;
    const filePath = `planning/${fileName}`;

    // Supabase Storage'a yükle
    try {
      const fileBuffer = await file.arrayBuffer();
      const fileBytes = Buffer.from(fileBuffer);

      // Supabase Storage bucket'ına yükle
      const { data, error: uploadError } = await supabase.storage
        .from('instagram-media')
        .upload(filePath, fileBytes, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        // Supabase Storage yoksa, alternatif olarak base64 veya public URL kullan
        console.log("Supabase Storage hatası, alternatif yöntem kullanılıyor:", uploadError);
        
        // n8n webhook'a gönder (n8n dosyayı işleyebilir)
        const n8nWebhookUrl = process.env.N8N_API_PLANNING_UPLOAD_URL;
        if (n8nWebhookUrl) {
          const base64File = fileBytes.toString('base64');
          try {
            await fetch(n8nWebhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filename: fileName,
                contentType: file.type,
                size: file.size,
                data: base64File
              }),
            });
          } catch (error) {
            console.log("n8n upload webhook error:", error);
          }
        }

        // Mock URL döndür (gerçek implementasyonda n8n'den gelen URL kullanılacak)
        return NextResponse.json({
          url: `https://via.placeholder.com/1080x1080/4F46E5/FFFFFF?text=${encodeURIComponent(fileName)}`,
          filename: fileName,
          size: file.size,
          type: file.type
        });
      }

      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('instagram-media')
        .getPublicUrl(filePath);

      return NextResponse.json({
        url: publicUrl,
        filename: fileName,
        size: file.size,
        type: file.type
      });

    } catch (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "Dosya yükleme başarısız oldu" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}




