'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { OrderOverview } from '@/components/dashboard/order-overview';
import { OrderHistory } from '@/components/dashboard/order-history';
import { AccountSettings } from '@/components/dashboard/account-settings';
import { Package, Settings, History, Heart } from 'lucide-react';

type DashboardTab = 'overview' | 'orders' | 'wishlist' | 'settings';

export default function DashboardPage() {
  const [scrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-4 py-12 pt-32 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-warm-charcoal mb-2 font-serif text-4xl font-bold">My Dashboard</h1>
          <p className="text-warm-charcoal/60">
            Track your orders, manage your account, and explore your wishlist
          </p>
        </div>

        {/* Tabs */}
        <div className="border-border mb-12 flex gap-4 overflow-x-auto border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 font-semibold whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <Package className="h-5 w-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 font-semibold whitespace-nowrap transition ${
              activeTab === 'orders'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <History className="h-5 w-5" />
            Order History
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 font-semibold whitespace-nowrap transition ${
              activeTab === 'wishlist'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <Heart className="h-5 w-5" />
            Wishlist
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 font-semibold whitespace-nowrap transition ${
              activeTab === 'settings'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && <OrderOverview />}
        {activeTab === 'orders' && <OrderHistory />}
        {activeTab === 'wishlist' && <WishlistTab />}
        {activeTab === 'settings' && <AccountSettings />}
      </div>

      <Footer />
    </main>
  );
}

function WishlistTab() {
  const wishlist = [
    {
      id: 1,
      name: 'Hand-Woven Saree',
      price: 4500,
      image: '/placeholder.svg?key=wish1',
      artisan: 'Priya Textiles',
    },
    {
      id: 2,
      name: 'Kundan Necklace',
      price: 8900,
      image: '/placeholder.svg?key=wish2',
      artisan: 'Meera Jewelry',
    },
    {
      id: 3,
      name: 'Blue Pottery Bowl',
      price: 2800,
      image: '/placeholder.svg?key=wish3',
      artisan: 'Khurja Crafts',
    },
  ];

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-3">
        {wishlist.map((item) => (
          <div key={item.id} className="card-light transition hover:shadow-lg">
            <div className="bg-warm-sand mb-4 h-48 overflow-hidden rounded-lg">
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-warm-charcoal mb-2 font-serif text-lg font-bold">{item.name}</h3>
            <p className="text-warm-charcoal/60 mb-4 text-sm">{item.artisan}</p>
            <div className="flex items-center justify-between">
              <p className="text-primary text-2xl font-bold">₹{item.price.toLocaleString()}</p>
              <button className="bg-primary hover:bg-warm-rust rounded-lg px-4 py-2 font-semibold text-white transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
