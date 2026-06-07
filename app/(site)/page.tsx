import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "@/components/resource-card";
import { CategoryIcon } from "@/components/category-icon";
import { HeroSearch } from "@/components/hero-search";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  allResourcesQuery,
  featuredResourcesQuery,
} from "@/sanity/lib/queries";
import type { Category, Resource } from "@/lib/types";

export default async function HomePage() {
  const [categories, featured, all] = await Promise.all([
    sanityFetch<Category[]>({ query: allCategoriesQuery, tags: ["category"] }),
    sanityFetch<Resource[]>({
      query: featuredResourcesQuery,
      tags: ["resource"],
    }),
    sanityFetch<Resource[]>({ query: allResourcesQuery, tags: ["resource"] }),
  ]);

  const topLevel = categories
    .filter((c) => !c.parentSlug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.54_0.22_285/0.12),transparent)]" />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            {all.length}+ hand-picked free resources
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Every great resource,{" "}
            <span className="text-primary">one search away.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted-foreground">
            A curated, searchable directory of the best free tools, libraries,
            courses and assets for developers and designers.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Browse by category
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/browse">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topLevel.map((cat) => {
            const children = categories.filter(
              (c) => c.parentSlug === cat.slug,
            );
            const total =
              cat.count + children.reduce((n, c) => n + c.count, 0);
            return (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <CategoryIcon name={cat.icon} className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-medium">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {total} resources
                    </p>
                  </div>
                </div>
                {children.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {children.slice(0, 4).map((c) => (
                      <span
                        key={c._id}
                        className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {c.title}
                      </span>
                    ))}
                    {children.length > 4 && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        +{children.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="mb-8 flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => (
              <ResourceCard key={r._id} resource={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
