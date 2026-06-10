"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

/**
 * Read-only view of a taxonomy suggestion's proposed categories/tags, with the
 * newly-added ones (not in the original set) visually marked — primary border
 * + a leading dot — so it's obvious what the suggestion actually changes.
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
  const origCats = new Set(originalCategories);
  const origTags = new Set(originalTags);
  const anyNew =
    proposedCategories.some((c) => !origCats.has(c)) ||
    proposedTags.some((tg) => !origTags.has(tg));

  return (
    <div className="flex flex-col gap-3">
      {proposedCategories.length > 0 && (
        <Section label={categoriesLabel}>
          {proposedCategories.map((c) => (
            <Chip key={c} isNew={!origCats.has(c)}>
              {resolveCategory(c)}
            </Chip>
          ))}
        </Section>
      )}
      {proposedTags.length > 0 && (
        <Section label={tagsLabel}>
          {proposedTags.map((tg) => (
            <Chip key={tg} isNew={!origTags.has(tg)}>
              {resolveTag(tg)}
            </Chip>
          ))}
        </Section>
      )}
      {anyNew && (
        <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          {t("taxonomy.newLegend")}
        </p>
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
  isNew,
  children,
}: {
  isNew: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs",
        isNew
          ? "border border-primary bg-primary/10 text-foreground"
          : "bg-accent text-accent-foreground",
      )}
    >
      {isNew && <span className="size-1.5 rounded-full bg-primary" />}
      {children}
    </span>
  );
}
