import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { MenuPageSkeleton, FooterSkeleton } from '@/components/Skeletons'
import MenuPageHero from '@/components/menu/MenuPageHero'

const MenuPageContent = dynamic(
  () => import('@/components/menu/MenuPageContent'),
  { loading: () => <MenuPageSkeleton /> }
)

const Footer = dynamic(
  () => import('@/components/Footer'),
  { loading: () => <FooterSkeleton /> }
)

export const metadata: Metadata = {
  title: "Menu — Rack N Roll",
  description: "Full menu at Rack N Roll in Erie, PA. Burgers, wings, appetizers, nachos, salads, and sweet treats. Kitchen opens at 4 PM.",
  openGraph: {
    title: "Menu — Rack N Roll",
    description: "Full menu at Rack N Roll in Erie, PA. Burgers, wings, appetizers, and more.",
    type: "website",
  },
}

export default function MenuPage() {
  return (
    <main>
      <Header />
      <div className="pt-16">
        <MenuPageHero />
        <MenuPageContent />
        <Footer />
      </div>
    </main>
  )
}
