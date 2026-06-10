/** Shapes returned by the GROQ projections in sanity/lib/queries.ts. */

export type LinkStatus = 'ok' | 'broken' | 'redirect' | 'suspect' | 'unchecked'
export type Pricing = 'free' | 'freemium' | 'paid'
export type Domain = 'developer' | 'designer' | 'general'
export type TagKind = 'tech' | 'topic' | 'language' | 'general'

/** Public profile fields (from the public_profiles Supabase view). */
export interface PublicProfile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  portfolio_url: string | null
  github_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  dribbble_url: string | null
}

/** The signed-in user's own editable profile (private columns included). */
export interface Profile extends PublicProfile {
  email: string | null
}

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
  /** Supabase user id of the community member who submitted it (if any). */
  submittedBy?: string
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

export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

/** A user's own submission row (public.submissions mirror, RLS read-own). */
export interface Submission {
  id: string
  sanity_submission_id: string | null
  name: string | null
  url: string | null
  status: SubmissionStatus
  suggested_category: string | null
  note: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string | null
}

/** A category with its resolved resource list (detail page query). */
export interface CategoryWithResources extends Omit<Category, 'count' | 'parentSlug'> {
  resources: Resource[]
}

export interface TagWithResources extends Omit<Tag, 'count'> {
  resources: Resource[]
}
