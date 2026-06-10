"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaxonomy } from "@/components/taxonomy-provider";
import { cn } from "@/lib/utils";
import type { Resource } from "@/lib/types";

/**
 * One selectable taxonomy value: either an existing doc (carries its slug +
 * title) or a free-text entry the user typed (slug === title === the text).
 */
type Picked = { slug: string; title: string };

/**
 * Inline editor for proposing a resource's categories/tags. Users start from
 * the resource's current values, add from existing options (searchable) or
 * type new ones, then submit as a `taxonomy` fix that an editor reviews.
 */
export function TaxonomyFixEditor({
  resource,
  onCancel,
  onDone,
}: {
  resource: Resource;
  onCancel: () => void;
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const { categories, tags } = useTaxonomy();
  const [pending, setPending] = useState(false);

  // Snapshot the resource's current taxonomy to detect "no change".
  const initialCats = useMemo(
    () => (resource.categories ?? []).map((c) => ({ slug: c.slug, title: c.title })),
    [resource.categories],
  );
  const initialTags = useMemo(
    () => (resource.tags ?? []).map((tg) => ({ slug: tg.slug, title: tg.title })),
    [resource.tags],
  );
  const [cats, setCats] = useState<Picked[]>(initialCats);
  const [tagList, setTagList] = useState<Picked[]>(initialTags);
  // Uncommitted input text — the user must add (+) or clear it before submitting.
  const [catQuery, setCatQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const hasPendingText = !!catQuery.trim() || !!tagQuery.trim();

  // Order-independent comparison of slug sets.
  const sameSet = (a: Picked[], b: Picked[]) => {
    if (a.length !== b.length) return false;
    const bs = new Set(b.map((p) => p.slug));
    return a.every((p) => bs.has(p.slug));
  };
  const dirty =
    !sameSet(cats, initialCats) || !sameSet(tagList, initialTags);

  async function submit() {
    if (!dirty) return;
    if (!cats.length && !tagList.length) {
      toast.error(t("taxonomy.atLeastOne"));
      return;
    }
    if (hasPendingText) {
      toast.error(t("taxonomy.pendingText"));
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "taxonomy",
          targetResourceId: resource._id,
          name: resource.name,
          // Send slugs for existing, raw title for free-text — the webhook
          // resolves either against slug or title on approval.
          proposedCategories: cats.map((c) => c.slug),
          proposedTags: tagList.map((tg) => tg.slug),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("taxonomy.success"));
      onDone();
    } catch {
      toast.error(t("taxonomy.error"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-3">
      <TokenField
        label={t("modal.categories")}
        picked={cats}
        onChange={setCats}
        query={catQuery}
        onQueryChange={setCatQuery}
        options={categories.map((c) => ({ slug: c.slug, title: c.title }))}
        placeholder={t("taxonomy.addCategory")}
      />
      <TokenField
        label={t("modal.tags")}
        picked={tagList}
        onChange={setTagList}
        query={tagQuery}
        onQueryChange={setTagQuery}
        options={tags.map((tg) => ({ slug: tg.slug, title: tg.title }))}
        placeholder={t("taxonomy.addTag")}
      />
      {hasPendingText && (
        <p className="text-xs text-destructive">{t("taxonomy.pendingText")}</p>
      )}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onCancel}
        >
          {t("submissions.cancel")}
        </Button>
        <Button
          type="button"
          size="sm"
          className="flex-1"
          disabled={pending || hasPendingText || !dirty}
          onClick={submit}
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("taxonomy.submit")}
        </Button>
      </div>
    </div>
  );
}

/** A label + chips of picked values + a searchable add input with suggestions. */
function TokenField({
  label,
  picked,
  onChange,
  query,
  onQueryChange,
  options,
  placeholder,
}: {
  label: string;
  picked: Picked[];
  onChange: (next: Picked[]) => void;
  query: string;
  onQueryChange: (q: string) => void;
  options: Picked[];
  placeholder: string;
}) {
  const setQuery = onQueryChange;

  const pickedSlugs = new Set(picked.map((p) => p.slug));
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return options
      .filter(
        (o) => !pickedSlugs.has(o.slug) && o.title.toLowerCase().includes(q),
      )
      .slice(0, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, options, picked]);

  const add = (p: Picked) => {
    if (pickedSlugs.has(p.slug)) return;
    onChange([...picked, p]);
    setQuery("");
  };

  // Turn free text into a slug-ish token (matches Sanity slugs well enough for
  // the webhook's slug-or-title resolution).
  const addFreeText = () => {
    const title = query.trim();
    if (!title) return;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!slug || pickedSlugs.has(slug)) {
      setQuery("");
      return;
    }
    add({ slug, title });
  };

  const remove = (slug: string) =>
    onChange(picked.filter((p) => p.slug !== slug));

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {picked.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {picked.map((p) => (
            <span
              key={p.slug}
              className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground"
            >
              {p.title}
              <button
                type="button"
                aria-label="remove"
                onClick={() => remove(p.slug)}
                className="cursor-pointer rounded-full text-accent-foreground/60 transition-colors hover:text-accent-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (suggestions[0]) add(suggestions[0]);
              else addFreeText();
            }
          }}
          placeholder={placeholder}
          className="h-9"
        />
        {query.trim() && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-md">
            {suggestions.map((o) => (
              <button
                key={o.slug}
                type="button"
                onClick={() => add(o)}
                className="block w-full cursor-pointer px-3 py-1.5 text-left text-sm hover:bg-muted"
              >
                {o.title}
              </button>
            ))}
            <button
              type="button"
              onClick={addFreeText}
              className={cn(
                "flex w-full cursor-pointer items-center gap-1.5 px-3 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted",
                suggestions.length > 0 && "border-t border-border",
              )}
            >
              <Plus className="size-3.5" />“{query.trim()}”
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
