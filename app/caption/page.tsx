"use client";
import { useState } from "react";
import { aiService } from "@/lib/aiService";

export default function CaptionPage() {
  const [content, setContent] = useState("");
  const [tone, setTone] = useState<"fun" | "professional" | "friendly">("professional");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/caption/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tone }),
      });

      if (!response.ok) throw new Error("Caption oluşturulamadı");

      const result = await response.json();
      if (result.success && result.caption) {
        setGenerated(result.caption);
      } else {
        throw new Error("Caption alınamadı");
      }
    } catch (error) {
      console.error("Caption generation error:", error);
      // Fallback
      const toneEmojis: { [key: string]: string } = {
        fun: "🎉✨",
        professional: "💼📊",
        friendly: "👋💙",
      };
      setGenerated(`${toneEmojis[tone]} ${content}\n\n✨ Detaylı bilgi için profilimizi ziyaret edin!\n\n💬 Yorumlarınızı bekliyoruz!`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">✍️ AI Caption Üretici</h1>
        <p className="text-gray-600">İçeriğiniz için profesyonel Instagram caption'ları oluşturun</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">İçerik Açıklaması</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="İçeriğiniz hakkında kısa bir açıklama yazın..."
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ton Seçimi</label>
            <div className="flex gap-4">
              {[
                { value: "fun", label: "🎉 Eğlenceli" },
                { value: "professional", label: "💼 Profesyonel" },
                { value: "friendly", label: "👋 Samimi" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value as any)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    tone === t.value
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !content.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Oluşturuluyor..." : "🤖 AI ile Caption Oluştur"}
          </button>
        </div>
      </div>

      {generated && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-8 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✨ Oluşturulan Caption</h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <pre className="whitespace-pre-wrap text-gray-800 font-medium">{generated}</pre>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generated);
                alert("Caption kopyalandı!");
              }}
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              📋 Kopyala
            </button>
            <button
              onClick={() => {
                // Save to localStorage or database
                const saved = JSON.parse(localStorage.getItem("savedCaptions") || "[]");
                saved.push({ content: generated, tone, createdAt: new Date().toISOString() });
                localStorage.setItem("savedCaptions", JSON.stringify(saved));
                alert("Caption kaydedildi!");
              }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              💾 Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
