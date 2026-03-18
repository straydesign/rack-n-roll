'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { dailySpecials as defaultSpecials } from '@/data/events'
import type { CalendarEvent, DailySpecial } from '@/data/events'
import type { SanityCalendarEvent } from '@/lib/types'
import WeeklySpecials from '@/components/WeeklySpecials'
import EventsCalendar from '@/components/EventsCalendar'
import EventDayModal from '@/components/EventDayModal'

interface FlyerImage {
  src: string
  alt: string
}

const defaultFlyerImages: FlyerImage[] = [
  { src: '/flyers/darts-blind-draw.jpg', alt: 'Dart Gear Blind Draw — Friday Feb 20' },
  { src: '/flyers/hiring-doorman.jpg', alt: 'Now Hiring — Weekend Doorman' },
]

const ease = [0.33, 1, 0.68, 1] as const

const DAY_ABBREV: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
}

interface EventsPageContentProps {
  flyers?: FlyerImage[]
  specials?: DailySpecial[]
  sanityCalendarEvents?: SanityCalendarEvent[]
}

export default function EventsPageContent({ flyers, specials, sanityCalendarEvents }: EventsPageContentProps) {
  const dailySpecials = specials && specials.length > 0 ? specials : defaultSpecials
  const flyerImages = flyers && flyers.length > 0 ? flyers : defaultFlyerImages
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([])

  const handleDayClick = useCallback((dateStr: string, events: CalendarEvent[]) => {
    setSelectedDate(dateStr)
    setSelectedEvents(events)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedDate(null)
    setSelectedEvents([])
  }, [])

  return (
    <section className="relative px-6 py-16 md:py-24 bg-charcoal text-cream overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Everyday + Weekly Schedule Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="glass rounded-2xl border border-cream/10 overflow-hidden mb-20"
        >
          {/* Everyday specials */}
          <div className="p-8 md:p-10">
            <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">
              Every Day
            </span>
            <div className="space-y-2">
              <p className="text-cream/80 text-sm">Busch Light Bucket &mdash; 4 for $10</p>
              <p className="text-cream/80 text-sm">Kitchen opens at 4 PM</p>
              <p className="text-cream/50 text-xs mt-3">Burgers, wings, pizza, cheesesteaks &mdash; bar food done right.</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 px-8 md:px-10">
            <div className="flex-1 h-px bg-cream/10" />
            <span className="text-cream/30 text-[10px] font-bold uppercase tracking-[0.2em]">
              Every Week
            </span>
            <div className="flex-1 h-px bg-cream/10" />
          </div>

          {/* Weekly schedule — simple list */}
          <div className="p-8 md:p-10">
            <div className="space-y-2">
              {dailySpecials.map((day) => (
                <div key={day.day} className="flex items-baseline gap-3">
                  <span className={`text-xs font-semibold w-8 flex-shrink-0 ${day.closed ? 'text-cream/20' : 'text-cream/60'}`}>
                    {DAY_ABBREV[day.day]}
                  </span>
                  {day.closed ? (
                    <span className="text-cream/20 text-xs">Closed</span>
                  ) : (
                    <span className="text-cream/50 text-xs">
                      {day.hours}
                      {day.specials.filter(s => s !== 'Busch Light Bucket — 4 for $10' && s !== 'Kitchen opens 4 PM').length > 0 && (
                        <span className="text-cream/40"> · {day.specials.filter(s => s !== 'Busch Light Bucket — 4 for $10' && s !== 'Kitchen opens 4 PM').join(' · ')}</span>
                      )}
                      {day.karaoke && (
                        <span className="text-green/60"> · Karaoke {day.karaoke}</span>
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── This Week ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mb-20"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-cream text-center mb-3">
            This Week
          </h2>
          <p className="text-cream/30 text-sm text-center mb-8">
            What&rsquo;s on tonight and the rest of the week
          </p>
          <WeeklySpecials specials={specials} />
        </motion.div>

        {/* ── Calendar ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="max-w-xl mx-auto mb-24"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-cream text-center mb-3">
            Calendar
          </h2>
          <p className="text-cream/30 text-sm text-center mb-10">
            Click a day to see what&rsquo;s happening
          </p>
          <EventsCalendar
            onDayClick={handleDayClick}
            externalCalendarEvents={sanityCalendarEvents?.map((e) => ({
              ...e,
              description: e.description ?? '',
            }))}
          />
        </motion.div>

        {/* ── Flyers & Promos ── */}
        <div>
          <h2 className="font-heading text-3xl md:text-4xl text-cream text-center mb-4">
            Flyers &amp; Promos
          </h2>
          <p className="text-cream/40 text-sm text-center mb-12 max-w-md mx-auto">
            Latest promotions and announcements.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {flyerImages.slice(0, 10).map((flyer, i) => (
              <motion.div
                key={flyer.src}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.15, ease }}
                className="group relative rounded-2xl overflow-hidden border border-cream/[0.06] hover:border-green/20 transition-all duration-500"
              >
                <Image
                  src={flyer.src}
                  alt={flyer.alt}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-cream text-sm font-medium">{flyer.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Facebook link ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mt-16"
        >
          <a
            href="https://www.facebook.com/profile.php?id=100053614732579"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3 text-xs font-semibold text-cream/60 border border-cream/10 rounded-full hover:border-cream/30 hover:text-cream transition-all duration-300 uppercase tracking-wider group"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            More on Facebook
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Event Day Modal */}
      <EventDayModal
        date={selectedDate}
        events={selectedEvents}
        onClose={handleClose}
      />
    </section>
  )
}
