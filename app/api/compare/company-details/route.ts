import { NextResponse } from "next/server";
import { n8nClient } from "@/lib/n8nClient";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: "Kullanıcı adı gereklidir" },
        { status: 400 }
      );
    }

    const cleanUsername = username.replace("@", "").trim();

    // Gerçek implementasyonda:
    // 1. Instagram Graph API ile hesap bilgileri
    // 2. Google Places API ile firma bilgileri
    // 3. Google Reviews API ile yorumlar
    // 4. n8n workflow ile entegrasyon

    // Mock company data - Instagram username'den firma bilgileri çıkarılacak
    const companyData = {
      // Instagram Hesap Bilgileri
      instagram: {
        username: cleanUsername,
        followers: Math.floor(Math.random() * 500000) + 10000,
        posts: Math.floor(Math.random() * 500) + 50,
        following: Math.floor(Math.random() * 2000) + 100,
        verified: Math.random() > 0.7,
        profile_pic: `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${cleanUsername && cleanUsername.length > 0 ? cleanUsername.charAt(0).toUpperCase() : 'U'}`,
        bio: `@${cleanUsername} resmi hesabı`,
        engagement: (Math.random() * 8 + 2).toFixed(1) + '%',
        avg_likes: Math.floor(Math.random() * 100000) + 5000,
        avg_comments: Math.floor(Math.random() * 5000) + 100,
      },

      // Firma Bilgileri (Instagram bio'dan çıkarılabilir)
      company: {
        name: cleanUsername && cleanUsername.length > 0 ? cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1) + " A.Ş." : "Şirket A.Ş.",
        sector: "E-ticaret",
        website: `https://www.${cleanUsername.toLowerCase().replace(/\s+/g, '')}.com`,
        location: "İstanbul, Türkiye",
        phone: "+90 212 555 1234",
        email: `info@${cleanUsername.toLowerCase().replace(/\s+/g, '')}.com`,
        founded: "2018",
        employees: "50-100",
        description: `${cleanUsername} sektöründe faaliyet gösteren, müşteri memnuniyetini ön planda tutan bir firmadır.`,
      },

      // Google Yorumları
      google: {
        rating: 4.5,
        totalReviews: 1247,
        reviews: [
          {
            id: "1",
            author: "Ayşe Yılmaz",
            rating: 5,
            text: "Harika ürünler ve mükemmel müşteri hizmeti! Kesinlikle tavsiye ederim.",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 12,
          },
          {
            id: "2",
            author: "Mehmet Demir",
            rating: 4,
            text: "Ürünler kaliteli, fiyatlar uygun. Kargo biraz geç geldi ama genel olarak memnunum.",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 8,
          },
          {
            id: "3",
            author: "Zeynep Kaya",
            rating: 5,
            text: "İlk kez alışveriş yaptım ve çok memnun kaldım. Hızlı kargo, kaliteli ürünler!",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 15,
          },
          {
            id: "4",
            author: "Can Öz",
            rating: 3,
            text: "Ürünler güzel ama beden konusunda dikkatli olmak gerekiyor. Küçük gelmiş.",
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 5,
          },
          {
            id: "5",
            author: "Elif Şahin",
            rating: 5,
            text: "Müşteri hizmetleri çok ilgili, sorularıma hızlıca cevap verdiler. Teşekkürler!",
            date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: 9,
          },
        ],
      },

      // Sosyal Medya Linkleri
      socialMedia: {
        facebook: `https://facebook.com/${cleanUsername.toLowerCase().replace(/\s+/g, '')}`,
        twitter: `https://twitter.com/${cleanUsername.toLowerCase().replace(/\s+/g, '')}`,
        linkedin: `https://linkedin.com/company/${cleanUsername.toLowerCase().replace(/\s+/g, '')}`,
      },
    };

    // n8n ile gerçek veri çekme (varsa)
    try {
      const n8nResponse = await n8nClient.analyzeInstagram(cleanUsername, "", "");
      if (n8nResponse.success && n8nResponse.data) {
        // n8n'den gelen verileri birleştir
        if (n8nResponse.data.username) {
          companyData.instagram.username = n8nResponse.data.username;
        }
        if (n8nResponse.data.followers) {
          companyData.instagram.followers = n8nResponse.data.followers;
        }
        if (n8nResponse.data.posts_count) {
          companyData.instagram.posts = n8nResponse.data.posts_count;
        }
      }
    } catch (n8nError) {
      console.error("n8n company data error:", n8nError);
    }

    return NextResponse.json({
      success: true,
      data: companyData,
    });
  } catch (error) {
    console.error("Company details error:", error);
    return NextResponse.json(
      { error: "Firma detayları alınamadı" },
      { status: 500 }
    );
  }
}




