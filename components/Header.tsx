'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Events', href: '#events' },
  { label: 'Menu', href: '#menu' },
  { label: 'Find Us', href: '#info' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-charcoal/70 backdrop-blur-xl border-b border-cream/[0.06] shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-serif text-lg text-cream/80 hover:text-cream transition-colors duration-300 tracking-tight"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Rack N Roll
        </motion.button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => handleClick(link.href)}
              className="px-4 py-2 text-xs font-medium text-cream/40 uppercase tracking-[0.15em] hover:text-green transition-colors duration-300 rounded-full hover:bg-cream/[0.04]"
            >
              {link.label}
            </button>
          ))}
          <a
            href="tel:+18148643535"
            className="ml-3 px-4 py-2 text-xs font-semibold text-green border border-green/20 rounded-full hover:bg-green/10 transition-all duration-300 uppercase tracking-wider"
          >
            Call Us
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-cream/60"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-px bg-cream/60"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-cream/60"
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="md:hidden bg-charcoal/95 backdrop-blur-xl border-b border-cream/[0.06] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => handleClick(link.href)}
                  className="text-left py-3 text-sm text-cream/60 uppercase tracking-[0.15em] hover:text-green transition-colors border-b border-cream/[0.04] last:border-0"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.a
                href="tel:+18148643535"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.05, duration: 0.3 }}
                className="mt-3 text-center py-3 text-sm font-semibold text-green border border-green/20 rounded-full hover:bg-green/10 transition-all uppercase tracking-wider"
              >
                (814) 864-3535
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
