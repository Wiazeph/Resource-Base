import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Hash } from "lucide-react";
import { ResourceGrid } from "@/components/resource-grid";
import { sanityFetch } from "@/sanity/lib/fetch";
import { tagBySlugQuery, tagSlugsQuery } from "@/sanity/lib/queries";
import type { TagWithResources } from "@/lib/types";

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: tagSlugsQuery,
    tags: ["tag"],
  });
  return slugs.map((slug) => ({ slug }));
}

async function load(slug: string) {
  return sanityFetch<TagWithResources | null>({
    query: tagBySlugQuery,
    params: { slug },
    tags: ["tag", "resource"],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const tag = await load((await params).slug);
  if (!tag) return {};
  return {
    title: `${tag.title} resources`,
    description: `Resources tagged ${tag.title}.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const tag = await load((await params).slug);
  if (!tag) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">#{tag.title}</span>
      </nav>

      <div className="mb-8 flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-xl bg-primary/10 text-primary">
          <Hash className="size-7" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{tag.title}</h1>
          <p className="text-muted-foreground">
            {tag.resources.length} resources
          </p>
        </div>
      </div>

      <ResourceGrid resources={tag.resources} />
    </div>
  );
}
