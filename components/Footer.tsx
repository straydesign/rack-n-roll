'use client'

import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'

const ease = [0.33, 1, 0.68, 1] as const

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0A] text-cream overflow-hidden">
      {/* Green glow line */}
      <div className="hr-glow" />

      {/* Noise */}
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
        {/* Large footer text */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="text-center mb-16"
        >
          <h2 className="font-heading display-text text-cream/10 leading-none select-none">
            Rack N Roll
          </h2>
        </motion.div>

        {/* Info row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-3">
              Location
            </span>
            <p className="text-cream/40 text-sm leading-relaxed">
              2040 W 38th St<br />
              Erie, PA 16508
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-3">
              Hours
            </span>
            <p className="text-cream/40 text-sm leading-relaxed">
              Mon&ndash;Sat: 3pm&ndash;2am<br />
              Karaoke: 9:30pm&ndash;1:30am
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="flex flex-col items-center md:items-start"
          >
            <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-3">
              Connect
            </span>
            <MagneticButton
              href="tel:+18148643535"
              className="text-cream/40 text-sm hover:text-green transition-colors duration-300"
              strength={0.15}
            >
              (814) 864-3535
            </MagneticButton>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-cream/5 mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-cream/20 text-xs tracking-wider"
          >
            &copy; {new Date().getFullYear()} Rack N Roll Inc. All rights reserved.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-cream/10 text-xs tracking-wider"
          >
            Since &rsquo;89. Come as you are.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
