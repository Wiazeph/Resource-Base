"use client";

import { Boxes, CircleDot, Globe, Heart, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const REPO_URL = "https://github.com/Wiazeph/Resource-Base";
const ISSUES_URL = "https://github.com/Wiazeph/Resource-Base/issues";
const SITE_URL = "https://emreerden.dev";
const SPONSOR_URL = "https://github.com/sponsors/Wiazeph";
const CONTACT_EMAIL = "emreerden@pm.me";

/** Lucide 1.x dropped the GitHub brand mark, so the logo stays inline SVG. */
function GithubIcon() {
  return (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
    </svg>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="text-border">
      •
    </span>
  );
}

const linkClass =
  "inline-flex items-center gap-2 rounded-md px-2 py-1 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="px-4 pb-8 pt-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/40 px-4 py-8 text-sm text-muted-foreground backdrop-blur-sm sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2 text-foreground">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="size-4" />
          </span>
          <span className="font-semibold">Resource Base</span>
        </div>
        <p className="max-w-md text-center text-xs text-muted-foreground/80">
          {t("footer.tagline")}
        </p>

        {/* Row 1 — contact + personal site */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            <Mail className="size-4" aria-hidden="true" />
            <span>{CONTACT_EMAIL}</span>
          </a>
          <Dot />
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <Globe className="size-4" aria-hidden="true" />
            <span>emreerden.dev</span>
          </a>
        </div>

        {/* Row 2 — project links + sponsor */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <GithubIcon />
            <span>{t("footer.source")}</span>
          </a>
          <Dot />
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <CircleDot className="size-4" aria-hidden="true" />
            <span>{t("footer.reportIssue")}</span>
          </a>
          <Dot />
          <a
            href={SPONSOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-medium text-primary outline-none transition-colors hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Heart className="size-4 fill-current" aria-hidden="true" />
            <span>{t("footer.sponsor")}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
