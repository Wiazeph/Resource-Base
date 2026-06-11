"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Resets scroll to the top on every route change. Next.js' default scroll
 * restoration can return to a cached page at a non-zero offset, which — with
 * the sticky header — looks like the content opens "behind" the header. Forcing
 * the top on navigation keeps every page opening cleanly below the header.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
