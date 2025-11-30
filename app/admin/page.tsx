"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  role: string;
}

interface Stats {
  totalUsers: number;
  totalAnalyses: number;
  totalTrends: number;
  activeUsers: number;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAnalyses: 0,
    totalTrends: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Supabase yapılandırılmamışsa demo modda çalış
      if (!supabase) {
        console.log("Supabase yapılandırılmamış, demo modda çalışıyor");
        setUser({ email: "demo@trendcrm.com" });
        setLoading(false);
        fetchUsers();
        fetchStats();
        return;
      }

      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        // Demo modda admin panelini göster
        console.log("Kullanıcı girişi yok, demo modda çalışıyor");
        setUser({ email: "demo@trendcrm.com" });
        setLoading(false);
        fetchUsers();
        fetchStats();
        return;
      }

      // Basit admin kontrolü - email ile
      const adminEmails = ["admin@trendcrm.com", "selim@trendcrm.com"];
      if (!adminEmails.includes(user.email || "")) {
        router.push("/");
        return;
      }

      setUser(user);
      setLoading(false);
      fetchUsers();
      fetchStats();
    } catch (error) {
      // Supabase bağlantısı yoksa demo modda çalış
      console.log("Supabase bağlantısı yok, demo modda çalışıyor", error);
      setUser({ email: "demo@trendcrm.com" });
      setLoading(false);
      fetchUsers();
      fetchStats();
    }
  };

  const fetchUsers = async () => {
    // Demo data for development (Supabase admin API service role key gerektirir)
    setUsers([
      {
        id: "1",
        email: "user1@example.com",
        created_at: "2024-01-01T10:00:00Z",
        last_sign_in_at: "2024-01-15T14:30:00Z",
        role: "user"
      },
      {
        id: "2",
        email: "user2@example.com",
        created_at: "2024-01-05T09:15:00Z",
        last_sign_in_at: "2024-01-14T16:45:00Z",
        role: "user"
      },
      {
        id: "3",
        email: "admin@trendcrm.com",
        created_at: "2024-01-01T08:00:00Z",
        last_sign_in_at: "2024-01-15T10:20:00Z",
        role: "admin"
      },
      {
        id: "4",
        email: "demo@trendcrm.com",
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        role: "admin"
      }
    ]);
  };

  const fetchStats = async () => {
    // Demo stats for development
    setStats({
      totalUsers: 25,
      totalAnalyses: 150,
      totalTrends: 500,
      activeUsers: 18
    });
    // Loading zaten checkUser'da false yapılıyor
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Paneli
        </h1>
        <p className="text-gray-600">
          Sistem yönetimi ve kullanıcı istatistikleri
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Analiz</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAnalyses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Trend</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTrends}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Aktif Kullanıcı</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Kullanıcı Yönetimi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.email && user.email.length > 0 ? user.email.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Hiç giriş yapmamış'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Düzenle
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="space-y-3">
            <a href="/admin/test-api" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md block">
              🔗 n8n API Testi
            </a>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              📊 Analiz Raporları
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              🔥 Trend Yönetimi
            </button>
            <a href="/admin/settings" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md block">
              ⚙️ Sistem Ayarları
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">user1@example.com</span> Instagram analizi yaptı
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">user2@example.com</span> Trend içerikleri görüntüledi
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">user3@example.com</span> Yeni hesap oluşturdu
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Durumu</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Aktif
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Veritabanı</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Bağlı
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">n8n Entegrasyonu</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Demo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
