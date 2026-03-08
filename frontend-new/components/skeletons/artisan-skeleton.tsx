import { Skeleton } from '@/components/ui/skeleton';

export function ArtisanSkeleton() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-4 w-32" />
          <Skeleton className="mx-auto mt-2 h-10 w-48" />
          <Skeleton className="mx-auto mt-4 h-6 w-96" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-light">
              <Skeleton className="mb-4 h-64 w-full rounded-lg" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="mt-2 h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-16 w-full" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
