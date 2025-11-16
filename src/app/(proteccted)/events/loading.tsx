// app/(main)/loading.tsx
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Search and Filter Skeleton */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Search Bar */}
          <div className="h-12 w-full bg-muted rounded-md" />

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-muted rounded-md"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Event Cards Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden rounded-xl border border-border shadow-sm"
            >
              {/* Image placeholder */}
              <div className="aspect-video bg-muted w-full" />

              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />

                {/* Date, Time, Location */}
                <div className="pt-3 space-y-2">
                  <div className="h-4 w-1/2 bg-muted rounded" />
                  <div className="h-4 w-1/3 bg-muted rounded" />
                  <div className="h-4 w-1/4 bg-muted rounded" />
                </div>

                {/* Buttons */}
                <div className="pt-4 flex gap-2">
                  <div className="h-9 flex-1 bg-muted rounded-md" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
