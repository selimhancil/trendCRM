"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { TrendCard } from "@/components/TrendCard";
import { InstagramCard } from "@/components/InstagramCard";

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

interface InstagramPost {
  id: string;
  type: "reel" | "post" | "video";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption: string;
  username: string;
  likes_count: number;
  comments_count: number;
  views_count?: number;
  timestamp: string;
  hashtags: string[];
}

type SortOption = "views" | "likes" | "shares" | "date" | "engagement";
type FilterCategory = "all" | string;

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [filteredTrends, setFilteredTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sector, setSector] = useState("");
  const [question, setQuestion] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Yeni özellikler
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("engagement");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [searchHistory, setSearchHistory] = useState<Array<{sector: string; question: string; date: string}>>([]);
  
  // Instagram içerikleri state
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [instagramLoading, setInstagramLoading] = useState(false);
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Favorilere ekleme/çıkarma
  useEffect(() => {
    const savedFavorites = localStorage.getItem("trendFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (trendId: string) => {
    const newFavorites = favorites.includes(trendId)
      ? favorites.filter(id => id !== trendId)
      : [...favorites, trendId];
    setFavorites(newFavorites);
    localStorage.setItem("trendFavorites", JSON.stringify(newFavorites));
  };

  // Geçmiş aramaları yükle
  useEffect(() => {
    const savedHistory = localStorage.getItem("trendSearchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Filtreleme ve sıralama
  useEffect(() => {
    let filtered = [...trends];

    // Kategori filtresi
    if (filterCategory !== "all") {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.creator.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        case "shares":
          return b.shares - a.shares;
        case "date":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "engagement":
        default:
          const engagementA = a.views + a.likes * 2 + a.shares * 3;
          const engagementB = b.views + b.likes * 2 + b.shares * 3;
          return engagementB - engagementA;
      }
    });

    setFilteredTrends(filtered);
  }, [trends, searchQuery, sortBy, filterCategory]);

  // Kategorileri al
  const categories = Array.from(new Set(trends.map(t => t.category)));

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sector.trim() && !question.trim()) {
      setError("Lütfen sektör veya soru girin");
      return;
    }

    setLoading(true);
    setError(null);
    setAiRecommendation(null);
    setHasSearched(true);

    // Geçmiş aramaya ekle
    setSearchHistory(prev => {
      const newHistory = [
        { sector: sector.trim(), question: question.trim() || sector.trim(), date: new Date().toISOString() },
        ...prev.slice(0, 9) // Son 10 aramayı sakla
      ];
      localStorage.setItem("trendSearchHistory", JSON.stringify(newHistory));
      return newHistory;
    });

    try {
      const response = await fetch("/api/ai-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sector: sector.trim(),
          question: question.trim() || sector.trim()
        }),
      });

      if (!response.ok) {
        throw new Error("AI trend analizi alınamadı");
      }

      const data = await response.json();
      setTrends(data.trends || []);
      setAiRecommendation(data.aiRecommendation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAISearch(e);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ["Başlık", "Kategori", "Görüntülenme", "Beğeni", "Paylaşım", "Oluşturucu", "Tarih"];
    const rows = filteredTrends.map(t => [
      t.title,
      t.category,
      t.views.toString(),
      t.likes.toString(),
      t.shares.toString(),
      t.creator,
      new Date(t.created_at).toLocaleDateString('tr-TR')
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `trend-analizi-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Paylaşım
  const shareTrend = async (trend: TrendData) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: trend.title,
          text: trend.description,
          url: trend.video_url || window.location.href
        });
      } catch (err) {
        // Kullanıcı paylaşımı iptal etti
      }
    } else {
      // Fallback: URL'i kopyala
      navigator.clipboard.writeText(trend.video_url || window.location.href);
      alert("Link kopyalandı!");
    }
  };

  // Karşılaştırma modal'ı için seçim
  const toggleTrendSelection = (trendId: string) => {
    setSelectedTrends(prev => 
      prev.includes(trendId)
        ? prev.filter(id => id !== trendId)
        : prev.length < 2 ? [...prev, trendId] : prev
    );
  };

  // Instagram içeriklerini çek
  const fetchInstagramContent = useCallback(async (searchSector: string) => {
    if (!searchSector || searchSector.trim().length < 2) {
      setInstagramPosts([]);
      return;
    }

    setInstagramLoading(true);
    setInstagramError(null);

    try {
      const response = await fetch("/api/instagram-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector: searchSector.trim() }),
      });

      if (!response.ok) {
        throw new Error("Instagram içerikleri alınamadı");
      }

      const data = await response.json();
      setInstagramPosts(data.posts || []);
    } catch (err) {
      setInstagramError(err instanceof Error ? err.message : "Bir hata oluştu");
      setInstagramPosts([]);
    } finally {
      setInstagramLoading(false);
    }
  }, []);

  // Debounce ile gerçek zamanlı arama
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (sector.trim().length >= 2) {
        fetchInstagramContent(sector);
      } else {
        setInstagramPosts([]);
      }
    }, 800);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [sector, fetchInstagramContent]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl shadow-2xl p-8 md:p-12 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                🤖 AI Destekli Trend İçerikler
              </h1>
              <p className="text-white/90 text-lg">
                Sektörünüze özel AI destekli trend analizi ve içerik önerileri
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse animation-delay-2000"></div>
      </div>

      {/* AI Search Form */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-50 -mr-16 -mt-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Yapay Zeka Trend Asistanı
              </h2>
              <p className="text-gray-600">
                Sektörünüzle ilgili en güncel trend içerik önerilerini AI ile keşfedin
              </p>
            </div>
          </div>

          {/* Geçmiş Aramalar */}
          {searchHistory.length > 0 && (
            <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Geçmiş Aramalar
              </p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSector(item.sector);
                      setQuestion(item.question);
                    }}
                    className="text-xs px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-gray-700 hover:bg-purple-100 hover:border-purple-300 transition-colors"
                  >
                    {item.sector || item.question.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleAISearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="sector" className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Sektörünüz
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="sector"
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Örn: E-ticaret, Teknoloji, Moda, Yemek..."
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Özel Sorunuz (Opsiyonel)
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="question"
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Örn: Video içerik trendleri neler?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (!sector.trim() && !question.trim())}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI Analiz Ediyor...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI ile Trend Analizi Yap
                </>
              )}
            </button>
          </form>

          {/* Example Questions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Örnek Sorular
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "E-ticaret için video trendleri neler?",
                "Teknoloji sektöründe hangi içerikler popüler?",
                "Moda trendleri nasıl takip edilir?",
                "Yemek sektörü için içerik önerileri"
              ].map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setQuestion(example);
                    setSector("");
                  }}
                  className="text-sm px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg text-gray-700 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all duration-200 transform hover:scale-105"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendation */}
      {aiRecommendation && (
        <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 rounded-2xl shadow-xl p-8 border-l-4 border-yellow-400 mb-8 animate-fadeIn">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center">
                🤖 AI Trend Önerileri
              </h3>
              <p className="text-yellow-800 whitespace-pre-line leading-relaxed text-base">
                {aiRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl mb-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-700">AI trend analizi yapılıyor...</p>
          <p className="text-sm text-gray-500 mt-2">Bu işlem birkaç saniye sürebilir</p>
        </div>
      )}

      {/* Filtreleme ve Sıralama Toolbar */}
      {!loading && !error && trends.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Arama */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ara</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Trend, kategori, kullanıcı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Kategori Filtresi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tümü</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sırala</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="engagement">Etkileşim</option>
                <option value="views">Görüntülenme</option>
                <option value="likes">Beğeni</option>
                <option value="shares">Paylaşım</option>
                <option value="date">Tarih</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (selectedTrends.length === 2) {
                    setShowCompareModal(true);
                  } else {
                    alert("Karşılaştırma için 2 trend seçin");
                  }
                }}
                disabled={selectedTrends.length !== 2}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Karşılaştır ({selectedTrends.length}/2)
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV İndir
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {filteredTrends.length} trend gösteriliyor
            </div>
          </div>
        </div>
      )}

      {/* Trends Grid */}
      {!loading && !error && (
        <>
          {filteredTrends.length > 0 ? (
            <>
              <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {hasSearched ? "✨ AI Tarafından Önerilen Trendler" : "📈 Trend İçerikler"}
                  </h2>
                  <p className="text-gray-600">
                    {hasSearched ? "AI analizi sonuçları" : "Güncel trend içerikler"}
                  </p>
                </div>
                <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-200">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm font-semibold text-purple-700">
                    {filteredTrends.length} trend
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredTrends.map((trend, index) => (
                  <div key={trend.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                    <TrendCard 
                      data={trend} 
                      isFavorite={favorites.includes(trend.id)}
                      isSelected={selectedTrends.includes(trend.id)}
                      onFavoriteToggle={() => toggleFavorite(trend.id)}
                      onSelectToggle={() => toggleTrendSelection(trend.id)}
                      onShare={() => shareTrend(trend)}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : trends.length > 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Sonuç Bulunamadı
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                Arama kriterlerinize uygun trend bulunamadı. Filtreleri değiştirmeyi deneyin.
              </p>
            </div>
          ) : !hasSearched ? (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
              <div className="text-7xl mb-6 animate-bounce">🤖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                AI ile Trend Keşfedin
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                Yukarıdaki formu doldurarak sektörünüze özel trend içerik önerileri almak için AI asistanımıza soru sorun.
              </p>
            </div>
          ) : null}
        </>
      )}

      {/* Stats */}
      {!loading && !error && trends.length > 0 && (
        <div className="mt-12 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-8 border border-purple-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Trend İstatistikleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-md border-2 border-purple-100 transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {filteredTrends.length}
              </div>
              <div className="text-sm font-medium text-gray-600">Gösterilen Trend</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md border-2 border-green-100 transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                {filteredTrends.reduce((sum, trend) => sum + trend.views, 0).toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-600">Toplam İzlenme</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md border-2 border-blue-100 transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {filteredTrends.reduce((sum, trend) => sum + trend.likes, 0).toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-600">Toplam Beğeni</div>
            </div>
          </div>
        </div>
      )}

      {/* Karşılaştırma Modal */}
      {showCompareModal && selectedTrends.length === 2 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Trend Karşılaştırması</h3>
              <button
                onClick={() => {
                  setShowCompareModal(false);
                  setSelectedTrends([]);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedTrends.map(trendId => {
                const trend = trends.find(t => t.id === trendId);
                if (!trend) return null;
                return (
                  <div key={trendId} className="border-2 border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{trend.title}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Görüntülenme:</span>
                        <span className="font-semibold">{trend.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Beğeni:</span>
                        <span className="font-semibold">{trend.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paylaşım:</span>
                        <span className="font-semibold">{trend.shares.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Etkileşim Skoru:</span>
                        <span className="font-semibold text-purple-600">
                          {(trend.views + trend.likes * 2 + trend.shares * 3).toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <span className="text-gray-600">Kategori:</span>
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {trend.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Instagram İçerikler Bölümü - Aynı kalıyor */}
      {sector.trim().length >= 2 && (
        <div className="mt-16 pt-16 border-t-2 border-gray-200">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    📱 Instagram'da Popüler İçerikler
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold text-purple-600">"{sector}"</span> sektörü için en çok etkileşim alan reels ve paylaşımlar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {instagramLoading && (
            <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-pink-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                  </svg>
                </div>
              </div>
              <p className="text-lg font-medium text-gray-700">Instagram içerikleri yükleniyor...</p>
            </div>
          )}

          {instagramError && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6 mb-6 animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{instagramError}</p>
                </div>
              </div>
            </div>
          )}

          {!instagramLoading && !instagramError && instagramPosts.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  En Çok Etkileşim Alan {instagramPosts.length} İçerik
                </h3>
                <span className="text-sm text-gray-500 bg-pink-50 px-3 py-1 rounded-full">
                  En popüler reels ve paylaşımlar
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {instagramPosts.map((post, index) => (
                  <div key={post.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                    <InstagramCard post={post} />
                  </div>
                ))}
              </div>
            </>
          )}

          {!instagramLoading && !instagramError && instagramPosts.length === 0 && sector.trim().length >= 2 && (
            <div className="bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Instagram İçeriği Bulunamadı
              </h3>
              <p className="text-gray-600">
                <span className="font-semibold">"{sector}"</span> sektörü için henüz içerik bulunamadı. Farklı bir sektör deneyin.
              </p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}