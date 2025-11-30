import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Mock team data - Gerçek implementasyonda Supabase'den gelecek
    const members = [
      {
        id: "1",
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        role: "admin" as const,
        avatar: "",
        lastActive: new Date().toISOString(),
        status: "active" as const,
        permissions: ["all"],
      },
      {
        id: "2",
        name: "Ayşe Demir",
        email: "ayse@example.com",
        role: "manager" as const,
        avatar: "",
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        status: "active" as const,
        permissions: ["view", "edit", "report"],
      },
      {
        id: "3",
        name: "Mehmet Kaya",
        email: "mehmet@example.com",
        role: "editor" as const,
        avatar: "",
        lastActive: new Date(Date.now() - 86400000).toISOString(),
        status: "active" as const,
        permissions: ["view", "edit"],
      },
    ];

    return NextResponse.json({
      success: true,
      members,
      count: members.length,
    });
  } catch (error) {
    console.error("Team API error:", error);
    return NextResponse.json(
      { error: "Takım üyeleri alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, email, role, memberId } = await request.json();

    if (action === "invite") {
      if (!email || !role) {
        return NextResponse.json(
          { error: "Email ve rol gereklidir" },
          { status: 400 }
        );
      }

      // Invitation logic - Gerçek implementasyonda email gönderilecek
      return NextResponse.json({
        success: true,
        message: "Davetiye gönderildi",
        invitationId: `inv_${Date.now()}`,
      });
    }

    if (action === "remove") {
      return NextResponse.json({
        success: true,
        message: "Takım üyesi kaldırıldı",
      });
    }

    if (action === "updateRole") {
      return NextResponse.json({
        success: true,
        message: "Rol güncellendi",
      });
    }

    return NextResponse.json(
      { error: "Geçersiz işlem" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Team action error:", error);
    return NextResponse.json(
      { error: "İşlem başarısız oldu" },
      { status: 500 }
    );
  }
}




