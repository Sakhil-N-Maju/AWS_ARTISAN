'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  image: string;
  artisan: string;
  category: string;
  rating: number;
  inStock: boolean;
  addedDate: string;
}

const mockFavorites: FavoriteItem[] = [
  {
    id: 1,
    name: 'Hand-Woven Saree',
    price: 4500,
    image: '/hand-woven-saree.jpg',
    artisan: 'Priya Textiles',
    category: 'Textiles',
    rating: 4.8,
    inStock: true,
    addedDate: '2 days ago',
  },
  {
    id: 2,
    name: 'Kundan Necklace',
    price: 8900,
    image: '/kundan-necklace.jpg',
    artisan: 'Meera Jewelry',
    category: 'Jewelry',
    rating: 4.9,
    inStock: true,
    addedDate: '1 week ago',
  },
  {
    id: 3,
    name: 'Blue Pottery Bowl',
    price: 2800,
    image: '/blue-pottery-bowl.jpg',
    artisan: 'Khurja Crafts',
    category: 'Pottery',
    rating: 4.7,
    inStock: true,
    addedDate: '1 week ago',
  },
  {
    id: 4,
    name: 'Leather Mojari Shoes',
    price: 3200,
    image: '/leather-mojari.jpg',
    artisan: 'Jaipur Footwear',
    category: 'Footwear',
    rating: 4.6,
    inStock: false,
    addedDate: '3 weeks ago',
  },
  {
    id: 5,
    name: 'Brass Decorative Lamp',
    price: 5600,
    image: '/brass-lamp.jpg',
    artisan: 'Mohan Metal Works',
    category: 'Decor',
    rating: 4.8,
    inStock: true,
    addedDate: '1 month ago',
  },
  {
    id: 6,
    name: 'Pashmina Shawl',
    price: 12000,
    image: '/pashmina-shawl.jpg',
    artisan: 'Kashmir Weaves',
    category: 'Textiles',
    rating: 4.9,
    inStock: true,
    addedDate: '1 month ago',
  },
];

export default function FavoritesPage() {
  const [scrolled] = useState(false);
  const [favorites, setFavorites] = useState(mockFavorites);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFavorites = selectedCategory
    ? favorites.filter((item) => item.category === selectedCategory)
    : favorites;

  const categories = Array.from(new Set(mockFavorites.map((item) => item.category)));

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-4 py-8 pt-28 sm:px-6 sm:py-12 sm:pt-32 lg:px-8">
        <div className="mb-8 flex flex-col items-start gap-3 sm:mb-12 sm:flex-row sm:items-center sm:gap-3">
          <Heart className="text-primary h-7 w-7 flex-shrink-0 fill-current sm:h-8 sm:w-8" />
          <h1 className="text-warm-charcoal font-serif text-3xl font-bold sm:text-4xl">
            My Favorites
          </h1>
          <span className="bg-primary/10 text-primary ml-auto rounded-full px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm">
            {filteredFavorites.length} item{filteredFavorites.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filters */}
        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0 sm:pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition sm:text-sm ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-warm-sand text-warm-charcoal hover:bg-warm-sand/80'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition sm:text-sm ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-warm-sand text-warm-charcoal hover:bg-warm-sand/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredFavorites.map((item) => (
              <div
                key={item.id}
                className="card-light group flex flex-col p-4 transition hover:shadow-lg sm:p-5"
              >
                {/* Image Container */}
                <div className="bg-warm-sand relative mb-3 h-40 flex-shrink-0 overflow-hidden rounded-lg sm:mb-4 sm:h-48">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-xs font-semibold text-white sm:text-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="hover:bg-warm-sand absolute top-2 right-2 rounded-lg bg-white p-1.5 shadow transition sm:p-2"
                  >
                    <Heart className="text-primary h-4 w-4 fill-current sm:h-5 sm:w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="mb-3 flex-1 space-y-2 sm:mb-4">
                  <p className="text-primary text-xs font-semibold">{item.category}</p>
                  <h3 className="text-warm-charcoal line-clamp-2 font-serif text-sm font-bold sm:text-lg">
                    {item.name}
                  </h3>
                  <p className="text-warm-charcoal/60 text-xs sm:text-sm">{item.artisan}</p>
                </div>

                {/* Rating & Price */}
                <div className="border-border mb-3 flex items-center justify-between border-b pb-3 sm:mb-4 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-warm-charcoal text-xs font-semibold sm:text-sm">
                      ★ {item.rating}
                    </span>
                  </div>
                  <p className="text-primary text-base font-bold sm:text-xl">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>

                {/* Meta */}
                <p className="text-warm-charcoal/50 mb-3 text-xs sm:mb-4">Added {item.addedDate}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    disabled={!item.inStock}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold transition sm:gap-2 sm:text-sm ${
                      item.inStock
                        ? 'bg-primary hover:bg-warm-rust text-white'
                        : 'bg-warm-sand text-warm-charcoal/40 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </button>
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="border-border hover:bg-warm-sand rounded-lg border px-2 py-2 transition sm:px-3"
                  >
                    <Trash2 className="text-warm-charcoal/60 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center sm:py-16">
            <Heart className="text-warm-sand mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16" />
            <h2 className="text-warm-charcoal mb-2 font-serif text-2xl font-bold sm:text-3xl">
              No Favorites Yet
            </h2>
            <p className="text-warm-charcoal/60 mb-6 text-sm sm:text-base">
              Start adding items to your favorites to see them here
            </p>
            <a
              href="/shop"
              className="bg-primary hover:bg-warm-rust inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white transition"
            >
              Explore Shop
            </a>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
