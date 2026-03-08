'use client';

import Link from 'next/link';

export interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
}

const categories: Category[] = [
  { id: 1, name: 'Textiles', image: '/colorful-indian-fabrics.jpg', count: 450 },
  { id: 2, name: 'Pottery', image: '/terracotta-pots.jpg', count: 320 },
  { id: 3, name: 'Jewelry', image: '/traditional-jewelry.png', count: 280 },
  { id: 4, name: 'Woodcraft', image: '/carved-wood-art.jpg', count: 195 },
  { id: 5, name: 'Metalwork', image: '/brass-copper-metalwork.jpg', count: 165 },
  { id: 6, name: 'Paintings', image: '/indian-traditional-art.jpg', count: 240 },
];

export function CategoryGrid() {
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
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}
              className="group relative block h-64 cursor-pointer overflow-hidden rounded-xl"
            >
              <img
                src={category.image || '/placeholder.svg'}
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
