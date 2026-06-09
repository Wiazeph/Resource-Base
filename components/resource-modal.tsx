"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Star, TrendingUp, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/category-icon";
import { favicon } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useClickCounts } from "@/components/click-counts-provider";
import { useFavoriteCounts } from "@/components/favorite-counts-provider";
import { useContributors } from "@/components/contributors-provider";
import type { Resource } from "@/lib/types";

/** Pill shared with the resource card — accent background, rounded, hover. */
const PILL =
  "inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-foreground transition-colors hover:bg-accent/70";

/**
 * Detail view for a single resource, opened when the card body (not the title
 * link) is clicked. Surfaces everything the compact card truncates: full
 * description, pricing, every category and tag, click count, and meta.
 *
 * Navigation to the resource is funnelled through `onNavigate` (the card's
 * click-tracking) so opening the modal never counts as a click — only the
 * title link and the footer button do.
 */
export function ResourceModal({
  resource,
  open,
  onOpenChange,
  onNavigate,
}: {
  resource: Resource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: () => void;
}) {
  const { t, i18n } = useTranslation();
  const { get } = useClickCounts();
  const { get: getFavorites } = useFavoriteCounts();
  const { register, get: getContributor } = useContributors();
  const icon = favicon(resource.url);
  const broken = resource.linkStatus === "broken";
  const clicks = get(resource._id);
  const favorites = getFavorites(resource._id);

  useEffect(() => {
    if (open && resource.submittedBy) register(resource.submittedBy);
  }, [open, resource.submittedBy, register]);
  const contributor = resource.submittedBy
    ? getContributor(resource.submittedBy)
    : undefined;

  const addedOn = resource.addedAt
    ? new Intl.DateTimeFormat(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(resource.addedAt))
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] gap-3 overflow-y-auto sm:max-w-md">
        <DialogHeader className="flex-row items-start gap-3 pr-6">
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-muted/50">
            {icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={icon} alt="" className="size-5" loading="lazy" />
            ) : null}
          </span>
          <div className="min-w-0 flex-1">
            <DialogTitle>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                onAuxClick={onNavigate}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <span className="truncate">{resource.name}</span>
                <ArrowUpRight className="size-3.5 shrink-0 opacity-60" />
              </a>
            </DialogTitle>
            {resource.author && (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {t("card.by", { author: resource.author })}
              </p>
            )}
          </div>
        </DialogHeader>

        {/* Status / language / pricing badges */}
        <div className="flex flex-wrap items-center gap-1.5">
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
          {resource.pricing && (
            <Badge
              variant={resource.pricing === "free" ? "outline" : "secondary"}
              className="text-[10px]"
            >
              {t(`pricing.${resource.pricing}`)}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {resource.description || t("modal.noDescription")}
        </p>

        {/* Categories */}
        {resource.categories?.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-foreground">
              {t("modal.categories")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {resource.categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  onClick={() => onOpenChange(false)}
                  className={PILL}
                >
                  <CategoryIcon className="size-3" />
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-foreground">
              {t("modal.tags")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/tag/${tag.slug}`}
                  onClick={() => onOpenChange(false)}
                  className={PILL}
                >
                  {tag.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Meta: click count, added date, contributor */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
          {clicks >= 1 && (
            <span className="inline-flex items-center gap-0.5">
              <TrendingUp className="size-3" />
              {clicks}
            </span>
          )}
          {favorites >= 1 && (
            <span className="inline-flex items-center gap-0.5">
              <Star className="size-3" />
              {favorites}
            </span>
          )}
          {addedOn && <span>{t("modal.addedOn", { date: addedOn })}</span>}
          {contributor && (
            <Link
              href={`/profile/${contributor.username}`}
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("modal.close")}</Button>
          </DialogClose>
          <Button asChild>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onNavigate}
              onAuxClick={onNavigate}
            >
              {t("modal.open")}
              <ArrowUpRight />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
