"use client";
import { useState } from "react";

interface Competitor {
  id: string;
  username: string;
  followers: number;
  engagement: number;
  posts: number;
  growth: number;
  avatar: string;
}

export default function CompetitorPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      id: "1",
      username: "@rakip1",
      followers: 125000,
      engagement: 6.2,
      posts: 234,
      growth: 12.5,
      avatar: "",
    },
    {
      id: "2",
      username: "@rakip2",
      followers: 89000,
      engagement: 5.8,
      posts: 189,
      growth: 8.3,
      avatar: "",
    },
  ]);

  const [yourAccount] = useState({
    username: "@hesap1",
    followers: 45230,
    engagement: 5.2,
    posts: 156,
    growth: 10.2,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 Rekabet Analizi</h1>
        <p className="text-gray-600">Rakip hesapları takip edin ve karşılaştırın</p>
      </div>

      {/* Your Account Card */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-2">Sizin Hesabınız</p>
            <h2 className="text-2xl font-bold">{yourAccount.username}</h2>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm opacity-90">Takipçi</p>
              <p className="text-2xl font-bold">{yourAccount.followers.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Etkileşim</p>
              <p className="text-2xl font-bold">{yourAccount.engagement}%</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Büyüme</p>
              <p className="text-2xl font-bold">+{yourAccount.growth}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Competitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {competitors.map((competitor) => {
          const followerDiff = competitor.followers - yourAccount.followers;
          const engagementDiff = competitor.engagement - yourAccount.engagement;
          
          return (
            <div key={competitor.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {competitor?.username && competitor.username.length > 1 ? competitor.username.charAt(1).toUpperCase() : competitor?.username && competitor.username.length > 0 ? competitor.username.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{competitor.username}</p>
                    <p className="text-xs text-gray-500">Rakip</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Detay
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Takipçi</p>
                  <p className="text-lg font-bold text-gray-900">{competitor.followers.toLocaleString()}</p>
                  <p className={`text-xs ${followerDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {followerDiff > 0 ? '+' : ''}{followerDiff.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Etkileşim</p>
                  <p className="text-lg font-bold text-gray-900">{competitor.engagement}%</p>
                  <p className={`text-xs ${engagementDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {engagementDiff > 0 ? '+' : ''}{engagementDiff.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Büyüme</p>
                  <p className="text-lg font-bold text-gray-900">+{competitor.growth}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Competitor */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">➕ Rakip Ekle</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="@username"
            className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
            Ekle
          </button>
        </div>
      </div>
    </div>
  );
}




