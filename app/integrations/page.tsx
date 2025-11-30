"use client";
import { useState } from "react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: "social" | "analytics" | "automation" | "storage";
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Zapier",
      description: "2000+ uygulama ile entegrasyon",
      icon: "⚡",
      connected: false,
      category: "automation",
    },
    {
      id: "2",
      name: "Make (Integromat)",
      description: "Otomasyon ve workflow",
      icon: "🔗",
      connected: false,
      category: "automation",
    },
    {
      id: "3",
      name: "Slack",
      description: "Takım bildirimleri",
      icon: "💬",
      connected: false,
      category: "automation",
    },
    {
      id: "4",
      name: "Google Analytics",
      description: "Web analytics entegrasyonu",
      icon: "📊",
      connected: false,
      category: "analytics",
    },
    {
      id: "5",
      name: "Facebook",
      description: "Facebook ve Instagram yönetimi",
      icon: "📘",
      connected: false,
      category: "social",
    },
    {
      id: "6",
      name: "Shopify",
      description: "E-ticaret entegrasyonu",
      icon: "🛒",
      connected: false,
      category: "storage",
    },
  ]);

  const handleConnect = async (id: string) => {
    // Integration connection logic
    setIntegrations(integrations.map(int => 
      int.id === id ? { ...int, connected: true } : int
    ));
  };

  const categories = {
    social: "Sosyal Medya",
    analytics: "Analitik",
    automation: "Otomasyon",
    storage: "Depolama",
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔗 Entegrasyonlar</h1>
        <p className="text-gray-600">Popüler araçlarla entegrasyonlar</p>
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([key, label]) => {
          const categoryIntegrations = integrations.filter(int => int.category === key);
          if (categoryIntegrations.length === 0) return null;

          return (
            <div key={key} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{label}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      integration.connected
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{integration.name}</p>
                        </div>
                      </div>
                      {integration.connected && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Bağlı</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                    <button
                      onClick={() => handleConnect(integration.id)}
                      disabled={integration.connected}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                        integration.connected
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      }`}
                    >
                      {integration.connected ? "Bağlı" : "Bağlan"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* API Keys Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔑 API Keys</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">REST API Key</p>
              <p className="text-sm text-gray-500">Platform API'leri için</p>
            </div>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
              Oluştur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




