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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="size-5" />
          </span>
          <span className="hidden sm:inline">Resource Base</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openSearch}
            className="group flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <Search className="size-4" />
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
  );
}
