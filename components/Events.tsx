'use client'

import Link from 'next/link'
import { events } from '@/data/events'
import TextReveal from './TextReveal'

export default function Events() {
  return (
    <section
      className="relative px-6 py-28 md:py-40 overflow-hidden bg-charcoal text-cream"
    >
      {/* Background noise texture */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Floating green orbs */}
      <div
        className="absolute top-20 right-[15%] w-[500px] h-[500px] rounded-full bg-green/[0.04] blur-[100px] pointer-events-none"
      />
      <div
        className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full bg-green/[0.03] blur-[80px] pointer-events-none"
      />

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

        {/* Featured event highlight */}
        {events.length > 0 && (
          <div
            className="mb-8 group"
          >
            <div className="relative rounded-2xl p-10 md:p-14 overflow-hidden border border-green/20 bg-green/[0.04]">
              <div className="absolute inset-0 bg-gradient-to-br from-green/[0.08] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-green/10 rounded-bl-full pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-1">Featured</span>
                  <span className="text-green/60 text-[10px] font-bold uppercase tracking-[0.3em] block">{events[0].date}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-cream mb-3">{events[0].title}</h3>
                  <p className="text-cream/50 text-base md:text-lg leading-relaxed max-w-xl">{events[0].description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event cards — editorial large style */}
        {events.length > 1 ? (
          <div className="space-y-4">
            {events.slice(1).map((event, i) => (
              <div
                key={i}
                className="group relative"
              >
                <div className="glass rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12
                  hover:border-green/20 transition-all duration-700 overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Date column */}
                  <div className="md:w-48 flex-shrink-0 relative z-10">
                    <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                      {event.date}
                    </span>
                    <div className="hidden md:block w-12 h-px bg-green/20 mt-3" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 relative z-10">
                    <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-cream mb-3 group-hover:text-green transition-colors duration-500">
                      {event.title}
                    </h3>
                    <p className="text-cream/40 text-sm md:text-base leading-relaxed max-w-xl">
                      {event.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-cream/10 group-hover:border-green/30 group-hover:bg-green/10 transition-all duration-500 flex-shrink-0 relative z-10">
                    <svg className="w-5 h-5 text-cream/30 group-hover:text-green transition-colors duration-500 group-hover:translate-x-0.5 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-cream/40 text-lg">
            Every night&rsquo;s a good night. Karaoke starts at 9:30pm.
          </p>
        )}

        {/* See All Events link */}
        <div
          className="text-center mt-16"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold text-green border border-green/20 rounded-full hover:bg-green/10 transition-all duration-300 uppercase tracking-wider group"
          >
            See All Events
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
