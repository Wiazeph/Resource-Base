import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandPalette } from "@/components/command-palette";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allResourcesQuery } from "@/sanity/lib/queries";
import type { Resource } from "@/lib/types";

/**
 * Public site chrome. The command palette is mounted once here and hydrated
 * with the full (small) resource set so ⌘K search works from any page.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resources = await sanityFetch<Resource[]>({
    query: allResourcesQuery,
    tags: ["resource", "category", "tag"],
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <CommandPalette resources={resources} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
