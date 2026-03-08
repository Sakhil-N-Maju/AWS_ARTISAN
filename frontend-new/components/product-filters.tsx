'use client';

interface ProductFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'textiles', name: 'Textiles & Fabrics' },
  { id: 'pottery', name: 'Pottery & Ceramics' },
  { id: 'jewelry', name: 'Jewelry' },
  { id: 'woodcraft', name: 'Woodcraft' },
  { id: 'metalwork', name: 'Metalwork' },
  { id: 'paintings', name: 'Paintings & Art' },
];

const priceFilters = [
  { id: 'under-1000', label: 'Under ₹1,000', max: 1000 },
  { id: '1000-5000', label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { id: '5000-10000', label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { id: 'over-10000', label: 'Over ₹10,000', min: 10000 },
];

export function ProductFilters({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
}: ProductFiltersProps) {
  return (
    <div className="sticky top-24 space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-warm-charcoal mb-4 font-serif text-lg font-bold">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category.id} className="group flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={
                  selectedCategory === category.id ||
                  (selectedCategory === null && category.id === 'all')
                }
                onChange={(e) => onCategoryChange(e.target.value === 'all' ? null : e.target.value)}
                className="accent-primary h-4 w-4"
              />
              <span className="text-warm-charcoal/70 group-hover:text-primary transition">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-warm-charcoal mb-4 font-serif text-lg font-bold">Price Range</h3>
        <div className="mb-6 space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="50000"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
              className="border-border focus:ring-primary w-20 rounded border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              placeholder="Min"
            />
            <span className="text-warm-charcoal/60">to</span>
            <input
              type="number"
              min="0"
              max="50000"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
              className="border-border focus:ring-primary w-20 rounded border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              placeholder="Max"
            />
          </div>
        </div>

        <div className="space-y-2">
          {priceFilters.map((filter) => (
            <label key={filter.id} className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="accent-primary h-4 w-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    onPriceChange([filter.min || 0, filter.max]);
                  }
                }}
              />
              <span className="text-warm-charcoal/70 group-hover:text-primary text-sm transition">
                {filter.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div>
        <h3 className="text-warm-charcoal mb-4 font-serif text-lg font-bold">Ratings</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => (
            <label key={stars} className="group flex cursor-pointer items-center gap-3">
              <input type="checkbox" className="accent-primary h-4 w-4" />
              <div className="flex items-center gap-1">
                {Array.from({ length: stars }).map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
                {Array.from({ length: 5 - stars }).map((_, i) => (
                  <span key={i} className="text-warm-charcoal/20">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-warm-charcoal/60 group-hover:text-primary text-sm transition">
                & up
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Other Filters */}
      <div>
        <h3 className="text-warm-charcoal mb-4 font-serif text-lg font-bold">Availability</h3>
        <div className="space-y-3">
          <label className="group flex cursor-pointer items-center gap-3">
            <input type="checkbox" defaultChecked className="accent-primary h-4 w-4" />
            <span className="text-warm-charcoal/70 group-hover:text-primary transition">
              In Stock
            </span>
          </label>
          <label className="group flex cursor-pointer items-center gap-3">
            <input type="checkbox" className="accent-primary h-4 w-4" />
            <span className="text-warm-charcoal/70 group-hover:text-primary transition">
              On Sale
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
