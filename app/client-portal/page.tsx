"use client";
import { useState, useEffect } from "react";

export default function ClientPortalPage() {
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client portal data - müşteri görünümü için
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setClientData({
        accounts: [
          { id: "1", username: "@hesap1", followers: 45230, engagement: 5.2 },
          { id: "2", username: "@hesap2", followers: 28900, engagement: 4.8 },
        ],
        recentReports: [
          { id: "1", name: "Aralık 2024 Raporu", date: new Date().toISOString() },
          { id: "2", name: "Kasım 2024 Raporu", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        upcomingPosts: 3,
        pendingApprovals: 2,
      });
    } catch (error) {
      console.error("Client data fetch error:", error);
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏢 Müşteri Portal</h1>
        <p className="text-gray-600">Hesaplarınızı ve raporlarınızı görüntüleyin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Toplam Hesap</p>
          <p className="text-3xl font-bold">{clientData?.accounts.length || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Toplam Takipçi</p>
          <p className="text-3xl font-bold">
            {clientData?.accounts.reduce((sum: number, acc: any) => sum + acc.followers, 0).toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Planlanan İçerik</p>
          <p className="text-3xl font-bold">{clientData?.upcomingPosts || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Bekleyen Onaylar</p>
          <p className="text-3xl font-bold">{clientData?.pendingApprovals || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📱 Hesaplarım</h2>
          <div className="space-y-4">
            {clientData?.accounts.map((account: any) => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{account.username}</p>
                  <p className="text-sm text-gray-500">{account.followers.toLocaleString()} takipçi</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Etkileşim</p>
                  <p className="text-lg font-bold text-purple-600">{account.engagement}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Raporlar</h2>
          <div className="space-y-4">
            {clientData?.recentReports.map((report: any) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(report.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                  Görüntüle
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
            Tüm Raporları Gör
          </button>
        </div>
      </div>

      {/* Content Approval */}
      {clientData?.pendingApprovals > 0 && (
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-yellow-900 mb-2">⏳ Bekleyen Onaylar</h3>
              <p className="text-yellow-700">{clientData.pendingApprovals} içerik onayınızı bekliyor</p>
            </div>
            <button className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-medium hover:bg-yellow-700 transition-colors">
              Onayları Görüntüle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




