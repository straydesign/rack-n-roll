import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { EventsPageSkeleton, FooterSkeleton } from '@/components/Skeletons'
import EventsPageHero from '@/components/events/EventsPageHero'

const EventsPageContent = dynamic(
  () => import('@/components/events/EventsPageContent'),
  { loading: () => <EventsPageSkeleton /> }
)

const Footer = dynamic(
  () => import('@/components/Footer'),
  { loading: () => <FooterSkeleton /> }
)

export const metadata: Metadata = {
  title: "Events & Specials — Rack N Roll",
  description: "Weekly specials, karaoke nights, and upcoming events at Rack N Roll in Erie, PA. $2 pint nights, sing-alongs, and more.",
  openGraph: {
    title: "Events & Specials — Rack N Roll",
    description: "Weekly specials, karaoke nights, and upcoming events at Rack N Roll in Erie, PA.",
    type: "website",
  },
}

export default function EventsPage() {
  return (
    <main>
      <Header />
      <div className="pt-16">
        <EventsPageHero />
        <EventsPageContent />
        <Footer />
      </div>
    </main>
  )
}
