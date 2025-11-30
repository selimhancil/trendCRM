"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  type: "organic" | "ad";
  status: "active" | "planned" | "completed" | "paused";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  conversions?: number;
  ctr?: number;
  cpc?: number;
  platform: string;
}

interface AISuggestion {
  suggestion: string;
  strategy: {
    name: string;
    description: string;
    budget: number;
    duration: number;
    platforms: string[];
    adTypes: string[];
    targeting: string[];
    metrics: string[];
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<"all" | "organic" | "ad">("all");
  const [loading, setLoading] = useState(true);
  const [showAISuggest, setShowAISuggest] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState<AISuggestion | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // AI Suggestion Form
  const [suggestionForm, setSuggestionForm] = useState({
    goal: "",
    budget: 0,
    targetAudience: "",
    sector: "",
    duration: 30,
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCampaigns([
        {
          id: "1",
          name: "Yılbaşı Organik Kampanya",
          type: "organic",
          status: "active",
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          budget: 0,
          spent: 0,
          reach: 125000,
          impressions: 189000,
          engagement: 4.8,
          clicks: 0,
          platform: "Instagram",
        },
        {
          id: "2",
          name: "Yeni Koleksiyon Reklam Kampanyası",
          type: "ad",
          status: "active",
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          budget: 50000,
          spent: 32000,
          reach: 450000,
          impressions: 680000,
          engagement: 6.2,
          clicks: 12500,
          conversions: 340,
          ctr: 1.84,
          cpc: 2.56,
          platform: "Instagram + Meta",
        },
        {
          id: "3",
          name: "Story Reklam Kampanyası",
          type: "ad",
          status: "active",
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          budget: 30000,
          spent: 28500,
          reach: 320000,
          impressions: 520000,
          engagement: 5.8,
          clicks: 8900,
          conversions: 210,
          ctr: 1.71,
          cpc: 3.20,
          platform: "Instagram Stories",
        },
        {
          id: "4",
          name: "Reels Organik Kampanya",
          type: "organic",
          status: "planned",
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          budget: 0,
          spent: 0,
          reach: 0,
          impressions: 0,
          engagement: 0,
          clicks: 0,
          platform: "Instagram Reels",
        },
      ]);
    } catch (error) {
      console.error("Campaigns fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggest = async () => {
    if (!suggestionForm.goal || !suggestionForm.budget || !suggestionForm.targetAudience) {
      alert("Hedef, bütçe ve hedef kitle gereklidir");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch("/api/campaigns/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(suggestionForm),
      });

      if (!response.ok) throw new Error("Öneri alınamadı");

      const result = await response.json();
      if (result.success) {
        setAISuggestion(result);
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      alert("AI önerisi alınırken bir hata oluştu");
    } finally {
      setAiLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filter === "all") return true;
    return c.type === filter;
  });

  const organicCampaigns = filteredCampaigns.filter(c => c.type === "organic");
  const adCampaigns = filteredCampaigns.filter(c => c.type === "ad");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📢 Kampanya Yönetimi</h1>
          <p className="text-gray-600">Organik ve reklam kampanyalarınızı yönetin</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAISuggest(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            🤖 AI Kampanya Önerisi
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
            ➕ Yeni Kampanya
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
        <div className="flex gap-3">
          {[
            { value: "all", label: "Tümü", count: campaigns.length },
            { value: "organic", label: "Organik", count: organicCampaigns.length },
            { value: "ad", label: "Reklam", count: adCampaigns.length },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                filter === f.value
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Toplam Bütçe</p>
          <p className="text-3xl font-bold">
            {campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()} ₺
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Harcanan</p>
          <p className="text-3xl font-bold">
            {campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()} ₺
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Toplam Erişim</p>
          <p className="text-3xl font-bold">
            {campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Ort. Etkileşim</p>
          <p className="text-3xl font-bold">
            {campaigns.length > 0 
              ? (campaigns.reduce((sum, c) => sum + c.engagement, 0) / campaigns.length).toFixed(1)
              : 0}%
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {/* Ad Campaigns */}
        {adCampaigns.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">📺 Reklam Kampanyaları</h2>
            <div className="space-y-4">
              {adCampaigns.map((campaign) => {
                const progress = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;
                const daysLeft = Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const roi = campaign.spent > 0 && campaign.conversions
                  ? ((campaign.conversions * 100) / (campaign.spent / 100)).toFixed(1)
                  : 0;

                return (
                  <div key={campaign.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                          📺
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              campaign.status === "active" ? "bg-green-100 text-green-700" :
                              campaign.status === "planned" ? "bg-blue-100 text-blue-700" :
                              campaign.status === "completed" ? "bg-gray-100 text-gray-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {campaign.status === "active" ? "Aktif" :
                               campaign.status === "planned" ? "Planlandı" :
                               campaign.status === "completed" ? "Tamamlandı" :
                               "Duraklatıldı"}
                            </span>
                            <span className="text-sm text-gray-500">{campaign.platform}</span>
                            {daysLeft > 0 && campaign.status === "active" && (
                              <span className="text-sm text-gray-500">{daysLeft} gün kaldı</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors inline-block"
                      >
                        Detay
                      </Link>
                    </div>

                    {/* Budget Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Bütçe</span>
                        <span className="text-sm font-medium text-gray-900">
                          {campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()} ₺
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Ad Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Erişim</p>
                        <p className="text-lg font-bold text-gray-900">{campaign.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Görüntülenme</p>
                        <p className="text-lg font-bold text-gray-900">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Etkileşim</p>
                        <p className="text-lg font-bold text-gray-900">{campaign.engagement}%</p>
                      </div>
                      {campaign.ctr && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">CTR</p>
                          <p className="text-lg font-bold text-gray-900">{campaign.ctr}%</p>
                        </div>
                      )}
                      {campaign.cpc && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">CPC</p>
                          <p className="text-lg font-bold text-gray-900">{campaign.cpc} ₺</p>
                        </div>
                      )}
                    </div>
                    {campaign.conversions && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">Dönüşümler</span>
                          <span className="text-lg font-bold text-green-900">{campaign.conversions}</span>
                        </div>
                        {roi && (
                          <div className="mt-2 text-xs text-green-700">
                            ROI: %{roi}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Organic Campaigns */}
        {organicCampaigns.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">📱 Organik Kampanyalar</h2>
            <div className="space-y-4">
              {organicCampaigns.map((campaign) => {
                const daysLeft = Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={campaign.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                          📱
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              campaign.status === "active" ? "bg-green-100 text-green-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>
                              {campaign.status === "active" ? "Aktif" : "Planlandı"}
                            </span>
                            <span className="text-sm text-gray-500">{campaign.platform}</span>
                            {daysLeft > 0 && campaign.status === "active" && (
                              <span className="text-sm text-gray-500">{daysLeft} gün kaldı</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors inline-block"
                      >
                        Detay
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Erişim</p>
                        <p className="text-lg font-bold text-gray-900">{campaign.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Görüntülenme</p>
                        <p className="text-lg font-bold text-gray-900">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Etkileşim</p>
                        <p className="text-lg font-bold text-gray-900">{campaign.engagement}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {filteredCampaigns.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-16 border border-gray-100 text-center">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kampanya Bulunamadı</h3>
            <p className="text-gray-600">Yeni bir kampanya oluşturun veya filtreleri değiştirin</p>
          </div>
        )}
      </div>

      {/* AI Suggestion Modal */}
      {showAISuggest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">🤖 AI Kampanya Önerisi</h3>
              <button
                onClick={() => {
                  setShowAISuggest(false);
                  setAISuggestion(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {!aiSuggestion ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kampanya Hedefi *</label>
                  <input
                    type="text"
                    value={suggestionForm.goal}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, goal: e.target.value })}
                    placeholder="Örn: Marka bilinirliği artırmak, Satış artırmak, Yeni ürün tanıtımı"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bütçe (₺) *</label>
                    <input
                      type="number"
                      value={suggestionForm.budget || ""}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, budget: parseInt(e.target.value) || 0 })}
                      placeholder="50000"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Süre (gün)</label>
                    <input
                      type="number"
                      value={suggestionForm.duration || ""}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, duration: parseInt(e.target.value) || 30 })}
                      placeholder="30"
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Kitle *</label>
                  <input
                    type="text"
                    value={suggestionForm.targetAudience}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, targetAudience: e.target.value })}
                    placeholder="Örn: 18-35 yaş, moda ilgilisi, İstanbul"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sektör</label>
                  <input
                    type="text"
                    value={suggestionForm.sector}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, sector: e.target.value })}
                    placeholder="Örn: Moda, Teknoloji, Yemek"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={handleAISuggest}
                  disabled={aiLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50"
                >
                  {aiLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      AI Öneri Oluşturuyor...
                    </span>
                  ) : (
                    "🤖 AI Önerisi Al"
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4">📋 Önerilen Strateji</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Kampanya Adı:</span>
                      <span className="ml-2 text-gray-900">{aiSuggestion.strategy.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Bütçe:</span>
                      <span className="ml-2 text-gray-900">{aiSuggestion.strategy.budget.toLocaleString()} ₺</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Süre:</span>
                      <span className="ml-2 text-gray-900">{aiSuggestion.strategy.duration} gün</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Platformlar:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {aiSuggestion.strategy.platforms.map((platform, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Reklam Türleri:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {aiSuggestion.strategy.adTypes.map((type, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Hedefleme:</span>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                        {aiSuggestion.strategy.targeting.map((target, idx) => (
                          <li key={idx}>{target}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Takip Edilecek Metrikler:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {aiSuggestion.strategy.metrics.map((metric, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">🤖 AI Detaylı Öneri</h4>
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {aiSuggestion.suggestion}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAISuggest(false);
                      setAISuggestion(null);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => {
                      // Kampanyayı oluştur
                      alert("Kampanya oluşturuldu!");
                      setShowAISuggest(false);
                      setAISuggestion(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700"
                  >
                    Bu Stratejiyi Uygula
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}