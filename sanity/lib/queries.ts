import { groq } from 'next-sanity'

/** Projection shared by every resource query. */
const RESOURCE_FIELDS = groq`
  _id,
  name,
  "slug": slug.current,
  url,
  description,
  author,
  language,
  pricing,
  featured,
  addedAt,
  linkStatus,
  submittedBy,
  "categories": categories[]->{ _id, title, "slug": slug.current, domain },
  "tags": tags[]->{ _id, title, "slug": slug.current, kind }
`

const PUBLISHED = groq`_type == "resource" && submissionStatus == "published"`

/** Every published resource — the dataset the client-side search indexes. */
export const allResourcesQuery = groq`
  *[${PUBLISHED}] | order(featured desc, addedAt desc) {
    ${RESOURCE_FIELDS}
  }
`

/** Published resources contributed by a given Supabase user id. */
export const resourcesBySubmitterQuery = groq`
  *[${PUBLISHED} && submittedBy == $userId] | order(addedAt desc) {
    ${RESOURCE_FIELDS}
  }
`

export const featuredResourcesQuery = groq`
  *[${PUBLISHED} && featured == true] | order(addedAt desc)[0...12] {
    ${RESOURCE_FIELDS}
  }
`

/** All categories, with parent reference resolved to a slug for tree building. */
export const allCategoriesQuery = groq`
  *[_type == "category"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    icon,
    description,
    domain,
    order,
    "parentSlug": parent->slug.current,
    "count": count(*[${PUBLISHED} && references(^._id)])
  }
`

export const allTagsQuery = groq`
  *[_type == "tag"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    kind,
    "count": count(*[${PUBLISHED} && references(^._id)])
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, icon, description, domain,
    "resources": *[${PUBLISHED} && references(^._id)] | order(featured desc, name asc) {
      ${RESOURCE_FIELDS}
    }
  }
`

export const tagBySlugQuery = groq`
  *[_type == "tag" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, kind,
    "resources": *[${PUBLISHED} && references(^._id)] | order(featured desc, name asc) {
      ${RESOURCE_FIELDS}
    }
  }
`

export const categorySlugsQuery = groq`*[_type == "category" && defined(slug.current)].slug.current`
export const tagSlugsQuery = groq`*[_type == "tag" && defined(slug.current)].slug.current`
export const resourceSlugsQuery = groq`*[${PUBLISHED} && defined(slug.current)].slug.current`

/** A single published resource by slug, with related resources (same category). */
export const resourceBySlugQuery = groq`
  *[${PUBLISHED} && slug.current == $slug][0] {
    ${RESOURCE_FIELDS},
    "related": *[${PUBLISHED} && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0]
      | order(featured desc, addedAt desc)[0...6] {
      ${RESOURCE_FIELDS}
    }
  }
`
