import type { Metadata } from 'next'
import type { SanityPageSeo, SanitySiteSettings } from './types'
import { urlFor } from './sanity'

interface PageMetaDefaults {
  readonly title: string
  readonly description: string
  readonly ogDescription?: string
}

/**
 * Build Next.js Metadata for a page from Sanity siteSettings + hardcoded fallbacks.
 * Returns a Metadata object that merges with the layout-level metadata.
 */
export function buildPageMetadata(
  pageSeo: SanityPageSeo | undefined,
  settings: SanitySiteSettings | null,
  defaults: PageMetaDefaults,
): Metadata {
  const title = pageSeo?.metaTitle ?? defaults.title
  const description = pageSeo?.metaDescription ?? defaults.description
  const ogDescription = pageSeo?.metaDescription ?? defaults.ogDescription ?? defaults.description

  const ogImageUrl = pageSeo?.ogImage
    ? urlFor(pageSeo.ogImage).width(1200).height(630).auto('format').url()
    : settings?.defaultOgImage
      ? urlFor(settings.defaultOgImage).width(1200).height(630).auto('format').url()
      : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description: ogDescription,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      title,
      description: ogDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  }
}
