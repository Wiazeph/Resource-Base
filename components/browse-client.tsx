"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResourceCard } from "@/components/resource-card";
import { cn } from "@/lib/utils";
import type { Category, Resource, Tag } from "@/lib/types";

type Sort = "featured" | "name" | "recent";

const PRICING = [
  { value: "free", label: "Free" },
  { value: "freemium", label: "Free option" },
  { value: "paid", label: "Paid" },
];
const LANGS = [
  { value: "en", label: "English" },
  { value: "tr", label: "Turkish" },
];

export function BrowseClient({
  resources,
  categories,
  tags,
}: {
  resources: Resource[];
  categories: Category[];
  tags: Tag[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState(params.get("category") ?? "");
  const [activeTags, setActiveTags] = useState<string[]>(
    params.get("tags")?.split(",").filter(Boolean) ?? [],
  );
  const [lang, setLang] = useState(params.get("lang") ?? "");
  const [pricing, setPricing] = useState(params.get("pricing") ?? "");
  const [sort, setSort] = useState<Sort>(
    (params.get("sort") as Sort) ?? "featured",
  );
  const [showFilters, setShowFilters] = useState(false);

  // Keep the URL in sync so filtered views are shareable.
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (cat) sp.set("category", cat);
    if (activeTags.length) sp.set("tags", activeTags.join(","));
    if (lang) sp.set("lang", lang);
    if (pricing) sp.set("pricing", pricing);
    if (sort !== "featured") sp.set("sort", sort);
    const qs = sp.toString();
    router.replace(qs ? `/browse?${qs}` : "/browse", { scroll: false });
  }, [q, cat, activeTags, lang, pricing, sort, router]);

  const fuse = useMemo(
    () =>
      new Fuse(resources, {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "tags.title", weight: 0.25 },
          { name: "categories.title", weight: 0.15 },
          { name: "description", weight: 0.07 },
          { name: "author", weight: 0.03 },
        ],
        threshold: 0.38,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [resources],
  );

  const filtered = useMemo(() => {
    let list = q.trim() ? fuse.search(q).map((r) => r.item) : [...resources];

    if (cat)
      list = list.filter((r) => r.categories?.some((c) => c.slug === cat));
    if (activeTags.length)
      list = list.filter((r) =>
        activeTags.every((t) => r.tags?.some((rt) => rt.slug === t)),
      );
    if (lang) list = list.filter((r) => r.language?.includes(lang));
    if (pricing) list = list.filter((r) => (r.pricing ?? "free") === pricing);

    if (!q.trim()) {
      if (sort === "name")
        list.sort((a, b) => a.name.localeCompare(b.name));
      else if (sort === "recent")
        list.sort((a, b) =>
          (b.addedAt ?? "").localeCompare(a.addedAt ?? ""),
        );
      else
        list.sort(
          (a, b) => Number(b.featured ?? 0) - Number(a.featured ?? 0),
        );
    }
    return list;
  }, [q, cat, activeTags, lang, pricing, sort, fuse, resources]);

  const topCategories = categories
    .filter((c) => !c.parentSlug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const subCategories = categories.filter((c) => c.parentSlug);
  const popularTags = [...tags]
    .sort((a, b) => b.count - a.count)
    .slice(0, 24);

  const hasFilters =
    cat || activeTags.length || lang || pricing || q.trim();

  const reset = () => {
    setQ("");
    setCat("");
    setActiveTags([]);
    setLang("");
    setPricing("");
    setSort("featured");
  };

  const toggleTag = (slug: string) =>
    setActiveTags((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug],
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Browse resources</h1>
        <p className="mt-1 text-muted-foreground">
          {resources.length} resources across {topCategories.length} categories.
        </p>
      </div>

      {/* Search + sort bar */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, tag, description…"
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters((s) => !s)}
            className={cn(showFilters && "border-primary text-primary")}
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-md border border-border bg-background px-3 text-sm"
            aria-label="Sort"
          >
            <option value="featured">Featured</option>
            <option value="name">Name A→Z</option>
            <option value="recent">Recently added</option>
          </select>
        </div>

        {showFilters && (
          <div className="mt-3 space-y-3 rounded-lg border border-border bg-card p-4">
            <Facet
              label="Category"
              options={[
                ...topCategories.map((c) => ({ value: c.slug, label: c.title })),
                ...subCategories.map((c) => ({
                  value: c.slug,
                  label: `↳ ${c.title}`,
                })),
              ]}
              value={cat}
              onChange={(v) => setCat(v === cat ? "" : v)}
            />
            <Facet
              label="Pricing"
              options={PRICING}
              value={pricing}
              onChange={(v) => setPricing(v === pricing ? "" : v)}
            />
            <Facet
              label="Language"
              options={LANGS}
              value={lang}
              onChange={(v) => setLang(v === lang ? "" : v)}
            />
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map((t) => (
                  <button
                    key={t._id}
                    onClick={() => toggleTag(t.slug)}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                      activeTags.includes(t.slug)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted",
                    )}
                  >
                    {t.title}
                    <span className="ml-1 opacity-60">{t.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {hasFilters && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{filtered.length} results</span>
            <Button variant="ghost" size="sm" onClick={reset} className="h-7">
              <X className="size-3.5" /> Clear
            </Button>
            {activeTags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleTag(t)}
              >
                {tags.find((x) => x.slug === t)?.title ?? t} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No resources match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r._id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function Facet({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
              value === o.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
