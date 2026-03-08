'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { WorkshopGrid } from '@/components/workshops/workshop-grid';
import { WorkshopFilters } from '@/components/workshops/workshop-filters';
import { Search, Filter, Star, Clock, Users } from 'lucide-react';

export default function WorkshopsPage() {
  const [scrolled] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCraft, setSelectedCraft] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [duration, setDuration] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      {/* Hero Banner */}
      <section className="from-primary/20 to-secondary/20 relative h-56 overflow-hidden bg-gradient-to-br pt-16 sm:h-72 sm:pt-20 md:h-80">
        <div className="hero-gradient absolute inset-0 -z-10" />
        <div className="absolute inset-0 opacity-30">
          <div className="bg-primary/20 absolute -top-20 right-1/3 h-96 w-96 rounded-full blur-3xl" />
          <div className="bg-secondary/20 absolute bottom-0 left-1/4 h-80 w-80 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-warm-charcoal font-serif text-3xl font-bold text-pretty sm:text-5xl md:text-6xl">
              Artisan Experiences & Workshops
            </h1>
            <p className="text-warm-charcoal/70 max-w-3xl text-sm leading-relaxed sm:text-base md:text-lg">
              Immerse yourself in authentic craft experiences. Learn directly from master artisans
              and discover India's cultural heritage through hands-on workshops.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative z-20 mx-auto -mt-6 mb-8 max-w-7xl px-4 sm:-mt-8 sm:mb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
          <div className="border-border flex items-center gap-3 rounded-lg border bg-white p-4 shadow-md sm:gap-4 sm:p-6">
            <div className="bg-primary/10 flex-shrink-0 rounded-lg p-2 sm:p-3">
              <Star className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-warm-charcoal/60 text-xs sm:text-sm">Average Rating</p>
              <p className="text-warm-charcoal text-xl font-bold sm:text-2xl">4.8/5</p>
            </div>
          </div>
          <div className="border-border flex items-center gap-3 rounded-lg border bg-white p-4 shadow-md sm:gap-4 sm:p-6">
            <div className="bg-secondary/10 flex-shrink-0 rounded-lg p-2 sm:p-3">
              <Users className="text-secondary h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-warm-charcoal/60 text-xs sm:text-sm">Active Workshops</p>
              <p className="text-warm-charcoal text-xl font-bold sm:text-2xl">347</p>
            </div>
          </div>
          <div className="border-border flex items-center gap-3 rounded-lg border bg-white p-4 shadow-md sm:col-span-2 sm:gap-4 sm:p-6 md:col-span-1">
            <div className="bg-primary/10 flex-shrink-0 rounded-lg p-2 sm:p-3">
              <Clock className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-warm-charcoal/60 text-xs sm:text-sm">Total Participants</p>
              <p className="text-warm-charcoal text-xl font-bold sm:text-2xl">18,500+</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Search & Filters Toggle */}
        <div className="mb-8 space-y-3 sm:mb-12 sm:space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="text-warm-charcoal/40 absolute top-2.5 left-3 h-4 w-4 sm:top-3 sm:left-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border focus:ring-primary w-full rounded-lg border py-2.5 pr-3 pl-10 text-sm focus:ring-2 focus:outline-none sm:py-3 sm:pr-4 sm:pl-12 sm:text-base"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border-primary text-primary hover:bg-primary flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition hover:text-white sm:px-6 sm:py-3 sm:text-base md:hidden"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="md:col-span-1">
              <WorkshopFilters
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
                selectedCraft={selectedCraft}
                onCraftChange={setSelectedCraft}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                duration={duration}
                onDurationChange={setDuration}
              />
            </div>
          )}

          {/* Workshops Grid */}
          <div className={showFilters ? 'md:col-span-3' : 'md:col-span-4'}>
            <WorkshopGrid
              region={selectedRegion}
              craft={selectedCraft}
              priceRange={priceRange}
              duration={duration}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
