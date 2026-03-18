'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Star } from 'lucide-react'
import TextReveal from './TextReveal'
import { reviews, googleFiveStarCount } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-charcoal/20'}`}
        />
      ))}
    </div>
  )
}

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  return (
    <section ref={sectionRef} className="relative px-6 py-28 md:py-40 bg-charcoal text-cream overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Floating orbs */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-20 right-[-100px] w-[350px] h-[350px] rounded-full bg-green/[0.04] blur-[100px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section tag */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center"
        >
          What People Say
        </motion.span>

        <TextReveal
          text="Don't take our word for it."
          className="font-heading display-text text-cream text-center max-w-4xl mx-auto mb-6"
        />

        {/* Google rating badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="flex items-center justify-center gap-3 mb-16"
        >
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-cream/60 text-sm">
            {googleFiveStarCount}+ five-star reviews on Google
          </span>
        </motion.div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease }}
              className="glass rounded-2xl p-7 group hover:scale-[1.02] transition-transform duration-500 relative"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-green/5 via-transparent to-transparent" />

              <Stars count={review.rating} />
              <p className="text-cream/70 text-sm leading-relaxed mt-4 mb-5 relative z-10">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-cream font-medium text-sm">{review.name}</span>
                <span className="text-cream/30 text-xs">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
