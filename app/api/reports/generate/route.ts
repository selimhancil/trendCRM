import { NextResponse } from "next/server";
import { n8nClient } from "@/lib/n8nClient";
import { aiService } from "@/lib/aiService";

export async function POST(request: Request) {
  try {
    const { reportType, startDate, endDate, accountId, format } = await request.json();

    // Önce n8n'den rapor verisi almayı dene
    const n8nResponse = await n8nClient.generateReport({
      reportType,
      startDate,
      endDate,
      accountId,
      format,
    });

    let reportData = null;
    if (n8nResponse.success && n8nResponse.data) {
      reportData = n8nResponse.data;
    }

    // Mock report data
    const mockReportData = {
      period: reportType === "weekly" ? "Son 7 Gün" : reportType === "monthly" ? "Son 30 Gün" : "Özel Tarih Aralığı",
      startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: endDate || new Date().toISOString(),
      accountId: accountId || "all",
      metrics: {
        followers: {
          start: 42000,
          end: 45230,
          growth: 7.7,
        },
        posts: 12,
        totalLikes: 145000,
        totalComments: 5600,
        engagementRate: 5.2,
        bestPost: {
          caption: "En popüler içerik",
          likes: 15230,
          comments: 890,
        },
      },
      topPosts: [
        { caption: "Post 1", likes: 15230, comments: 890 },
        { caption: "Post 2", likes: 12450, comments: 650 },
        { caption: "Post 3", likes: 11200, comments: 540 },
      ],
    };

    // n8n'den veri gelmediyse mock data kullan
    const finalReportData = reportData || mockReportData;

    // AI ile rapor analizi ve öneriler
    let aiAnalysis = null;
    try {
      aiAnalysis = await aiService.analyzeReport({
        metrics: finalReportData.metrics,
        period: finalReportData.period,
        accountData: accountId ? { id: accountId } : undefined,
      });
    } catch (error) {
      console.error("AI report analysis error:", error);
    }

    // PDF generation would use a library like pdfkit or puppeteer
    // Excel generation would use a library like xlsx
    
    return NextResponse.json({
      success: true,
      report: finalReportData,
      aiAnalysis,
      downloadUrl: `/api/reports/download?reportId=report_${Date.now()}&format=${format || 'pdf'}`,
      message: `${(format || 'pdf').toUpperCase()} formatında rapor hazırlandı`,
      source: reportData ? "n8n" : "mock",
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Rapor oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}


