import { Skeleton } from "@/components/ui/skeleton";
import { ResourceGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Skeleton className="mb-6 h-4 w-32" />
      <div className="mb-8 flex items-center gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <ResourceGridSkeleton />
    </div>
  );
}
