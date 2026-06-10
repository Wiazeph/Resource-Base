import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandPalette } from "@/components/command-palette";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AuthRequiredPrompt } from "@/components/auth/auth-required-prompt";
import { ClickCountsProvider } from "@/components/click-counts-provider";
import { ContributorsProvider } from "@/components/contributors-provider";
import { FavoritesProvider } from "@/components/favorites-provider";
import { FavoriteCountsProvider } from "@/components/favorite-counts-provider";
import { TaxonomyProvider } from "@/components/taxonomy-provider";
import { SubmissionsProvider } from "@/lib/submissions";
import { I18nProvider } from "@/components/i18n-provider";
import { ConsentGate } from "@/components/consent";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  allResourcesQuery,
  allTagsQuery,
} from "@/sanity/lib/queries";
import type { Category, Resource, Tag } from "@/lib/types";

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
            <SiteHeader />
            <CommandPalette resources={resources} />
            <Suspense>
              <AuthRequiredPrompt />
            </Suspense>
            <main className="flex-1 pt-6">{children}</main>
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
