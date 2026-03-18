import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import Header from '@/components/Header'
import { NavigableSection } from '@/components/NavigableSection'
import { getSiteSettings, getDailySpecials } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/metadata'
import type { DailySpecial } from '@/data/events'
import type { SanityDailySpecial } from '@/lib/types'
import {
  AboutSkeleton,
  EventsSkeleton,
  MenuSkeleton,
  InfoSkeleton,
  FooterSkeleton,
} from '@/components/Skeletons'

const HOME_DEFAULTS = {
  title: "Rack N Roll \u2014 Erie's Premier Karaoke Bar Since '89",
  description:
    "Erie's premier karaoke bar since 1989. 6 nights a week, great specials, good food. Come as you are.",
  ogDescription: "Erie's premier karaoke bar since 1989. Come as you are.",
} as const

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildPageMetadata(settings?.homeSeo, settings, HOME_DEFAULTS)
}

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
    <main id="main-content">
      <Header />
      <NavigableSection id="hero" label="Hero">
        <Hero
          bannerEnabled={siteSettings?.bannerEnabled}
          bannerText={siteSettings?.bannerText}
          hiringEnabled={siteSettings?.hiringEnabled}
          hiringText={siteSettings?.hiringText}
        />
      </NavigableSection>
      <div className="relative z-20">
        <NavigableSection id="about" label="About">
          <About />
        </NavigableSection>
        <div className="hr-glow max-w-4xl mx-auto" />
        <NavigableSection id="events" label="Events">
          <EventsSection specials={specials} />
        </NavigableSection>
        <NavigableSection id="menu" label="Menu">
          <Menu />
        </NavigableSection>
        <NavigableSection id="reviews" label="Reviews">
          <Reviews />
        </NavigableSection>
        <NavigableSection id="info" label="Find Us">
          <Info siteSettings={siteSettings} />
        </NavigableSection>
        <NavigableSection id="footer" label="Footer" excludeFromScrollSpy>
          <Footer siteSettings={siteSettings} />
        </NavigableSection>
      </div>
    </main>
  )
}
