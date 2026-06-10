"use client";

import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MySubmissions } from "@/components/my-submissions";
import type { Category } from "@/lib/types";

/** Heading + list wrapper for the "My submissions" block on the edit page. */
export function MySubmissionsSection({
  categories,
}: {
  categories: Category[];
}) {
  const { t } = useTranslation();
  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="mb-4 flex items-center gap-2">
        <Send className="size-5 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">
          {t("submissions.title")}
        </h2>
      </div>
      <MySubmissions categories={categories} />
    </section>
  );
}
