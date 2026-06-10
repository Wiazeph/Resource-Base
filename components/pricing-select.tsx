"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Pricing } from "@/lib/types";

/**
 * Pricing chooser as toggle chips (not a dropdown). The whole selection is one
 * enum value (free | freemium | paid); the chips are just how it's expressed:
 *   - "Free" is standalone.
 *   - "Free option" means `freemium` — a free tier AND a paid tier — so picking
 *     it lights up both "Free option" and "Paid" automatically.
 *   - "Paid" alone is `paid`; adding "Free option" to it makes `freemium`.
 *
 * The resolved enum is written to a hidden input named `pricing`, so form
 * submission stays unchanged. `value`/`onChange` make it controllable (the
 * submit form clears it after a successful submit).
 */
export function PricingSelect({
  defaultValue,
  value: controlled,
  onChange,
}: {
  defaultValue?: Pricing;
  value?: Pricing | "";
  onChange?: (v: Pricing | "") => void;
}) {
  const { t } = useTranslation();
  const [internal, setInternal] = useState<Pricing | "">(defaultValue ?? "");
  const value = controlled ?? internal;

  const set = (next: Pricing | "") => {
    if (onChange) onChange(next);
    else setInternal(next);
  };

  const isFree = value === "free";
  const isFreemium = value === "freemium";
  const isPaid = value === "paid";

  const chips: {
    key: string;
    label: string;
    active: boolean;
    disabled: boolean;
    onToggle: () => void;
  }[] = [
    {
      key: "free",
      label: t("pricing.free"),
      active: isFree,
      // Free is standalone — unavailable once a paid-side option is chosen.
      disabled: isFreemium || isPaid,
      onToggle: () => set(isFree ? "" : "free"),
    },
    {
      key: "freemium",
      label: t("pricing.freemium"),
      // Freemium implies a paid tier, so this lights up whenever value=freemium.
      active: isFreemium,
      disabled: isFree,
      // Picking "free option" = freemium (paid auto-included); toggling it off
      // when already freemium drops the free tier back to plain paid.
      onToggle: () => set(isFreemium ? "paid" : "freemium"),
    },
    {
      key: "paid",
      label: t("pricing.paid"),
      // Active for plain paid AND freemium (freemium has a paid tier).
      active: isPaid || isFreemium,
      disabled: isFree,
      onToggle: () => set(isPaid || isFreemium ? "" : "paid"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <input type="hidden" name="pricing" value={value} />
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          aria-pressed={c.active}
          disabled={c.disabled}
          onClick={c.onToggle}
          className={cn(
            "cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors",
            c.active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background hover:bg-muted",
            c.disabled && "cursor-not-allowed opacity-40 hover:bg-background",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
