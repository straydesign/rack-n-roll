'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { menuPreview } from '@/data/events'
import TextReveal from './TextReveal'

const ease = [0.33, 1, 0.68, 1] as const

export default function Menu() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={sectionRef} className="relative px-6 py-28 md:py-40 overflow-hidden">
      <motion.div
        style={{ y: parallaxY }}
        className="absolute top-0 left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green/[0.03] blur-[120px] pointer-events-none"
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Tag */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center"
        >
          The Grub
        </motion.span>

        <TextReveal
          text="Bar food. Done right."
          className="font-heading heading-text text-white text-center mb-4"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center text-white/40 mb-16 text-sm"
        >
          Kitchen opens at 4 PM &middot; Nothing fancy, everything good
        </motion.p>

        {/* Preview items — no tabs, just the hits */}
        <div className="max-w-lg mx-auto space-y-1">
          {menuPreview.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease }}
              className="group flex items-start gap-4 p-5 rounded-xl hover:bg-charcoal/[0.03] transition-all duration-300"
            >
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="font-bold text-white text-lg group-hover:text-green transition-colors duration-300">
                    {item.name}
                  </h4>
                  {item.price && (
                    <span className="text-green font-bold text-base flex-shrink-0">{item.price}</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-white/40 text-sm mt-1">{item.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Full Menu button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="text-center mt-12"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold text-white border border-charcoal/15 rounded-full hover:bg-charcoal hover:text-cream transition-all duration-300 uppercase tracking-wider group"
          >
            View Full Menu
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
