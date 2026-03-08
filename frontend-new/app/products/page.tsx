'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { ProductGrid } from '@/components/product-grid';
import { ProductFilters } from '@/components/product-filters';
import { Footer } from '@/components/footer';
import { Filter, TrendingUp, Mic } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [scrolled] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      {/* Hero Banner */}
      <section className="from-primary/10 to-secondary/10 relative overflow-hidden bg-gradient-to-br pt-20 pb-12 sm:pb-16 md:h-72">
        <div className="absolute inset-0 opacity-30">
          <div className="bg-secondary/20 absolute top-10 right-20 h-80 w-80 rounded-full blur-3xl" />
          <div className="bg-primary/10 absolute bottom-0 left-20 h-96 w-96 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-primary text-xs font-semibold sm:text-sm">
                CURATED COLLECTION
              </span>
            </div>
            <h1 className="text-warm-charcoal font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
              Authentic Handcrafted Products
            </h1>
            <p className="text-warm-charcoal/70 max-w-2xl text-base sm:text-lg">
              Browse thousands of authentic handcrafted products from artisans across India, each
              piece tells a story
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border-border hover:bg-warm-sand flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-semibold transition sm:w-auto md:hidden"
            >
              <Filter className="h-5 w-5" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>

            {/* Voice Search Button */}
            <Link
              href="/voice"
              className="bg-primary hover:bg-secondary flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-semibold text-white transition sm:w-auto"
            >
              <Mic className="h-5 w-5" />
              Voice Search
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border focus:ring-primary flex-1 rounded-lg border px-4 py-2.5 text-base focus:ring-2 focus:outline-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-border focus:ring-primary rounded-lg border px-4 py-2.5 text-base focus:ring-2 focus:outline-none"
            >
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
          {/* Filters Sidebar - Desktop Always Visible */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:col-span-1 md:block`}>
            <ProductFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />
          </div>

          {/* Products Grid */}
          <div className={showFilters ? 'md:col-span-3' : 'md:col-span-4'}>
            <ProductGrid
              category={selectedCategory}
              priceRange={priceRange}
              sortBy={sortBy}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
