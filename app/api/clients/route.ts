import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    // Mock clients data - Gerçek implementasyonda Supabase'den gelecek
    const allClients = [
      {
        id: "1",
        name: "Ali Veli",
        company: "Tech Corp",
        email: "ali@techcorp.com",
        phone: "+90 555 123 4567",
        accounts: 3,
        status: "active" as const,
        avatar: "",
        joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["premium", "active"],
        notes: "VIP müşteri - özel destek gerekiyor",
      },
      {
        id: "2",
        name: "Zeynep Şahin",
        company: "Fashion Brand",
        email: "zeynep@fashion.com",
        phone: "+90 555 987 6543",
        accounts: 2,
        status: "active" as const,
        avatar: "",
        joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["standard"],
        notes: "",
      },
      {
        id: "3",
        name: "Can Öz",
        company: "Restaurant Chain",
        email: "can@restaurant.com",
        phone: "+90 555 111 2233",
        accounts: 1,
        status: "pending" as const,
        avatar: "",
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["new"],
        notes: "Onboarding sürecinde",
      },
    ];

    let filteredClients = allClients;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredClients = filteredClients.filter(
        client =>
          client.name.toLowerCase().includes(searchLower) ||
          client.company.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== "all") {
      filteredClients = filteredClients.filter(client => client.status === status);
    }

    return NextResponse.json({
      success: true,
      clients: filteredClients,
      count: filteredClients.length,
    });
  } catch (error) {
    console.error("Clients API error:", error);
    return NextResponse.json(
      { error: "Müşteriler alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, clientData, clientId } = await request.json();

    if (action === "create") {
      return NextResponse.json({
        success: true,
        client: {
          id: `client_${Date.now()}`,
          ...clientData,
          joinedAt: new Date().toISOString(),
        },
        message: "Müşteri oluşturuldu",
      });
    }

    if (action === "update") {
      return NextResponse.json({
        success: true,
        message: "Müşteri güncellendi",
      });
    }

    return NextResponse.json(
      { error: "Geçersiz işlem" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Client action error:", error);
    return NextResponse.json(
      { error: "İşlem başarısız oldu" },
      { status: 500 }
    );
  }
}




