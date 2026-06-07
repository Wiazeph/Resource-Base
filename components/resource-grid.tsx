import { ResourceCard } from "@/components/resource-card";
import type { Resource } from "@/lib/types";

export function ResourceGrid({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No resources here yet.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((r) => (
        <ResourceCard key={r._id} resource={r} />
      ))}
    </div>
  );
}
