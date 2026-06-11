import { ResourceGridSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-64" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="size-9 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="mt-12">
        <Skeleton className="mb-4 h-4 w-32" />
        <ResourceGridSkeleton count={6} />
      </div>
    </div>
  );
}
