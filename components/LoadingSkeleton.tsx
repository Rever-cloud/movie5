"use client";

export function SkeletonCard() {
  return (
    <div className="animate-pulse" aria-label="Loading content" role="status">
      <div className="aspect-[2/3] rounded-lg shimmer mb-2" />
      <div className="h-4 shimmer rounded w-3/4 mb-1" />
      <div className="h-3 shimmer rounded w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="space-y-4" aria-label="Loading row" role="status">
      <div className="h-6 shimmer rounded w-48" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[180px]">
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative w-full h-[80vh] shimmer" aria-label="Loading hero" role="status">
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
        <div className="h-10 shimmer rounded w-96" />
        <div className="h-4 shimmer rounded w-2/3" />
        <div className="h-4 shimmer rounded w-1/3" />
        <div className="flex gap-3 mt-4">
          <div className="h-12 shimmer rounded w-36" />
          <div className="h-12 shimmer rounded w-44" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" aria-label="Loading grid" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
