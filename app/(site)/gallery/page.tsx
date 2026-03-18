import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { NavigableSection } from '@/components/NavigableSection'
import { GalleryPageSkeleton, FooterSkeleton } from '@/components/Skeletons'
import GalleryPageHero from '@/components/gallery/GalleryPageHero'
import { getGalleryImages, getSiteSettings } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/metadata'
import { urlFor } from '@/lib/sanity'
import type { GalleryImage } from '@/data/events'

const GalleryGrid = dynamic(
  () => import('@/components/gallery/GalleryGrid'),
  { loading: () => <GalleryPageSkeleton /> }
)

const Footer = dynamic(
  () => import('@/components/Footer'),
  { loading: () => <FooterSkeleton /> }
)

const GALLERY_DEFAULTS = {
  title: 'Gallery \u2014 Rack N Roll',
  description:
    'Photos from karaoke nights, specials, and good times at Rack N Roll in Erie, PA.',
} as const

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildPageMetadata(settings?.gallerySeo, settings, GALLERY_DEFAULTS)
}

export default async function GalleryPage() {
  const [sanityImages, siteSettings] = await Promise.all([
    getGalleryImages(),
    getSiteSettings(),
  ])

  const images: GalleryImage[] | undefined = sanityImages.length > 0
    ? sanityImages.map((img) => ({
        src: urlFor(img.image).width(1200).auto('format').quality(75).url(),
        alt: img.alt,
        width: 1200,
        height: 1600,
        featured: img.featured,
      }))
    : undefined

  return (
    <main id="main-content">
      <Header />
      <div className="pt-16">
        <NavigableSection id="gallery-hero" label="Gallery">
          <GalleryPageHero />
        </NavigableSection>
        <NavigableSection id="gallery-content" label="Photos">
          <GalleryGrid images={images} />
        </NavigableSection>
        <NavigableSection id="footer" label="Footer" excludeFromScrollSpy>
          <Footer siteSettings={siteSettings} />
        </NavigableSection>
      </div>
    </main>
  )
}
