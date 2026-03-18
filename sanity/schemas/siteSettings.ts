import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'bannerEnabled',
      title: 'Show Banner',
      type: 'boolean',
      description: 'Toggle the announcement banner on the homepage hero',
      initialValue: false,
    }),
    defineField({
      name: 'bannerText',
      title: 'Banner Text',
      type: 'string',
      description: 'Announcement text shown in the hero banner (e.g. "St. Patrick\'s Day — Green beer all night!")',
      hidden: ({ parent }) => !parent?.bannerEnabled,
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      initialValue: '2040 W 38th St, Erie, PA 16508',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      initialValue: '(814) 864-3535',
    }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'string',
      description: 'e.g. "Tue–Sat: 3pm–2am"',
      initialValue: 'Tue–Sat: 3pm–2am',
    }),
    defineField({
      name: 'closedDays',
      title: 'Closed Days',
      type: 'string',
      description: 'e.g. "Closed Sun & Mon"',
      initialValue: 'Closed Sun & Mon',
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'Non-smoking inside',
        'Smoke porch out front',
        'Kitchen until 11pm',
        'Credit cards accepted',
        'Darts',
        '12 TVs',
      ],
    }),
    defineField({
      name: 'hiringEnabled',
      title: 'Show Hiring Badge',
      type: 'boolean',
      description: 'Toggle the "Now Hiring" badge on the hero',
      initialValue: true,
    }),
    defineField({
      name: 'hiringText',
      title: 'Hiring Text',
      type: 'string',
      description: 'e.g. "Now hiring: Weekend Doorman"',
      initialValue: 'Now hiring: Weekend Doorman',
      hidden: ({ parent }) => !parent?.hiringEnabled,
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
