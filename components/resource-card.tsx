"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Star, TrendingUp, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFavorites } from "@/lib/favorites";
import { useClickCounts } from "@/components/click-counts-provider";
import { useContributors } from "@/components/contributors-provider";
import { useAuth } from "@/components/auth/auth-provider";
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
  const { t } = useTranslation();
  const { has, toggle } = useFavorites();
  const { get, bump } = useClickCounts();
  const { register, get: getContributor } = useContributors();
  const { user, openAuth } = useAuth();
  const counted = useRef(false);
  const fav = has(resource._id);
  const icon = favicon(resource.url);
  const broken = resource.linkStatus === "broken";
  const clicks = get(resource._id);

  // Resolve the contributor (if a community member submitted this).
  useEffect(() => {
    if (resource.submittedBy) register(resource.submittedBy);
  }, [resource.submittedBy, register]);
  const contributor = resource.submittedBy
    ? getContributor(resource.submittedBy)
    : undefined;

  // Fire-and-forget click increment via our API (server-side IP debounce
  // guards against repeat/refresh spam). The link opens in a new tab, so
  // there's no navigation race — we don't preventDefault.
  function registerClick() {
    if (counted.current) return;
    counted.current = true;
    bump(resource._id);
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId: resource._id }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <div
      className={cn(
        "card-hover group relative flex flex-col rounded-xl border border-border bg-card p-4",
        broken && "opacity-70",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-muted/50 transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
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
            onClick={registerClick}
            onAuxClick={registerClick}
            className="flex items-center gap-1 font-medium leading-tight after:absolute after:inset-0"
          >
            <span className="truncate">{resource.name}</span>
            <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
          </a>
          {resource.author && (
            <p className="truncate text-xs text-muted-foreground">
              {t("card.by", { author: resource.author })}
            </p>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Favorites are account-only — prompt sign-in for guests.
            if (!user) {
              openAuth();
              return;
            }
            toggle(resource._id);
          }}
          aria-label={
            !user
              ? t("card.signInToSave")
              : fav
                ? t("card.removeFavorite")
                : t("card.addFavorite")
          }
          className="relative z-10 -m-1 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
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
            <TriangleAlert className="size-3" /> {t("card.broken")}
          </Badge>
        )}
        {resource.language?.includes("tr") && (
          <Badge variant="outline" className="text-[10px]">
            TR
          </Badge>
        )}
        {resource.pricing && resource.pricing !== "free" && (
          <Badge variant="secondary" className="text-[10px]">
            {t(`pricing.${resource.pricing}`)}
          </Badge>
        )}
        {resource.tags?.slice(0, 3).map((tag) => (
          <Link
            key={tag._id}
            href={`/tag/${tag.slug}`}
            className="relative z-10 rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-foreground transition-colors hover:bg-accent/70"
          >
            {tag.title}
          </Link>
        ))}
        {clicks >= 1 && (
          <span className="ml-auto inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
            <TrendingUp className="size-3" />
            {clicks}
          </span>
        )}
      </div>

      {contributor && (
        <Link
          href={`/profile/${contributor.username}`}
          className="relative z-10 mt-3 inline-flex w-fit items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {contributor.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={contributor.avatar_url}
              alt=""
              className="size-4 rounded-full object-cover"
            />
          ) : null}
          {t("card.addedBy", { username: contributor.username })}
        </Link>
      )}
    </div>
  );
}
