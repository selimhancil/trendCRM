import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mock data - Gerçek implementasyonda Supabase veya veritabanından çekilecek
    const accounts = [
      {
        id: "1",
        username: "example_account",
        profile_pic: "https://via.placeholder.com/150/4F46E5/FFFFFF?text=EA",
        connected: true,
        connected_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}




