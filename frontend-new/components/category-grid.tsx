'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';

export interface Category {
  name: string;
  image: string;
  count: number;
}

// Category image mapping (fallback to placeholder if not found)
const categoryImages: Record<string, string> = {
  textiles: '/colorful-indian-fabrics.jpg',
  pottery: '/terracotta-pots.jpg',
  jewelry: '/traditional-jewelry.png',
  woodcraft: '/carved-wood-art.jpg',
  metalwork: '/brass-copper-metalwork.jpg',
  paintings: '/indian-traditional-art.jpg',
};

export function CategoryGrid() {
  // Fetch all products to derive categories
  const { products, loading, error } = useProducts({});

  // Compute unique categories from product tags
  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Count products per category
    const categoryMap = new Map<string, number>();
    
    products.forEach((product) => {
      product.tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();
        categoryMap.set(normalizedTag, (categoryMap.get(normalizedTag) || 0) + 1);
      });
    });

    // Convert to array and sort by count (descending), limit to 6 categories
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        image: categoryImages[name] || '/placeholder.svg',
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Limit to 6 categories
  }, [products]);

  // Handle loading state
  if (loading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Shop By Category
            </p>
            <h2 className="text-warm-charcoal mt-2 font-serif text-4xl font-bold sm:text-5xl">
              Explore Crafts
            </h2>
          </div>
          <div className="text-center text-warm-charcoal/60">Loading categories...</div>
        </div>
      </section>
    );
  }

  // Handle error or empty state
  if (error || categories.length === 0) {
    return null; // Hide section if no categories available
  }
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Shop By Category
          </p>
          <h2 className="text-warm-charcoal mt-2 font-serif text-4xl font-bold sm:text-5xl">
            Explore Crafts
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}
              className="group relative block h-64 cursor-pointer overflow-hidden rounded-xl"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="from-warm-charcoal/80 via-warm-charcoal/20 absolute inset-0 flex flex-col justify-end bg-gradient-to-t to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="font-serif text-2xl font-bold text-white">{category.name}</h3>
                <p className="text-warm-sand/80 mt-2 text-sm">{category.count} products</p>
              </div>

              {/* Static overlay */}
              <div className="from-warm-charcoal/60 absolute inset-0 flex flex-col justify-end bg-gradient-to-t to-transparent p-6">
                <h3 className="font-serif text-2xl font-bold text-white">{category.name}</h3>
                <p className="text-warm-sand/80 mt-2 text-sm">{category.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
