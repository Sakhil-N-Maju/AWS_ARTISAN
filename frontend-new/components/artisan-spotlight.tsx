'use client';

import { MapPin, Award, Heart } from 'lucide-react';
import Link from 'next/link';
import { useArtisans } from '@/hooks/useArtisans';
import type { Artisan } from '@/types';

export function ArtisanSpotlight() {
  // Fetch artisans from API (limit to 4, display first 3)
  const { artisans, loading, error } = useArtisans({ limit: 4 });
  const displayArtisans = artisans.slice(0, 3);

  // Handle loading state
  // TODO: Replace with <ArtisanSkeleton /> when Task 4.5 is complete
  if (loading) return null;

  // Handle error or empty state
  if (error || displayArtisans.length === 0) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-warm-charcoal/60">
            Unable to load artisan profiles at this time.
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Meet The Masters
          </p>
          <h2 className="text-warm-charcoal mt-2 font-serif text-4xl font-bold sm:text-5xl">
            Artisan Profiles
          </h2>
          <p className="text-warm-charcoal/60 mx-auto mt-4 max-w-2xl">
            Get to know the skilled craftspeople behind your favorite products
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {displayArtisans.map((artisan) => {
            const productCount = artisan.products?.length || 0;
            
            return (
              <div
                key={artisan.id}
                className="group card-light transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative mb-4 h-64 overflow-hidden rounded-lg">
                  <img
                    src={artisan.profilePhotoUrl || '/placeholder.svg'}
                    alt={artisan.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button className="hover:bg-warm-sand absolute top-4 right-4 rounded-full bg-white p-2 shadow-md transition">
                    <Heart className="text-warm-charcoal h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-warm-charcoal font-serif text-xl font-bold">
                      {artisan.name}
                    </h3>
                    <p className="text-primary text-sm font-semibold">{artisan.craftType}</p>
                  </div>

                  <div className="text-warm-charcoal/60 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{artisan.region}</span>
                  </div>

                  <p className="text-warm-charcoal/70 text-sm">
                    {artisan.bio || `Skilled ${artisan.craftType} artisan from ${artisan.region}`}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <Award className="text-secondary h-4 w-4" />
                      <span className="text-sm font-semibold">{productCount}</span>
                      <span className="text-warm-charcoal/60 text-xs">
                        {productCount === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                    <Link
                      href={`/artisans/${artisan.id}`}
                      className="bg-primary hover:bg-warm-rust rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
                    >
                      Visit Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
