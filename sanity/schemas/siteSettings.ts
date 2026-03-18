import { defineType, defineField } from 'sanity'

const pageSeoFields = (page: string, defaults: { title: string; description: string }) => [
  defineField({
    name: `${page}MetaTitle`,
    title: 'Meta Title',
    type: 'string',
    description: `SEO title for the ${page} page. Defaults to "${defaults.title}"`,
    validation: (rule) => rule.max(70).warning('Keep under 70 characters for best SEO results'),
  }),
  defineField({
    name: `${page}MetaDescription`,
    title: 'Meta Description',
    type: 'text',
    rows: 3,
    description: `SEO description for the ${page} page. Defaults to "${defaults.description}"`,
    validation: (rule) => rule.max(160).warning('Keep under 160 characters for best SEO results'),
  }),
  defineField({
    name: `${page}OgImage`,
    title: 'Social Share Image',
    type: 'image',
    description: `Image shown when the ${page} page is shared on social media. Falls back to the default social image.`,
    options: { hotspot: true },
  }),
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'seo', title: 'SEO & Social' },
    { name: 'jsonLd', title: 'Google / Schema' },
  ],
  fields: [
    // ── General ──────────────────────────────────────────
    defineField({
      name: 'bannerEnabled',
      title: 'Show Banner',
      type: 'boolean',
      description: 'Toggle the announcement banner on the homepage hero',
      initialValue: false,
      group: 'general',
    }),
    defineField({
      name: 'bannerText',
      title: 'Banner Text',
      type: 'string',
      description:
        'Announcement text shown in the hero banner (e.g. "St. Patrick\'s Day — Green beer all night!")',
      hidden: ({ parent }) => !parent?.bannerEnabled,
      group: 'general',
    }),
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      description: 'The official business name (used in SEO and structured data)',
      initialValue: 'Rack N Roll',
      group: 'general',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      initialValue: '(814) 864-3535',
      group: 'general',
    }),
    defineField({
      name: 'addressStreet',
      title: 'Street Address',
      type: 'string',
      description: 'e.g. "2040 W 38th St"',
      initialValue: '2040 W 38th St',
      group: 'general',
    }),
    defineField({
      name: 'addressCity',
      title: 'City',
      type: 'string',
      initialValue: 'Erie',
      group: 'general',
    }),
    defineField({
      name: 'addressState',
      title: 'State',
      type: 'string',
      initialValue: 'PA',
      group: 'general',
    }),
    defineField({
      name: 'addressZip',
      title: 'ZIP Code',
      type: 'string',
      initialValue: '16508',
      group: 'general',
    }),
    // Keep the flat address field for backward compatibility
    defineField({
      name: 'address',
      title: 'Full Address (legacy)',
      type: 'string',
      description:
        'Full address string used in the footer/info sections. Auto-composed from the fields above if left empty.',
      initialValue: '2040 W 38th St, Erie, PA 16508',
      group: 'general',
    }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'string',
      description: 'e.g. "Tue\u2013Sat: 3pm\u20132am"',
      initialValue: 'Tue\u2013Sat: 3pm\u20132am',
      group: 'general',
    }),
    defineField({
      name: 'closedDays',
      title: 'Closed Days',
      type: 'string',
      description: 'e.g. "Closed Sun & Mon"',
      initialValue: 'Closed Sun & Mon',
      group: 'general',
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
      group: 'general',
    }),
    defineField({
      name: 'hiringEnabled',
      title: 'Show Hiring Badge',
      type: 'boolean',
      description: 'Toggle the "Now Hiring" badge on the hero',
      initialValue: true,
      group: 'general',
    }),
    defineField({
      name: 'hiringText',
      title: 'Hiring Text',
      type: 'string',
      description: 'e.g. "Now hiring: Weekend Doorman"',
      initialValue: 'Now hiring: Weekend Doorman',
      hidden: ({ parent }) => !parent?.hiringEnabled,
      group: 'general',
    }),

    // ── SEO & Social ─────────────────────────────────────
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Used as the og:site_name across all pages',
      initialValue: 'Rack N Roll',
      group: 'seo',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Social Share Image',
      type: 'image',
      description:
        'Fallback image used when a page is shared on social media and no page-specific image is set. Recommended: 1200x630px.',
      options: { hotspot: true },
      group: 'seo',
    }),

    // Home page SEO
    defineField({
      name: 'homeHeading',
      title: 'Home Page SEO',
      type: 'string',
      description: 'Section label only \u2014 not displayed on the site',
      readOnly: true,
      initialValue: '\u2500\u2500 Home Page \u2500\u2500',
      group: 'seo',
      components: {
        field: (props) => props.renderDefault({ ...props, title: 'Home Page' }),
      },
    }),
    ...pageSeoFields('home', {
      title: "Rack N Roll \u2014 Erie's Premier Karaoke Bar Since '89",
      description:
        "Erie's premier karaoke bar since 1989. 6 nights a week, great specials, good food. Come as you are.",
    }).map((f) => ({ ...f, group: 'seo' })),

    // Events page SEO
    defineField({
      name: 'eventsHeading',
      title: 'Events Page SEO',
      type: 'string',
      readOnly: true,
      initialValue: '\u2500\u2500 Events Page \u2500\u2500',
      group: 'seo',
      components: {
        field: (props) => props.renderDefault({ ...props, title: 'Events Page' }),
      },
    }),
    ...pageSeoFields('events', {
      title: 'Events & Specials \u2014 Rack N Roll',
      description:
        'Weekly specials, karaoke nights, and upcoming events at Rack N Roll in Erie, PA. $2 pint nights, sing-alongs, and more.',
    }).map((f) => ({ ...f, group: 'seo' })),

    // Menu page SEO
    defineField({
      name: 'menuHeading',
      title: 'Menu Page SEO',
      type: 'string',
      readOnly: true,
      initialValue: '\u2500\u2500 Menu Page \u2500\u2500',
      group: 'seo',
      components: {
        field: (props) => props.renderDefault({ ...props, title: 'Menu Page' }),
      },
    }),
    ...pageSeoFields('menu', {
      title: 'Menu \u2014 Rack N Roll',
      description:
        'Full menu at Rack N Roll in Erie, PA. Burgers, wings, appetizers, nachos, salads, and sweet treats. Kitchen opens at 4 PM.',
    }).map((f) => ({ ...f, group: 'seo' })),

    // Gallery page SEO
    defineField({
      name: 'galleryHeading',
      title: 'Gallery Page SEO',
      type: 'string',
      readOnly: true,
      initialValue: '\u2500\u2500 Gallery Page \u2500\u2500',
      group: 'seo',
      components: {
        field: (props) => props.renderDefault({ ...props, title: 'Gallery Page' }),
      },
    }),
    ...pageSeoFields('gallery', {
      title: 'Gallery \u2014 Rack N Roll',
      description:
        'Photos from karaoke nights, specials, and good times at Rack N Roll in Erie, PA.',
    }).map((f) => ({ ...f, group: 'seo' })),

    // ── Google / Schema (JSON-LD) ────────────────────────
    defineField({
      name: 'cuisineType',
      title: 'Cuisine Type',
      type: 'string',
      description: 'Used in Google structured data (schema.org servesCuisine). e.g. "American"',
      initialValue: 'American',
      group: 'jsonLd',
    }),
    defineField({
      name: 'jsonLdDescription',
      title: 'Google Business Description',
      type: 'text',
      rows: 3,
      description:
        'Description used in Google structured data. This may appear in search results.',
      initialValue:
        "Erie's premier karaoke bar since 1989. 6 nights a week, great specials, good food. Come as you are.",
      group: 'jsonLd',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
