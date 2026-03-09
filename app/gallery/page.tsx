import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { GalleryPageSkeleton, FooterSkeleton } from '@/components/Skeletons'
import GalleryPageHero from '@/components/gallery/GalleryPageHero'

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

export default function GalleryPage() {
  return (
    <main>
      <Header />
      <div className="pt-16">
        <GalleryPageHero />
        <GalleryGrid />
        <Footer />
      </div>
    </main>
  )
}
