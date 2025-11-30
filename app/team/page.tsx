"use client";
import { useState, useEffect } from "react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "editor" | "viewer";
  avatar: string;
  lastActive: string;
  status: "active" | "inactive" | "pending";
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"manager" | "editor" | "viewer">("editor");

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/team");
      if (!response.ok) throw new Error("Takım üyeleri alınamadı");
      
      const result = await response.json();
      if (result.success && result.members) {
        setMembers(result.members);
      } else {
        // Fallback
        setMembers([
        {
          id: "1",
          name: "Ahmet Yılmaz",
          email: "ahmet@example.com",
          role: "admin",
          avatar: "",
          lastActive: new Date().toISOString(),
          status: "active",
        },
        {
          id: "2",
          name: "Ayşe Demir",
          email: "ayse@example.com",
          role: "manager",
          avatar: "",
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          status: "active",
        },
        {
          id: "3",
          name: "Mehmet Kaya",
          email: "mehmet@example.com",
          role: "editor",
          avatar: "",
          lastActive: new Date(Date.now() - 86400000).toISOString(),
          status: "active",
        },
      ]);
      }
    } catch (error) {
      console.error("Team fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "invite",
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (response.ok) {
        alert("Davetiye gönderildi!");
        setShowInviteModal(false);
        setInviteEmail("");
        fetchTeam();
      }
    } catch (error) {
      console.error("Invite error:", error);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: "bg-red-100 text-red-700",
      manager: "bg-blue-100 text-blue-700",
      editor: "bg-green-100 text-green-700",
      viewer: "bg-gray-100 text-gray-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      admin: "Yönetici",
      manager: "Yönetici",
      editor: "Editör",
      viewer: "Görüntüleyici",
    };
    return labels[role] || role;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 Takım Yönetimi</h1>
          <p className="text-gray-600">Takım üyelerini yönetin ve rolleri atayın</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          ➕ Üye Davet Et
        </button>
      </div>

      {/* Role Permissions Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-4">Rol İzinleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { role: "admin", desc: "Tüm yetkiler" },
            { role: "manager", desc: "Yönetim ve raporlama" },
            { role: "editor", desc: "İçerik oluşturma ve düzenleme" },
            { role: "viewer", desc: "Sadece görüntüleme" },
          ].map((r) => (
            <div key={r.role} className="bg-white rounded-lg p-4 border border-gray-200">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getRoleColor(r.role)}`}>
                {getRoleLabel(r.role)}
              </span>
              <p className="text-sm text-gray-600">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Takım Üyeleri</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {member?.name && member.name.length > 0 ? member.name.charAt(0) : 'M'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {getRoleLabel(member.role)}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${member.status === "active" ? "bg-green-500" : "bg-gray-400"}`}></span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{member.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Son aktif: {new Date(member.lastActive).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                    Düzenle
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors">
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Üye Davet Et</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="editor">Editör</option>
                  <option value="manager">Yönetici</option>
                  <option value="viewer">Görüntüleyici</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleInvite}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700"
                >
                  Davet Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
