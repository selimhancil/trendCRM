import { NextResponse } from "next/server";
import { n8nClient } from "@/lib/n8nClient";

export async function POST(request: Request) {
  try {
    const { companyName, website, location } = await request.json();

    if (!companyName) {
      return NextResponse.json(
        { error: "Firma adı gereklidir" },
        { status: 400 }
      );
    }

    // Gerçek implementasyonda:
    // 1. Google Places API ile firma bilgileri
    // 2. Google Reviews API ile yorumlar
    // 3. Instagram Graph API ile Instagram verileri
    // 4. n8n workflow ile entegrasyon

    // Mock company data
    const companyData = {
      name: companyName,
      sector: "E-ticaret",
      website: website || `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      location: location || "İstanbul, Türkiye",
      phone: "+90 212 555 1234",
      email: `info@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      founded: "2018",
      employees: "50-100",
      description: `${companyName} sektöründe faaliyet gösteren, müşteri memnuniyetini ön planda tutan bir firmadır.`,
      googleRating: 4.5,
      googleReviews: 1247,
      googleReviewsData: [
        {
          id: "1",
          author: "Ayşe Yılmaz",
          rating: 5,
          text: "Harika ürünler ve mükemmel müşteri hizmeti!",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 12,
        },
      ],
      instagram: {
        username: companyName.toLowerCase().replace(/\s+/g, ''),
        followers: 45230,
        posts: 156,
        engagement: 5.2,
        verified: false,
      },
      socialMedia: {
        facebook: `https://facebook.com/${companyName.toLowerCase().replace(/\s+/g, '')}`,
        twitter: `https://twitter.com/${companyName.toLowerCase().replace(/\s+/g, '')}`,
        linkedin: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '')}`,
      },
    };

    return NextResponse.json({
      success: true,
      company: companyData,
    });
  } catch (error) {
    console.error("Company details error:", error);
    return NextResponse.json(
      { error: "Firma detayları alınamadı" },
      { status: 500 }
    );
  }
}




