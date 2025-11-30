"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Settings {
  // Unified n8n AI Agent
  n8n_agent_url: string;
  n8n_agent_token: string;
  
  // Non-AI webhooks (kept for backward compatibility)
  n8n_planning_schedule_url: string;
  n8n_planning_connect_url: string;
  n8n_planning_upload_url: string;
  n8n_analytics_url: string;
  n8n_comments_url: string;
  n8n_reports_url: string;
  n8n_calendar_url: string;
  n8n_accounts_url: string;
  n8n_library_url: string;
  n8n_trend_radar_url: string;

  // General Settings
  instagram_access_token: string;
  instagram_client_id: string;
  instagram_client_secret: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    n8n_agent_url: "",
    n8n_agent_token: "",
    n8n_planning_schedule_url: "",
    n8n_planning_connect_url: "",
    n8n_planning_upload_url: "",
    n8n_analytics_url: "",
    n8n_comments_url: "",
    n8n_reports_url: "",
    n8n_calendar_url: "",
    n8n_accounts_url: "",
    n8n_library_url: "",
    n8n_trend_radar_url: "",
    instagram_access_token: "",
    instagram_client_id: "",
    instagram_client_secret: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error("Settings fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ Ayarlar başarıyla kaydedildi!");
        window.location.reload();
      } else {
        alert("❌ Hata: " + (data.error || "Ayarlar kaydedilemedi"));
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Ayarlar kaydedilirken bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch("/api/admin/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "ai_agent",
          url: settings.n8n_agent_url,
          token: settings.n8n_agent_token,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ n8n AI Agent bağlantısı başarılı!");
      } else {
        alert(`❌ n8n AI Agent bağlantısı başarısız: ${data.error || "Bilinmeyen hata"}`);
      }
    } catch (error) {
      console.error("Test error:", error);
      alert("❌ Bağlantı testi sırasında hata oluştu");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.push("/admin")}
          className="text-purple-600 hover:text-purple-700 mb-4 inline-flex items-center"
        >
          ← Admin Paneline Dön
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Sistem Ayarları</h1>
        <p className="text-gray-600">Unified n8n AI Agent ve sistem ayarlarını yapılandırın</p>
      </div>

      <div className="space-y-6">
        {/* Unified n8n AI Agent Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">🤖 Unified n8n AI Agent</h2>
              <p className="text-sm text-gray-500 mt-1">
                Tüm AI işlemleri (trend analizi, caption oluşturma, sentiment analizi, vb.) bu tek endpoint üzerinden yapılır
              </p>
            </div>
            <button
              onClick={handleTestConnection}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              🔍 Bağlantıyı Test Et
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                n8n AI Agent URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={settings.n8n_agent_url}
                onChange={(e) => setSettings({ ...settings, n8n_agent_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/ai-agent"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Environment variable: <code className="bg-gray-100 px-1 rounded">N8N_AGENT_URL</code>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                n8n AI Agent Token <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={settings.n8n_agent_token}
                onChange={(e) => setSettings({ ...settings, n8n_agent_token: e.target.value })}
                placeholder="your-bearer-token-here"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Environment variable: <code className="bg-gray-100 px-1 rounded">N8N_AGENT_TOKEN</code>
                <br />
                Bu token Bearer authentication için kullanılacaktır.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Nasıl Çalışır?
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Tüm AI istekleri <code className="bg-blue-100 px-1 rounded">{`{prompt, context}`}</code> formatında gönderilir</li>
                <li>Her istek <code className="bg-blue-100 px-1 rounded">Authorization: Bearer {`{token}`}</code> header'ı ile gönderilir</li>
                <li>n8n workflow'unuzda bu token'ı kontrol edip isteği işleyebilirsiniz</li>
                <li>Task parametresi ile farklı AI görevlerini route edebilirsiniz</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Non-AI Webhooks (Optional - for backward compatibility) */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">🔗 n8n Webhook Ayarları (Opsiyonel)</h2>
              <p className="text-sm text-gray-500 mt-1">
                AI dışı işlemler için (planning, analytics, comments, vb.)
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planlama - Zamanlama Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_planning_schedule_url}
                onChange={(e) => setSettings({ ...settings, n8n_planning_schedule_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-planning-schedule"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planlama - Bağlantı Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_planning_connect_url}
                onChange={(e) => setSettings({ ...settings, n8n_planning_connect_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-planning-connect"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planlama - Yükleme Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_planning_upload_url}
                onChange={(e) => setSettings({ ...settings, n8n_planning_upload_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-upload"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analytics Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_analytics_url}
                onChange={(e) => setSettings({ ...settings, n8n_analytics_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-analytics"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yorumlar Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_comments_url}
                onChange={(e) => setSettings({ ...settings, n8n_comments_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-comments"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raporlar Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_reports_url}
                onChange={(e) => setSettings({ ...settings, n8n_reports_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-reports"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Takvim Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_calendar_url}
                onChange={(e) => setSettings({ ...settings, n8n_calendar_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-calendar"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hesaplar Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_accounts_url}
                onChange={(e) => setSettings({ ...settings, n8n_accounts_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-accounts"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kütüphane Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_library_url}
                onChange={(e) => setSettings({ ...settings, n8n_library_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-library"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trend Radar Webhook URL
              </label>
              <input
                type="text"
                value={settings.n8n_trend_radar_url}
                onChange={(e) => setSettings({ ...settings, n8n_trend_radar_url: e.target.value })}
                placeholder="https://your-n8n-instance.com/webhook/trendcrm-trend-radar"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Instagram Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📷 Instagram API Ayarları (Opsiyonel)</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <input
                type="password"
                value={settings.instagram_access_token}
                onChange={(e) => setSettings({ ...settings, instagram_access_token: e.target.value })}
                placeholder="Instagram Access Token"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  value={settings.instagram_client_id}
                  onChange={(e) => setSettings({ ...settings, instagram_client_id: e.target.value })}
                  placeholder="Instagram Client ID"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={settings.instagram_client_secret}
                  onChange={(e) => setSettings({ ...settings, instagram_client_secret: e.target.value })}
                  placeholder="Instagram Client Secret"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push("/admin")}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Kaydediliyor..." : "💾 Ayarları Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
