import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors ProfileEditForm: title then labelled fields (bio is taller). */
export default function Loading() {
  // Field index 2 is the bio textarea (rows={3}); the rest are single inputs.
  return (
    <div className="mx-auto max-w-2xl">
      <Skeleton className="mb-4 h-9 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton
              className={`w-full rounded-md ${i === 2 ? "h-20" : "h-9"}`}
            />
          </div>
        ))}
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}
