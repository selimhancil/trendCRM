"use client";
import { useState, useEffect } from "react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/calendar/posts");
      if (!response.ok) throw new Error("Planlanmış içerikler alınamadı");
      
      const result = await response.json();
      if (result.success && result.posts && Array.isArray(result.posts)) {
        setScheduledPosts(result.posts.map((post: any) => ({
          id: post.id,
          date: new Date(post.scheduled_time),
          content: post.content || "",
          type: post.post_type || "post",
          account: post.account || "",
        })));
      } else {
        setScheduledPosts([]);
      }
    } catch (error) {
      console.error("Calendar fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 İçerik Takvimi</h1>
        <p className="text-gray-600">Planlanan içeriklerinizi takvim görünümünde görüntüleyin</p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode("month")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "month"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Ay Görünümü
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "week"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Hafta Görünümü
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg mb-2">📅 Takvim görünümü yakında eklenecek</p>
          <p className="text-sm">Planlanan içerikleriniz burada görünecek</p>
        </div>
      </div>

      {/* Scheduled Posts List */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Yaklaşan Planlanmış İçerikler</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Yükleniyor...</p>
          </div>
        ) : scheduledPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Henüz planlanmış içerik yok</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${post.type === "post" ? "bg-blue-500" : post.type === "reel" ? "bg-pink-500" : "bg-purple-500"}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{post.content || "İçerik yok"}</p>
                    <p className="text-sm text-gray-500">
                      {post.account || "Bilinmeyen hesap"} • {post.date ? post.date.toLocaleDateString('tr-TR') + " " + post.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : "Tarih yok"}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.type === "post" ? "bg-blue-100 text-blue-700" : post.type === "reel" ? "bg-pink-100 text-pink-700" : "bg-purple-100 text-purple-700"
                }`}>
                  {post.type === "post" ? "Post" : post.type === "reel" ? "Reel" : "Story"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
