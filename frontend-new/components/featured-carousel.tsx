'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

interface FeaturedItem {
  id: number;
  image: string;
  title: string;
  artisan: string;
  price: string;
  category: string;
}

const featuredItems: FeaturedItem[] = [
  {
    id: 1,
    image: '/indian-handmade-textiles-fabric.jpg',
    title: 'Hand-Woven Saree',
    artisan: 'Priya Textiles',
    price: '₹4,500',
    category: 'Textiles',
  },
  {
    id: 2,
    image: '/traditional-indian-pottery-ceramic.jpg',
    title: 'Terracotta Pottery Set',
    artisan: 'Rajesh Ceramics',
    price: '₹3,200',
    category: 'Ceramics',
  },
  {
    id: 3,
    image: '/indian-jewelry-gold-traditional.jpg',
    title: 'Temple Jewelry Set',
    artisan: 'Meera Jewelry',
    price: '₹8,900',
    category: 'Jewelry',
  },
  {
    id: 4,
    image: '/wooden-handicraft-indian-carving.jpg',
    title: 'Wooden Carving',
    artisan: 'Kumar Woodcraft',
    price: '₹2,800',
    category: 'Woodcraft',
  },
  {
    id: 5,
    image: '/indian-hand-painted-art.jpg',
    title: 'Hand-Painted Tiles',
    artisan: 'Anita Art Studio',
    price: '₹5,600',
    category: 'Painting',
  },
];

export function FeaturedCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { addToCart } = useCart();

  const handleAddToCart = (item: FeaturedItem) => {
    addToCart(
      {
        id: item.id.toString(),
        name: item.title,
        price: parseInt(item.price.replace(/[₹,]/g, '')),
        image: item.image,
        artisan: item.artisan,
      },
      1
    );
  };

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay]);

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
              {featuredItems.map((item) => (
                <div key={item.id} className="min-w-full">
                  <div className="grid items-center gap-8 py-8 md:grid-cols-2">
                    <div className="relative h-96 overflow-hidden rounded-xl">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="bg-primary absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-semibold text-white">
                        {item.category}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-secondary text-sm font-semibold tracking-wide uppercase">
                          By {item.artisan}
                        </p>
                        <h3 className="text-warm-charcoal mt-2 font-serif text-4xl font-bold">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-warm-charcoal/60 text-lg">
                        Each piece is meticulously crafted by skilled artisans using traditional
                        techniques passed down through generations.
                      </p>

                      <div className="space-y-4">
                        <div className="text-primary text-3xl font-bold">{item.price}</div>
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
              ))}
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
