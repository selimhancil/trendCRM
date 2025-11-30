"use client";
import { useState } from "react";
import Link from "next/link";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"weekly" | "monthly" | "custom">("weekly");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType,
          format: "pdf",
        }),
      });

      if (!response.ok) throw new Error("Rapor oluşturulamadı");

      const result = await response.json();
      if (result.success && result.downloadUrl) {
        window.open(result.downloadUrl, "_blank");
        alert(result.message);
      }
    } catch (error) {
      console.error("Report generation error:", error);
      alert("Rapor oluşturulurken bir hata oluştu");
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = (format: "pdf" | "excel") => {
    alert(`${(format || 'pdf').toUpperCase()} formatında rapor indiriliyor...`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Raporlar</h1>
        <p className="text-gray-600">Detaylı performans raporları oluşturun ve dışa aktarın</p>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Rapor Oluştur</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Rapor Tipi</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "weekly", label: "📅 Haftalık", desc: "Son 7 gün" },
                { value: "monthly", label: "📆 Aylık", desc: "Son 30 gün" },
                { value: "custom", label: "🎯 Özel", desc: "Tarih aralığı seç" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setReportType(type.value as any)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    reportType === type.value
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{type.label.split(' ')[0]}</div>
                  <div className="font-semibold text-gray-900">{type.label.split(' ').slice(1).join(' ')}</div>
                  <div className="text-sm text-gray-500 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
          >
            {generating ? "Rapor Oluşturuluyor..." : "📊 Rapor Oluştur"}
          </button>

          <div className="pt-4 border-t border-gray-200">
            <Link
              href="/reports/templates"
              className="block text-center text-purple-600 hover:text-purple-700 font-medium"
            >
              📋 Rapor Şablonlarını Görüntüle →
            </Link>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Raporu Dışa Aktar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleExport("pdf")}
            className="p-6 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-colors text-left"
          >
            <div className="text-3xl mb-2">📄</div>
            <div className="font-semibold text-gray-900">PDF Formatında</div>
            <div className="text-sm text-gray-600 mt-1">Yazdırma için ideal</div>
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors text-left"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold text-gray-900">Excel Formatında</div>
            <div className="text-sm text-gray-600 mt-1">Analiz için ideal</div>
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Son Oluşturulan Raporlar</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Henüz rapor oluşturulmamış</p>
        </div>
      </div>
    </div>
  );
}
