import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export default function Loading() {
  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={false} />

      {/* Hero Banner Skeleton */}
      <section className="from-secondary/15 to-primary/15 relative overflow-hidden bg-gradient-to-br pt-20 pb-10 sm:pb-12 md:h-80">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-warm-charcoal/20 h-12 w-3/4 animate-pulse rounded-lg" />
            <div className="bg-warm-charcoal/20 h-6 w-full max-w-3xl animate-pulse rounded-lg" />
            <div className="bg-warm-charcoal/20 h-6 w-2/3 animate-pulse rounded-lg" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Stats Skeleton */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-border rounded-lg border bg-white p-5 shadow-sm sm:p-6">
              <div className="bg-warm-charcoal/20 mb-2 h-8 w-24 animate-pulse rounded" />
              <div className="bg-warm-charcoal/20 h-4 w-32 animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Search & Filters Skeleton */}
        <div className="mb-8 space-y-4 sm:mb-12">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="bg-warm-charcoal/20 h-12 flex-1 animate-pulse rounded-lg" />
            <div className="bg-warm-charcoal/20 h-12 w-32 animate-pulse rounded-lg" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="bg-warm-charcoal/20 h-12 flex-1 animate-pulse rounded-lg" />
            <div className="bg-warm-charcoal/20 h-12 flex-1 animate-pulse rounded-lg" />
          </div>
        </div>

        {/* Artisan Cards Skeleton */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border-border rounded-2xl border bg-white p-6 shadow-sm">
              <div className="bg-warm-charcoal/20 mb-4 h-48 w-full animate-pulse rounded-xl" />
              <div className="bg-warm-charcoal/20 mb-2 h-6 w-3/4 animate-pulse rounded" />
              <div className="bg-warm-charcoal/20 mb-4 h-4 w-1/2 animate-pulse rounded" />
              <div className="bg-warm-charcoal/20 h-16 w-full animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
