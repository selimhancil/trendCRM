"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const fetchClient = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setClient({
        id: clientId,
        name: "Ali Veli",
        company: "Tech Corp",
        email: "ali@techcorp.com",
        phone: "+90 555 123 4567",
        accounts: 3,
        status: "active",
        joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ["premium", "active"],
      });
    } catch (error) {
      console.error("Client fetch error:", error);
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

  if (!client) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/clients" className="text-purple-600 hover:text-purple-700 mb-4 inline-flex items-center">
          ← Müşterilere Dön
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{client.name}</h1>
        <p className="text-gray-600">{client.company}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Müşteri Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">E-posta</label>
                <p className="text-gray-900">{client.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Telefon</label>
                <p className="text-gray-900">{client.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Hesap Sayısı</label>
                <p className="text-gray-900">{client.accounts} hesap</p>
              </div>
            </div>
          </div>

          {/* Accounts */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bağlı Hesaplar</h2>
            <p className="text-gray-500">Bu müşteriye bağlı Instagram hesapları burada görünecek</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                📊 Rapor Oluştur
              </button>
              <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                💬 Mesaj Gönder
              </button>
              <button className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors">
                📅 Toplantı Planla
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">İstatistikler</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Üyelik Tarihi</p>
                <p className="text-gray-900 font-medium">{new Date(client.joinedAt).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Son Aktivite</p>
                <p className="text-gray-900 font-medium">{new Date(client.lastActivity).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




