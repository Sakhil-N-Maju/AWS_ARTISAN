'use client';

import type React from 'react';

import { useState } from 'react';
import { Mail, Phone, MapPin, Lock, Bell, Shield } from 'lucide-react';

export function AccountSettings() {
  const [formData, setFormData] = useState({
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    address: '123 Street, City, State 12345',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    zipCode: '400001',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    reviews: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <div className="space-y-12">
      {/* Profile Settings */}
      <div className="card-light">
        <h2 className="text-warm-charcoal mb-6 font-serif text-2xl font-bold">
          Profile Information
        </h2>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-warm-charcoal mb-2 block text-sm font-semibold">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-warm-charcoal mb-2 block text-sm font-semibold">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-warm-charcoal mb-2 block flex items-center gap-2 text-sm font-semibold">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-warm-charcoal mb-2 block flex items-center gap-2 text-sm font-semibold">
              <Phone className="h-4 w-4" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-warm-charcoal mb-2 block flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-warm-charcoal mb-2 block text-sm font-semibold">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-warm-charcoal mb-2 block text-sm font-semibold">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-warm-charcoal mb-2 block text-sm font-semibold">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-warm-charcoal mb-2 block text-sm font-semibold">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        <button className="bg-primary hover:bg-warm-rust rounded-lg px-8 py-3 font-semibold text-white transition">
          Save Changes
        </button>
      </div>

      {/* Notification Settings */}
      <div className="card-light">
        <h2 className="text-warm-charcoal mb-6 flex items-center gap-2 font-serif text-2xl font-bold">
          <Bell className="h-6 w-6" />
          Notification Settings
        </h2>

        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => {
            const labels: Record<string, { title: string; description: string }> = {
              orderUpdates: {
                title: 'Order Updates',
                description: 'Get notified about order status changes and delivery updates',
              },
              promotions: {
                title: 'Promotions & Offers',
                description: 'Receive special offers and discount codes',
              },
              newsletter: {
                title: 'Newsletter',
                description: 'Weekly stories, artisan highlights, and craft tips',
              },
              reviews: {
                title: 'Review Requests',
                description: 'Ask for your feedback on recent purchases',
              },
            };

            return (
              <label
                key={key}
                className="border-border hover:bg-warm-sand/30 flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationChange(key as any)}
                  className="accent-primary h-5 w-5"
                />
                <div className="flex-1">
                  <p className="text-warm-charcoal font-semibold">{labels[key].title}</p>
                  <p className="text-warm-charcoal/60 text-sm">{labels[key].description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Security Settings */}
      <div className="card-light">
        <h2 className="text-warm-charcoal mb-6 flex items-center gap-2 font-serif text-2xl font-bold">
          <Shield className="h-6 w-6" />
          Security & Privacy
        </h2>

        <div className="space-y-4">
          <button className="border-border hover:bg-warm-sand flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition">
            <div className="flex items-center gap-3">
              <Lock className="text-primary h-5 w-5" />
              <div>
                <p className="text-warm-charcoal font-semibold">Change Password</p>
                <p className="text-warm-charcoal/60 text-sm">
                  Update your password regularly for security
                </p>
              </div>
            </div>
            <span className="text-primary">→</span>
          </button>

          <button className="border-border hover:bg-warm-sand flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition">
            <div className="flex items-center gap-3">
              <Shield className="text-primary h-5 w-5" />
              <div>
                <p className="text-warm-charcoal font-semibold">Two-Factor Authentication</p>
                <p className="text-warm-charcoal/60 text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <span className="text-primary">→</span>
          </button>

          <button className="border-border hover:bg-warm-sand flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition">
            <div className="flex items-center gap-3">
              <Shield className="text-primary h-5 w-5" />
              <div>
                <p className="text-warm-charcoal font-semibold">Privacy Policy</p>
                <p className="text-warm-charcoal/60 text-sm">Review how we handle your data</p>
              </div>
            </div>
            <span className="text-primary">→</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card-light border-2 border-red-200 bg-red-50">
        <h2 className="mb-6 font-serif text-2xl font-bold text-red-700">Danger Zone</h2>

        <button className="rounded-lg border-2 border-red-500 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-500 hover:text-white">
          Delete Account
        </button>
        <p className="mt-2 text-sm text-red-600">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
      </div>
    </div>
  );
}
