'use client';

interface WorkshopFiltersProps {
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
  selectedCraft: string | null;
  onCraftChange: (craft: string | null) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  duration: string | null;
  onDurationChange: (duration: string | null) => void;
}

const regions = [
  { id: 'rajasthan', name: 'Rajasthan' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh' },
  { id: 'gujarat', name: 'Gujarat' },
  { id: 'karnataka', name: 'Karnataka' },
  { id: 'tamil-nadu', name: 'Tamil Nadu' },
  { id: 'bihar', name: 'Bihar' },
];

const crafts = [
  { id: 'weaving', name: 'Hand-Weaving' },
  { id: 'pottery', name: 'Pottery' },
  { id: 'jewelry', name: 'Jewelry Making' },
  { id: 'woodcraft', name: 'Woodcraft' },
  { id: 'metalwork', name: 'Metalwork' },
  { id: 'painting', name: 'Painting' },
];

const durations = [
  { id: 'half-day', name: 'Half Day (3-4 hrs)' },
  { id: 'full-day', name: 'Full Day (6-8 hrs)' },
  { id: '2-3-days', name: '2-3 Days' },
  { id: '1-week', name: '1 Week' },
  { id: 'extended', name: 'Extended (2+ weeks)' },
];

export function WorkshopFilters({
  selectedRegion,
  onRegionChange,
  selectedCraft,
  onCraftChange,
  priceRange,
  onPriceChange,
  duration,
  onDurationChange,
}: WorkshopFiltersProps) {
  return (
    <div className="sticky top-24 space-y-6 sm:space-y-8">
      {/* Region */}
      <div>
        <h3 className="text-warm-charcoal mb-3 font-serif text-base font-bold sm:mb-4 sm:text-lg">
          Region
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {regions.map((region) => (
            <label
              key={region.id}
              className="group flex cursor-pointer items-center gap-2 sm:gap-3"
            >
              <input
                type="radio"
                name="region"
                value={region.id}
                checked={selectedRegion === region.id}
                onChange={() => onRegionChange(region.id)}
                className="accent-primary h-4 w-4"
              />
              <span className="text-warm-charcoal/70 group-hover:text-primary text-sm transition sm:text-base">
                {region.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Craft */}
      <div>
        <h3 className="text-warm-charcoal mb-3 font-serif text-base font-bold sm:mb-4 sm:text-lg">
          Craft
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {crafts.map((craft) => (
            <label key={craft.id} className="group flex cursor-pointer items-center gap-2 sm:gap-3">
              <input
                type="radio"
                name="craft"
                value={craft.id}
                checked={selectedCraft === craft.id}
                onChange={() => onCraftChange(craft.id)}
                className="accent-primary h-4 w-4"
              />
              <span className="text-warm-charcoal/70 group-hover:text-primary text-sm transition sm:text-base">
                {craft.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <h3 className="text-warm-charcoal mb-3 font-serif text-base font-bold sm:mb-4 sm:text-lg">
          Duration
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {durations.map((dur) => (
            <label key={dur.id} className="group flex cursor-pointer items-center gap-2 sm:gap-3">
              <input
                type="radio"
                name="duration"
                value={dur.id}
                checked={duration === dur.id}
                onChange={() => onDurationChange(dur.id)}
                className="accent-primary h-4 w-4"
              />
              <span className="text-warm-charcoal/70 group-hover:text-primary text-sm transition sm:text-base">
                {dur.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-warm-charcoal mb-3 font-serif text-base font-bold sm:mb-4 sm:text-lg">
          Price Range
        </h3>
        <div className="space-y-3 sm:space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
              className="border-border focus:ring-primary w-20 rounded border px-2 py-2 text-sm focus:ring-2 focus:outline-none sm:w-24 sm:px-3 sm:text-base"
              placeholder="Min"
            />
            <span className="text-warm-charcoal/60 text-sm sm:text-base">to</span>
            <input
              type="number"
              max="100000"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
              className="border-border focus:ring-primary w-20 rounded border px-2 py-2 text-sm focus:ring-2 focus:outline-none sm:w-24 sm:px-3 sm:text-base"
              placeholder="Max"
            />
          </div>
          <p className="text-warm-charcoal/60 text-xs sm:text-sm">
            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
