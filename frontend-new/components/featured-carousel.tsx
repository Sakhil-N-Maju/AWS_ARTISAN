'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice, paiseToRupees } from '@/lib/transformers';
import Link from 'next/link';

export function FeaturedCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { addToCart } = useCart();
  
  // Fetch products from API (limit to 8, take first 6 for carousel)
  const { products, loading, error } = useProducts({ limit: 8 });
  const featuredItems = products.slice(0, 6);

  const handleAddToCart = (product: typeof featuredItems[0]) => {
    addToCart(
      {
        id: product.id,
        name: product.title,
        price: paiseToRupees(product.price),
        image: product.images[0]?.url || '/placeholder.svg',
        artisan: product.artisan?.name || 'Artisan',
      },
      1
    );
  };

  useEffect(() => {
    if (!autoPlay || featuredItems.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay, featuredItems.length]);

  // Hide carousel if loading, error, or no products
  // TODO: Replace with <CarouselSkeleton /> when Task 4.4 is complete
  if (loading) return null;
  if (error || featuredItems.length === 0) return null;

  const next = () => {
    setCurrent((prev) => (prev + 1) % featuredItems.length);
    setAutoPlay(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    setAutoPlay(false);
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Featured Collection
          </p>
          <h2 className="text-warm-charcoal mt-2 font-serif text-4xl font-bold sm:text-5xl">
            Artisan Treasures
          </h2>
          <p className="text-warm-charcoal/60 mx-auto mt-4 max-w-2xl">
            Curated selections from master craftspeople who preserve traditions through contemporary
            design.
          </p>
        </div>

        {/* Carousel */}
        <div className="group relative">
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {featuredItems.map((item) => {
                const imageUrl = item.images[0]?.url || '/placeholder.svg';
                const category = item.tags[0] || 'Handcraft';
                
                return (
                  <div key={item.id} className="min-w-full">
                    <div className="grid items-center gap-8 py-8 md:grid-cols-2">
                      <div className="relative h-96 overflow-hidden rounded-xl">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="bg-primary absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-semibold text-white">
                          {category}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-secondary text-sm font-semibold tracking-wide uppercase">
                            By {item.artisan?.name || 'Artisan'}
                          </p>
                          <h3 className="text-warm-charcoal mt-2 font-serif text-4xl font-bold">
                            {item.title}
                          </h3>
                        </div>

                        <p className="text-warm-charcoal/60 text-lg">
                          {item.description.substring(0, 150)}...
                        </p>

                        <div className="space-y-4">
                          <div className="text-primary text-3xl font-bold">
                            {formatPrice(item.price)}
                          </div>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-accent hover:bg-secondary w-full rounded-lg py-4 font-semibold text-white transition-all duration-300"
                          >
                            Add to Cart
                          </button>
                          <Link
                            href={`/products/${item.id}`}
                            className="border-primary text-primary hover:bg-primary block w-full rounded-lg border-2 py-3 text-center font-semibold transition-all duration-300 hover:text-white"
                          >
                            View Details
                          </Link>
                        </div>

                        {/* Indicators */}
                        <div className="flex gap-2 pt-4">
                          {featuredItems.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setCurrent(idx);
                                setAutoPlay(false);
                              }}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                idx === current ? 'bg-primary w-8' : 'bg-border w-2'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-white"
          >
            <ChevronLeft className="text-warm-charcoal h-6 w-6" />
          </button>

          <button
            onClick={next}
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:bg-white"
          >
            <ChevronRight className="text-warm-charcoal h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
