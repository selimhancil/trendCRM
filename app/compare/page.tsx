"use client";
import { useState } from "react";

interface CompetitorAnalysis {
  account: {
    username: string;
    followers: number;
    posts_count: number;
    engagement: string;
    avg_likes: number;
    avg_comments: number;
    bio: string;
    profile_pic: string;
    verified?: boolean;
  };
  topPosts: Array<{
    id: string;
    type: "reel" | "post";
    caption: string;
    likes: number;
    comments: number;
    views?: number;
    engagement_rate: string;
    posted_at: string;
    hashtags: string[];
    media_url: string;
  }>;
  aiAnalysis: string;
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
}

interface CompanyDetails {
  instagram: {
    username: string;
    followers: number;
    posts: number;
    following: number;
    verified: boolean;
    profile_pic: string;
    bio: string;
    engagement: string;
    avg_likes: number;
    avg_comments: number;
  };
  company: {
    name: string;
    sector: string;
    website: string;
    location: string;
    phone: string;
    email: string;
    founded: string;
    employees: string;
    description: string;
  };
  google: {
    rating: number;
    totalReviews: number;
    reviews: Array<{
      id: string;
      author: string;
      rating: number;
      text: string;
      date: string;
      helpful: number;
    }>;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
  };
}

export default function ComparePage() {
  const [competitorUsername, setCompetitorUsername] = useState("");
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"analysis" | "company" | "reviews" | "instagram">("analysis");

  const handleAnalyze = async () => {
    if (!competitorUsername.trim()) {
      setError("Kullanıcı adı gereklidir");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setCompanyDetails(null);

    try {
      // Önce kampanya analizi
      const response = await fetch("/api/compare/analyze-competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: competitorUsername }),
      });

      if (!response.ok) throw new Error("Analiz başarısız oldu");

      const result = await response.json();
      if (result.success) {
        setAnalysis(result);
      }

      // Sonra firma detayları
      setLoadingDetails(true);
      const detailsResponse = await fetch("/api/compare/company-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: competitorUsername }),
      });

      if (detailsResponse.ok) {
        const detailsResult = await detailsResponse.json();
        if (detailsResult.success) {
          setCompanyDetails(detailsResult.data);
        }
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
      setLoadingDetails(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "Yüksek Öncelik";
      case "medium":
        return "Orta Öncelik";
      case "low":
        return "Düşük Öncelik";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⚖️ Rakip Hesap Analizi</h1>
        <p className="text-gray-600">Rakip hesabın kullanıcı adını girin, AI ile detaylı analiz alın</p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rakip Hesap Kullanıcı Adı
            </label>
            <input
              type="text"
              value={competitorUsername}
              onChange={(e) => {
                setCompetitorUsername(e.target.value);
                setError(null);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleAnalyze();
                }
              }}
              placeholder="@username veya username"
              className="w-full border-2 border-gray-300 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAnalyze}
              disabled={loading || !competitorUsername.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Analiz Yapılıyor...
                </span>
              ) : (
                "🤖 AI ile Analiz Et"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: "analysis", label: "📊 Analiz Sonuçları" },
                { id: "company", label: "🏢 Firma Bilgileri", loading: loadingDetails },
                { id: "reviews", label: "⭐ Google Yorumları", badge: companyDetails?.google.totalReviews },
                { id: "instagram", label: "📱 Instagram Detay", badge: companyDetails?.instagram.followers },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2"></div>
                      {tab.label.split(" ")[0]}
                    </span>
                  ) : (
                    tab.label
                  )}
                  {tab.badge && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                      {typeof tab.badge === "number" ? tab.badge.toLocaleString() : tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Tab */}
          {activeTab === "analysis" && (
            <>
              {/* Account Overview */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
                    {analysis?.account?.username && analysis.account.username.length > 0 ? analysis.account.username.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">@{analysis.account.username}</h2>
                    <p className="text-white/80">{analysis.account.bio}</p>
                  </div>
                  {analysis.account.verified && (
                    <span className="px-3 py-1 bg-blue-500 rounded-full text-xs font-medium">
                      ✓ Doğrulanmış
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Takipçi</p>
                    <p className="text-2xl font-bold">{analysis.account.followers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">Post</p>
                    <p className="text-2xl font-bold">{analysis.account.posts_count}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">Etkileşim</p>
                    <p className="text-2xl font-bold">{analysis.account.engagement}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">Ort. Beğeni</p>
                    <p className="text-2xl font-bold">{analysis.account.avg_likes.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Top Performing Content */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🔥 En Etkileşimli İçerikler</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysis.topPosts.map((post) => (
                    <div key={post.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-colors">
                      <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300">
                        <img
                          src={post.media_url}
                          alt={post.caption}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                          <span className="text-xs font-medium text-white">
                            {post.type === "reel" ? "🎬 Reel" : "📸 Post"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                          {post.caption}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <span>❤️ {post.likes.toLocaleString()}</span>
                          <span>💬 {post.comments.toLocaleString()}</span>
                          {post.views && (
                            <span>👁️ {post.views.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-purple-600">
                            📈 {post.engagement_rate}% etkileşim
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.posted_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        {post.hashtags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {post.hashtags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Detaylı Analiz</h2>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {analysis.aiAnalysis}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Size Özel Tavsiyeler</h2>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border-2 ${getPriorityColor(rec.priority)}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold mr-4 text-lg shadow-md">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg">{rec.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              rec.priority === "high" ? "bg-red-200 text-red-800" :
                              rec.priority === "medium" ? "bg-yellow-200 text-yellow-800" :
                              "bg-blue-200 text-blue-800"
                            }`}>
                              {getPriorityBadge(rec.priority)}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Company Tab */}
          {activeTab === "company" && companyDetails && (
            <div className="space-y-6">
              {/* Company Overview */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
                    {companyDetails?.company?.name && companyDetails.company.name.length > 0 ? companyDetails.company.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{companyDetails.company.name}</h2>
                    <p className="text-white/80">{companyDetails.company.sector}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm opacity-90 mb-1">📍 Lokasyon</p>
                    <p className="font-medium">{companyDetails.company.location}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">📞 Telefon</p>
                    <p className="font-medium">{companyDetails.company.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">✉️ Email</p>
                    <p className="font-medium">{companyDetails.company.email}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">🌐 Website</p>
                    <a href={companyDetails.company.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                      {companyDetails.company.website.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Firma Detayları</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Sektör</p>
                      <p className="text-gray-900">{companyDetails.company.sector}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Kuruluş Yılı</p>
                      <p className="text-gray-900">{companyDetails.company.founded}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Çalışan Sayısı</p>
                      <p className="text-gray-900">{companyDetails.company.employees}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Lokasyon</p>
                      <p className="text-gray-900">{companyDetails.company.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Açıklama</p>
                    <p className="text-gray-900 leading-relaxed">{companyDetails.company.description}</p>
                  </div>
                </div>
              </div>

              {/* Social Media Presence */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📱 Sosyal Medya Varlığı</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href={`https://instagram.com/${companyDetails.instagram.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:border-purple-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">Instagram</span>
                      <span className="text-2xl">📷</span>
                    </div>
                    <p className="text-sm text-gray-700">@{companyDetails.instagram.username}</p>
                    <div className="mt-2 text-xs text-gray-600">
                      {companyDetails.instagram.followers.toLocaleString()} takipçi
                    </div>
                  </a>
                  <a
                    href={companyDetails.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">Facebook</span>
                      <span className="text-2xl">📘</span>
                    </div>
                    <p className="text-sm text-gray-700">Facebook sayfası</p>
                  </a>
                  <a
                    href={companyDetails.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">LinkedIn</span>
                      <span className="text-2xl">💼</span>
                    </div>
                    <p className="text-sm text-gray-700">LinkedIn sayfası</p>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && companyDetails && (
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">⭐ Google Yorumları</h2>
                    <p className="text-gray-600">
                      {companyDetails.google.totalReviews.toLocaleString()} toplam yorum • 
                      Ortalama {companyDetails.google.rating.toFixed(1)} puan
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-1">
                      {companyDetails.google.rating.toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-6 h-6 ${star <= Math.round(companyDetails.google.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = companyDetails.google.reviews.filter(r => r.rating === rating).length;
                    const percentage = companyDetails.google.reviews.length > 0 
                      ? (count / companyDetails.google.reviews.length) * 100 
                      : 0;
                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700 w-8">{rating} ⭐</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews List */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Son Yorumlar</h3>
                <div className="space-y-4">
                  {companyDetails.google.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {review?.author && review.author.length > 0 ? review.author.charAt(0) : 'R'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.author}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.helpful > 0 && (
                          <span className="text-xs text-gray-500">
                            👍 {review.helpful} faydalı
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 leading-relaxed ml-13">{review.text}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                  Tüm Yorumları Görüntüle
                </button>
              </div>
            </div>
          )}

          {/* Instagram Tab */}
          {activeTab === "instagram" && companyDetails && (
            <div className="space-y-6">
              {/* Instagram Overview */}
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
                    📷
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">@{companyDetails.instagram.username}</h2>
                    <p className="text-white/80">{companyDetails.company.sector}</p>
                    {companyDetails.instagram.verified && (
                      <span className="mt-2 inline-block px-3 py-1 bg-blue-500 rounded-full text-xs font-medium">
                        ✓ Doğrulanmış Hesap
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-2">Takipçi</p>
                    <p className="text-3xl font-bold">{companyDetails.instagram.followers.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-2">Post</p>
                    <p className="text-3xl font-bold">{companyDetails.instagram.posts}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-2">Etkileşim</p>
                    <p className="text-3xl font-bold">{companyDetails.instagram.engagement}</p>
                  </div>
                </div>
              </div>

              {/* Instagram Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Performans</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ortalama Beğeni</span>
                      <span className="font-bold text-gray-900">
                        {companyDetails.instagram.avg_likes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ortalama Yorum</span>
                      <span className="font-bold text-gray-900">
                        {companyDetails.instagram.avg_comments.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Post Başına Etkileşim</span>
                      <span className="font-bold text-gray-900">
                        {((companyDetails.instagram.followers * parseFloat(companyDetails.instagram.engagement)) / companyDetails.instagram.posts / 100).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Post Sıklığı</span>
                      <span className="font-bold text-gray-900">
                        Haftada {Math.ceil(companyDetails.instagram.posts / 52)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 İçerik Analizi</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">En Çok Etkileşim Alan İçerik</p>
                      <p className="font-semibold text-gray-900">Reel İçerikler</p>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Popüler Hashtag'ler</p>
                      <p className="font-semibold text-gray-900">
                        #{companyDetails.company.sector.toLowerCase()}, #trend, #viral
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">En Aktif Gün</p>
                      <p className="font-semibold text-gray-900">Perşembe</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Trend Analizi</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Takipçi Büyümesi</span>
                      <span className="font-bold text-green-600">+12.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700">Etkileşim Artışı</span>
                      <span className="font-bold text-blue-600">+8.3%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700">Reach Artışı</span>
                      <span className="font-bold text-purple-600">+15.2%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram Bio */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Profil Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Bio</p>
                    <p className="text-gray-900 leading-relaxed">{companyDetails.instagram.bio}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Takip</p>
                      <p className="text-gray-900 font-semibold">{companyDetails.instagram.following.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Takipçi</p>
                      <p className="text-gray-900 font-semibold">{companyDetails.instagram.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Gönderi</p>
                      <p className="text-gray-900 font-semibold">{companyDetails.instagram.posts}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Hızlı İşlemler</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <a
                    href={`https://instagram.com/${companyDetails.instagram.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl text-center hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    <div className="text-2xl mb-2">📷</div>
                    <div className="text-sm font-medium">Profili Gör</div>
                  </a>
                  <button className="p-4 bg-blue-50 text-blue-700 rounded-xl text-center hover:bg-blue-100 transition-all">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium">Analiz Et</div>
                  </button>
                  <button className="p-4 bg-green-50 text-green-700 rounded-xl text-center hover:bg-green-100 transition-all">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="text-sm font-medium">Rapor Al</div>
                  </button>
                  <button className="p-4 bg-orange-50 text-orange-700 rounded-xl text-center hover:bg-orange-100 transition-all">
                    <div className="text-2xl mb-2">🔔</div>
                    <div className="text-sm font-medium">Takip Et</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!analysis && !loading && (
        <div className="bg-white rounded-xl shadow-lg p-16 border border-gray-100 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Rakip Hesap Analizi</h3>
          <p className="text-gray-600 mb-6">
            Analiz etmek istediğiniz rakip hesabın kullanıcı adını girin
          </p>
          <p className="text-sm text-gray-500">
            AI, hesabın içerik stratejisini, en başarılı paylaşımlarını, firma bilgilerini, Google yorumlarını ve size özel tavsiyeleri analiz edecek
          </p>
        </div>
      )}
    </div>
  );
}