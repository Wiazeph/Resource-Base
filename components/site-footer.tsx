import Link from "next/link";
import { Boxes, FolderGit2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="size-4" />
          </span>
          <span>
            Resource Base — a curated directory of free resources for builders.
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/browse" className="hover:text-foreground">
            Browse
          </Link>
          <Link href="/submit" className="hover:text-foreground">
            Submit a resource
          </Link>
          <a
            href="https://github.com/Wiazeph/Front-End-Development-Resources"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
            aria-label="GitHub"
          >
            <FolderGit2 className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
