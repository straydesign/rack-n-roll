import { defineType, defineField } from 'sanity'

export const flyer = defineType({
  name: 'flyer',
  title: 'Flyer',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Flyer Image',
      type: 'image',
      description: 'Upload your event square / flyer image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the flyer for accessibility (e.g. "Darts Blind Draw — Friday March 20")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'facebookPostId',
      title: 'Facebook Post ID',
      type: 'string',
      description: 'Auto-populated when imported from Facebook. Used to prevent duplicates.',
      readOnly: true,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Only active flyers are shown on the site',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first (0 = top)',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'image',
      active: 'active',
    },
    prepare: ({ title, media, active }) => ({
      title: title || 'Untitled Flyer',
      subtitle: active ? 'Active' : 'Hidden',
      media,
    }),
  },
})
