/** Shapes returned by the GROQ projections in sanity/lib/queries.ts. */

export type LinkStatus = 'ok' | 'broken' | 'redirect' | 'suspect' | 'unchecked'
export type Pricing = 'free' | 'freemium' | 'paid'
export type Domain = 'developer' | 'designer' | 'general'
export type TagKind = 'tech' | 'topic' | 'language' | 'general'

export interface CategoryRef {
  _id: string
  title: string
  slug: string
  domain?: Domain
}

export interface TagRef {
  _id: string
  title: string
  slug: string
  kind?: TagKind
}

export interface Resource {
  _id: string
  name: string
  slug: string
  url: string
  description?: string
  author?: string
  language: string[]
  pricing?: Pricing
  featured?: boolean
  addedAt?: string
  linkStatus?: LinkStatus
  categories: CategoryRef[]
  tags: TagRef[]
}

export interface Category {
  _id: string
  title: string
  slug: string
  icon?: string
  description?: string
  domain?: Domain
  order?: number
  parentSlug?: string
  count: number
}

export interface Tag {
  _id: string
  title: string
  slug: string
  kind?: TagKind
  count: number
}

/** A category with its resolved resource list (detail page query). */
export interface CategoryWithResources extends Omit<Category, 'count' | 'parentSlug'> {
  resources: Resource[]
}

export interface TagWithResources extends Omit<Tag, 'count'> {
  resources: Resource[]
}
