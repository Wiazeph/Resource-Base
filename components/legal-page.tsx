"use client";

import { useTranslation } from "react-i18next";
import { getLegalDoc } from "@/lib/legal";

/** Renders the localized Privacy / Terms document. */
export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const { t, i18n } = useTranslation();
  const doc = getLegalDoc(kind, i18n.language);
  const updated = new Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(doc.updated));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("legal.updated", { date: updated })}
      </p>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        {doc.intro}
      </p>

      <div className="mt-8 space-y-8">
        {doc.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-semibold tracking-tight">
              {s.heading}
            </h2>
            <div className="mt-2 space-y-2">
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
