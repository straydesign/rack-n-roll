'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/40 py-12 border-t-2 border-green/30">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-serif text-2xl text-cream/70 mb-3"
        >
          Rack N Roll &mdash; Since &rsquo;89
        </motion.p>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Rack N Roll Inc. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
