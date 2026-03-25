'use client'

import Link from 'next/link'
import TextReveal from './TextReveal'
import WeeklySpecials from './WeeklySpecials'
import type { DailySpecial } from '@/data/events'

interface EventsSectionProps {
  specials?: DailySpecial[]
}

export default function EventsSection({ specials }: EventsSectionProps = {}) {
  return (
    <section
      className="relative px-6 py-28 md:py-40 bg-charcoal text-cream"
    >
      {/* Background effects — clipped separately so card badges aren't cut off */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="noise absolute inset-0" />
        <div
          className="absolute top-20 right-[15%] w-[500px] h-[500px] rounded-full bg-green/[0.04] blur-[100px]"
        />
        <div
          className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full bg-green/[0.03] blur-[80px]"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Tag */}
        <span
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center"
        >
          What&rsquo;s Happening
        </span>

        <TextReveal
          text="Grab the mic. Own the night."
          className="font-heading display-text text-cream text-center max-w-4xl mx-auto mb-6"
        />

        <p
          className="text-center text-cream/30 mb-20 text-sm max-w-lg mx-auto"
        >
          Karaoke Tue&ndash;Sat starting 9:30 PM &middot; Trivia &middot; Darts &middot; Kitchen open
        </p>

        {/* Weekly Specials Row */}
        <div>
          <h3 className="font-heading text-lg text-cream/60 mb-6 text-center md:text-left">
            This Week
          </h3>
          <WeeklySpecials specials={specials} />
        </div>

        {/* See All Events link */}
        <div
          className="text-center mt-16"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold text-green border border-green/20 rounded-full hover:bg-green/10 transition-all duration-300 uppercase tracking-wider group"
          >
            See All Events &amp; Calendar
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
