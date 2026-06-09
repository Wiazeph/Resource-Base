import { Skeleton } from "@/components/ui/skeleton";
import { ResourceGridSkeleton } from "@/components/skeletons";

/** Mirrors FavoritesClient: icon + title, then a grid of saved resources. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Skeleton className="size-6 rounded-md" />
        <Skeleton className="h-8 w-40" />
      </div>
      <ResourceGridSkeleton count={6} />
    </div>
  );
}
