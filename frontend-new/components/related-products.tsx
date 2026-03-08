'use client';

import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/transformers';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  // Fetch products from the same category
  const { products, loading, error } = useProducts({ 
    category: category?.toLowerCase() 
  });

  // Filter out current product and limit to 4
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== currentProductId)
      .slice(0, 4);
  }, [products, currentProductId]);

  // Hide section if loading, error, or no related products
  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-warm-charcoal mb-6 font-serif text-2xl font-bold">
          Related Products
        </h2>
        <div className="text-center text-warm-charcoal/60">Loading related products...</div>
      </section>
    );
  }

  if (error || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-warm-charcoal mb-6 font-serif text-2xl font-bold">
        Related Products
      </h2>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group card-light transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[0]?.url || '/placeholder.svg'}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                priority={false}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-warm-charcoal font-serif text-lg font-bold line-clamp-2">
                {product.title}
              </h3>
              
              <p className="text-warm-charcoal/60 text-sm">
                By {product.artisan?.name || 'Artisan'}
              </p>
              
              <p className="text-primary text-xl font-bold">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
