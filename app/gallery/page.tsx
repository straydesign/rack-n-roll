import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { GalleryPageSkeleton, FooterSkeleton } from '@/components/Skeletons'
import GalleryPageHero from '@/components/gallery/GalleryPageHero'
import { getGalleryImages, getSiteSettings } from '@/lib/queries'
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

export const metadata: Metadata = {
  title: "Gallery — Rack N Roll",
  description: "Photos from karaoke nights, specials, and good times at Rack N Roll in Erie, PA.",
  openGraph: {
    title: "Gallery — Rack N Roll",
    description: "Photos from karaoke nights, specials, and good times at Rack N Roll in Erie, PA.",
    type: "website",
  },
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
    <main>
      <Header />
      <div className="pt-16">
        <GalleryPageHero />
        <GalleryGrid images={images} />
        <Footer siteSettings={siteSettings} />
      </div>
    </main>
  )
}
