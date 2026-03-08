'use client';

import { MapPin, Award, Heart } from 'lucide-react';
import Link from 'next/link';

interface Artisan {
  id: number;
  name: string;
  location: string;
  craft: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
}

const artisans: Artisan[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Jaipur, Rajasthan',
    craft: 'Hand-Weaving',
    image: '/indian-woman-weaving.jpg',
    rating: 4.9,
    reviews: 342,
    description: 'Master weaver with 30+ years experience in traditional saree making',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Khurja, Uttar Pradesh',
    craft: 'Pottery',
    image: '/potter-making-clay-pots.jpg',
    rating: 4.8,
    reviews: 278,
    description: 'Award-winning ceramics artist specializing in traditional blue pottery',
  },
  {
    id: 3,
    name: 'Meera Patel',
    location: 'Ahmedabad, Gujarat',
    craft: 'Jewelry Design',
    image: '/jeweler-crafting-jewelry.jpg',
    rating: 4.9,
    reviews: 456,
    description: 'Contemporary Kundan and Meenakari jewelry designer',
  },
];

export function ArtisanSpotlight() {
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
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              className="group card-light transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative mb-4 h-64 overflow-hidden rounded-lg">
                <img
                  src={artisan.image || '/placeholder.svg'}
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
                  <p className="text-primary text-sm font-semibold">{artisan.craft}</p>
                </div>

                <div className="text-warm-charcoal/60 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{artisan.location}</span>
                </div>

                <p className="text-warm-charcoal/70 text-sm">{artisan.description}</p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <Award className="text-secondary h-4 w-4" />
                    <span className="text-sm font-semibold">{artisan.rating}</span>
                    <span className="text-warm-charcoal/60 text-xs">({artisan.reviews})</span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
