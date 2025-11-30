import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { reportId, recipients, schedule } = await request.json();

    if (!reportId || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: "Rapor ID ve alıcılar gereklidir" },
        { status: 400 }
      );
    }

    // Email gönderme logic - Gerçek implementasyonda SendGrid, AWS SES vb. kullanılabilir
    const emailResult = {
      success: true,
      message: "Rapor başarıyla gönderildi",
      recipients: recipients,
      scheduled: schedule || false,
      sentAt: new Date().toISOString(),
    };

    return NextResponse.json({
      ...emailResult,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Rapor gönderilemedi" },
      { status: 500 }
    );
  }
}
