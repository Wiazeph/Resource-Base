import { defineField, defineType } from 'sanity'

/**
 * Flat, free-form facet taxonomy (React, Vue, Figma, AI, ...).
 * `kind` lets the UI render tech-stack filters separately from a language
 * toggle or generic topic chips.
 */
export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      type: 'string',
      options: {
        list: [
          { title: 'Tech', value: 'tech' },
          { title: 'Topic', value: 'topic' },
          { title: 'Language', value: 'language' },
          { title: 'General', value: 'general' },
        ],
        layout: 'radio',
      },
      initialValue: 'topic',
    }),
    defineField({ name: 'description', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', kind: 'kind' },
    prepare({ title, kind }) {
      return { title, subtitle: kind }
    },
  },
})
