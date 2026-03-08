'use client';

import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export function OrderOverview() {
  const stats = [
    { label: 'Total Orders', value: '12', icon: Package, color: 'primary' },
    { label: 'In Transit', value: '2', icon: Truck, color: 'secondary' },
    { label: 'Delivered', value: '10', icon: CheckCircle, color: 'sage' },
    { label: 'Processing', value: '1', icon: Clock, color: 'rust' },
  ];

  const recentOrders = [
    {
      id: 'ORD-2025-0456',
      product: 'Hand-Woven Saree',
      date: 'Dec 2, 2025',
      amount: '₹4,500',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-700',
      image: '/placeholder.svg?key=order1',
    },
    {
      id: 'ORD-2025-0455',
      product: 'Kundan Necklace',
      date: 'Nov 28, 2025',
      amount: '₹8,900',
      status: 'In Transit',
      statusColor: 'bg-blue-100 text-blue-700',
      image: '/placeholder.svg?key=order2',
    },
    {
      id: 'ORD-2025-0454',
      product: 'Blue Pottery Set',
      date: 'Nov 24, 2025',
      amount: '₹3,200',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-700',
      image: '/placeholder.svg?key=order3',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card-light">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-warm-charcoal/60 text-sm">{stat.label}</p>
                  <p className="text-warm-charcoal text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`h-12 w-12 bg-${stat.color}/10 flex items-center justify-center rounded-full`}
                >
                  <Icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="card-light">
        <h2 className="text-warm-charcoal mb-6 font-serif text-2xl font-bold">Recent Orders</h2>

        <div className="space-y-4">
          {recentOrders.map((order) => (
            <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
              <div className="border-border hover:bg-warm-sand/30 flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition">
                <img
                  src={order.image || '/placeholder.svg'}
                  alt={order.product}
                  className="h-16 w-16 rounded object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-warm-charcoal font-semibold">{order.product}</p>
                  <p className="text-warm-charcoal/60 text-sm">{order.id}</p>
                  <p className="text-warm-charcoal/50 text-xs">{order.date}</p>
                </div>

                <div className="text-right">
                  <p className="text-warm-charcoal font-bold">{order.amount}</p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="#orders"
          className="text-primary hover:text-warm-rust mt-6 inline-block font-semibold transition"
        >
          View All Orders →
        </Link>
      </div>
    </div>
  );
}
