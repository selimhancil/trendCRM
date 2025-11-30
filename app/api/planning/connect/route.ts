import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Instagram OAuth URL'i oluştur
    // Gerçek implementasyonda Instagram Graph API OAuth kullanılacak
    const clientId = process.env.INSTAGRAM_CLIENT_ID || "your-instagram-client-id";
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/planning/callback`;
    
    // Instagram Basic Display API veya Graph API için OAuth URL
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`;

    // n8n webhook'a bildir (opsiyonel)
    const n8nWebhookUrl = process.env.N8N_API_PLANNING_CONNECT_URL;
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "connect_instagram",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.log("n8n webhook error (non-critical):", error);
      }
    }

    return NextResponse.json({ auth_url: authUrl });
  } catch (error) {
    console.error("Error connecting Instagram:", error);
    return NextResponse.json(
      { error: "Failed to initiate Instagram connection" },
      { status: 500 }
    );
  }
}




