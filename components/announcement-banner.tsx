"use client";

import { Construction, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Bump this key when you want the banner to re-appear for everyone who
// previously dismissed it (e.g. for a new announcement).
const DISMISS_KEY = "rb:announcement:relaunch-2026-06";

export function AnnouncementBanner() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(localStorage.getItem(DISMISS_KEY) !== "1");
  }, []);

  if (!show) return null;

  return (
    <div className="relative overflow-hidden border-b border-primary/20 bg-primary/10">
      <div className="mx-auto flex max-w-6xl justify-center items-center gap-3 px-4 py-2.5 text-sm">
        <div className="flex flex-col text-foreground/90 items-center">
          <div className="flex items-center gap-x-1 font-medium"><Construction className="size-4 shrink-0 text-primary" /> {t("banner.title")}</div>
          <div className="text-muted-foreground text-center">{t("banner.body")}</div>
        </div>
        <button
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setShow(false);
          }}
          aria-label="Dismiss announcement"
          className="shrink-0 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
