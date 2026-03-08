'use client';

import Link from 'next/link';
import { Volume2, RotateCcw, Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface VoiceResultsProps {
  products: Product[];
  onReset: () => void;
}

export function VoiceResults({ products, onReset }: VoiceResultsProps) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="bg-primary/10 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Volume2 className="text-primary h-5 w-5" />
            <span className="text-primary text-sm font-semibold">Voice Discovery Results</span>
          </div>
          <h1 className="text-warm-charcoal mb-4 font-serif text-4xl font-bold sm:text-5xl">
            Perfect Matches Found
          </h1>
          <p className="text-warm-charcoal/60 mx-auto max-w-2xl">
            We found {products.length} products that match your description. Curated by AI to match
            your voice request.
          </p>
        </div>

        {/* Results Grid */}
        <div className="mb-12 grid gap-8 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="card-light transition-all duration-300 hover:shadow-2xl"
            >
              <div className="bg-warm-sand relative mb-4 h-64 overflow-hidden rounded-lg">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="hover:bg-warm-sand absolute top-4 right-4 rounded-full bg-white p-2 shadow-md transition"
                >
                  <Heart
                    className={`h-5 w-5 transition ${
                      wishlist.includes(product.id)
                        ? 'fill-primary text-primary'
                        : 'text-warm-charcoal'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-3">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-warm-charcoal hover:text-primary font-serif text-lg font-bold transition">
                    {product.name}
                  </h3>
                </Link>

                <div className="text-primary text-2xl font-bold">
                  ₹{product.price.toLocaleString()}
                </div>

                <button className="bg-primary hover:bg-warm-rust flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Refine Search or Explore */}
        <div className="grid gap-6 md:grid-cols-2">
          <button
            onClick={onReset}
            className="border-primary text-primary hover:bg-primary flex items-center justify-center gap-2 rounded-lg border-2 py-6 font-semibold transition hover:text-white"
          >
            <RotateCcw className="h-5 w-5" />
            Try Another Search
          </button>

          <Link
            href="/shop"
            className="bg-primary hover:bg-warm-rust flex items-center justify-center gap-2 rounded-lg py-6 font-semibold text-white transition"
          >
            <span>Explore Full Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
