"use client";
import { useState, useEffect } from "react";
import { getTheme, setTheme } from "@/lib/theme";

export default function SettingsPage() {
  const [darkMode, setDarkModeState] = useState(false);

  useEffect(() => {
    setDarkModeState(getTheme() === "dark");
  }, []);

  const setDarkMode = (enabled: boolean) => {
    setDarkModeState(enabled);
    setTheme(enabled ? "dark" : "light");
  };
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Ayarlar</h1>
        <p className="text-gray-600">Hesap ayarlarınızı buradan yönetin</p>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🎨 Görünüm</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Karanlık Mod</p>
            <p className="text-sm text-gray-500">Göz dostu karanlık tema</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              darkMode ? "bg-purple-600" : "bg-gray-300"
            }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              darkMode ? "translate-x-6" : ""
            }`}></div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔔 Bildirimler</h2>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">{key}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  value ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  value ? "translate-x-6" : ""
                }`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Hesap</h2>
        <div className="space-y-4">
          <button className="w-full text-left p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium hover:bg-red-100 transition-colors">
            🚪 Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
