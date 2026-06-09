import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors NotificationsClient: narrow column, icon + title, a list of rows. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Skeleton className="size-6 rounded-md" />
        <Skeleton className="h-8 w-44" />
      </div>
      <ul className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-3 w-14 shrink-0" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
