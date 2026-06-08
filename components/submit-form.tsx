"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/auth-provider";
import type { Category } from "@/lib/types";

const OTHER = "__other__";

export function SubmitForm({ categories }: { categories: Category[] }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [pending, setPending] = useState(false);
  const [categoryChoice, setCategoryChoice] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    // Honeypot: bots fill hidden fields.
    if (data.company) return;

    // "Other" → use the free-text category the user typed.
    const suggestedCategory =
      data.categoryChoice === OTHER
        ? (data.customCategory ?? "").trim()
        : (data.categoryChoice ?? "");

    setPending(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Attach the signed-in user's id + email so we can notify them on approval.
        body: JSON.stringify({
          name: data.name,
          url: data.url,
          suggestedCategory,
          note: data.note,
          userId: user?.id ?? null,
          email: data.email || user?.email || "",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("submit.success"));
      form.reset();
      setCategoryChoice("");
    } catch {
      toast.error(t("submit.error"));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("submit.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("submit.subtitle")}</p>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          {t("submit.name")} *
        </label>
        <Input name="name" required placeholder="e.g. Tailwind CSS" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          {t("submit.url")} *
        </label>
        <Input name="url" type="url" required placeholder="https://…" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          {t("submit.category")}
        </label>
        <select
          name="categoryChoice"
          value={categoryChoice}
          onChange={(e) => setCategoryChoice(e.target.value)}
          className="h-9 w-full cursor-pointer rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="">{t("submit.selectCategory")}</option>
          {categories
            .filter((c) => !c.parentSlug)
            .map((c) => (
              <option key={c._id} value={c.title}>
                {c.title}
              </option>
            ))}
          <option value={OTHER}>{t("submit.otherCategory")}</option>
        </select>
        {categoryChoice === OTHER && (
          <Input
            name="customCategory"
            className="mt-2"
            required
            maxLength={60}
            placeholder={t("submit.customCategoryPlaceholder")}
            autoFocus
          />
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          {t("submit.note")}
        </label>
        <Textarea
          name="note"
          rows={3}
          placeholder={t("submit.notePlaceholder")}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          {t("submit.email")}
        </label>
        <Input name="email" type="email" placeholder="you@example.com" />
      </div>

      {/* Honeypot — hidden from humans, catches bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {t("submit.submit")}
      </Button>
    </form>
  );
}
