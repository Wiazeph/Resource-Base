"use client";

import Link from "next/link";
import { Boxes, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { OPEN_COMMAND_EVENT } from "@/components/command-palette";
import { UserMenu } from "@/components/auth/user-menu";

function openSearch() {
  window.dispatchEvent(new Event(OPEN_COMMAND_EVENT));
}

export function SiteHeader() {
  const { t } = useTranslation();
  return (
    <>
      {/* Opaque strip masking content that scrolls beneath the floating header. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-20 bg-background" />
      <header className="sticky top-3 z-40 px-3">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 rounded-2xl border border-border/70 bg-background/95 px-3 shadow-lg shadow-black/5 ring-1 ring-black/[0.03] backdrop-blur-xl supports-[backdrop-filter]:bg-background/85 sm:px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
            <Boxes className="size-5" />
          </span>
          <span className="hidden sm:inline">Resource Base</span>
        </Link>

        <nav className="ml-2 hidden md:flex">
          <Link
            href="/categories"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.categories")}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openSearch}
            className="group flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground"
          >
            <Search className="size-4 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">{t("header.searchPlaceholder")}</span>
            <kbd className="ml-2 hidden rounded border border-border bg-background px-1.5 font-mono text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>

          <LanguageToggle />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
      </header>
    </>
  );
}
