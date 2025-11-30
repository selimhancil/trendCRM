"use client";

import { useState } from "react";
import TrendCard from "./components/TrendCard";
import SectorSelect from "./components/SectorSelect";
import SummaryBox from "./components/SummaryBox";

interface Trend {
  sound: string;
  visualStyle: string;
  concept: string;
  engagement: number;
  soundUrl?: string;
  thumbnailUrl?: string;
}

interface TrendReport {
  sector: string;
  trends: Trend[];
  lastUpdated: string;
}

export default function TrendRadarPage() {
  const [selectedSector, setSelectedSector] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<TrendReport | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [insights, setInsights] = useState<Array<{ trend: string; insight: string }>>([]);
  const [reportsUsed, setReportsUsed] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Subscription kontrolü (placeholder - gerçek implementasyon için Supabase/Stripe gerekli)
  const MAX_FREE_REPORTS = 3;

  const generateReport = async () => {
    if (!selectedSector) {
      setError("Lütfen bir sektör seçiniz");
      return;
    }

    // Subscription kontrolü
    if (reportsUsed >= MAX_FREE_REPORTS) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setAiSummary(null);
    setInsights([]);

    try {
      // Trend verilerini çek
      const trendsResponse = await fetch("/api/trend-radar/fetch-trends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sector: selectedSector }),
      });

      if (!trendsResponse.ok) {
        throw new Error("Trend verileri alınamadı");
      }

      const trendsData = await trendsResponse.json();

      if (!trendsData.success) {
        throw new Error(trendsData.error || "Hata oluştu");
      }

      setReport({
        sector: trendsData.sector,
        trends: trendsData.trends,
        lastUpdated: trendsData.lastUpdated,
      });

      // AI özeti oluştur
      try {
        const summaryResponse = await fetch("/api/trend-radar/ai-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trends: trendsData.trends,
            sector: selectedSector,
          }),
        });

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          if (summaryData.success) {
            setAiSummary(summaryData.summary);
            setInsights(summaryData.insights || []);
          }
        }
      } catch (summaryError) {
        console.error("AI summary error:", summaryError);
      }

      // Rapor sayısını artır
      setReportsUsed((prev) => prev + 1);

      // Confetti animasyonu (basit versiyon)
      if (typeof window !== "undefined") {
        // Basit bir başarı mesajı göster
        console.log("🎉 Trend raporu oluşturuldu!");
      }
    } catch (err: any) {
      setError(err.message || "Rapor oluşturulurken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report) return;

    const csvContent = [
      ["Sektör", "Ses", "Görsel Stil", "Konsept", "Engagement"],
      ...report.trends.map((t) => [
        report.sector,
        t.sound,
        t.visualStyle,
        t.concept,
        `${t.engagement}%`,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `trend-radar-${report.sector}-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareReport = async () => {
    if (!report) return;

    const shareText = `${report.sector} sektörü için Trend Radar raporu - ${report.trends.length} trend bulundu.`;
    const shareUrl = `${window.location.origin}/trend-radar?report=${encodeURIComponent(JSON.stringify(report))}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Trend Radar Raporu",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // Kullanıcı paylaşımı iptal etti
      }
    } else {
      // Fallback: Clipboard'a kopyala
      await navigator.clipboard.writeText(shareUrl);
      alert("Link panoya kopyalandı!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Creative Trend Radar 🎧
          </h1>
          <p className="text-gray-600 text-lg">
            Sektörünüze özel haftalık trend fikirlerini keşfedin
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <SectorSelect value={selectedSector} onChange={setSelectedSector} />
            </div>
            <button
              onClick={generateReport}
              disabled={loading || !selectedSector}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Oluşturuluyor...
                </span>
              ) : (
                "Trend Raporu Oluştur"
              )}
            </button>
          </div>

          {/* Reports Counter */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Bu ay kullanılan rapor: {reportsUsed}/{MAX_FREE_REPORTS}
            </span>
            {reportsUsed >= MAX_FREE_REPORTS && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Pro'ya Yükselt →
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {report && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {report?.sector && report.sector.length > 0 ? report.sector.charAt(0).toUpperCase() + report.sector.slice(1) : 'Genel'} Sektörü Trend Raporu
                </h2>
                <p className="text-gray-600 text-sm">
                  Son güncelleme: {new Date(report.lastUpdated).toLocaleString("tr-TR")}
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  CSV İndir
                </button>
                <button
                  onClick={shareReport}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Paylaş
                </button>
              </div>
            </div>

            {/* Trend Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {report.trends.map((trend, index) => (
                <TrendCard key={index} {...trend} index={index} />
              ))}
            </div>

            {/* AI Summary */}
            {aiSummary && (
              <SummaryBox summary={aiSummary} insights={insights} />
            )}
          </div>
        )}

        {/* Empty State */}
        {!report && !loading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              Sektör seçip "Trend Raporu Oluştur" butonuna tıklayarak başlayın
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              TrendCRM Pro'ya Yükselt
            </h3>
            <p className="text-gray-600 mb-6">
              Ücretsiz planınızda aylık {MAX_FREE_REPORTS} rapor limitine ulaştınız. 
              Pro plana geçerek sınırsız trend raporu oluşturabilirsiniz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  // TODO: Stripe/Supabase entegrasyonu
                  alert("Pro plan özelliği yakında eklenecek!");
                  setShowUpgradeModal(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Pro'ya Geç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

