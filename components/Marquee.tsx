'use client'

import { motion } from 'framer-motion'

const text =
  'KARAOKE \u00B7 CHEAP DRINKS \u00B7 GOOD TIMES \u00B7 SINCE \u201989 \u00B7 20,000+ SONGS \u00B7 ERIE\u2019S LIVING ROOM \u00B7 '

export default function Marquee() {
  return (
    <div className="overflow-hidden py-4 sm:py-5 bg-green">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="text-cream/90 text-sm sm:text-base md:text-lg font-bold tracking-[0.15em] mx-0"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
