"use client";
import { useState, useEffect } from "react";

interface Account {
  id: string;
  username: string;
  followers: number;
  posts: number;
  engagement: number;
  avatar: string;
  connected: boolean;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/accounts");
      if (!response.ok) throw new Error("Hesaplar alınamadı");
      
      const result = await response.json();
      if (result.success && result.accounts) {
        setAccounts(result.accounts);
      }
    } catch (error) {
      console.error("Accounts fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 Hesap Yönetimi</h1>
          <p className="text-gray-600">Birden fazla Instagram hesabını tek yerden yönetin</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          ➕ Yeni Hesap Ekle
        </button>
      </div>

      {/* Accounts Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500">Henüz hesap eklenmemiş</p>
            </div>
          ) : (
            accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  @{account?.username && account.username.length > 0 ? account.username.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">@{account.username}</p>
                  <span className={`text-xs ${account.connected ? "text-green-600" : "text-red-600"}`}>
                    {account.connected ? "● Bağlı" : "○ Bağlı Değil"}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{(account.followers / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-500">Takipçi</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{account.posts}</p>
                <p className="text-xs text-gray-500">Gönderi</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{account.engagement}%</p>
                <p className="text-xs text-gray-500">Etkileşim</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                Görüntüle
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                ⚙️
              </button>
            </div>
          </div>
        ))
          )}
        </div>
      )}
    </div>
  );
}
