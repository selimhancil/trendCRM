import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Mock brands data - Gerçek implementasyonda Supabase'den gelecek
    const brands = [
      {
        id: "1",
        name: "Ana Marka",
        logo: "",
        colorScheme: { primary: "#8B5CF6", secondary: "#EC4899" },
        accounts: 5,
        users: 8,
        active: true,
        createdAt: new Date().toISOString(),
        settings: {
          customDomain: null,
          whiteLabel: false,
        },
      },
    ];

    return NextResponse.json({
      success: true,
      brands,
      count: brands.length,
    });
  } catch (error) {
    console.error("Brands API error:", error);
    return NextResponse.json(
      { error: "Markalar alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, logo, colorScheme } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Marka adı gereklidir" },
        { status: 400 }
      );
    }

    // Yeni marka oluştur - Gerçek implementasyonda Supabase'e kaydedilecek
    const newBrand = {
      id: `brand_${Date.now()}`,
      name,
      logo: logo || "",
      colorScheme: colorScheme || { primary: "#8B5CF6", secondary: "#EC4899" },
      accounts: 0,
      users: 1,
      active: true,
      createdAt: new Date().toISOString(),
      settings: {
        customDomain: null,
        whiteLabel: false,
      },
    };

    return NextResponse.json({
      success: true,
      brand: newBrand,
      message: "Marka başarıyla oluşturuldu",
    });
  } catch (error) {
    console.error("Brand creation error:", error);
    return NextResponse.json(
      { error: "Marka oluşturulamadı" },
      { status: 500 }
    );
  }
}




