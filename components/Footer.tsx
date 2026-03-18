'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import MagneticButton from './MagneticButton'
import type { SanitySiteSettings } from '@/lib/types'

const ease = [0.33, 1, 0.68, 1] as const

interface FooterProps {
  siteSettings?: SanitySiteSettings | null
}

export default function Footer({ siteSettings }: FooterProps = {}) {
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
          <h2 className="font-heading display-text text-cream/10 leading-none select-none" style={{ opacity: 0.1 }}>
            Rack N Roll
          </h2>
        </motion.div>

        {/* Info row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-3">
              Location
            </span>
            <p className="text-cream/40 text-sm leading-relaxed whitespace-pre-line">
              {siteSettings?.address ?? '2040 W 38th St, Erie, PA 16508'}
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
              {siteSettings?.hours ?? 'Tue–Sat: 3pm–2am'}<br />
              Karaoke: 9:30pm–1:30am
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
          >
            <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-3">
              Explore
            </span>
            <div className="flex flex-col gap-2">
              <Link
                href="/events"
                className="text-cream/40 text-sm hover:text-green transition-colors duration-300"
              >
                Events & Specials
              </Link>
              <Link
                href="/menu"
                className="text-cream/40 text-sm hover:text-green transition-colors duration-300"
              >
                Full Menu
              </Link>
              <Link
                href="/gallery"
                className="text-cream/40 text-sm hover:text-green transition-colors duration-300"
              >
                Gallery
              </Link>
            </div>
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
            <div className="flex flex-col gap-3">
              <MagneticButton
                href={`tel:${(siteSettings?.phone ?? '(814) 864-3535').replace(/[^+\d]/g, '')}`}
                className="text-cream/40 text-sm hover:text-green transition-colors duration-300"
                strength={0.15}
              >
                {siteSettings?.phone ?? '(814) 864-3535'}
              </MagneticButton>
              <MagneticButton
                href="https://www.facebook.com/profile.php?id=100053614732579"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold transition-colors duration-300 shadow-lg shadow-[#1877F2]/20"
                strength={0.15}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Follow on Facebook
              </MagneticButton>
            </div>
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
          <motion.a
            href="https://straywebdesign.co"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-cream/10 text-xs tracking-wider hover:text-green transition-colors duration-300"
          >
            Built by Stray Web Design
          </motion.a>
        </div>
      </div>
    </footer>
  )
}
