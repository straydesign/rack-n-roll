import { defineType, defineField } from 'sanity'

export const dailySpecial = defineType({
  name: 'dailySpecial',
  title: 'Daily Special',
  type: 'document',
  fields: [
    defineField({
      name: 'day',
      title: 'Day of Week',
      type: 'string',
      options: {
        list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: '0=Monday, 1=Tuesday, ... 6=Sunday',
      validation: (rule) => rule.required().min(0).max(6),
    }),
    defineField({
      name: 'closed',
      title: 'Closed',
      type: 'boolean',
      description: 'Is the bar closed on this day?',
      initialValue: false,
    }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'string',
      description: 'e.g. "3 PM – 2 AM"',
      hidden: ({ parent }) => parent?.closed,
    }),
    defineField({
      name: 'specials',
      title: 'Specials',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of specials for this day',
      hidden: ({ parent }) => parent?.closed,
    }),
    defineField({
      name: 'karaoke',
      title: 'Karaoke Info',
      type: 'string',
      description: 'e.g. "9:30 PM w/ DJ Paul Amann"',
      hidden: ({ parent }) => parent?.closed,
    }),
  ],
  orderings: [
    {
      title: 'Day of Week',
      name: 'dayAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      day: 'day',
      closed: 'closed',
      specials: 'specials',
    },
    prepare: ({ day, closed, specials }) => ({
      title: day || 'Untitled',
      subtitle: closed ? 'Closed' : (specials ?? []).join(', '),
    }),
  },
})
