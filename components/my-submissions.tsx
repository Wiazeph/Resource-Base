"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, Loader2, PencilLine, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubmissions } from "@/lib/submissions";
import { cn, favicon } from "@/lib/utils";
import type { Category, Submission, SubmissionStatus } from "@/lib/types";

const OTHER = "__other__";

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "border-destructive/30 bg-destructive/10 text-destructive",
};

const STATUS_ICON: Record<SubmissionStatus, typeof Clock> = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};

/**
 * Owner-only list of the user's submissions with live moderation status.
 * Rejected items surface the editor's reason and an "edit & resubmit" modal
 * that patches the same Sanity doc back to pending (via /api/submit).
 */
export function MySubmissions({ categories }: { categories: Category[] }) {
  const { t } = useTranslation();
  const { items, loading, reload } = useSubmissions();
  const [editing, setEditing] = useState<Submission | null>(null);

  if (loading) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <Loader2 className="mx-auto size-5 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        {t("submissions.empty")}
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => {
          const Icon = STATUS_ICON[s.status];
          const icon = s.url ? favicon(s.url) : undefined;
          return (
            <div
              key={s.id}
              className="flex flex-col rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-muted/50">
                  {icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={icon} alt="" className="size-5" loading="lazy" />
                  ) : null}
                </span>
                <a
                  href={s.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate font-medium leading-tight hover:underline"
                >
                  {s.name}
                </a>
                <Badge
                  variant="outline"
                  className={cn("gap-1 shrink-0", STATUS_STYLE[s.status])}
                >
                  <Icon className="size-3" />
                  {t(`submissions.status.${s.status}`)}
                </Badge>
              </div>

              {s.status === "rejected" && (
                <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <p className="text-sm text-muted-foreground">
                    {s.rejection_reason ? (
                      <>
                        <span className="font-medium text-foreground">
                          {t("submissions.reasonLabel")}:{" "}
                        </span>
                        {s.rejection_reason}
                      </>
                    ) : (
                      t("submissions.noReason")
                    )}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => setEditing(s)}
                  >
                    <PencilLine className="size-3.5" />
                    {t("submissions.editResubmit")}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ResubmitDialog
        submission={editing}
        categories={categories}
        onClose={() => setEditing(null)}
        onDone={() => {
          setEditing(null);
          reload();
        }}
      />
    </>
  );
}

function ResubmitDialog({
  submission,
  categories,
  onClose,
  onDone,
}: {
  submission: Submission | null;
  categories: Category[];
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  // Prefill the category select; "Other" when the saved value isn't a known cat.
  const known = categories.some((c) => c.title === submission?.suggested_category);
  const [categoryChoice, setCategoryChoice] = useState("");

  // Reset the controlled select whenever a new submission opens.
  const openId = submission?.id ?? null;
  const [seededFor, setSeededFor] = useState<string | null>(null);
  if (openId && openId !== seededFor) {
    setSeededFor(openId);
    setCategoryChoice(
      submission?.suggested_category
        ? known
          ? submission.suggested_category
          : OTHER
        : "",
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!submission) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const suggestedCategory =
      data.categoryChoice === OTHER
        ? (data.customCategory ?? "").trim()
        : (data.categoryChoice ?? "");

    setPending(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.sanity_submission_id,
          name: data.name,
          url: data.url,
          suggestedCategory,
          note: data.note,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("submissions.resubmitSuccess"));
      onDone();
    } catch {
      toast.error(t("submissions.resubmitError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={!!submission} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] gap-4 overflow-y-auto p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("submissions.editResubmit")}</DialogTitle>
        </DialogHeader>
        {submission && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t("submit.name")} *
              </label>
              <Input
                name="name"
                required
                defaultValue={submission.name ?? ""}
                maxLength={200}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t("submit.url")} *
              </label>
              <Input
                name="url"
                type="url"
                required
                defaultValue={submission.url ?? ""}
              />
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
                  defaultValue={known ? "" : (submission.suggested_category ?? "")}
                  placeholder={t("submit.customCategoryPlaceholder")}
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
                defaultValue={submission.note ?? ""}
                placeholder={t("submit.notePlaceholder")}
              />
            </div>
            <Button type="submit" disabled={pending} className="w-full">
              {pending && <Loader2 className="size-4 animate-spin" />}
              {t("submissions.resubmit")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
