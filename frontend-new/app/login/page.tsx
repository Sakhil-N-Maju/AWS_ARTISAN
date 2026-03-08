'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { role, isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = (nextRole: 'customer' | 'artisan') => {
    login(nextRole);
    router.replace('/');
  };

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={false} />

      <div className="mx-auto max-w-4xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">
            Choose your experience
          </p>
          <h1 className="text-warm-charcoal mb-4 font-serif text-4xl font-bold sm:text-5xl">
            Sign in to continue
          </h1>
          <p className="text-warm-charcoal/70 mx-auto max-w-2xl text-sm sm:text-base">
            Select the interface that fits your role. Customers explore handcrafted goods, while
            artisans manage their collections and growth tools.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <button
            onClick={() => handleLogin('customer')}
            className={`card-light rounded-2xl border-2 p-8 text-left transition hover:shadow-xl ${
              role === 'customer' ? 'border-primary' : 'border-transparent'
            }`}
          >
            <div className="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
              For Customers
            </div>
            <h2 className="text-warm-charcoal mb-4 font-serif text-2xl font-bold">
              Discover and shop
            </h2>
            <ul className="text-warm-charcoal/70 space-y-2 text-sm">
              <li>Browse curated artisan collections</li>
              <li>Save favorites and manage your cart</li>
              <li>Book workshops and follow stories</li>
            </ul>
            <span className="text-primary mt-6 inline-block text-sm font-semibold">
              Continue as customer →
            </span>
          </button>

          <button
            onClick={() => handleLogin('artisan')}
            className={`card-light rounded-2xl border-2 p-8 text-left transition hover:shadow-xl ${
              role === 'artisan' ? 'border-primary' : 'border-transparent'
            }`}
          >
            <div className="text-secondary mb-3 text-xs font-semibold tracking-widest uppercase">
              For Artisans
            </div>
            <h2 className="text-warm-charcoal mb-4 font-serif text-2xl font-bold">
              Manage your business
            </h2>
            <ul className="text-warm-charcoal/70 space-y-2 text-sm">
              <li>Update product catalog and inventory</li>
              <li>Track orders, performance, and analytics</li>
              <li>Access admin tools and messaging</li>
            </ul>
            <span className="text-secondary mt-6 inline-block text-sm font-semibold">
              Continue as artisan →
            </span>
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
