"use client";

import Link from "next/link";
import { ArrowUpRight, Star, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites";
import type { Resource } from "@/lib/types";

/** Favicon via Google's service — zero-config thumbnails for any URL. */
function favicon(url: string) {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return undefined;
  }
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const { has, toggle } = useFavorites();
  const fav = has(resource._id);
  const icon = favicon(resource.url);
  const broken = resource.linkStatus === "broken";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md",
        broken && "opacity-70",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-muted/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {icon ? (
            <img src={icon} alt="" className="size-5" loading="lazy" />
          ) : null}
        </span>

        <div className="min-w-0 flex-1">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium leading-tight after:absolute after:inset-0"
          >
            <span className="truncate">{resource.name}</span>
            <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
          </a>
          {resource.author && (
            <p className="truncate text-xs text-muted-foreground">
              by {resource.author}
            </p>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(resource._id);
          }}
          aria-label={fav ? "Remove favorite" : "Add favorite"}
          className="relative z-10 -m-1 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Star
            className={cn("size-4", fav && "fill-primary text-primary")}
          />
        </button>
      </div>

      {resource.description && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {resource.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {broken && (
          <Badge variant="destructive" className="gap-1">
            <TriangleAlert className="size-3" /> broken
          </Badge>
        )}
        {resource.language?.includes("tr") && (
          <Badge variant="outline" className="text-[10px]">
            TR
          </Badge>
        )}
        {resource.pricing && resource.pricing !== "free" && (
          <Badge variant="secondary" className="text-[10px] capitalize">
            {resource.pricing === "freemium" ? "free option" : resource.pricing}
          </Badge>
        )}
        {resource.tags?.slice(0, 3).map((t) => (
          <Link
            key={t._id}
            href={`/tag/${t.slug}`}
            className="relative z-10 rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-foreground transition-colors hover:bg-accent/70"
          >
            {t.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
