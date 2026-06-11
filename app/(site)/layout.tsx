import { AuthProvider } from "@/components/auth/auth-provider";
import { AuthRequiredPrompt } from "@/components/auth/auth-required-prompt";
import { ClickCountsProvider } from "@/components/click-counts-provider";
import { CommandPalette } from "@/components/command-palette";
import { ConsentGate } from "@/components/consent";
import { ContributorsProvider } from "@/components/contributors-provider";
import { FavoriteCountsProvider } from "@/components/favorite-counts-provider";
import { FavoritesProvider } from "@/components/favorites-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { TaxonomyProvider } from "@/components/taxonomy-provider";
import { SubmissionsProvider } from "@/lib/submissions";
import type { Category, Resource, Tag } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  allResourcesQuery,
  allTagsQuery,
} from "@/sanity/lib/queries";
import { Suspense } from "react";

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
  // Same queries + tags as the pages so Next.js dedupes within a request.
  // Categories/tags also feed the taxonomy-fix editor in resource modals.
  const [resources, categories, tags] = await Promise.all([
    sanityFetch<Resource[]>({ query: allResourcesQuery, tags: ["resource"] }),
    sanityFetch<Category[]>({ query: allCategoriesQuery, tags: ["category"] }),
    sanityFetch<Tag[]>({ query: allTagsQuery, tags: ["tag"] }),
  ]);

  return (
    <I18nProvider>
      <AuthProvider>
        <SubmissionsProvider>
          <TaxonomyProvider categories={categories} tags={tags}>
            <FavoriteCountsProvider>
              <FavoritesProvider>
                <ClickCountsProvider>
                  <ContributorsProvider>
                    <div className="flex min-h-screen flex-col">
                      <ScrollToTop />
                      <SiteHeader />
                      <CommandPalette resources={resources} />
                      <Suspense>
                        <AuthRequiredPrompt />
                      </Suspense>
                      {/* Clear the floating header (top-3 + h-14 ≈ 4.25rem) so page
                content never renders behind it. */}
                      <main className="flex-1 px-4 pb-12 pt-10">{children}</main>
                      <SiteFooter />
                    </div>
                    <ConsentGate gaId={process.env.NEXT_PUBLIC_GA_ID} />
                  </ContributorsProvider>
                </ClickCountsProvider>
              </FavoritesProvider>
            </FavoriteCountsProvider>
          </TaxonomyProvider>
        </SubmissionsProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
