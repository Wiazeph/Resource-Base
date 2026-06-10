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
