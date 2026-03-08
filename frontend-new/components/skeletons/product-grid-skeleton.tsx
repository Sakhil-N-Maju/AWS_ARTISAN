/**
 * Loading skeleton for ProductGrid component
 */

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card-light animate-pulse">
          {/* Image skeleton */}
          <div className="bg-warm-sand mb-4 h-64 rounded-lg" />
          
          {/* Content skeleton */}
          <div className="space-y-3">
            {/* Artisan name */}
            <div className="bg-warm-sand h-3 w-24 rounded" />
            
            {/* Product title */}
            <div className="bg-warm-sand h-5 w-3/4 rounded" />
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="bg-warm-sand h-4 w-20 rounded" />
              <div className="bg-warm-sand h-4 w-12 rounded" />
            </div>
            
            {/* Price */}
            <div className="bg-warm-sand h-6 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
