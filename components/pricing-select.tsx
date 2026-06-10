"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Pricing } from "@/lib/types";

/**
 * Pricing chooser as toggle chips (not a dropdown), with the project's
 * combination rules:
 *   - "Free" is standalone — picking it clears the others.
 *   - "Free option" (freemium tier) and "Paid" can be combined.
 *   - "Free option" alone, or "Free option" + "Paid", both mean `freemium`
 *     (a product with a free tier and a paid tier).
 *
 * The three chips are presentational; the resolved single enum value is written
 * to a hidden input named `pricing`, so form submission stays unchanged.
 */
export function PricingSelect({ defaultValue }: { defaultValue?: Pricing }) {
  const { t } = useTranslation();
  // Seed the chips from the stored enum.
  const [free, setFree] = useState(defaultValue === "free");
  const [option, setOption] = useState(defaultValue === "freemium");
  const [paid, setPaid] = useState(defaultValue === "paid");

  // Resolve chips → the single enum the backend stores.
  const value: Pricing | "" = free
    ? "free"
    : option
      ? "freemium" // "free option" (with or without paid) = freemium
      : paid
        ? "paid"
        : "";

  const chips: {
    key: "free" | "option" | "paid";
    label: string;
    active: boolean;
    disabled: boolean;
    onToggle: () => void;
  }[] = [
    {
      key: "free",
      label: t("pricing.free"),
      active: free,
      // Free is mutually exclusive with the combinable pair.
      disabled: option || paid,
      onToggle: () => {
        setFree((v) => !v);
        setOption(false);
        setPaid(false);
      },
    },
    {
      key: "option",
      label: t("pricing.freemium"),
      active: option,
      disabled: free,
      onToggle: () => {
        setOption((v) => !v);
        setFree(false);
      },
    },
    {
      key: "paid",
      label: t("pricing.paid"),
      active: paid,
      disabled: free,
      onToggle: () => {
        setPaid((v) => !v);
        setFree(false);
      },
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
