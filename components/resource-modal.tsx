"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { CategoryIcon } from "@/components/category-icon";
import { useClickCounts } from "@/components/click-counts-provider";
import { useContributors } from "@/components/contributors-provider";
import { useFavoriteCounts } from "@/components/favorite-counts-provider";
import { useFavorites } from "@/components/favorites-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Resource } from "@/lib/types";
import { cn, favicon } from "@/lib/utils";
import {
  ArrowUpRight,
  Loader2,
  Star,
  TrendingUp,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Separator } from "./ui/separator";

/** Pill shared with the resource card — accent background, rounded, hover. */
const PILL =
  "inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground transition-colors hover:bg-accent/70";

/**
 * Detail view for a single resource, opened when the card body (not the title
 * link) is clicked. Surfaces everything the compact card truncates: full
 * description, pricing, every category and tag, click count, and meta.
 *
 * Navigation to the resource is funnelled through `onNavigate` (the card's
 * click-tracking) so opening the modal never counts as a click — only the
 * title link and the action button do.
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
  const { has, toggle } = useFavorites();
  const { get } = useClickCounts();
  const { get: getFavorites } = useFavoriteCounts();
  const { register, get: getContributor } = useContributors();
  const { user, openAuth } = useAuth();
  const icon = favicon(resource.url);
  const broken = resource.linkStatus === "broken";
  const fav = has(resource._id);
  const clicks = get(resource._id);
  const favorites = getFavorites(resource._id);

  // Broken-link fix suggestion (account-only, like submit/favorites).
  const [fixOpen, setFixOpen] = useState(false);
  const [fixUrl, setFixUrl] = useState("");
  const [fixPending, setFixPending] = useState(false);

  // Reset the inline fix form whenever the modal closes.
  useEffect(() => {
    if (!open) {
      setFixOpen(false);
      setFixUrl("");
    }
  }, [open]);

  async function submitFix(e: React.FormEvent) {
    e.preventDefault();
    setFixPending(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "fix",
          targetResourceId: resource._id,
          name: resource.name,
          url: fixUrl.trim(),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("modal.fixSuccess"));
      setFixOpen(false);
      setFixUrl("");
    } catch {
      toast.error(t("modal.fixError"));
    } finally {
      setFixPending(false);
    }
  }

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
      <DialogContent
        className={cn(
          "max-h-[85vh] gap-6 overflow-y-auto p-4 sm:max-w-md",
          broken && "ring-destructive/50",
        )}
      >
        {/* Header — icon top-aligned so long, wrapping names read naturally */}
        <DialogHeader className="flex-row items-start gap-3.5 pr-6 items-center">
          <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-muted/50">
            {icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={icon} alt="" className="size-6" loading="lazy" />
            ) : null}
          </span>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base leading-snug">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                onAuxClick={onNavigate}
                className="hover:underline"
              >
                {resource.name}
                <ArrowUpRight className="ml-1 inline size-3.5 shrink-0 align-baseline opacity-60" />
              </a>
            </DialogTitle>
            {resource.author && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {t("card.by", { author: resource.author })}
              </p>
            )}
          </div>
        </DialogHeader>

        {/* Status / language / pricing badges */}
        <div className="-mt-2 flex flex-wrap items-center gap-2">
          {broken && (
            <Badge variant="destructive" className="gap-1">
              <TriangleAlert className="size-3" /> {t("card.broken")}
            </Badge>
          )}
          {resource.language?.includes("tr") && (
            <Badge variant="outline">TR</Badge>
          )}
          {resource.pricing && (
            <Badge
              variant={resource.pricing === "free" ? "outline" : "secondary"}
            >
              {t(`pricing.${resource.pricing}`)}
            </Badge>
          )}
        </div>

        {/* Broken link → let signed-in users suggest a corrected URL. */}
        {broken && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            {!fixOpen ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  {t("modal.fixPrompt")}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => (user ? setFixOpen(true) : openAuth())}
                >
                  <Wrench className="size-3.5" />
                  {t("modal.fixCta")}
                </Button>
              </div>
            ) : (
              <form onSubmit={submitFix} className="space-y-2">
                <label className="block text-xs font-medium text-foreground">
                  {t("modal.fixLabel")}
                </label>
                <Input
                  type="url"
                  required
                  autoFocus
                  value={fixUrl}
                  onChange={(e) => setFixUrl(e.target.value)}
                  placeholder="https://…"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setFixOpen(false)}
                  >
                    {t("submissions.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={fixPending}
                    className="flex-1"
                  >
                    {fixPending && <Loader2 className="size-4 animate-spin" />}
                    {t("modal.fixSubmit")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {resource.description || t("modal.noDescription")}
        </p>

        {/* Categories */}
        {resource.categories?.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("modal.categories")}
            </p>
            <div className="flex flex-wrap gap-2">
              {resource.categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  onClick={() => onOpenChange(false)}
                  className={PILL}
                >
                  <CategoryIcon className="size-3.5" />
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("modal.tags")}
            </p>
            <div className="flex flex-wrap gap-2">
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

        <div className="flex flex-col gap-y-4">
          <Separator />

          {/* Meta: click count, favorite count, added date, contributor */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {favorites >= 1 && (
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5" />
                {favorites}
              </span>
            )}
            {clicks >= 1 && (
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="size-3.5" />
                {clicks}
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

          {/* Actions — favorite toggle + open, no footer bar */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => {
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
            >
              <Star className={cn(fav && "fill-primary text-primary")} />
            </Button>
            <Button asChild className="flex-1">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
