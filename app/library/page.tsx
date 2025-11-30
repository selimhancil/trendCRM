"use client";
import { useState, useEffect } from "react";

interface LibraryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  caption: string;
  tags: string[];
  uploadedAt: string;
}

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/library?filter=${filter}`);
      if (!response.ok) throw new Error("Kütüphane verileri alınamadı");
      
      const result = await response.json();
      if (result.success && result.items) {
        setItems(result.items);
      }
    } catch (error) {
      console.error("Library fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 İçerik Kütüphanesi</h1>
          <p className="text-gray-600">Paylaştığınız tüm içeriklerin arşivi</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
          📤 Yeni Yükle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">Filtrele:</span>
          {[
            { value: "all", label: "Tümü" },
            { value: "image", label: "Görseller" },
            { value: "video", label: "Videolar" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f.value
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Library Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kütüphane Boş</h3>
            <p className="text-gray-600 mb-6">Henüz hiç içerik yüklenmemiş</p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
              İlk İçeriğinizi Yükleyin
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer hover:shadow-lg transition-shadow">
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.caption} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                  <p className="text-white text-sm line-clamp-2">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
