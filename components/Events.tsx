'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { events } from '@/data/events'
import TextReveal from './TextReveal'

const ease = [0.33, 1, 0.68, 1] as const

export default function Events() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-28 md:py-40 overflow-hidden bg-charcoal text-cream"
    >
      {/* Background noise texture */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Floating green orbs */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-20 right-[15%] w-[500px] h-[500px] rounded-full bg-green/[0.04] blur-[100px] pointer-events-none"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full bg-green/[0.03] blur-[80px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Tag */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center"
        >
          What&rsquo;s Happening
        </motion.span>

        <TextReveal
          text="Grab the mic. Own the night."
          className="font-serif display-text text-cream text-center max-w-4xl mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center text-cream/30 mb-20 text-sm max-w-lg mx-auto"
        >
          Karaoke Mon&ndash;Sat 9:30pm&ndash;1:30am &middot; Kitchen open until 11pm
        </motion.p>

        {/* Event cards — editorial large style */}
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.9, delay: i * 0.12, ease }}
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
                    <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-cream mb-3 group-hover:text-green transition-colors duration-500">
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
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-cream/40 text-lg">
            Every night&rsquo;s a good night. Karaoke starts at 9:30pm.
          </p>
        )}
      </div>
    </section>
  )
}
