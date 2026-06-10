"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type ChipState = "kept" | "added" | "removed";

/**
 * Read-only view of a taxonomy suggestion. Diffs the proposed set against the
 * original (snapshot at submit time) and marks each value:
 *   - added   → primary border + dot
 *   - removed → destructive border + strikethrough (shown even though it's no
 *               longer in the proposed set, so the change is visible)
 *   - kept    → plain accent chip
 * Shared by the resource modal and the profile "my submissions" detail.
 */
export function TaxonomyProposal({
  categoriesLabel,
  tagsLabel,
  proposedCategories,
  proposedTags,
  originalCategories,
  originalTags,
  resolveCategory = (s) => s,
  resolveTag = (s) => s,
}: {
  categoriesLabel: string;
  tagsLabel: string;
  proposedCategories: string[];
  proposedTags: string[];
  originalCategories: string[];
  originalTags: string[];
  resolveCategory?: (slug: string) => string;
  resolveTag?: (slug: string) => string;
}) {
  const { t } = useTranslation();
  // Older submissions (created before we snapshotted the original taxonomy)
  // have no baseline to diff against — show everything as plain "kept".
  const hasBaseline =
    originalCategories.length > 0 || originalTags.length > 0;

  // Build the ordered list of {slug, state} for a section: proposed items
  // first (added/kept), then any removed originals.
  const diff = (proposed: string[], original: string[]) => {
    const prop = new Set(proposed);
    const orig = new Set(original);
    const rows: { slug: string; state: ChipState }[] = proposed.map((s) => ({
      slug: s,
      state: hasBaseline && !orig.has(s) ? "added" : "kept",
    }));
    if (hasBaseline) {
      for (const s of original) {
        if (!prop.has(s)) rows.push({ slug: s, state: "removed" });
      }
    }
    return rows;
  };

  const catRows = diff(proposedCategories, originalCategories);
  const tagRows = diff(proposedTags, originalTags);
  const all = [...catRows, ...tagRows];
  const anyAdded = all.some((r) => r.state === "added");
  const anyRemoved = all.some((r) => r.state === "removed");

  return (
    <div className="flex flex-col gap-3">
      {catRows.length > 0 && (
        <Section label={categoriesLabel}>
          {catRows.map((r) => (
            <Chip key={`c-${r.slug}`} state={r.state}>
              {resolveCategory(r.slug)}
            </Chip>
          ))}
        </Section>
      )}
      {tagRows.length > 0 && (
        <Section label={tagsLabel}>
          {tagRows.map((r) => (
            <Chip key={`t-${r.slug}`} state={r.state}>
              {resolveTag(r.slug)}
            </Chip>
          ))}
        </Section>
      )}
      {(anyAdded || anyRemoved) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {anyAdded && (
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary" />
              {t("taxonomy.newLegend")}
            </span>
          )}
          {anyRemoved && (
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-destructive" />
              {t("taxonomy.removedLegend")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  state,
  children,
}: {
  state: ChipState;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs",
        state === "added" && "border border-primary bg-primary/10 text-foreground",
        state === "removed" &&
          "border border-destructive/50 bg-destructive/10 text-muted-foreground line-through",
        state === "kept" && "bg-accent text-accent-foreground",
      )}
    >
      {state === "added" && <span className="size-1.5 rounded-full bg-primary" />}
      {state === "removed" && (
        <span className="size-1.5 rounded-full bg-destructive" />
      )}
      {children}
    </span>
  );
}
