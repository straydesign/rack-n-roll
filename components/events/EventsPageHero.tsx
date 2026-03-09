'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ease = [0.33, 1, 0.68, 1] as const

export default function EventsPageHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section
      ref={ref}
      className="relative min-h-[50vh] flex items-center justify-center px-6 py-28 md:py-40 overflow-hidden bg-charcoal text-cream"
    >
      {/* Noise texture */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Floating green orbs */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-10 right-[20%] w-[400px] h-[400px] rounded-full bg-green/[0.05] blur-[100px] pointer-events-none"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute bottom-0 left-[15%] w-[300px] h-[300px] rounded-full bg-green/[0.03] blur-[80px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8"
        >
          What&rsquo;s Happening
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="font-heading display-text text-cream mb-6"
        >
          Events & Specials
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-cream/30 text-sm max-w-lg mx-auto"
        >
          Karaoke Mon&ndash;Sat 9:30pm&ndash;1:30am &middot; Kitchen open until 11pm
        </motion.p>
      </div>
    </section>
  )
}
