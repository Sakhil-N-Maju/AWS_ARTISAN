'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton';
import { ErrorMessage } from '@/components/error-message';
import { formatPrice } from '@/lib/transformers';
import { Product } from '@/types';

interface ProductGridProps {
  category: string | null;
  priceRange: [number, number];
  sortBy: string;
  searchQuery: string;
}

export function ProductGrid({ category, priceRange, sortBy, searchQuery }: ProductGridProps) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Fetch products from API
  const { products, loading, error, refetch } = useProducts({
    search: searchQuery || undefined,
  });

  // Client-side filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category (check if category is in tags)
    if (category) {
      filtered = filtered.filter((product) =>
        product.tags.some((tag) => tag.toLowerCase() === category.toLowerCase())
      );
    }

    // Filter by price range (convert to paise)
    const minPricePaise = priceRange[0] * 100;
    const maxPricePaise = priceRange[1] * 100;
    filtered = filtered.filter(
      (product) => product.price >= minPricePaise && product.price <= maxPricePaise
    );

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.favoriteCount - a.favoriteCount;
        case 'trending':
        default:
          return b.viewCount - a.viewCount;
      }
    });

    return sorted;
  }, [products, category, priceRange, sortBy]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Loading state
  if (loading) {
    return <ProductGridSkeleton count={12} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        message="Failed to load products. Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <div className="text-warm-charcoal/60 mb-6">
        Showing {filteredAndSortedProducts.length} products
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-warm-charcoal/60 text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedProducts.map((product) => {
            const isPublished = product.status === 'published';
            const imageUrl = product.images[0]?.url || '/placeholder.svg';

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group card-light cursor-pointer transition-all duration-300 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="bg-warm-sand relative mb-4 h-64 overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    priority={false}
                  />
                  {/* Badge */}
                  {!isPublished && (
                    <div className="bg-warm-charcoal/50 absolute inset-0 flex items-center justify-center">
                      <span className="font-semibold text-white">Out of Stock</span>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className="hover:bg-warm-sand absolute top-4 right-4 rounded-full bg-white p-2 opacity-0 shadow-md transition group-hover:opacity-100"
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

                {/* Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-secondary text-xs font-semibold tracking-wide uppercase">
                      {product.artisan?.name || 'Artisan'}
                    </p>
                    <h3 className="text-warm-charcoal group-hover:text-primary font-serif text-lg font-bold transition">
                      {product.title}
                    </h3>
                  </div>

                  {/* View count as rating indicator */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < 4 ? 'text-yellow-400' : 'text-warm-charcoal/20'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-warm-charcoal/60 text-sm">
                      ({product.viewCount || 0})
                    </span>
                  </div>

                  {/* Price & Info */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-primary text-2xl font-bold">
                      {formatPrice(product.price)}
                    </p>
                    {!isPublished && (
                      <span className="text-warm-charcoal/50 text-sm font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
