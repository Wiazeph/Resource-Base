"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/auth-provider";
import type { Category } from "@/lib/types";

export function SubmitForm({ categories }: { categories: Category[] }) {
  const { user } = useAuth();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    // Honeypot: bots fill hidden fields.
    if (data.company) return;

    setPending(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Attach the signed-in user's id + email so we can notify them on approval.
        body: JSON.stringify({
          ...data,
          userId: user?.id ?? null,
          email: data.email || user?.email || "",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Thanks! Your suggestion is in the review queue.");
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Name *</label>
        <Input name="name" required placeholder="e.g. Tailwind CSS" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">URL *</label>
        <Input name="url" type="url" required placeholder="https://…" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Category</label>
        <select
          name="suggestedCategory"
          className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
          defaultValue=""
        >
          <option value="">Select a category…</option>
          {categories
            .filter((c) => !c.parentSlug)
            .map((c) => (
              <option key={c._id} value={c.title}>
                {c.title}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Note</label>
        <Textarea
          name="note"
          rows={3}
          placeholder="Why is this resource great?"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Your email (optional)
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
        Submit resource
      </Button>
    </form>
  );
}
