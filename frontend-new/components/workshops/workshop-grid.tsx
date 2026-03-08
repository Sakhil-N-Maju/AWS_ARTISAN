'use client';

import Link from 'next/link';
import { Calendar, Users, MapPin, Heart } from 'lucide-react';
import { useState } from 'react';

interface Workshop {
  id: number;
  name: string;
  artisan: string;
  location: string;
  region: string;
  craft: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
  groupSize: number;
  startDate: string;
  description: string;
}

const workshops: Workshop[] = [
  {
    id: 1,
    name: 'Hand-Weaving Masterclass with Priya Sharma',
    artisan: 'Priya Sharma',
    location: 'Jaipur, Rajasthan',
    region: 'rajasthan',
    craft: 'weaving',
    image: '/placeholder.svg?key=workshop1',
    rating: 4.9,
    reviews: 234,
    price: 8500,
    duration: 'full-day',
    groupSize: 8,
    startDate: 'Dec 15, 2025',
    description:
      'Learn the art of hand-weaving directly from a master weaver with 35 years of experience',
  },
  {
    id: 2,
    name: 'Blue Pottery Workshop: Traditional Khurja Techniques',
    artisan: 'Rajesh Kumar',
    location: 'Khurja, Uttar Pradesh',
    region: 'uttar-pradesh',
    craft: 'pottery',
    image: '/placeholder.svg?key=workshop2',
    rating: 4.8,
    reviews: 189,
    price: 6500,
    duration: 'full-day',
    groupSize: 10,
    startDate: 'Dec 18, 2025',
    description: 'Master the 600-year-old art of blue pottery in this immersive workshop',
  },
  {
    id: 3,
    name: 'Kundan Jewelry Making: 3-Day Intensive',
    artisan: 'Meera Patel',
    location: 'Ahmedabad, Gujarat',
    region: 'gujarat',
    craft: 'jewelry',
    image: '/placeholder.svg?key=workshop3',
    rating: 4.9,
    reviews: 312,
    price: 18500,
    duration: '2-3-days',
    groupSize: 6,
    startDate: 'Dec 20, 2025',
    description:
      'Create your own Kundan jewelry piece under expert guidance in this 3-day intensive',
  },
  {
    id: 4,
    name: 'Woodcarving Fundamentals: Inlay Work',
    artisan: 'Kumar Woodcraft',
    location: 'Bangalore, Karnataka',
    region: 'karnataka',
    craft: 'woodcraft',
    image: '/placeholder.svg?key=workshop4',
    rating: 4.7,
    reviews: 156,
    price: 7800,
    duration: 'full-day',
    groupSize: 8,
    startDate: 'Dec 22, 2025',
    description: 'Learn traditional woodcarving and inlay techniques in this hands-on workshop',
  },
  {
    id: 5,
    name: 'Madhubani Art: Sacred Patterns Workshop',
    artisan: 'Anita Singh',
    location: 'Madhubani, Bihar',
    region: 'bihar',
    craft: 'painting',
    image: '/placeholder.svg?key=workshop5',
    rating: 4.8,
    reviews: 198,
    price: 5500,
    duration: 'full-day',
    groupSize: 12,
    startDate: 'Dec 25, 2025',
    description: 'Discover the sacred patterns and meanings behind Madhubani art',
  },
  {
    id: 6,
    name: 'Metalwork & Brass Engraving: 2-Day Workshop',
    artisan: 'Mohan Lal',
    location: 'Moradabad, Uttar Pradesh',
    region: 'uttar-pradesh',
    craft: 'metalwork',
    image: '/placeholder.svg?key=workshop6',
    rating: 4.6,
    reviews: 142,
    price: 12000,
    duration: '2-3-days',
    groupSize: 8,
    startDate: 'Dec 28, 2025',
    description: 'Learn brass working and traditional engraving techniques',
  },
  {
    id: 7,
    name: 'Natural Dye Making: Full-Week Immersion',
    artisan: 'Priya Sharma',
    location: 'Jaipur, Rajasthan',
    region: 'rajasthan',
    craft: 'weaving',
    image: '/placeholder.svg?key=workshop7',
    rating: 4.9,
    reviews: 89,
    price: 35000,
    duration: '1-week',
    groupSize: 6,
    startDate: 'Jan 5, 2026',
    description: 'Deep dive into natural dye extraction, processing, and application',
  },
  {
    id: 8,
    name: 'Tanjore Painting: Gold Foil Art Workshop',
    artisan: 'South Indian Gallery',
    location: 'Chennai, Tamil Nadu',
    region: 'tamil-nadu',
    craft: 'painting',
    image: '/placeholder.svg?key=workshop8',
    rating: 4.7,
    reviews: 167,
    price: 7200,
    duration: 'full-day',
    groupSize: 10,
    startDate: 'Jan 8, 2026',
    description: 'Learn the intricate art of creating Tanjore paintings with gold foil',
  },
];

