'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { weeklySchedule } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const

export default function Schedule() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeDay, setActiveDay] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.4], ['0%', '100%'])

  return (
    <section ref={sectionRef} className="relative px-6 py-24 md:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section tag */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-6 text-center"
        >
          The Schedule
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="font-heading heading-text text-charcoal text-center mb-4"
        >
          Make It
          <span className="text-gradient"> Your Night</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-charcoal/40 mb-16 text-sm"
        >
          DJ Paul Amann on the mic &middot; Karaoke 9:30pm&ndash;1:30am
        </motion.p>

        {/* Animated line */}
        <div className="relative mb-12">
          <div className="h-px bg-charcoal/10 w-full" />
          <motion.div
            style={{ width: lineWidth }}
            className="absolute top-0 left-0 h-px bg-green/40"
          />
        </div>

        {/* Day cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {weeklySchedule.map((row, i) => {
            const isActive = activeDay === i
            const hasSpecial = !!row.special

            return (
              <motion.div
                key={row.day}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                onMouseEnter={() => setActiveDay(i)}
                onMouseLeave={() => setActiveDay(null)}
                className={`relative rounded-2xl p-5 cursor-default transition-all duration-500 group overflow-hidden
                  ${isActive
                    ? 'bg-charcoal text-cream scale-105 glow-green'
                    : hasSpecial
                      ? 'bg-green/[0.06] border border-green/15 hover:border-green/30'
                      : 'bg-charcoal/[0.02] border border-charcoal/5 hover:border-charcoal/15'
                  }`}
              >
                {/* Glow orb */}
                {isActive && (
                  <motion.div
                    layoutId="day-glow"
                    className="absolute -top-10 -right-10 w-24 h-24 bg-green/20 rounded-full blur-2xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <span className={`text-[10px] uppercase tracking-[0.2em] font-bold block mb-3 transition-colors duration-300 ${isActive ? 'text-green' : 'text-charcoal/30'}`}>
                  {row.day.slice(0, 3)}
                </span>

                <span className={`font-heading text-2xl block leading-none mb-1 transition-colors duration-300 ${isActive ? 'text-cream' : 'text-charcoal'}`}>
                  {row.day}
                </span>

                <span className={`text-xs block mt-3 transition-colors duration-300 ${isActive ? 'text-cream/60' : 'text-charcoal/40'}`}>
                  {row.hours}
                </span>

                <span className={`text-xs block mt-1 transition-colors duration-300 ${isActive ? 'text-green' : 'text-charcoal/30'}`}>
                  🎤 {row.karaoke}
                </span>

                {/* Special badge */}
                <AnimatePresence>
                  {hasSpecial && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-3 pt-3 border-t transition-colors duration-300 ${isActive ? 'border-cream/10' : 'border-green/10'}`}
                    >
                      <span className={`text-xs font-semibold block transition-colors duration-300 ${isActive ? 'text-green' : 'text-green/70'}`}>
                        {row.special}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-charcoal/25 text-xs mt-8 text-center tracking-wide"
        >
          Closed Sundays &middot; We all need a night off
        </motion.p>
      </div>
    </section>
  )
}
