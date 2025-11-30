"use client";
import { useState, useEffect } from "react";

interface Comment {
  id: string;
  postId: string;
  username: string;
  text: string;
  likes: number;
  timestamp: string;
  isReply: boolean;
  sentiment: "positive" | "neutral" | "negative";
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "positive" | "negative" | "unread">("all");

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments?filter=${filter}`);
      if (!response.ok) throw new Error("Yorumlar alınamadı");
      
      const result = await response.json();
      if (result.success && result.comments) {
        setComments(result.comments);
      }
    } catch (error) {
      console.error("Comments fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, commentId: string, replyText?: string) => {
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, commentId, replyText }),
      });

      if (response.ok) {
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Comment action error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 Yorum Yönetimi</h1>
        <p className="text-gray-600">Tüm yorumları tek yerden görüntüleyin ve yönetin</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
        <div className="flex gap-3">
          {[
            { value: "all", label: "Tümü", count: comments.length },
            { value: "positive", label: "Pozitif", count: comments.filter((c: any) => c.sentiment === "positive").length },
            { value: "negative", label: "Negatif", count: comments.filter((c: any) => c.sentiment === "negative").length },
            { value: "unread", label: "Okunmamış", count: comments.filter((c: any) => !c.read).length },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === f.value
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Yorumlar</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Henüz yorum bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment: any) => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {comment?.username && comment.username.length > 0 ? comment.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">@{comment.username}</p>
                    <p className="text-sm text-gray-500">{new Date(comment.timestamp).toLocaleString('tr-TR')}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  comment.sentiment === "positive" ? "bg-green-100 text-green-700" :
                  comment.sentiment === "negative" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {comment.sentiment === "positive" ? "Pozitif" : comment.sentiment === "negative" ? "Negatif" : "Nötr"}
                </span>
              </div>
              <p className="text-gray-800 ml-13 mb-3">{comment.text}</p>
              <div className="flex items-center gap-4 ml-13">
                <button
                  onClick={() => handleAction("reply", comment.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  👍 Yanıtla
                </button>
                <button
                  onClick={() => handleAction("approve", comment.id)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  ✅ Onayla
                </button>
                <button
                  onClick={() => handleAction("delete", comment.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  ❌ Sil
                </button>
                <span className="text-sm text-gray-500">❤️ {comment.likes}</span>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
