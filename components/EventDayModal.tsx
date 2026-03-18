'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CalendarEvent } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const

interface EventDayModalProps {
  date: string | null
  events: CalendarEvent[]
  onClose: () => void
}

export default function EventDayModal({ date, events, onClose }: EventDayModalProps) {
  const isOpen = date !== null && events.length > 0

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll + pause Lenis
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).__lenis
      if (lenis) lenis.stop()
    } else {
      document.body.style.overflow = ''
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).__lenis
      if (lenis) lenis.start()
    }
    return () => {
      document.body.style.overflow = ''
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).__lenis
      if (lenis) lenis.start()
    }
  }, [isOpen])

  const formattedDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-cream/10 text-cream/60 hover:text-cream hover:border-cream/30 transition-all duration-300 z-10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease }}
            className="relative w-full max-w-lg rounded-2xl bg-charcoal border border-cream/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-4 border-b border-cream/10">
              <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                Events
              </span>
              <h3 className="font-heading text-2xl text-cream">
                {formattedDate}
              </h3>
            </div>

            {/* Events list */}
            <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {events.map((event, i) => (
                <motion.div
                  key={`${event.title}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08, ease }}
                  className="relative pl-5"
                >
                  {/* Green dot indicator */}
                  <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-green" />

                  <div className="flex items-baseline gap-3 mb-1">
                    <h4 className="font-heading text-lg text-cream">{event.title}</h4>
                    {event.time && (
                      <span className="text-green/70 text-xs font-medium">{event.time}</span>
                    )}
                  </div>
                  <p className="text-cream/40 text-sm leading-relaxed">{event.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-cream/10 text-center">
              <span className="text-cream/20 text-xs">
                Karaoke every night Tue–Sat at 9:30 PM
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
