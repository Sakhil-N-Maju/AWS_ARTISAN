'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export function CartNotification() {
  const [notification, setNotification] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      setNotification({ message: event.detail.message });

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    };

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  if (!notification) return null;

  return (
    <div className="animate-slide-up fixed right-4 bottom-4 z-50">
      <div className="border-primary flex min-w-[300px] items-center gap-3 rounded-lg border-2 bg-white p-4 shadow-xl">
        <CheckCircle className="text-primary h-6 w-6 flex-shrink-0" />
        <p className="text-warm-charcoal flex-1 font-medium">{notification.message}</p>
        <button
          onClick={() => setNotification(null)}
          className="hover:bg-warm-sand rounded p-1 transition"
        >
          <X className="text-warm-charcoal h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
