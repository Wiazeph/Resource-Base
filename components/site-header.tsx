"use client";

import Link from "next/link";
import { Boxes, Plus, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { OPEN_COMMAND_EVENT } from "@/components/command-palette";

function openSearch() {
  window.dispatchEvent(new Event(OPEN_COMMAND_EVENT));
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="size-5" />
          </span>
          <span className="hidden sm:inline">Resource Base</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm md:flex">
          <Link
            href="/browse"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse
          </Link>
          <Link
            href="/favorites"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            Favorites
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openSearch}
            className="group flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="ml-2 hidden rounded border border-border bg-background px-1.5 font-mono text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>

          <Button asChild size="sm" variant="ghost" className="hidden sm:flex">
            <Link href="/favorites" aria-label="Favorites">
              <Star className="size-4" />
            </Link>
          </Button>

          <Button asChild size="sm" className="hidden sm:flex">
            <Link href="/submit">
              <Plus className="size-4" />
              Submit
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
