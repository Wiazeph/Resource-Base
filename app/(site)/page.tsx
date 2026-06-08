import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { BrowseClient } from "@/components/browse-client";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  allResourcesQuery,
  allTagsQuery,
} from "@/sanity/lib/queries";
import type { Category, Resource, Tag } from "@/lib/types";

export default async function HomePage() {
  const [resources, categories, tags] = await Promise.all([
    sanityFetch<Resource[]>({ query: allResourcesQuery, tags: ["resource"] }),
    sanityFetch<Category[]>({ query: allCategoriesQuery, tags: ["category"] }),
    sanityFetch<Tag[]>({ query: allTagsQuery, tags: ["tag"] }),
  ]);

  const intro = (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
        <Sparkles className="size-3.5 text-primary" />
        {resources.length}+ hand-picked free resources
      </div>
      <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
        Find your next <span className="text-primary">resource.</span>
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">
        Search and filter the best free tools, libraries, courses and assets
        for developers and designers.
      </p>
    </div>
  );

  return (
    <>
      <AnnouncementBanner />
      <Suspense>
        <BrowseClient
          resources={resources}
          categories={categories}
          tags={tags}
          basePath="/"
          intro={intro}
        />
      </Suspense>
    </>
  );
}
