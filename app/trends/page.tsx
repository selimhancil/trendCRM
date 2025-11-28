"use client";
import { useState, useEffect } from "react";
import { TrendCard } from "@/components/TrendCard";

interface TrendData {
  id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  likes: number;
  shares: number;
  thumbnail_url?: string;
  video_url?: string;
  creator: string;
  created_at: string;
  tags: string[];
}

const categories = [
  "Tümü",
  "Eğlence",
  "Müzik",
  "Dans",
  "Komedi",
  "Eğitim",
  "Yaşam",
  "Spor",
  "Teknoloji",
  "Moda",
  "Yemek"
];

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  useEffect(() => {
    fetchTrends();
  }, [selectedCategory]);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category: selectedCategory === "Tümü" ? undefined : selectedCategory 
        }),
      });

      if (!response.ok) {
        throw new Error("Trend verileri alınamadı");
      }

      const data = await response.json();
      setTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      // Demo data for development
      setTrends([
        {
          id: "1",
          title: "En Popüler Dans Trendi 2024",
          description: "Bu hafta en çok izlenen dans videosu. Yaratıcı hareketler ve mükemmel koreografi.",
          category: "Dans",
          views: 2500000,
          likes: 150000,
          shares: 45000,
          thumbnail_url: "https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Dance+Trend",
          video_url: "#",
          creator: "dancemaster",
          created_at: "2024-01-15T10:30:00Z",
          tags: ["dans", "trend", "koreografi", "müzik"]
        },
        {
          id: "2",
          title: "Yemek Tarifi: Viral Pasta",
          description: "Sosyal medyada patlayan pasta tarifi. Kolay ve lezzetli!",
          category: "Yemek",
          views: 1800000,
          likes: 120000,
          shares: 35000,
          thumbnail_url: "https://via.placeholder.com/400x225/10B981/FFFFFF?text=Food+Trend",
          video_url: "#",
          creator: "chefmaster",
          created_at: "2024-01-14T15:45:00Z",
          tags: ["yemek", "tarif", "pasta", "tatlı"]
        },
        {
          id: "3",
          title: "Teknoloji Haberleri",
          description: "Bu haftanın en önemli teknoloji gelişmeleri ve yeni ürün tanıtımları.",
          category: "Teknoloji",
          views: 3200000,
          likes: 200000,
          shares: 60000,
          thumbnail_url: "https://via.placeholder.com/400x225/EF4444/FFFFFF?text=Tech+News",
          video_url: "#",
          creator: "techguru",
          created_at: "2024-01-13T09:20:00Z",
          tags: ["teknoloji", "haber", "gelişme", "ürün"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Haftalık Trend İçerikler
        </h1>
        <p className="text-gray-600">
          En popüler videoları keşfedin ve kategorilere göre filtreleyin
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Hata
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends Grid */}
      {!loading && !error && (
        <>
          {trends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends.map((trend) => (
                <TrendCard key={trend.id} data={trend} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz trend içerik yok
              </h3>
              <p className="text-gray-600">
                Bu kategoride henüz trend içerik bulunmuyor. Lütfen daha sonra tekrar kontrol edin.
              </p>
            </div>
          )}
        </>
      )}

      {/* Stats */}
      {!loading && !error && trends.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bu Haftanın İstatistikleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {trends.length}
              </div>
              <div className="text-sm text-gray-600">Toplam Trend</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {trends.reduce((sum, trend) => sum + trend.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Toplam İzlenme</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {trends.reduce((sum, trend) => sum + trend.likes, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Toplam Beğeni</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
