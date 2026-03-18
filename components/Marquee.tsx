'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const words = [
  'KARAOKE',
  'DRINK SPECIALS',
  'GOOD TIMES',
  'SINCE \'89',
  '20,000+ SONGS',
  'ERIE PA',
  'NO COVER',
  'NO DRESS CODE',
]

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const skew = useTransform(scrollYProgress, [0, 0.5, 1], [-1.5, 0, 1.5])

  const text = words.map((w) => w + ' · ').join('')

  return (
    <div ref={ref} className="relative overflow-hidden bg-green">
      {/* Top line */}
      <div className="h-px bg-cream/10" />

      <motion.div
        style={{ skewY: skew }}
        className="py-5 sm:py-6"
      >
        {/* Row 1 — left (CSS animation) */}
        <div className="flex whitespace-nowrap mb-1 animate-marquee-left will-change-transform">
          {[...Array(6)].map((_, i) => (
            <span
              key={`a-${i}`}
              className="text-cream/90 text-sm sm:text-base md:text-lg font-bold tracking-[0.15em]"
            >
              {text}
            </span>
          ))}
        </div>

        {/* Row 2 — right (CSS animation) */}
        <div className="flex whitespace-nowrap animate-marquee-right will-change-transform">
          {[...Array(6)].map((_, i) => (
            <span
              key={`b-${i}`}
              className="text-cream/40 text-[10px] sm:text-xs tracking-[0.25em] uppercase"
            >
              {text}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Bottom line */}
      <div className="h-px bg-cream/10" />
    </div>
  )
}
