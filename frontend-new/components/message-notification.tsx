'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export function MessageNotification() {
  const [notifications, setNotifications] = useState<
    Array<{ id: number; message: string; type: 'success' | 'error' }>
  >([]);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { message, type } = customEvent.detail;
      const id = Date.now();

      setNotifications((prev) => [...prev, { id, message, type }]);

      // Auto remove after 3 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    };

    window.addEventListener('showNotification', handleNotification);
    return () => window.removeEventListener('showNotification', handleNotification);
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`animate-slide-up flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${
            notif.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notif.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{notif.message}</span>
          <button
            onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
            className="ml-2 rounded p-1 transition hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
