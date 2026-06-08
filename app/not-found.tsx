import Link from "next/link";
import { Boxes, Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Root 404 — renders outside the (site) providers, so it's intentionally
 * self-contained (no i18n/auth hooks). A friendly dead-end that points back
 * to the directory.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.54_0.22_285/0.10),transparent)]" />

      <Link
        href="/"
        className="mb-8 flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
          <Boxes className="size-5" />
        </span>
        Resource Base
      </Link>

      <p className="text-7xl font-bold tracking-tight text-primary">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        This page wandered off
      </h1>
      <p className="mt-2 max-w-md text-balance text-muted-foreground">
        The page or resource you&apos;re looking for doesn&apos;t exist or may
        have moved. Let&apos;s get you back on track.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="size-4" /> Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/categories">
            <Compass className="size-4" /> Browse categories
          </Link>
        </Button>
      </div>
    </div>
  );
}
