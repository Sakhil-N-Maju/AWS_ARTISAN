'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ArtisanDirectory } from '@/components/artisan-directory';
import { Search, Filter, Users, Award, Globe } from 'lucide-react';

export default function ArtisansPage() {
  const [scrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      {/* Hero Banner */}
      <section className="from-secondary/15 to-primary/15 relative overflow-hidden bg-gradient-to-br pt-20 pb-10 sm:pb-12 md:h-80">
        <div className="absolute inset-0 opacity-40">
          <div className="bg-primary/20 absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl" />
          <div className="bg-secondary/20 absolute right-1/4 bottom-10 h-80 w-80 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-warm-charcoal font-serif text-3xl font-bold sm:text-5xl md:text-6xl">
              Meet Our Artisans
            </h1>
            <p className="text-warm-charcoal/70 max-w-3xl text-sm sm:text-base md:text-lg">
              Discover the skilled craftspeople behind every handcrafted product. Each artisan has a
              unique story, years of dedication, and mastery of their craft passed down through
              generations.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-3 sm:gap-4">
          <div className="border-border rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <Users className="text-primary h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
              <span className="text-warm-charcoal text-2xl font-bold sm:text-3xl">2,340+</span>
            </div>
            <p className="text-warm-charcoal/60 text-xs sm:text-sm">Artisans</p>
          </div>
          <div className="border-border rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <Award className="text-primary h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
              <span className="text-warm-charcoal text-2xl font-bold sm:text-3xl">18</span>
            </div>
            <p className="text-warm-charcoal/60 text-xs sm:text-sm">States Covered</p>
          </div>
          <div className="border-border rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <Globe className="text-primary h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
              <span className="text-warm-charcoal text-2xl font-bold sm:text-3xl">156</span>
            </div>
            <p className="text-warm-charcoal/60 text-xs sm:text-sm">Countries Reached</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4 sm:mb-12">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-warm-charcoal/40 absolute top-3 left-4 h-5 w-5" />
              <input
                type="text"
                placeholder="Search artisans by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border focus:ring-primary w-full rounded-lg border py-2.5 pr-4 pl-12 text-base focus:ring-2 focus:outline-none"
              />
            </div>
            <button className="border-primary text-primary hover:bg-primary flex items-center justify-center gap-2 rounded-lg border-2 px-5 py-2.5 font-semibold transition hover:text-white sm:px-6">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filter Options */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label className="text-warm-charcoal mb-2 block text-xs font-semibold sm:text-sm">
                Craft
              </label>
              <select
                value={selectedCraft || ''}
                onChange={(e) => setSelectedCraft(e.target.value || null)}
                className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2.5 text-base focus:ring-2 focus:outline-none"
              >
                <option value="">All Crafts</option>
                <option value="weaving">Weaving</option>
                <option value="pottery">Pottery</option>
                <option value="jewelry">Jewelry</option>
                <option value="woodcraft">Woodcraft</option>
                <option value="metalwork">Metalwork</option>
                <option value="painting">Painting</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-warm-charcoal mb-2 block text-xs font-semibold sm:text-sm">
                Region
              </label>
              <select
                value={selectedRegion || ''}
                onChange={(e) => setSelectedRegion(e.target.value || null)}
                className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2.5 text-base focus:ring-2 focus:outline-none"
              >
                <option value="">All Regions</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="uttar-pradesh">Uttar Pradesh</option>
                <option value="gujarat">Gujarat</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamil-nadu">Tamil Nadu</option>
                <option value="bihar">Bihar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Artisan Directory */}
        <ArtisanDirectory searchQuery={searchQuery} craft={selectedCraft} region={selectedRegion} />
      </div>

      <Footer />
    </main>
  );
}
