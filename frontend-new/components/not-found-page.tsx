/**
 * 404 Not Found page component
 */

import { Search, Home, Grid, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[600px] items-center justify-center py-16">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-primary mb-2 font-serif text-8xl font-bold">404</h1>
          <h2 className="text-warm-charcoal mb-2 text-2xl font-semibold">
            Product Not Found
          </h2>
          <p className="text-warm-charcoal/60 max-w-md">
            We couldn't find the product you're looking for. It may have been removed or the link might be incorrect.
          </p>
        </div>
        
        <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="bg-primary hover:bg-secondary flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          
          <Link
            href="/products"
            className="border-primary text-primary hover:bg-primary flex items-center gap-2 rounded-lg border-2 px-6 py-3 font-semibold transition hover:text-white"
          >
            <Grid className="h-4 w-4" />
            Browse All Products
          </Link>
        </div>
        
        <div className="border-border rounded-lg border bg-white p-6">
          <h3 className="text-warm-charcoal mb-4 flex items-center justify-center gap-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5" />
            Popular Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {['Textiles', 'Pottery', 'Jewelry', 'Woodcraft', 'Metalwork', 'Paintings'].map((category) => (
              <Link
                key={category}
                href={`/products?category=${category.toLowerCase()}`}
                className="hover:bg-primary rounded-full bg-warm-sand px-4 py-2 text-sm font-medium transition hover:text-white"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
