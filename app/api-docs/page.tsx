"use client";
import { useState } from "react";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  parameters?: Array<{ name: string; type: string; required: boolean; description: string }>;
  example?: string;
}

export default function APIDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  const endpoints: Endpoint[] = [
    {
      method: "GET",
      path: "/api/analytics",
      description: "Performans analitik verilerini getirir",
      parameters: [
        { name: "period", type: "string", required: false, description: "Zaman aralığı (7d, 30d, 90d)" },
        { name: "accountId", type: "string", required: false, description: "Hesap ID" },
      ],
      example: `GET /api/analytics?period=30d&accountId=123
{
  "success": true,
  "data": {
    "followers": 45230,
    "engagementRate": 5.2,
    ...
  }
}`,
    },
    {
      method: "POST",
      path: "/api/caption/generate",
      description: "AI ile caption oluşturur",
      parameters: [
        { name: "content", type: "string", required: true, description: "İçerik açıklaması" },
        { name: "tone", type: "string", required: false, description: "Ton (fun, professional, friendly)" },
      ],
      example: `POST /api/caption/generate
{
  "content": "Yeni koleksiyon tanıtımı",
  "tone": "professional"
}`,
    },
    {
      method: "GET",
      path: "/api/accounts",
      description: "Bağlı hesapları listeler",
      example: `GET /api/accounts
{
  "success": true,
  "accounts": [...]
}`,
    },
    {
      method: "POST",
      path: "/api/planning/schedule",
      description: "İçerik planlar",
      parameters: [
        { name: "account", type: "string", required: true, description: "Hesap adı" },
        { name: "content", type: "string", required: true, description: "İçerik metni" },
        { name: "scheduled_time", type: "ISO string", required: true, description: "Planlanan zaman" },
      ],
    },
  ];

  const selected = endpoints.find(e => e.path === selectedEndpoint);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 API Dokümantasyonu</h1>
        <p className="text-gray-600">trendCRM API'lerini kullanarak entegrasyonlar geliştirin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">API Endpoints</h2>
            <div className="space-y-2">
              {endpoints.map((endpoint) => (
                <button
                  key={endpoint.path}
                  onClick={() => setSelectedEndpoint(endpoint.path)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedEndpoint === endpoint.path
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === "GET" ? "bg-green-100 text-green-700" :
                      endpoint.method === "POST" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="text-sm font-medium">{endpoint.path}</span>
                  </div>
                  <p className="text-xs text-gray-500">{endpoint.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Endpoint Details */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <span className={`px-3 py-1 rounded font-medium ${
                  selected.method === "GET" ? "bg-green-100 text-green-700" :
                  selected.method === "POST" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {selected.method}
                </span>
                <code className="text-lg font-mono text-gray-900">{selected.path}</code>
              </div>

              <p className="text-gray-700 mb-6">{selected.description}</p>

              {selected.parameters && selected.parameters.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Parametreler</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Parametre</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tip</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Zorunlu</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Açıklama</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.parameters.map((param, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-4 py-2 font-mono text-sm">{param.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{param.type}</td>
                            <td className="px-4 py-2 text-sm">
                              {param.required ? (
                                <span className="text-red-600 font-medium">Evet</span>
                              ) : (
                                <span className="text-gray-500">Hayır</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selected.example && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Örnek</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{selected.example}</code>
                  </pre>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>🔑 Authentication:</strong> API çağrıları için header'da <code className="bg-blue-100 px-2 py-1 rounded">Authorization: Bearer YOUR_API_KEY</code> ekleyin.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bir Endpoint Seçin</h3>
              <p className="text-gray-600">Sol taraftan detaylarını görmek istediğiniz endpoint'i seçin</p>
            </div>
          )}
        </div>
      </div>

      {/* API Key Management */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔑 API Key Yönetimi</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Production API Key</p>
              <p className="text-sm text-gray-500">Ana API anahtarınız</p>
            </div>
            <div className="flex items-center space-x-3">
              <code className="px-4 py-2 bg-gray-100 rounded font-mono text-sm">••••••••••••••••</code>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                Yenile
              </button>
            </div>
          </div>
          <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
            ➕ Yeni API Key Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}




