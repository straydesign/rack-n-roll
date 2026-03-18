'use client'

import { motion } from 'framer-motion'

const ease = [0.33, 1, 0.68, 1] as const

export default function MenuPageHero() {
  return (
    <section
      className="relative min-h-[50vh] flex items-center justify-center px-6 py-28 md:py-40 overflow-hidden bg-charcoal text-cream"
    >
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8"
        >
          The Grub
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="font-heading display-text text-cream mb-6"
        >
          Full Menu
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-cream/30 text-sm max-w-lg mx-auto"
        >
          Kitchen opens at 4 PM &middot; Bar food done right &middot; Dine in or carry out
        </motion.p>
      </div>
    </section>
  )
}
