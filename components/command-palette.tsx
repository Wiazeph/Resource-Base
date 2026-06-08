"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { ArrowUpRight, Hash, Search } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Resource } from "@/lib/types";

/** Fired by the header search button to open the palette from anywhere. */
export const OPEN_COMMAND_EVENT = "open-command-palette";

export function CommandPalette({ resources }: { resources: Resource[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Build the fuzzy index once. name > tags > description > author.
  const fuse = useMemo(
    () =>
      new Fuse(resources, {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "tags.title", weight: 0.25 },
          { name: "categories.title", weight: 0.15 },
          { name: "description", weight: 0.07 },
          { name: "author", weight: 0.03 },
        ],
        threshold: 0.38,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [resources],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen);
    };
  }, []);

  const results = useMemo(() => {
    if (!query.trim())
      return resources.filter((r) => r.featured).slice(0, 8);
    return fuse
      .search(query)
      .slice(0, 12)
      .map((r) => r.item);
  }, [query, fuse, resources]);

  const go = (href: string, external = false) => {
    setOpen(false);
    setQuery("");
    if (external) window.open(href, "_blank", "noopener,noreferrer");
    else router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search resources"
      description="Search across every resource, category and tag."
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search resources, tags, categories…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
        <CommandEmpty>No matching resources.</CommandEmpty>
        <CommandGroup heading={query ? "Results" : "Featured"}>
          {results.map((r) => (
            <CommandItem
              key={r._id}
              value={r._id}
              onSelect={() => go(r.url, true)}
              className="flex items-center gap-2"
            >
              <Search className="size-4 shrink-0 opacity-60" />
              <span className="flex-1 truncate">{r.name}</span>
              {r.categories?.[0] && (
                <span className="text-muted-foreground text-xs">
                  {r.categories[0].title}
                </span>
              )}
              <ArrowUpRight className="size-3.5 opacity-50" />
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Go to">
          <CommandItem value="browse-all" onSelect={() => go("/")}>
            <Hash className="size-4 opacity-60" />
            Browse all resources
          </CommandItem>
        </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
