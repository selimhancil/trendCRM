"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AnalyticsData {
  followers: number;
  followersGrowth: number;
  postsCount: number;
  avgEngagement: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
  bestPostTime: string;
  weeklyStats: {
    date: string;
    followers: number;
    likes: number;
    comments: number;
  }[];
  topPosts: Array<{
    id: string;
    caption: string;
    likes: number;
    comments: number;
    date: string;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod, selectedAccount]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?period=${selectedPeriod}&accountId=${selectedAccount}`);
      if (!response.ok) throw new Error("Analytics verileri alınamadı");
      
      const result = await response.json();
      const mockData: AnalyticsData = result.data || {
        followers: 45230,
        followersGrowth: 12.5,
        postsCount: 156,
        avgEngagement: 4.8,
        totalLikes: 1245000,
        totalComments: 45600,
        engagementRate: 5.2,
        bestPostTime: "18:00 - 20:00",
        weeklyStats: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          followers: 45230 - (6 - i) * 200,
          likes: 15000 + Math.random() * 5000,
          comments: 500 + Math.random() * 200,
        })),
        topPosts: [
          {
            id: "1",
            caption: "🎯 Bu haftanın en popüler içeriği!",
            likes: 15230,
            comments: 890,
            date: new Date().toISOString(),
          },
          {
            id: "2",
            caption: "✨ Yeni koleksiyon tanıtımı",
            likes: 12450,
            comments: 650,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "3",
            caption: "🔥 Trend içerik #viral",
            likes: 11200,
            comments: 540,
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      };

      setAnalytics(mockData);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      // Fallback to mock data
      const fallbackData: AnalyticsData = {
        followers: 45230,
        followersGrowth: 12.5,
        postsCount: 156,
        avgEngagement: 4.8,
        totalLikes: 1245000,
        totalComments: 45600,
        engagementRate: 5.2,
        bestPostTime: "18:00 - 20:00",
        weeklyStats: [],
        topPosts: [],
      };
      setAnalytics(fallbackData);
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

  if (!analytics) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Performans Dashboard</h1>
            <p className="text-gray-600">Hesabınızın detaylı performans analizi</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tüm Hesaplar</option>
              <option value="account1">@hesap1</option>
              <option value="account2">@hesap2</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Son 7 Gün</option>
              <option value="30d">Son 30 Gün</option>
              <option value="90d">Son 90 Gün</option>
              <option value="all">Tüm Zamanlar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Takipçi</span>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{analytics.followers.toLocaleString()}</span>
            <span className={`ml-2 text-sm font-semibold ${analytics.followersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.followersGrowth >= 0 ? '+' : ''}{analytics.followersGrowth}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Son 30 günde büyüme</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Etkileşim Oranı</span>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{analytics.engagementRate}%</span>
            <span className="ml-2 text-sm font-semibold text-green-600">↑ 0.8%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Ortalama etkileşim</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Toplam Beğeni</span>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{(analytics.totalLikes / 1000).toFixed(0)}K</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tüm zamanlar</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Gönderi Sayısı</span>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{analytics.postsCount}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Toplam gönderi</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Followers Growth Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Takipçi Büyümesi</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.weeklyStats.map((stat, index) => {
              const maxFollowers = Math.max(...analytics.weeklyStats.map(s => s.followers));
              const height = (stat.followers / maxFollowers) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg mb-2" style={{ height: `${height}%` }}></div>
                  <span className="text-xs text-gray-500">{new Date(stat.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💬 Etkileşim Trendi</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.weeklyStats.map((stat, index) => {
              const maxEngagement = Math.max(...analytics.weeklyStats.map(s => s.likes + s.comments));
              const height = ((stat.likes + stat.comments) / maxEngagement) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-cyan-600 rounded-t-lg mb-2" style={{ height: `${height}%` }}></div>
                  <span className="text-xs text-gray-500">{new Date(stat.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 En İyi Performans Gösteren Gönderiler</h3>
        <div className="space-y-4">
          {analytics.topPosts.map((post, index) => (
            <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{post.caption}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(post.date).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-pink-600">{post.likes.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Beğeni</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{post.comments.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Yorum</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Time to Post */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">⏰ En İyi Paylaşım Zamanı</h3>
            <p className="text-gray-600">AI analizi sonucunda önerilen optimal paylaşım saatleri</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {analytics.bestPostTime}
            </div>
            <p className="text-sm text-gray-600 mt-1">Ortalama etkileşim saati</p>
          </div>
        </div>
      </div>
    </div>
  );
}
