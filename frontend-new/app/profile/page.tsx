'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  LogOut,
  Package,
  Heart,
  Settings,
  Clock,
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
}

const mockProfile: UserProfile = {
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@example.com',
  phone: '+91 98765 43210',
  address: '123 Artisan Street, Delhi, India 110001',
  joinDate: 'January 2023',
  avatar: '/professional-profile.jpg',
  totalOrders: 24,
  totalSpent: 185400,
};

interface RecentOrder {
  id: string;
  date: string;
  items: number;
  total: number;
  status: 'delivered' | 'in-transit' | 'processing';
}

const mockRecentOrders: RecentOrder[] = [
  { id: 'ORD-2025-001', date: 'Jan 15, 2025', items: 3, total: 15800, status: 'delivered' },
  { id: 'ORD-2025-002', date: 'Jan 8, 2025', items: 1, total: 8900, status: 'delivered' },
  { id: 'ORD-2025-003', date: 'Dec 28, 2024', items: 2, total: 12500, status: 'delivered' },
  { id: 'ORD-2024-148', date: 'Dec 20, 2024', items: 1, total: 4500, status: 'delivered' },
];

type ProfileTab = 'overview' | 'orders' | 'addresses' | 'settings';

export default function ProfilePage() {
  const [scrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-4 py-8 pt-28 sm:px-6 sm:py-12 sm:pt-32 lg:px-8">
        <div className="card-light mb-8 p-5 sm:p-6">
          <div className="border-border mb-6 flex flex-col items-start gap-4 border-b pb-6 sm:mb-8 sm:flex-row sm:items-center sm:gap-6 sm:pb-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={mockProfile.avatar || '/placeholder.svg'}
                alt={mockProfile.name}
                className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
              />
              <button className="bg-primary hover:bg-warm-rust absolute right-2 bottom-2 rounded-lg p-2 text-white transition">
                <Edit2 className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="w-full flex-1">
              <h1 className="text-warm-charcoal mb-2 font-serif text-2xl font-bold sm:text-3xl">
                {mockProfile.name}
              </h1>
              <div className="text-warm-charcoal/60 mb-4 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{mockProfile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  {mockProfile.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  Member since {mockProfile.joinDate}
                </div>
              </div>
              <button className="bg-primary hover:bg-warm-rust w-full rounded-lg px-6 py-2 text-sm font-semibold text-white transition sm:w-auto">
                Edit Profile
              </button>
            </div>

            {/* Stats */}
            <div className="grid w-full grid-cols-2 gap-4 sm:w-auto sm:gap-6">
              <div className="text-center sm:text-right">
                <p className="text-primary text-xl font-bold sm:text-2xl">
                  {mockProfile.totalOrders}
                </p>
                <p className="text-warm-charcoal/60 text-xs sm:text-sm">Total Orders</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-primary text-xl font-bold sm:text-2xl">
                  ₹{(mockProfile.totalSpent / 1000).toFixed(0)}K
                </p>
                <p className="text-warm-charcoal/60 text-xs sm:text-sm">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-border mb-8 flex gap-2 overflow-x-auto border-b pb-0 sm:gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition sm:px-6 sm:py-4 sm:text-base ${
              activeTab === 'overview'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition sm:px-6 sm:py-4 sm:text-base ${
              activeTab === 'orders'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <Package className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition sm:px-6 sm:py-4 sm:text-base ${
              activeTab === 'addresses'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Addresses</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition sm:px-6 sm:py-4 sm:text-base ${
              activeTab === 'settings'
                ? 'text-primary border-primary'
                : 'text-warm-charcoal/60 hover:text-warm-charcoal border-transparent'
            }`}
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Links */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="/favorites"
                className="card-light flex cursor-pointer items-center gap-4 p-4 transition hover:shadow-lg sm:p-5"
              >
                <div className="bg-primary/10 flex-shrink-0 rounded-lg p-3">
                  <Heart className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-warm-charcoal text-sm font-semibold sm:text-base">Favorites</p>
                  <p className="text-warm-charcoal/60 text-xs sm:text-sm">12 items saved</p>
                </div>
              </a>
              <a
                href="/cart"
                className="card-light flex cursor-pointer items-center gap-4 p-4 transition hover:shadow-lg sm:p-5"
              >
                <div className="bg-secondary/10 flex-shrink-0 rounded-lg p-3">
                  <Package className="text-secondary h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-warm-charcoal text-sm font-semibold sm:text-base">Cart</p>
                  <p className="text-warm-charcoal/60 text-xs sm:text-sm">3 items in cart</p>
                </div>
              </a>
              <div className="card-light flex items-center gap-4 p-4 sm:p-5">
                <div className="bg-primary/10 flex-shrink-0 rounded-lg p-3">
                  <Settings className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-warm-charcoal text-sm font-semibold sm:text-base">
                    Preferences
                  </p>
                  <p className="text-warm-charcoal/60 text-xs sm:text-sm">
                    Customize your experience
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-warm-charcoal mb-4 font-serif text-xl font-bold sm:mb-6 sm:text-2xl">
                Recent Orders
              </h2>
              <div className="space-y-3">
                {mockRecentOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="card-light flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                  >
                    <div className="min-w-0">
                      <p className="text-warm-charcoal text-sm font-semibold sm:text-base">
                        {order.id}
                      </p>
                      <p className="text-warm-charcoal/60 text-xs sm:text-sm">{order.date}</p>
                    </div>
                    <div className="flex items-center justify-between sm:text-right">
                      <p className="text-warm-charcoal text-sm font-semibold sm:text-base">
                        ₹{order.total.toLocaleString()}
                      </p>
                      <p
                        className={`ml-4 text-xs font-semibold sm:ml-0 ${
                          order.status === 'delivered'
                            ? 'text-green-600'
                            : order.status === 'in-transit'
                              ? 'text-blue-600'
                              : 'text-amber-600'
                        }`}
                      >
                        {order.status.replace('-', ' ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#"
                onClick={() => setActiveTab('orders')}
                className="text-primary hover:text-warm-rust mt-4 text-sm font-semibold transition"
              >
                View All Orders →
              </a>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            {mockRecentOrders.map((order) => (
              <div
                key={order.id}
                className="card-light flex flex-col gap-3 p-4 transition hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-warm-charcoal text-sm font-semibold sm:text-base">
                    {order.id}
                  </p>
                  <p className="text-warm-charcoal/60 text-xs sm:text-sm">
                    {order.date} • {order.items} item{order.items > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:text-right">
                  <p className="text-primary text-sm font-bold sm:text-base">
                    ₹{order.total.toLocaleString()}
                  </p>
                  <p
                    className={`ml-4 text-xs font-semibold sm:ml-0 ${
                      order.status === 'delivered'
                        ? 'text-green-600'
                        : order.status === 'in-transit'
                          ? 'text-blue-600'
                          : 'text-amber-600'
                    }`}
                  >
                    {order.status.replace('-', ' ').toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="card-light p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:mb-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-warm-charcoal text-sm font-semibold sm:text-base">Home</p>
                  <p className="text-warm-charcoal/60 mt-2 text-xs sm:text-sm">
                    {mockProfile.address}
                  </p>
                </div>
                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
                  Default
                </span>
              </div>
              <button className="text-primary hover:text-warm-rust text-xs font-semibold transition sm:text-sm">
                Edit Address
              </button>
            </div>

            <button className="card-light border-border hover:bg-warm-sand/50 w-full border-2 border-dashed py-6 text-center transition sm:py-8">
              <p className="text-warm-charcoal text-sm font-semibold sm:text-base">
                + Add New Address
              </p>
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="card-light p-4 sm:p-5">
              <h3 className="text-warm-charcoal mb-4 text-sm font-semibold sm:text-base">
                Notifications
              </h3>
              <div className="space-y-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                  <span className="text-warm-charcoal text-xs sm:text-sm">Order updates</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                  <span className="text-warm-charcoal text-xs sm:text-sm">
                    Promotions and discounts
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" className="h-4 w-4" />
                  <span className="text-warm-charcoal text-xs sm:text-sm">
                    New artisan collections
                  </span>
                </label>
              </div>
            </div>

            <div className="card-light p-4 sm:p-5">
              <h3 className="text-warm-charcoal mb-4 text-sm font-semibold sm:text-base">
                Security
              </h3>
              <button className="border-border hover:bg-warm-sand w-full rounded-lg border px-4 py-2.5 text-left text-xs font-semibold transition sm:text-sm">
                Change Password
              </button>
            </div>

            <div className="card-light p-4 sm:p-5">
              <h3 className="text-warm-charcoal mb-4 text-sm font-semibold text-red-600 sm:text-base">
                Danger Zone
              </h3>
              <button className="border-destructive text-destructive hover:bg-destructive/5 w-full rounded-lg border-2 px-4 py-2.5 text-xs font-semibold transition sm:text-sm">
                Delete Account
              </button>
            </div>

            <button className="border-primary text-primary hover:bg-primary/5 flex w-full items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-xs font-semibold transition sm:text-sm">
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
