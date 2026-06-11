import { defineField, defineType } from 'sanity'

/**
 * Community-suggested resource. Kept separate from `resource` so the public
 * submit endpoint only needs create access on this one type and can never
 * touch the live taxonomy. An editor reviews, then promotes to a `resource`.
 */
export const submission = defineType({
  name: 'submission',
  title: 'Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Submission type',
      type: 'string',
      options: {
        list: [
          { title: 'New resource', value: 'new' },
          { title: 'URL fix', value: 'fix' },
          { title: 'Category / tag fix', value: 'taxonomy' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
      readOnly: true,
    }),
    defineField({
      name: 'targetResourceId',
      title: 'Target resource (_id) — for fixes',
      type: 'string',
      description:
        'The resource this fix corrects. On approval the relevant fields are updated automatically.',
      readOnly: true,
      hidden: ({ parent }) => parent?.kind === 'new',
    }),
    defineField({
      name: 'proposedCategories',
      title: 'Proposed categories (slug or new title)',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'For taxonomy fixes. Existing category slugs are applied automatically; unrecognized values are left for you to add.',
      options: { layout: 'tags' },
      hidden: ({ parent }) => parent?.kind !== 'taxonomy',
    }),
    defineField({
      name: 'proposedTags',
      title: 'Proposed tags (slug or new title)',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'For taxonomy fixes. Existing tag slugs are applied automatically; unrecognized values are left for you to add.',
      options: { layout: 'tags' },
      hidden: ({ parent }) => parent?.kind !== 'taxonomy',
    }),
    defineField({
      name: 'proposedDescription',
      title: 'Proposed description',
      type: 'text',
      rows: 3,
      description:
        'For taxonomy fixes. The submitter’s suggested description — review and apply to the resource on approval.',
      hidden: ({ parent }) => parent?.kind !== 'taxonomy',
    }),
    defineField({
      name: 'originalDescription',
      title: 'Original description (at submit time)',
      type: 'text',
      rows: 3,
      readOnly: true,
      hidden: ({ parent }) => parent?.kind !== 'taxonomy',
    }),
    defineField({
      name: 'originalCategories',
      title: 'Original categories (slugs at submit time)',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
      hidden: ({ parent }) => parent?.kind !== 'taxonomy',
    }),
    defineField({
      name: 'originalTags',
      title: 'Original tags (slugs at submit time)',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
      hidden: ({ parent }) => parent?.kind !== 'taxonomy',
    }),
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'suggestedCategory', type: 'string' }),
    defineField({
      name: 'pricing',
      type: 'string',
      options: {
        list: [
          { title: 'Free', value: 'free' },
          { title: 'Freemium', value: 'freemium' },
          { title: 'Paid', value: 'paid' },
        ],
        layout: 'radio',
      },
      description: 'Suggested pricing — the submitter’s hint for the editor.',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Free-text tag suggestions; editor maps them to real tags.',
      options: { layout: 'tags' },
    }),
    defineField({ name: 'note', type: 'text', rows: 3 }),
    defineField({ name: 'email', type: 'string' }),
    defineField({
      name: 'submittedBy',
      title: 'Submitted by (Supabase user id)',
      type: 'string',
      description:
        'Set automatically when a signed-in user submits. Used to notify them on approval.',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'rejectionReason',
      title: 'Rejection reason',
      type: 'text',
      rows: 2,
      description:
        'Shown to the submitter so they can fix and resubmit. Only fill this when rejecting.',
      hidden: ({ parent }) => parent?.status !== 'rejected',
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest',
      name: 'createdDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', url: 'url', status: 'status' },
    prepare({ title, url, status }) {
      return { title, subtitle: `[${status}] ${url}` }
    },
  },
})
