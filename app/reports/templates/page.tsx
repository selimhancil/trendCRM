"use client";
import { useState } from "react";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  sections: string[];
  preview: string;
}

export default function ReportTemplatesPage() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: "1",
      name: "Performans Özeti",
      description: "Takipçi, etkileşim ve içerik performans özeti",
      icon: "📊",
      sections: ["Takipçi Analizi", "İçerik Performansı", "Hashtag Analizi"],
      preview: "/api/reports/preview?template=performance",
    },
    {
      id: "2",
      name: "Müşteri Raporu",
      description: "Müşterilere gönderilecek profesyonel rapor",
      icon: "💼",
      sections: ["Haftalık Özet", "Top 5 İçerik", "Hedefler vs Gerçekleşen"],
      preview: "/api/reports/preview?template=client",
    },
    {
      id: "3",
      name: "Rekabet Analizi",
      description: "Rakip hesaplarla karşılaştırmalı analiz",
      icon: "🏆",
      sections: ["Rakip Karşılaştırması", "Sektör Benchmark", "Fırsatlar"],
      preview: "/api/reports/preview?template=competitor",
    },
    {
      id: "4",
      name: "Aylık Detaylı",
      description: "30 günlük detaylı performans raporu",
      icon: "📅",
      sections: ["Günlük Trendler", "İçerik Analizi", "Audience Insights"],
      preview: "/api/reports/preview?template=monthly",
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Rapor Şablonları</h1>
        <p className="text-gray-600">Önceden hazırlanmış profesyonel rapor şablonları</p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-xl shadow-lg p-6 border-2 cursor-pointer transition-all hover:shadow-xl ${
              selectedTemplate === template.id
                ? "border-purple-500 ring-4 ring-purple-200"
                : "border-gray-100 hover:border-purple-300"
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="text-4xl mb-4">{template.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            <div className="space-y-2">
              {template.sections.map((section, idx) => (
                <div key={idx} className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {section}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      {selectedTemplate && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {templates.find(t => t.id === selectedTemplate)?.name}
              </h3>
              <p className="text-gray-600">Şablonu özelleştirin ve rapor oluşturun</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCustomize(true)}
                className="px-6 py-3 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors"
              >
                ✏️ Özelleştir
              </button>
              <button
                onClick={() => {
                  alert("Rapor oluşturuluyor...");
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                📄 Rapor Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Template Builder */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🎨 Özel Şablon Oluştur</h2>
        <button
          onClick={() => setShowCustomize(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all"
        >
          ➕ Yeni Şablon Oluştur
        </button>
      </div>
    </div>
  );
}




