'use client';

import { ChevronRight, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20 pb-12">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Centered Content */}
        <div
          className={`space-y-8 text-center transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="space-y-4">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Celebrate Handcrafted Heritage
            </p>
            <h1 className="text-warm-charcoal mx-auto font-serif text-5xl leading-tight font-bold sm:text-6xl">
              Discover Authentic Stories Behind Every Craft
            </h1>
            <p className="text-warm-charcoal/70 mx-auto max-w-2xl text-lg">
              Connect directly with Indian artisans, explore voice-guided product discovery, and
              support traditional craftsmanship through modern storytelling.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/shop"
              className="border-primary text-primary hover:bg-primary flex items-center justify-center gap-2 rounded-lg border-2 bg-transparent px-8 py-4 font-semibold transition-all duration-300 hover:text-white"
            >
              Explore Products
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="/voice"
              className="border-primary text-primary hover:bg-primary flex items-center justify-center gap-2 rounded-lg border-2 bg-transparent px-8 py-4 font-semibold transition-all duration-300 hover:text-white"
            >
              <Volume2 className="h-5 w-5" />
              Voice Discovery
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-8 pt-8">
            <div>
              <p className="text-primary text-3xl font-bold">5000+</p>
              <p className="text-warm-charcoal/60 text-sm">Artisans</p>
            </div>
            <div>
              <p className="text-primary text-3xl font-bold">25K+</p>
              <p className="text-warm-charcoal/60 text-sm">Products</p>
            </div>
            <div>
              <p className="text-primary text-3xl font-bold">50K+</p>
              <p className="text-warm-charcoal/60 text-sm">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
