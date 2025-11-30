import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/planning?error=${error}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/planning?error=no_code`
      );
    }

    // Instagram access token al
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/planning/callback`;

    // Access token için istek
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId || "",
        client_secret: clientSecret || "",
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to get access token");
    }

    const tokenData = await tokenResponse.json();
    
    // n8n webhook'a bildir
    const n8nWebhookUrl = process.env.N8N_API_PLANNING_CONNECT_URL;
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "instagram_connected",
            access_token: tokenData.access_token,
            user_id: tokenData.user_id,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.log("n8n webhook error (non-critical):", error);
      }
    }

    // Başarılı bağlantı sonrası planning sayfasına yönlendir
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/planning?success=connected`
    );
  } catch (error) {
    console.error("Instagram callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/planning?error=callback_failed`
    );
  }
}




