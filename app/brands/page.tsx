"use client";
import { useState, useEffect } from "react";

interface Brand {
  id: string;
  name: string;
  logo: string;
  colorScheme: {
    primary: string;
    secondary: string;
  };
  accounts: number;
  users: number;
  active: boolean;
  createdAt: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/brands");
      if (!response.ok) throw new Error("Markalar alınamadı");
      
      const result = await response.json();
      if (result.success && result.brands) {
        setBrands(result.brands);
      } else {
        // Fallback
        setBrands([
        {
          id: "1",
          name: "Ana Marka",
          logo: "",
          colorScheme: { primary: "#8B5CF6", secondary: "#EC4899" },
          accounts: 5,
          users: 8,
          active: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      }
    } catch (error) {
      console.error("Brands fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏢 Marka Yönetimi</h1>
          <p className="text-gray-600">Tüm markalarınızı tek yerden yönetin</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          ➕ Yeni Marka Ekle
        </button>
      </div>

      {/* Brands Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand.id)}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 cursor-pointer transition-all hover:shadow-xl ${
                selectedBrand === brand.id ? "border-purple-500 ring-4 ring-purple-200" : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                    style={{
                      background: `linear-gradient(135deg, ${brand.colorScheme.primary}, ${brand.colorScheme.secondary})`,
                    }}
                  >
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{brand.name}</p>
                    <span className={`text-xs ${brand.active ? "text-green-600" : "text-gray-500"}`}>
                      {brand.active ? "● Aktif" : "○ Pasif"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Hesaplar</p>
                  <p className="text-xl font-bold text-gray-900">{brand.accounts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kullanıcılar</p>
                  <p className="text-xl font-bold text-gray-900">{brand.users}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                  Yönet
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  ⚙️
                </button>
              </div>
            </div>
          ))}
          {brands.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Marka Yok</h3>
              <p className="text-gray-600 mb-6">İlk markanızı ekleyerek başlayın</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                İlk Markanızı Ekleyin
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
