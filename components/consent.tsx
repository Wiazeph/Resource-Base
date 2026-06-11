"use client";

import { Button } from "@/components/ui/button";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const KEY = "analytics-consent"; // "granted" | "denied"

/**
 * Cookie/analytics consent gate. Analytics (Google Analytics + Vercel
 * Analytics) load ONLY after the user accepts; declining sets no analytics
 * scripts or cookies. Choice is persisted in localStorage. Shows a banner
 * until a choice is made. GDPR/KVKK-aligned (opt-in, not opt-out).
 */
export function ConsentGate({ gaId }: { gaId?: string }) {
  const { t } = useTranslation();
  // null = not yet read / undecided
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "granted" || stored === "denied") setConsent(stored);
    setReady(true);
  }, []);

  const choose = (value: "granted" | "denied") => {
    localStorage.setItem(KEY, value);
    setConsent(value);
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Analytics />
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </>
      )}

      {/* Banner: only once the stored choice is read AND none was made. */}
      {ready && consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-border bg-background/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {t("consent.message")}{" "}
              <Link
                href="/privacy"
                className="text-primary underline-offset-2 hover:underline"
              >
                {t("footer.privacy")}
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => choose("denied")}
              >
                {t("consent.decline")}
              </Button>
              <Button size="sm" onClick={() => choose("granted")}>
                {t("consent.accept")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
