'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { PlusCircle, Package, BarChart2, Edit, Archive } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface ArtisanProduct {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'draft' | 'archived';
  inventory: number;
  updatedAt: string;
}

const mockProducts: ArtisanProduct[] = [
  {
    id: 'ART-001',
    name: 'Handwoven Silk Saree',
    price: 7800,
    status: 'active',
    inventory: 12,
    updatedAt: 'Oct 12, 2025',
  },
  {
    id: 'ART-002',
    name: 'Terracotta Planter Set',
    price: 3200,
    status: 'draft',
    inventory: 5,
    updatedAt: 'Oct 10, 2025',
  },
  {
    id: 'ART-003',
    name: 'Bidriware Jewelry Box',
    price: 5600,
    status: 'active',
    inventory: 8,
    updatedAt: 'Oct 8, 2025',
  },
  {
    id: 'ART-004',
    name: 'Handcrafted Bamboo Lamp',
    price: 2800,
    status: 'archived',
    inventory: 0,
    updatedAt: 'Sep 30, 2025',
  },
];

export default function ArtisanProductsPage() {
  const [scrolled] = useState(false);
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (role !== 'artisan') {
      router.replace('/');
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'artisan') {
    return null;
  }

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-secondary text-xs font-semibold tracking-widest uppercase">
              Artisan workspace
            </p>
            <h1 className="text-warm-charcoal font-serif text-3xl font-bold sm:text-4xl">
              My Products
            </h1>
            <p className="text-warm-charcoal/70 mt-2 max-w-2xl text-sm">
              Review listings, adjust inventory, and keep your catalog ready for the marketplace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="bg-primary hover:bg-warm-rust flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white transition">
              <PlusCircle className="h-4 w-4" />
              Add product
            </button>
            <button className="border-border hover:bg-warm-sand flex items-center gap-2 rounded-lg border px-4 py-2 font-semibold transition">
              <BarChart2 className="h-4 w-4" />
              View analytics
            </button>
          </div>
        </div>

        <div className="card-light overflow-hidden">
          <div className="text-warm-charcoal/60 hidden grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold tracking-widest uppercase md:grid">
            <span className="col-span-4">Product</span>
            <span className="col-span-2">Price</span>
            <span className="col-span-2">Inventory</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2">Updated</span>
          </div>

          <div className="divide-border/70 divide-y">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="hover:bg-warm-sand/40 grid grid-cols-1 gap-4 px-6 py-5 transition md:grid-cols-12"
              >
                <div className="col-span-4 flex items-start gap-4">
                  <div className="bg-warm-sand flex h-16 w-16 items-center justify-center rounded-lg">
                    <Package className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-warm-charcoal text-base font-semibold">{product.name}</h2>
                    <p className="text-warm-charcoal/60 text-xs">{product.id}</p>
                  </div>
                </div>
                <div className="text-warm-charcoal col-span-2 flex items-center text-sm font-semibold">
                  ₹{product.price.toLocaleString()}
                </div>
                <div className="text-warm-charcoal/80 col-span-2 flex items-center text-sm">
                  {product.inventory} units
                </div>
                <div className="col-span-2 flex items-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : product.status === 'draft'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {product.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-warm-charcoal/60 col-span-2 flex items-center justify-between gap-3 text-xs md:justify-end">
                  <span>{product.updatedAt}</span>
                  <div className="flex gap-2">
                    <button
                      className="hover:bg-warm-sand rounded-lg p-2 transition"
                      aria-label="Edit product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="hover:bg-warm-sand rounded-lg p-2 transition"
                      aria-label="Archive product"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
