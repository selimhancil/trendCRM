"use client";
import { useState } from "react";
import { AnalysisCard } from "@/components/AnalysisCard";

interface AnalysisData {
  username: string;
  sector: string;
  goal: string;
  followers: number;
  engagement: string;
  recommendation: string;
  profile_pic?: string;
  bio?: string;
  posts_count?: number;
  following?: number;
  verified?: boolean;
  detailedAnalysis?: {
    contentStrategy: string;
    postingSchedule: string;
    hashtagStrategy: string;
    audienceInsights: string;
    improvementAreas: string[];
    competitiveAdvantage: string;
  };
}

export default function AnalyzePage() {
  const [formData, setFormData] = useState({
    username: "",
    sector: "",
    goal: ""
  });
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string>("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim()) {
      setError("Instagram kullanıcı adı gereklidir");
      return;
    }
    if (!formData.sector.trim()) {
      setError("Sektör bilgisi gereklidir");
      return;
    }
    if (!formData.goal.trim()) {
      setError("Instagram'da amaçladığınız şey gereklidir");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.replace("@", ""),
          sector: formData.sector,
          goal: formData.goal
        }),
      });

      if (!response.ok) {
        throw new Error("Analiz başarısız oldu");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ username: "", sector: "", goal: "" });
    setData(null);
    setError(null);
    setActiveField("");
  };

  const goalOptions = [
    "Marka bilinirliği artırmak",
    "Satış ve ürün tanıtımı yapmak",
    "Topluluk oluşturmak",
    "İçerik üreticisi olmak",
    "Eğitim ve bilgi paylaşmak",
    "Kişisel marka oluşturmak",
    "Müşteri kazanmak",
    "Diğer"
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Animated Header */}
      <div className="mb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 blur-3xl"></div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <svg className="w-12 h-12 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-gradient">
            AI Destekli Instagram Analizi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hesabınızı analiz edin, sektörünüzü belirtin ve Instagram'da neyi başarmak istediğinizi anlatın. 
            Size özel <span className="font-semibold text-purple-600">AI destekli strateji önerileri</span> alın.
          </p>
        </div>
      </div>

      {/* Form Section */}
      {!data && !loading && (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-gray-200/50 mb-8 transform transition-all duration-300 hover:shadow-3xl">
          <form onSubmit={handleAnalyze} className="space-y-8">
            {/* Instagram Username */}
            <div className="group">
              <label 
                htmlFor="username" 
                className="block text-sm font-bold text-gray-700 mb-3 transition-colors group-focus-within:text-purple-600"
              >
                <span className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  Instagram Kullanıcı Adı
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              <input
                id="username"
                type="text"
                className="w-full border-2 border-gray-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                placeholder="@kullaniciadi"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                onFocus={() => setActiveField("username")}
                onBlur={() => setActiveField("")}
                required
              />
              <p className="mt-2 text-sm text-gray-500">Instagram hesabınızın kullanıcı adını girin</p>
            </div>

            {/* Sector */}
            <div className="group">
              <label 
                htmlFor="sector" 
                className="block text-sm font-bold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600"
              >
                <span className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Sektörünüz
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              <input
                id="sector"
                type="text"
                className="w-full border-2 border-gray-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                placeholder="Örn: E-ticaret, Teknoloji, Moda, Yemek, Eğitim, Sağlık..."
                value={formData.sector}
                onChange={(e) => handleInputChange("sector", e.target.value)}
                onFocus={() => setActiveField("sector")}
                onBlur={() => setActiveField("")}
                required
              />
              <p className="mt-2 text-sm text-gray-500">Hangi sektörde çalıştığınızı belirtin</p>
            </div>

            {/* Goal */}
            <div className="group">
              <label 
                htmlFor="goal" 
                className="block text-sm font-bold text-gray-700 mb-3 transition-colors group-focus-within:text-pink-600"
              >
                <span className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Instagram'da Amaçladığınız Şey
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              <textarea
                id="goal"
                rows={5}
                className="w-full border-2 border-gray-300 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 resize-none"
                placeholder="Örn: Marka bilinirliğimi artırmak, ürünlerimi tanıtmak, topluluk oluşturmak, içerik üreticisi olmak, müşteri kazanmak..."
                value={formData.goal}
                onChange={(e) => handleInputChange("goal", e.target.value)}
                onFocus={() => setActiveField("goal")}
                onBlur={() => setActiveField("")}
                required
              />
              <p className="mt-2 text-sm text-gray-500">Instagram'da neyi başarmak istediğinizi detaylıca açıklayın</p>
              
              {/* Quick Goal Options */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-600 mb-3">💡 Hızlı Seçim:</p>
                <div className="flex flex-wrap gap-2">
                  {goalOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleInputChange("goal", option)}
                      className={`text-sm px-4 py-2 bg-white border-2 rounded-full transition-all duration-200 ${
                        formData.goal === option
                          ? "border-pink-500 bg-pink-50 text-pink-700 font-semibold shadow-md"
                          : "border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-5 bg-red-50 border-2 border-red-200 rounded-2xl animate-shake">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-bold text-red-800">
                      Hata
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.username.trim() || !formData.sector.trim() || !formData.goal.trim()}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-purple-500/50 transform hover:scale-[1.02] disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI Analiz Yapıyor...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI ile Analizi Başlat
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-16 text-center border border-gray-200/50">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent mx-auto mb-8"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            AI Analiz Yapıyor...
          </h3>
          <p className="text-gray-600 text-lg">
            Hesabınız, sektörünüz ve hedefleriniz derinlemesine analiz ediliyor
          </p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Analiz Sonuçları</h2>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Yeni Analiz Yap
            </button>
          </div>
          <AnalysisCard data={data} />
        </div>
      )}

      {/* Empty State */}
      {!data && !loading && !error && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-3xl p-16 text-center border-2 border-purple-200/50">
          <div className="text-8xl mb-6 animate-bounce">📊</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Profesyonel Instagram Analizi
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Yukarıdaki formu doldurarak hesabınızı, sektörünüzü ve Instagram'da neyi başarmak istediğinizi analiz edin.
            Size özel <span className="font-bold text-purple-600">AI destekli strateji önerileri</span> alın!
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>AI Destekli</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Anında Sonuç</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Güvenli Analiz</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}