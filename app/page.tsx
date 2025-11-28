import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          trendCRM'e Hoş Geldiniz
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Instagram hesap analizi ve haftalık trend içerik takibi için modern CRM paneli
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Instagram Analizi
            </h2>
            <p className="text-gray-600 mb-6">
              Instagram hesabınızı analiz edin ve AI destekli öneriler alın. 
              Takipçi sayısı, etkileşim oranı ve içerik önerileri.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Analiz Başlat
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Trend İçerikler
            </h2>
            <p className="text-gray-600 mb-6">
              Haftalık trend videoları keşfedin. Kategorilere göre filtreleyin 
              ve en popüler içerikleri takip edin.
            </p>
            <Link
              href="/trends"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Trendleri Gör
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Özellikler
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🤖</div>
            <h4 className="font-semibold text-gray-900 mb-2">AI Destekli Analiz</h4>
            <p className="text-sm text-gray-600">
              Yapay zeka ile hesap analizi ve kişiselleştirilmiş öneriler
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <h4 className="font-semibold text-gray-900 mb-2">Gerçek Zamanlı Veriler</h4>
            <p className="text-sm text-gray-600">
              n8n entegrasyonu ile güncel veriler ve trend analizi
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔐</div>
            <h4 className="font-semibold text-gray-900 mb-2">Güvenli Giriş</h4>
            <p className="text-sm text-gray-600">
              Supabase ile güvenli kimlik doğrulama sistemi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
