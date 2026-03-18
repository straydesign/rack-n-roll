'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCalendarGrid, getEventsForMonth, getEventsForDate, getMonthName } from '@/data/calendar-utils'
import type { CalendarEvent } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface EventsCalendarProps {
  onDayClick: (dateStr: string, events: CalendarEvent[]) => void
  externalCalendarEvents?: CalendarEvent[]
}

export default function EventsCalendar({ onDayClick, externalCalendarEvents }: EventsCalendarProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [direction, setDirection] = useState(0)

  const grid = useMemo(() => getCalendarGrid(year, month), [year, month])
  const monthEvents = useMemo(() => getEventsForMonth(year, month, externalCalendarEvents), [year, month, externalCalendarEvents])

  function navigate(delta: number) {
    setDirection(delta)
    let newMonth = month + delta
    let newYear = year
    if (newMonth < 0) { newMonth = 11; newYear-- }
    if (newMonth > 11) { newMonth = 0; newYear++ }
    setMonth(newMonth)
    setYear(newYear)
  }

  function handleDayClick(dateStr: string) {
    const dayEvents = getEventsForDate(dateStr, monthEvents)
    if (dayEvents.length > 0) {
      onDayClick(dateStr, dayEvents)
    }
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  }

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-cream/10 text-cream/50 hover:text-cream hover:border-cream/30 transition-all duration-300"
          aria-label="Previous month"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.h3
            key={`${year}-${month}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease }}
            className="font-heading text-2xl md:text-3xl text-cream"
          >
            {getMonthName(month)} {year}
          </motion.h3>
        </AnimatePresence>

        <button
          onClick={() => navigate(1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-cream/10 text-cream/50 hover:text-cream hover:border-cream/30 transition-all duration-300"
          aria-label="Next month"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] uppercase tracking-[0.15em] font-bold text-cream/30 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${year}-${month}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease }}
          className="grid grid-cols-7 gap-1"
        >
          {grid.map((cell, i) => {
            const dayEvents = cell.dateStr ? getEventsForDate(cell.dateStr, monthEvents) : []
            const hasEvents = dayEvents.length > 0
            const isClickable = hasEvents && cell.isCurrentMonth

            return (
              <motion.button
                key={`${cell.dateStr}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.008, ease }}
                disabled={!isClickable}
                onClick={() => isClickable && handleDayClick(cell.dateStr)}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-300
                  ${!cell.isCurrentMonth
                    ? 'text-cream/10'
                    : cell.isToday
                      ? 'ring-1 ring-green/40 text-cream font-bold'
                      : 'text-cream/60'
                  }
                  ${isClickable
                    ? 'bg-green/[0.08] border border-green/15 hover:bg-green/[0.15] hover:border-green/30 cursor-pointer'
                    : 'cursor-default'
                  }
                `}
              >
                <span>{cell.date || ''}</span>

                {/* Event dot */}
                {hasEvents && cell.isCurrentMonth && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-green" />
                )}
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
