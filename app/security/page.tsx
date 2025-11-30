"use client";
import { useState } from "react";

export default function SecurityPage() {
  const [twoFA, setTwoFA] = useState(false);
  const [sso, setSSO] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState<string[]>([]);
  const [newIp, setNewIp] = useState("");

  const handleAddIp = () => {
    if (newIp.trim()) {
      setIpWhitelist([...ipWhitelist, newIp.trim()]);
      setNewIp("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔐 Güvenlik Ayarları</h1>
        <p className="text-gray-600">Hesap güvenliğinizi yönetin</p>
      </div>

      <div className="space-y-6">
        {/* 2FA */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">İki Faktörlü Kimlik Doğrulama (2FA)</h2>
              <p className="text-sm text-gray-600 mt-1">Hesabınıza ek güvenlik katmanı ekleyin</p>
            </div>
            <button
              onClick={() => setTwoFA(!twoFA)}
              className={`relative w-16 h-9 rounded-full transition-colors ${
                twoFA ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <div className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full transition-transform ${
                twoFA ? "translate-x-7" : ""
              }`}></div>
            </button>
          </div>
          {twoFA && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-3">
                QR kodunu bir authenticator uygulamasıyla (Google Authenticator, Authy) tarayın
              </p>
              <div className="bg-white p-4 rounded-lg inline-block mb-3">
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                  QR Code
                </div>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Onayla ve Aktif Et
              </button>
            </div>
          )}
        </div>

        {/* SSO */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Single Sign-On (SSO)</h2>
              <p className="text-sm text-gray-600 mt-1">Kurumsal SSO ile giriş yapın</p>
            </div>
            <button
              onClick={() => setSSO(!sso)}
              className={`relative w-16 h-9 rounded-full transition-colors ${
                sso ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full transition-transform ${
                sso ? "translate-x-7" : ""
              }`}></div>
            </button>
          </div>
          {sso && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SAML 2.0 Endpoint</label>
                <input
                  type="text"
                  placeholder="https://your-sso-provider.com/saml"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate</label>
                <textarea
                  placeholder="Paste your SAML certificate here..."
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                SSO Ayarlarını Kaydet
              </button>
            </div>
          )}
        </div>

        {/* IP Whitelist */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🌐 IP Whitelist</h2>
          <p className="text-sm text-gray-600 mb-4">Sadece belirli IP adreslerinden erişime izin verin</p>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="192.168.1.1"
              className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddIp}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              Ekle
            </button>
          </div>

          {ipWhitelist.length > 0 && (
            <div className="space-y-2">
              {ipWhitelist.map((ip, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <code className="font-mono text-sm">{ip}</code>
                  <button
                    onClick={() => setIpWhitelist(ipWhitelist.filter((_, i) => i !== idx))}
                    className="text-red-600 hover:text-red-700"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session Management */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔑 Aktif Oturumlar</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Mevcut Oturum</p>
                <p className="text-sm text-gray-500">Chrome - macOS - 192.168.1.100</p>
                <p className="text-xs text-gray-400 mt-1">Şu anda aktif</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Aktif
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Diğer Oturum</p>
                <p className="text-sm text-gray-500">Safari - iOS - 192.168.1.101</p>
                <p className="text-xs text-gray-400 mt-1">2 saat önce</p>
              </div>
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors">
                Sonlandır
              </button>
            </div>
          </div>
          <button className="w-full mt-4 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
            Tüm Oturumları Sonlandır
          </button>
        </div>

        {/* Audit Log */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Aktivite Logları</h2>
          <div className="space-y-2">
            {[
              { action: "Giriş yapıldı", time: "2 saat önce", ip: "192.168.1.100" },
              { action: "Şifre değiştirildi", time: "1 gün önce", ip: "192.168.1.100" },
              { action: "API Key oluşturuldu", time: "3 gün önce", ip: "192.168.1.101" },
            ].map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.time} - {log.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