interface WorkshopGridProps {
  region: string | null;
  craft: string | null;
  priceRange: [number, number];
  duration: string | null;
  searchQuery: string;
}

export function WorkshopGrid({
  region,
  craft,
  priceRange,
  duration,
  searchQuery,
}: WorkshopGridProps) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filteredWorkshops = workshops.filter((workshop) => {
    if (region && workshop.region !== region) return false;
    if (craft && workshop.craft !== craft) return false;
    if (duration && workshop.duration !== duration) return false;
    if (workshop.price < priceRange[0] || workshop.price > priceRange[1]) return false;
    if (
      searchQuery &&
      !workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !workshop.artisan.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div>
      <div className="text-warm-charcoal/60 mb-4 text-xs sm:mb-6 sm:text-base">
        Found {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? 's' : ''}
      </div>

      {filteredWorkshops.length === 0 ? (
        <div className="py-12 text-center sm:py-16">
          <p className="text-warm-charcoal/60 text-base sm:text-lg">
            No workshops found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8">
          {filteredWorkshops.map((workshop) => (
            <Link key={workshop.id} href={`/workshops/${workshop.id}`}>
              <div className="card-light flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl">
                {/* Image */}
                <div className="bg-warm-sand group relative mb-3 h-40 overflow-hidden rounded-lg sm:mb-4 sm:h-48 md:h-56">
                  <img
                    src={workshop.image || '/placeholder.svg'}
                    alt={workshop.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(workshop.id);
                    }}
                    className="hover:bg-warm-sand absolute top-2 right-2 rounded-full bg-white p-1.5 shadow-md transition sm:top-4 sm:right-4 sm:p-2"
                  >
                    <Heart
                      className={`h-4 w-4 transition sm:h-5 sm:w-5 ${
                        wishlist.includes(workshop.id)
                          ? 'fill-primary text-primary'
                          : 'text-warm-charcoal'
                      }`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-secondary text-xs font-semibold tracking-wide uppercase sm:text-sm">
                      {workshop.craft}
                    </p>
                    <h3 className="text-warm-charcoal group-hover:text-primary line-clamp-2 font-serif text-base font-bold transition sm:text-lg">
                      {workshop.name}
                    </h3>
                  </div>

                  <p className="text-warm-charcoal/70 line-clamp-2 text-xs sm:text-sm">
                    {workshop.description}
                  </p>

                  {/* Artisan */}
                  <p className="text-warm-charcoal/60 text-xs sm:text-sm">By {workshop.artisan}</p>

                  {/* Details */}
                  <div className="space-y-1 text-xs sm:space-y-2 sm:text-sm">
                    <div className="text-warm-charcoal/60 flex items-center gap-2">
                      <MapPin className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                      <span className="truncate">{workshop.location}</span>
                    </div>
                    <div className="text-warm-charcoal/60 flex items-center gap-2">
                      <Calendar className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                      <span>{workshop.startDate}</span>
                    </div>
                    <div className="text-warm-charcoal/60 flex items-center gap-2">
                      <Users className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                      <span>Max {workshop.groupSize} participants</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm sm:text-base ${
                            i < Math.floor(workshop.rating)
                              ? 'text-yellow-400'
                              : 'text-warm-charcoal/20'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-warm-charcoal/60 text-xs sm:text-sm">
                      ({workshop.reviews})
                    </span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="border-border mt-3 flex items-center justify-between gap-2 border-t pt-3 sm:mt-4 sm:pt-4">
                  <div>
                    <p className="text-primary text-lg font-bold sm:text-2xl">
                      ₹{workshop.price.toLocaleString()}
                    </p>
                    <p className="text-warm-charcoal/60 text-xs">per person</p>
                  </div>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="bg-primary hover:bg-warm-rust rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white transition sm:px-6 sm:py-2 sm:text-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
