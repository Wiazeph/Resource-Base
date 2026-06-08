import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandPalette } from "@/components/command-palette";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ClickCountsProvider } from "@/components/click-counts-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allResourcesQuery } from "@/sanity/lib/queries";
import type { Resource } from "@/lib/types";

/**
 * Public site chrome. AuthProvider + ClickCountsProvider wrap everything so the
 * header, cards and favorites share auth state and click counts. The command
 * palette is hydrated with the full (small) resource set for ⌘K search.
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
    <I18nProvider>
      <AuthProvider>
        <ClickCountsProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <CommandPalette resources={resources} />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ClickCountsProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
