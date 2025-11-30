"use client";
import { useState, useEffect, useCallback } from "react";

interface InstagramAccount {
  id: string;
  username: string;
  profile_pic?: string;
  connected: boolean;
  connected_at?: string;
}

interface ScheduledPost {
  id: string;
  content: string;
  media_url?: string;
  scheduled_time: string;
  status: "pending" | "scheduled" | "published" | "failed";
  account: string;
  hashtags: string[];
  post_type: "post" | "reel" | "story";
}

export default function PlanningPage() {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    content: "",
    scheduled_time: "",
    hashtags: "",
    post_type: "post" as "post" | "reel" | "story",
    media_url: ""
  });

  // Dosya yükleme fonksiyonu
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setNotification(null);

    try {
      // Dosya tipini kontrol et
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/quicktime"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Geçersiz dosya tipi. Sadece görsel (JPG, PNG, GIF, WEBP) ve video (MP4, MOV) desteklenir.");
      }

      // Dosya boyutunu kontrol et (max 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("Dosya çok büyük. Maksimum 100MB.");
      }

      // Preview oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // FormData oluştur
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("accountId", selectedAccount || "default");

      // Upload API'ye gönder
      const response = await fetch("/api/planning/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Dosya yükleme başarısız");
      }

      const result = await response.json();
      setFormData({ ...formData, media_url: result.url });
      setUploadProgress(100);
      setNotification({ type: "success", message: "Dosya başarıyla yüklendi!" });

      // 2 saniye sonra bildirimi kapat
      setTimeout(() => setNotification(null), 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      setNotification({ type: "error", message: error.message || "Dosya yükleme başarısız oldu" });
      setUploadedFilePreview(null);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // File input handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await fetch("/api/planning/accounts");
      if (!response.ok) {
        throw new Error("Hesaplar alınamadı");
      }
      const data = await response.json();
      setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    }
  }, []);

  const fetchScheduledPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/planning/scheduled");
      if (!response.ok) {
        throw new Error("Planlanmış içerikler alınamadı");
      }
      const data = await response.json();
      setScheduledPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      setScheduledPosts([]);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    fetchAccounts();
    fetchScheduledPosts();
  }, [fetchAccounts, fetchScheduledPosts]);

  // URL'deki query parametrelerini kontrol et (OAuth callback için)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const error = params.get("error");

    if (success === "connected") {
      setNotification({ type: "success", message: "Instagram hesabı başarıyla bağlandı!" });
      fetchAccounts();
      // URL'yi temizle
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setNotification({ type: "error", message: "Instagram bağlantısı başarısız oldu." });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [fetchAccounts]);

  const handleConnectInstagram = async () => {
    setLoading(true);
    try {
      // Instagram OAuth başlat
      const response = await fetch("/api/planning/connect", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.auth_url) {
        // Instagram OAuth sayfasına yönlendir
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error("Error connecting Instagram:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccount) {
      alert("Lütfen bir Instagram hesabı seçin");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/planning/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          account: selectedAccount,
          hashtags: formData.hashtags ? formData.hashtags.split(",").map((tag: string) => tag.trim()).filter(Boolean) : []
        }),
      });

      if (!response.ok) {
        throw new Error("Planlama başarısız oldu");
      }

      const result = await response.json();
      setScheduledPosts([...scheduledPosts, result.post]);
      setShowScheduleModal(false);
      setUploadedFilePreview(null);
      setFormData({
        content: "",
        scheduled_time: "",
        hashtags: "",
        post_type: "post",
        media_url: ""
      });
    } catch (error) {
      console.error("Error scheduling post:", error);
      alert("Planlama sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Tarih yok";
    try {
      return new Date(dateString).toLocaleString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Geçersiz tarih";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "scheduled":
        return "Planlandı";
      case "published":
        return "Yayınlandı";
      case "failed":
        return "Başarısız";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl ${
          notification.type === "success" 
            ? "bg-green-50 border-2 border-green-200" 
            : "bg-red-50 border-2 border-red-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === "success" ? (
                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`font-medium ${
                notification.type === "success" ? "text-green-800" : "text-red-800"
              }`}>
                {notification.message}
              </span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📅 İçerik Planlama
        </h1>
        <p className="text-gray-600">
          Instagram hesaplarınızı bağlayın ve içeriklerinizi planlayın
        </p>
      </div>

      {/* Connected Accounts Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bağlı Instagram Hesapları</h2>
            <p className="text-sm text-gray-600 mt-1">Hesaplarınızı yönetin ve içerik planlayın</p>
          </div>
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
            </svg>
            Hesap Bağla
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Henüz hesap bağlı değil
            </h3>
            <p className="text-gray-600 mb-6">
              İçerik planlamaya başlamak için Instagram hesabınızı bağlayın
            </p>
            <button
              onClick={() => setShowConnectModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              İlk Hesabı Bağla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all duration-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  {account.profile_pic ? (
                    <img
                      src={account.profile_pic}
                      alt={account.username}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {account.username && account.username.length > 0 ? account.username.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">@{account.username}</h3>
                    <p className="text-xs text-gray-500">
                      {account.connected_at
                        ? `Bağlandı: ${new Date(account.connected_at).toLocaleDateString('tr-TR')}`
                        : "Bağlı"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                    ✓ Bağlı
                  </span>
                  <button
                    onClick={() => {
                      setSelectedAccount(account.username);
                      setShowScheduleModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    İçerik Planla
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheduled Posts Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Planlanmış İçerikler</h2>
            <p className="text-sm text-gray-600 mt-1">Yaklaşan ve geçmiş planlamalarınız</p>
          </div>
          <button
            onClick={() => {
              if (accounts.length > 0) {
                setSelectedAccount(accounts[0].username);
                setShowScheduleModal(true);
              } else {
                setShowConnectModal(true);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
            disabled={accounts.length === 0}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Planlama
          </button>
        </div>

        {scheduledPosts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Henüz planlanmış içerik yok
            </h3>
            <p className="text-gray-600 mb-6">
              İlk içeriğinizi planlamak için "Yeni Planlama" butonuna tıklayın
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    {post.media_url && post.media_url.trim() && (
                      <img
                        src={post.media_url}
                        alt="Post media"
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          @{post.account}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                          {getStatusText(post.status)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.post_type ? post.post_type.toUpperCase() : 'POST'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                      {post.hashtags && Array.isArray(post.hashtags) && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.hashtags.slice(0, 5).map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.hashtags.length > 5 && (
                            <span className="text-xs text-gray-500">
                              +{post.hashtags.length - 5} daha
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-500">
                        📅 {formatDate(post.scheduled_time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Instagram Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Instagram Hesabı Bağla
              </h3>
              <p className="text-gray-600">
                İçerik planlamaya başlamak için Instagram hesabınızı bağlayın
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Nasıl Çalışır?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Instagram hesabınıza güvenli bağlantı yapılır</li>
                  <li>İçeriklerinizi planlayıp otomatik yayınlayabilirsiniz</li>
                  <li>n8n workflow ile entegre çalışır</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConnectModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleConnectInstagram}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? "Bağlanıyor..." : "Instagram ile Bağlan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Post Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Yeni İçerik Planla</h3>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setUploadedFilePreview(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSchedulePost} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instagram Hesabı
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Hesap seçin</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.username}>
                      @{account.username}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  İçerik Türü
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["post", "reel", "story"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, post_type: type as any })}
                      className={`px-4 py-3 border-2 rounded-xl font-medium transition-all ${
                        formData.post_type === type
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {type === "post" ? "📸 Post" : type === "reel" ? "🎬 Reel" : "📱 Story"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  İçerik Metni
                </label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="İçerik metninizi yazın..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Planlanan Tarih ve Saat
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    (En fazla 27 gün sonrası)
                  </span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_time}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setFormData({ ...formData, scheduled_time: "" });
                      return;
                    }
                    
                    try {
                      const selectedDate = new Date(e.target.value);
                      if (isNaN(selectedDate.getTime())) {
                        setNotification({ 
                          type: "error", 
                          message: "Geçersiz tarih formatı." 
                        });
                        return;
                      }
                      
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const maxDate = new Date(today);
                      maxDate.setDate(maxDate.getDate() + 27);
                      maxDate.setHours(23, 59, 59, 999);

                      if (selectedDate > maxDate) {
                        setNotification({ 
                          type: "error", 
                          message: "Planlama tarihi bugünden itibaren en fazla 27 gün sonrası olabilir." 
                        });
                        return;
                      }
                      if (selectedDate < today) {
                        setNotification({ 
                          type: "error", 
                          message: "Geçmiş bir tarih seçemezsiniz." 
                        });
                        return;
                      }
                      setFormData({ ...formData, scheduled_time: e.target.value });
                      setNotification(null);
                    } catch (error) {
                      console.error("Date validation error:", error);
                      setNotification({ 
                        type: "error", 
                        message: "Tarih seçiminde bir hata oluştu." 
                      });
                    }
                  }}
                  min={(() => {
                    const today = new Date();
                    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
                    return today.toISOString().slice(0, 16);
                  })()}
                  max={(() => {
                    const maxDate = new Date();
                    maxDate.setDate(maxDate.getDate() + 27);
                    maxDate.setMinutes(maxDate.getMinutes() - maxDate.getTimezoneOffset());
                    return maxDate.toISOString().slice(0, 16);
                  })()}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  📅 Bugünden itibaren en fazla 27 gün sonrasına kadar planlama yapabilirsiniz
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hashtag'ler (virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={formData.hashtags}
                  onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="trend, instagram, marketing, ..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Görsel / Video Yükle
                </label>
                
                {/* Drag & Drop Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                    uploading
                      ? "border-purple-500 bg-purple-50"
                      : uploadedFilePreview || formData.media_url
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                  }`}
                >
                  {uploading ? (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="text-purple-700 font-medium mb-2">Yükleniyor...</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">{uploadProgress}% tamamlandı</p>
                    </div>
                  ) : uploadedFilePreview || formData.media_url ? (
                    <div className="space-y-4">
                      <div className="relative">
                        {uploadedFilePreview ? (
                          <div className="relative rounded-lg overflow-hidden bg-gray-100">
                            {(formData.media_url && formData.media_url.includes('video')) || (uploadedFilePreview && uploadedFilePreview.startsWith('data:video')) ? (
                              <video
                                src={uploadedFilePreview}
                                controls
                                className="w-full h-64 object-contain"
                              />
                            ) : (
                              <img
                                src={uploadedFilePreview}
                                alt="Preview"
                                className="w-full h-64 object-contain"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedFilePreview(null);
                                setFormData({ ...formData, media_url: "" });
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : formData.media_url ? (
                          <div className="relative rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={formData.media_url}
                              alt="Media"
                              className="w-full h-64 object-contain"
                              onError={() => setFormData({ ...formData, media_url: "" })}
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, media_url: "" })}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          type="button"
                          onClick={() => document.getElementById('file-upload-input')?.click()}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          📁 Yeni Dosya Seç
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <button
                            type="button"
                            onClick={() => document.getElementById('file-upload-input')?.click()}
                            className="text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Dosya seçin
                          </button>
                          {" "}veya sürükleyip bırakın
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG, GIF, WEBP (maks. 100MB) veya MP4, MOV (video)
                        </p>
                      </div>
                    </div>
                  )}

                  <input
                    id="file-upload-input"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* URL Input (Alternatif) */}
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    veya URL ile ekleyin (Opsiyonel)
                  </label>
                  <input
                    type="url"
                    value={formData.media_url}
                    onChange={(e) => {
                      setFormData({ ...formData, media_url: e.target.value });
                      setUploadedFilePreview(null);
                    }}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setUploadedFilePreview(null);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? "Planlanıyor..." : "Planla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
