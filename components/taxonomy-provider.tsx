"use client";

import { createContext, useContext } from "react";
import type { Category, Tag } from "@/lib/types";

type TaxonomyValue = { categories: Category[]; tags: Tag[] };

const TaxonomyContext = createContext<TaxonomyValue>({
  categories: [],
  tags: [],
});

/** All categories + tags, so taxonomy-fix editors can offer existing options. */
export function useTaxonomy() {
  return useContext(TaxonomyContext);
}

export function TaxonomyProvider({
  categories,
  tags,
  children,
}: TaxonomyValue & { children: React.ReactNode }) {
  return (
    <TaxonomyContext.Provider value={{ categories, tags }}>
      {children}
    </TaxonomyContext.Provider>
  );
}
