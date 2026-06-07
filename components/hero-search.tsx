"use client";

import { Search } from "lucide-react";
import { OPEN_COMMAND_EVENT } from "@/components/command-palette";

export function HeroSearch() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_EVENT))}
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      <Search className="size-5" />
      <span className="flex-1">Search 500+ resources…</span>
      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
        ⌘K
      </kbd>
    </button>
  );
}
