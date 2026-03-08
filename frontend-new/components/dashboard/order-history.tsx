'use client';

import { useState } from 'react';
import { Download, RotateCcw, MessageCircle } from 'lucide-react';

interface Order {
  id: string;
  product: string;
  artisan: string;
  date: string;
  amount: number;
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Cancelled';
  trackingId: string;
  image: string;
}

const orders: Order[] = [
  {
    id: 'ORD-2025-0456',
    product: 'Hand-Woven Saree',
    artisan: 'Priya Textiles',
    date: 'Dec 2, 2025',
    amount: 4500,
    status: 'Delivered',
    trackingId: 'TRK-1234567890',
    image: '/placeholder.svg?key=hist1',
  },
  {
    id: 'ORD-2025-0455',
    product: 'Kundan Necklace',
    artisan: 'Meera Jewelry',
    date: 'Nov 28, 2025',
    amount: 8900,
    status: 'In Transit',
    trackingId: 'TRK-1234567891',
    image: '/placeholder.svg?key=hist2',
  },
  {
    id: 'ORD-2025-0454',
    product: 'Blue Pottery Set',
    artisan: 'Rajesh Ceramics',
    date: 'Nov 24, 2025',
    amount: 3200,
    status: 'Delivered',
    trackingId: 'TRK-1234567892',
    image: '/placeholder.svg?key=hist3',
  },
  {
    id: 'ORD-2025-0453',
    product: 'Wooden Jewelry Box',
    artisan: 'Kumar Woodcraft',
    date: 'Nov 18, 2025',
    amount: 2800,
    status: 'Delivered',
    trackingId: 'TRK-1234567893',
    image: '/placeholder.svg?key=hist4',
  },
];

export function OrderHistory() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="card-light">
          {/* Order Header */}
          <button
            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            className="w-full text-left"
          >
            <div className="border-border flex items-center gap-4 border-b pb-4">
              <img
                src={order.image || '/placeholder.svg'}
                alt={order.product}
                className="h-20 w-20 rounded object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-warm-charcoal font-serif text-lg font-bold">
                    {order.product}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-warm-charcoal/60 mb-1 text-sm">{order.artisan}</p>
                <p className="text-warm-charcoal/50 text-xs">
                  {order.id} • {order.date}
                </p>
              </div>

              <div className="text-right">
                <p className="text-primary text-2xl font-bold">₹{order.amount.toLocaleString()}</p>
              </div>
            </div>
          </button>

          {/* Order Details */}
          {expandedOrder === order.id && (
            <div className="space-y-6 pt-6">
              {/* Tracking */}
              <div>
                <h4 className="text-warm-charcoal mb-3 font-semibold">Tracking Information</h4>
                <div className="bg-warm-sand/50 mb-4 rounded-lg p-4">
                  <p className="text-warm-charcoal/60 mb-1 text-sm">Tracking ID</p>
                  <p className="text-warm-charcoal font-mono font-bold">{order.trackingId}</p>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  {[
                    { stage: 'Order Placed', date: 'Nov 28, 2025', completed: true },
                    { stage: 'Processing', date: 'Nov 29, 2025', completed: true },
                    { stage: 'Shipped', date: 'Nov 30, 2025', completed: true },
                    {
                      stage: 'Out for Delivery',
                      date: 'Dec 1, 2025',
                      completed: order.status === 'Delivered',
                    },
                    {
                      stage: 'Delivered',
                      date: 'Dec 2, 2025',
                      completed: order.status === 'Delivered',
                    },
                  ].map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-4 w-4 rounded-full ${event.completed ? 'bg-primary' : 'bg-border'}`}
                        />
                        {idx < 4 && (
                          <div
                            className={`h-8 w-0.5 ${event.completed ? 'bg-primary' : 'bg-border'}`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-warm-charcoal font-semibold">{event.stage}</p>
                        <p className="text-warm-charcoal/60 text-sm">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-border flex flex-wrap gap-3 border-t pt-6">
                <button className="border-primary text-primary hover:bg-primary flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-semibold transition hover:text-white">
                  <Download className="h-4 w-4" />
                  Invoice
                </button>
                <button className="border-border text-warm-charcoal hover:bg-warm-sand flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-semibold transition">
                  <RotateCcw className="h-4 w-4" />
                  Return
                </button>
                <button className="border-border text-warm-charcoal hover:bg-warm-sand flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-semibold transition">
                  <MessageCircle className="h-4 w-4" />
                  Support
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
