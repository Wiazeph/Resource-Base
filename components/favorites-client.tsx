"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { ResourceGrid } from "@/components/resource-grid";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites";
import type { Resource } from "@/lib/types";

export function FavoritesClient({ resources }: { resources: Resource[] }) {
  const { ids } = useFavorites();
  const favorites = resources.filter((r) => ids.includes(r._id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Star className="size-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Your favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t saved any resources yet.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Browse resources</Link>
          </Button>
        </div>
      ) : (
        <ResourceGrid resources={favorites} />
      )}
    </div>
  );
}
