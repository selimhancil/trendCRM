"use client";
import { useState, useEffect } from "react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?unreadOnly=${filter === "unread"}`);
      if (!response.ok) throw new Error("Bildirimler alınamadı");
      
      const result = await response.json();
      if (result.success && result.notifications) {
        setNotifications(result.notifications);
      }
    } catch (error) {
      console.error("Notifications fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔔 Bildirimler</h1>
        <p className="text-gray-600">Tüm bildirimlerinizi buradan yönetin</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bildirim Yok</h3>
            <p className="text-gray-600">Henüz bildiriminiz bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{notif.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(notif.timestamp).toLocaleString('tr-TR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
