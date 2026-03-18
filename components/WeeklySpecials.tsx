'use client'

import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { dailySpecials as defaultSpecials } from '@/data/events'
import type { DailySpecial } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const

const DAY_NAMES: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
}

function getTodayIndex(): number {
  // JS getDay: 0=Sun, we want: 0=Mon
  const jsDay = new Date().getDay()
  return jsDay === 0 ? 6 : jsDay - 1
}

function DayCard({ special, index, isTonight, cardRef }: { special: DailySpecial; index: number; isTonight: boolean; cardRef?: React.Ref<HTMLDivElement> }) {
  const isClosed = special.closed

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
      className={`relative flex-shrink-0 w-[140px] md:w-auto snap-center rounded-2xl p-5 transition-all duration-500 group flex flex-col
        ${isTonight
          ? 'bg-green/[0.12] border-2 border-green/40 glow-green'
          : isClosed
            ? 'bg-white/[0.02] border border-dashed border-cream/10'
            : 'bg-white/[0.04] border border-cream/10 hover:border-cream/20'
        }`}
    >
      {/* Tonight badge */}
      {isTonight && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-green text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap z-10"
        >
          Tonight
        </motion.span>
      )}

      {/* Day name abbreviation */}
      <span className={`text-[10px] uppercase tracking-[0.2em] font-bold block mb-2
        ${isTonight ? 'text-green' : isClosed ? 'text-cream/20' : 'text-cream/50'}`}>
        {DAY_NAMES[special.day]}
      </span>

      {/* Full day name */}
      <span className={`font-heading text-xl block leading-none mb-3
        ${isTonight ? 'text-cream' : isClosed ? 'text-cream/20' : 'text-cream/80'}`}>
        {special.day}
      </span>

      {isClosed ? (
        <span className="text-cream/15 text-xs">Closed</span>
      ) : (
        <>
          {/* Hours */}
          {special.hours && (
            <span className={`text-xs block mb-2 ${isTonight ? 'text-cream/60' : 'text-cream/30'}`}>
              {special.hours}
            </span>
          )}

          {/* Specials list — grows to fill available space */}
          <div className="space-y-1.5 flex-1">
            {special.specials.map((s, i) => (
              <span
                key={i}
                className={`text-xs block leading-snug ${isTonight ? 'text-cream/70' : 'text-cream/40'}`}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Karaoke info — pinned to bottom */}
          {special.karaoke && (
            <div className={`pt-2 mt-3 border-t ${isTonight ? 'border-green/20' : 'border-cream/5'}`}>
              <span className={`text-xs font-semibold block ${isTonight ? 'text-green' : 'text-green/60'}`}>
                🎤 {special.karaoke}
              </span>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

interface WeeklySpecialsProps {
  specials?: DailySpecial[]
}

export default function WeeklySpecials({ specials }: WeeklySpecialsProps = {}) {
  const dailySpecials = specials && specials.length > 0 ? specials : defaultSpecials
  const tonightIndex = getTodayIndex()
  const scrollRef = useRef<HTMLDivElement>(null)
  const todayCardRef = useRef<HTMLDivElement>(null)

  const scrollToToday = useCallback(() => {
    const container = scrollRef.current
    const card = todayCardRef.current
    if (!container || !card) return

    const containerRect = container.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const scrollLeft = card.offsetLeft - containerRect.width / 2 + cardRect.width / 2

    container.scrollTo({ left: scrollLeft, behavior: 'instant' })
  }, [])

  useEffect(() => {
    // Small delay to ensure cards are rendered
    const timer = setTimeout(scrollToToday, 100)
    return () => clearTimeout(timer)
  }, [scrollToToday])

  return (
    <div>
      {/* Desktop: 7-col grid, equal height cards */}
      <div className="hidden md:grid grid-cols-7 gap-3 pt-3 items-stretch">
        {dailySpecials.map((special, i) => (
          <DayCard key={special.day} special={special} index={i} isTonight={i === tonightIndex} />
        ))}
      </div>

      {/* Mobile: horizontal scroll with snap, auto-scrolls to today */}
      <div className="md:hidden -mx-6 px-6">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 pt-4 scrollbar-hide items-stretch"
        >
          {dailySpecials.map((special, i) => (
            <DayCard
              key={special.day}
              special={special}
              index={i}
              isTonight={i === tonightIndex}
              cardRef={i === tonightIndex ? todayCardRef : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
