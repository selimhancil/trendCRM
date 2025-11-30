"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Campaign {
  id: string;
  name: string;
  type: "organic" | "ad";
  status: string;
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

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    setLoading(true);
    try {
      // Mock campaign data - Gerçek implementasyonda API'den gelecek
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockCampaign: Campaign = {
        id: campaignId,
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
      };

      setCampaign(mockCampaign);
    } catch (error) {
      console.error("Campaign fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <a href="/campaigns" className="text-purple-600 hover:text-purple-700 mb-4 inline-flex items-center">
          ← Kampanyalara Dön
        </a>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                campaign.status === "active" ? "bg-green-100 text-green-700" :
                campaign.status === "planned" ? "bg-blue-100 text-blue-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {campaign.status === "active" ? "Aktif" :
                 campaign.status === "planned" ? "Planlandı" :
                 "Tamamlandı"}
              </span>
              <span className="text-gray-600">{campaign.platform}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="space-y-6">
        {/* Budget & Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Bütçe ve İlerleme</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Bütçe</span>
              <span className="text-sm font-medium text-gray-900">
                {campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()} ₺
                <span className="ml-2 text-purple-600">
                  (%{((campaign.spent / campaign.budget) * 100).toFixed(1)})
                </span>
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Kalan Bütçe</p>
              <p className="text-lg font-bold text-gray-900">
                {(campaign.budget - campaign.spent).toLocaleString()} ₺
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Günlük Ortalama</p>
              <p className="text-lg font-bold text-gray-900">
                {Math.ceil(campaign.spent / Math.ceil((Date.now() - new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24)))} ₺
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tahmini Bitiş</p>
              <p className="text-lg font-bold text-gray-900">
                {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">ROI</p>
              <p className="text-lg font-bold text-green-600">
                {campaign.conversions && campaign.spent > 0
                  ? `%${((campaign.conversions * 100) / (campaign.spent / 100)).toFixed(1)}`
                  : "Hesaplanıyor..."}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Erişim</p>
            <p className="text-3xl font-bold">{campaign.reach.toLocaleString()}</p>
            <p className="text-sm opacity-80 mt-2">Görüntülenme: {campaign.impressions.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Etkileşim</p>
            <p className="text-3xl font-bold">{campaign.engagement}%</p>
            <p className="text-sm opacity-80 mt-2">Tıklama: {campaign.clicks.toLocaleString()}</p>
          </div>
          {campaign.type === "ad" && (
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-2">Dönüşümler</p>
              <p className="text-3xl font-bold">{campaign.conversions || 0}</p>
              <p className="text-sm opacity-80 mt-2">
                CTR: {campaign.ctr}% • CPC: {campaign.cpc} ₺
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
