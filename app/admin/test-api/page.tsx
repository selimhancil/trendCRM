"use client";
import { useState } from "react";

export default function TestApiPage() {
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [trendsResult, setTrendsResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAnalyzeAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "test_user" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalyzeResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "API test hatası");
    } finally {
      setLoading(false);
    }
  };

  const testTrendsAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "Eğlence" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTrendsResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "API test hatası");
    } finally {
      setLoading(false);
    }
  };

  const testDirectWebhook = async (type: 'analyze' | 'trends') => {
    setLoading(true);
    setError(null);
    
    try {
      const url = type === 'analyze' 
        ? process.env.N8N_API_ANALYZE_URL 
        : process.env.N8N_API_TRENDS_URL;
        
      if (!url) {
        throw new Error(`${type} webhook URL tanımlanmamış`);
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          type === 'analyze' 
            ? { username: "test_user" }
            : { category: "Eğlence" }
        ),
      });

      if (!response.ok) {
        throw new Error(`Webhook error! status: ${response.status}`);
      }

      const data = await response.json();
      if (type === 'analyze') {
        setAnalyzeResult(data);
      } else {
        setTrendsResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Webhook test hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          n8n API Test Paneli
        </h1>
        <p className="text-gray-600">
          n8n workflow'larınızı test edin ve entegrasyonu kontrol edin
        </p>
      </div>

      {/* Environment Variables */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">
          🔧 Environment Değişkenleri
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Analyze Webhook:</strong> 
            <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
              {process.env.N8N_API_ANALYZE_URL || "Tanımlanmamış"}
            </code>
          </div>
          <div>
            <strong>Trends Webhook:</strong> 
            <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
              {process.env.N8N_API_TRENDS_URL || "Tanımlanmamış"}
            </code>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Instagram Analiz API Testi
          </h3>
          <div className="space-y-3">
            <button
              onClick={testAnalyzeAPI}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
            >
              Next.js API Route Test Et
            </button>
            <button
              onClick={() => testDirectWebhook('analyze')}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md font-medium"
            >
              n8n Webhook Direkt Test Et
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔥 Trend İçerik API Testi
          </h3>
          <div className="space-y-3">
            <button
              onClick={testTrendsAPI}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
            >
              Next.js API Route Test Et
            </button>
            <button
              onClick={() => testDirectWebhook('trends')}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md font-medium"
            >
              n8n Webhook Direkt Test Et
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Test Hatası
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Analiz Sonucu
          </h3>
          {analyzeResult ? (
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(analyzeResult, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">Henüz test edilmedi</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔥 Trend Sonucu
          </h3>
          {trendsResult ? (
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(trendsResult, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">Henüz test edilmedi</p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">
          📋 n8n Entegrasyon Adımları
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
          <li>n8n instance'ınızı kurun ve çalıştırın</li>
          <li>Yukarıdaki workflow örneklerini n8n'de oluşturun</li>
          <li>Webhook URL'lerini kopyalayın</li>
          <li>.env.local dosyasındaki URL'leri güncelleyin</li>
          <li>Bu sayfada test butonlarını kullanın</li>
          <li>Başarılı test sonrası ana uygulamayı kullanın</li>
        </ol>
      </div>
    </div>
  );
}

