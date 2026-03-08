import { Skeleton } from '@/components/ui/skeleton';

export function CarouselSkeleton() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-4 w-32" />
          <Skeleton className="mx-auto mt-2 h-10 w-64" />
          <Skeleton className="mx-auto mt-4 h-6 w-96" />
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="grid items-center gap-8 py-8 md:grid-cols-2">
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="space-y-6">
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-10 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
