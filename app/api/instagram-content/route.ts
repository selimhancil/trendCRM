import { NextResponse } from "next/server";

interface InstagramPost {
  id: string;
  type: "reel" | "post" | "video";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption: string;
  username: string;
  likes_count: number;
  comments_count: number;
  views_count?: number;
  timestamp: string;
  hashtags: string[];
}

export async function POST(request: Request) {
  try {
    const { sector } = await request.json();

    if (!sector || sector.trim().length < 2) {
      return NextResponse.json(
        { error: "Sektör gereklidir (en az 2 karakter)" },
        { status: 400 }
      );
    }

    // n8n'den Instagram içerik verisi almak için aiAgent kullanılabilir
    // Şimdilik mock data kullanıyoruz
    let instagramData: InstagramPost[] = [];

    // Mock data - Gerçek Instagram API entegrasyonu için değiştirilebilir
    const mockPosts: InstagramPost[] = [
      {
        id: "1",
        type: "reel",
        media_url: `https://via.placeholder.com/1080x1920/4F46E5/FFFFFF?text=${encodeURIComponent(sector)}+Reel+1`,
        thumbnail_url: `https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=${encodeURIComponent(sector)}`,
        permalink: "https://instagram.com/p/example1",
        caption: `🔥 ${sector} sektöründe bu haftanın en popüler trendi! İzleyin ve beğenmeyi unutmayın 👆 #${sector.replace(/\s+/g, '')} #trend #viral`,
        username: `${sector.toLowerCase()}_creator`,
        likes_count: Math.floor(Math.random() * 500000) + 50000,
        comments_count: Math.floor(Math.random() * 50000) + 5000,
        views_count: Math.floor(Math.random() * 2000000) + 500000,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        hashtags: [sector.replace(/\s+/g, '').toLowerCase(), "trend", "viral", "reels"]
      },
      {
        id: "2",
        type: "reel",
        media_url: `https://via.placeholder.com/1080x1920/10B981/FFFFFF?text=${encodeURIComponent(sector)}+Reel+2`,
        thumbnail_url: `https://via.placeholder.com/400x225/10B981/FFFFFF?text=${encodeURIComponent(sector)}`,
        permalink: "https://instagram.com/p/example2",
        caption: `✨ ${sector} için mükemmel bir ipucu! Kaydetmeyi unutmayın 💾 #${sector.replace(/\s+/g, '')} #tips #creative`,
        username: `${sector.toLowerCase()}_expert`,
        likes_count: Math.floor(Math.random() * 300000) + 30000,
        comments_count: Math.floor(Math.random() * 30000) + 3000,
        views_count: Math.floor(Math.random() * 1500000) + 300000,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        hashtags: [sector.replace(/\s+/g, '').toLowerCase(), "tips", "creative", "reels"]
      },
      {
        id: "3",
        type: "post",
        media_url: `https://via.placeholder.com/1080x1080/EF4444/FFFFFF?text=${encodeURIComponent(sector)}+Post`,
        thumbnail_url: `https://via.placeholder.com/400x400/EF4444/FFFFFF?text=${encodeURIComponent(sector)}`,
        permalink: "https://instagram.com/p/example3",
        caption: `📊 ${sector} sektöründe bu ayın istatistikleri! Şaşırtıcı sonuçlar 👇 #${sector.replace(/\s+/g, '')} #stats #data`,
        username: `${sector.toLowerCase()}_analyst`,
        likes_count: Math.floor(Math.random() * 200000) + 20000,
        comments_count: Math.floor(Math.random() * 20000) + 2000,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        hashtags: [sector.replace(/\s+/g, '').toLowerCase(), "stats", "data", "analytics"]
      },
      {
        id: "4",
        type: "video",
        media_url: `https://via.placeholder.com/1080x1920/8B5CF6/FFFFFF?text=${encodeURIComponent(sector)}+Video`,
        thumbnail_url: `https://via.placeholder.com/400x225/8B5CF6/FFFFFF?text=${encodeURIComponent(sector)}`,
        permalink: "https://instagram.com/p/example4",
        caption: `🎬 ${sector} sektöründe yeni başlayanlar için rehber! İlk adımlar neler? 🚀 #${sector.replace(/\s+/g, '')} #guide #beginner`,
        username: `${sector.toLowerCase()}_mentor`,
        likes_count: Math.floor(Math.random() * 400000) + 40000,
        comments_count: Math.floor(Math.random() * 40000) + 4000,
        views_count: Math.floor(Math.random() * 1800000) + 400000,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        hashtags: [sector.replace(/\s+/g, '').toLowerCase(), "guide", "beginner", "tutorial"]
      },
      {
        id: "5",
        type: "reel",
        media_url: `https://via.placeholder.com/1080x1920/F59E0B/FFFFFF?text=${encodeURIComponent(sector)}+Reel+3`,
        thumbnail_url: `https://via.placeholder.com/400x225/F59E0B/FFFFFF?text=${encodeURIComponent(sector)}`,
        permalink: "https://instagram.com/p/example5",
        caption: `💡 ${sector} sektöründe başarı hikayeleri! İlham verici içerik 📚 #${sector.replace(/\s+/g, '')} #success #inspiration`,
        username: `${sector.toLowerCase()}_success`,
        likes_count: Math.floor(Math.random() * 600000) + 60000,
        comments_count: Math.floor(Math.random() * 60000) + 6000,
        views_count: Math.floor(Math.random() * 2500000) + 600000,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        hashtags: [sector.replace(/\s+/g, '').toLowerCase(), "success", "inspiration", "reels"]
      },
      {
        id: "6",
        type: "post",
        media_url: `https://via.placeholder.com/1080x1080/EC4899/FFFFFF?text=${encodeURIComponent(sector)}+Post+2`,
        thumbnail_url: `https://via.placeholder.com/400x400/EC4899/FFFFFF?text=${encodeURIComponent(sector)}`,
        permalink: "https://instagram.com/p/example6",
        caption: `🎯 ${sector} sektöründe bugünün öne çıkanları! Haftalık özet 🗓️ #${sector.replace(/\s+/g, '')} #highlights #weekly`,
        username: `${sector.toLowerCase()}_digest`,
        likes_count: Math.floor(Math.random() * 250000) + 25000,
        comments_count: Math.floor(Math.random() * 25000) + 2500,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        hashtags: [sector.replace(/\s+/g, '').toLowerCase(), "highlights", "weekly", "summary"]
      }
    ];

    // Mock data kullan (n8n entegrasyonu için aiAgent kullanılabilir)
    let posts: InstagramPost[] = instagramData.length > 0 ? instagramData : mockPosts;

    // Sektör bazlı filtreleme ve sıralama
    const filteredPosts = posts
      .map(post => ({
        ...post,
        relevanceScore: post.caption.toLowerCase().includes(sector.toLowerCase()) ? 100 : 50
      }))
      .sort((a, b) => {
        // Önce etkileşim sayısına göre sırala
        const aEngagement = a.likes_count + a.comments_count + (a.views_count || 0) / 10;
        const bEngagement = b.likes_count + b.comments_count + (b.views_count || 0) / 10;
        return bEngagement - aEngagement;
      })
      .slice(0, 8); // En fazla 8 içerik göster

    return NextResponse.json({
      posts: filteredPosts,
      sector: sector,
      total: filteredPosts.length,
      source: instagramData.length > 0 ? "n8n" : "mock"
    });

  } catch (error) {
    console.error("Instagram content API error:", error);
    return NextResponse.json(
      { error: "Instagram içerikleri alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
