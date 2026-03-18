import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import Header from '@/components/Header'
import { getSiteSettings, getDailySpecials } from '@/lib/queries'
import type { DailySpecial } from '@/data/events'
import type { SanityDailySpecial } from '@/lib/types'
import {
  AboutSkeleton,
  EventsSkeleton,
  MenuSkeleton,
  InfoSkeleton,
  FooterSkeleton,
} from '@/components/Skeletons'

const About = dynamic(() => import('@/components/About'), { loading: () => <AboutSkeleton /> })
const EventsSection = dynamic(() => import('@/components/EventsSection'), { loading: () => <EventsSkeleton /> })
const Menu = dynamic(() => import('@/components/Menu'), { loading: () => <MenuSkeleton /> })
const Reviews = dynamic(() => import('@/components/Reviews'), { loading: () => <div className="bg-charcoal py-40" /> })
const Info = dynamic(() => import('@/components/Info'), { loading: () => <InfoSkeleton /> })
const Footer = dynamic(() => import('@/components/Footer'), { loading: () => <FooterSkeleton /> })

function toLocalSpecials(sanity: SanityDailySpecial[]): DailySpecial[] {
  return sanity.map((s) => ({
    day: s.day as DailySpecial['day'],
    closed: s.closed,
    hours: s.hours,
    specials: s.specials ?? [],
    karaoke: s.karaoke,
  }))
}

export default async function Home() {
  const [siteSettings, sanitySpecials] = await Promise.all([
    getSiteSettings(),
    getDailySpecials(),
  ])

  const specials = sanitySpecials.length > 0 ? toLocalSpecials(sanitySpecials) : undefined

  return (
    <main>
      <Header />
      <Hero
        bannerEnabled={siteSettings?.bannerEnabled}
        bannerText={siteSettings?.bannerText}
        hiringEnabled={siteSettings?.hiringEnabled}
        hiringText={siteSettings?.hiringText}
      />
      <div className="relative z-20">
        {/* Light section: About + Schedule */}
        <div id="about">
          <About />
        </div>
        <div className="hr-glow max-w-4xl mx-auto" />
        {/* Dark section: Events */}
        <div id="events">
          <EventsSection specials={specials} />
        </div>
        {/* Light section: Menu */}
        <div id="menu">
          <Menu />
        </div>
        {/* Dark section: Reviews */}
        <div id="reviews">
          <Reviews />
        </div>
        {/* Dark section: Info */}
        <div id="info">
          <Info siteSettings={siteSettings} />
        </div>
        {/* Footer */}
        <Footer siteSettings={siteSettings} />
      </div>
    </main>
  )
}
