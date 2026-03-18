import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { EventsPageSkeleton, FooterSkeleton } from '@/components/Skeletons'
import EventsPageHero from '@/components/events/EventsPageHero'
import { getDailySpecials, getFlyers, getCalendarEvents, getSiteSettings } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import type { DailySpecial } from '@/data/events'
import type { SanityDailySpecial } from '@/lib/types'

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

function toLocalSpecials(sanity: SanityDailySpecial[]): DailySpecial[] {
  return sanity.map((s) => ({
    day: s.day as DailySpecial['day'],
    closed: s.closed,
    hours: s.hours,
    specials: s.specials ?? [],
    karaoke: s.karaoke,
  }))
}

export default async function EventsPage() {
  const [sanitySpecials, sanityFlyers, sanityCalendarEvents, siteSettings] = await Promise.all([
    getDailySpecials(),
    getFlyers(),
    getCalendarEvents(),
    getSiteSettings(),
  ])

  const specials = sanitySpecials.length > 0 ? toLocalSpecials(sanitySpecials) : undefined

  const flyers = sanityFlyers.length > 0
    ? sanityFlyers.map((f) => ({
        src: urlFor(f.image).width(800).auto('format').quality(80).url(),
        alt: f.alt,
      }))
    : undefined

  const calendarEvents = sanityCalendarEvents.length > 0
    ? sanityCalendarEvents.map((e) => ({
        date: e.date,
        title: e.title,
        description: e.description ?? '',
        time: e.time,
      }))
    : undefined

  return (
    <main>
      <Header />
      <div className="pt-16">
        <EventsPageHero />
        <EventsPageContent
          specials={specials}
          flyers={flyers}
          sanityCalendarEvents={calendarEvents}
        />
        <Footer siteSettings={siteSettings} />
      </div>
    </main>
  )
}
