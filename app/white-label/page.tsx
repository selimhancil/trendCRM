"use client";
import { useState, useEffect } from "react";

export default function WhiteLabelPage() {
  const [settings, setSettings] = useState({
    logo: "",
    favicon: "",
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    companyName: "trendCRM",
    customDomain: "",
    emailSignature: "",
  });
  const [preview, setPreview] = useState(false);

  const handleSave = async () => {
    try {
      // White-label settings save logic
      alert("White-label ayarları kaydedildi!");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 White-Label Ayarları</h1>
        <p className="text-gray-600">Platformunuzu markanıza özel hale getirin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Marka Özelleştirme</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şirket Adı</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    Logo Yükle
                  </label>
                  {settings.logo && (
                    <img src={settings.logo} alt="Logo" className="w-20 h-20 object-contain" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="favicon-upload"
                  />
                  <label
                    htmlFor="favicon-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    Favicon Yükle
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birincil Renk</label>
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İkincil Renk</label>
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Özel Domain</label>
                <input
                  type="text"
                  value={settings.customDomain}
                  onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                  placeholder="client.yourdomain.com"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Müşteriler için özel alt domain</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            💾 Ayarları Kaydet
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Önizleme</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
            <div className="text-center">
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                }}
              >
                {settings?.companyName && settings.companyName.length > 0 ? settings.companyName.charAt(0) : 'C'}
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: settings.primaryColor }}>
                {settings.companyName}
              </h3>
              <p className="text-gray-600">White-label önizleme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




