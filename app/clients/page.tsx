"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  accounts: number;
  status: "active" | "inactive" | "pending";
  avatar: string;
  joinedAt: string;
  lastActivity: string;
  tags: string[];
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients?status=${filterStatus}&search=${searchQuery}`);
      if (!response.ok) throw new Error("Müşteriler alınamadı");
      
      const result = await response.json();
      if (result.success && result.clients) {
        setClients(result.clients);
      } else {
        // Fallback
        setClients([
        {
          id: "1",
          name: "Ali Veli",
          company: "Tech Corp",
          email: "ali@techcorp.com",
          phone: "+90 555 123 4567",
          accounts: 3,
          status: "active",
          avatar: "",
          joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ["premium", "active"],
        },
        {
          id: "2",
          name: "Zeynep Şahin",
          company: "Fashion Brand",
          email: "zeynep@fashion.com",
          phone: "+90 555 987 6543",
          accounts: 2,
          status: "active",
          avatar: "",
          joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ["standard"],
        },
      ]);
      }
    } catch (error) {
      console.error("Clients fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [filterStatus, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💼 Müşteri Yönetimi</h1>
          <p className="text-gray-600">Tüm müşterilerinizi görüntüleyin ve yönetin</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
          ➕ Yeni Müşteri Ekle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Müşteri ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Müşteri Bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinize uygun müşteri yok</p>
          </div>
        ) : (
          clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {client?.name && client.name.length > 0 ? client.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.company}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  client.status === "active" ? "bg-green-100 text-green-700" :
                  client.status === "inactive" ? "bg-gray-100 text-gray-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {client.status === "active" ? "Aktif" : client.status === "inactive" ? "Pasif" : "Beklemede"}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {client.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {client.accounts} hesap
                </div>
              </div>
              {client.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
