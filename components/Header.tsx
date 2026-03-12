'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type NavLink = {
  label: string
  href: string
  type: 'anchor' | 'page'
}

const links: NavLink[] = [
  { label: 'About', href: '#about', type: 'anchor' },
  { label: 'Schedule', href: '#events', type: 'anchor' },
  { label: 'Events', href: '/events', type: 'page' },
  { label: 'Menu', href: '/menu', type: 'page' },
  { label: 'Gallery', href: '/gallery', type: 'page' },
  { label: 'Find Us', href: '#info', type: 'anchor' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (link: NavLink) => {
    setMobileOpen(false)

    if (link.type === 'page') {
      router.push(link.href)
      return
    }

    // Anchor link
    if (isHome) {
      const el = document.querySelector(link.href)
      el?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/' + link.href)
    }
  }

  const handleLogoClick = () => {
    setMobileOpen(false)
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
  }

  const isActive = (link: NavLink) => {
    if (link.type === 'page') return pathname === link.href
    return false
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-charcoal/90 backdrop-blur-2xl border-b border-cream/[0.06] shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-12">
        {/* Logo */}
        <motion.button
          onClick={handleLogoClick}
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image src="/racknroll.svg" alt="Rack N Roll" width={150} height={150} className="h-28 w-auto md:h-32 -mt-2" />
        </motion.button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) =>
            link.type === 'page' ? (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] hover:text-green transition-colors duration-300 rounded-full ${
                  isActive(link)
                    ? 'text-green'
                    : scrolled
                      ? 'text-cream/70 hover:bg-cream/[0.06]'
                      : 'text-cream/40 hover:bg-cream/[0.04]'
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => handleClick(link)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] hover:text-green transition-colors duration-300 rounded-full ${
                  scrolled
                    ? 'text-cream/70 hover:bg-cream/[0.06]'
                    : 'text-cream/40 hover:bg-cream/[0.04]'
                }`}
              >
                {link.label}
              </button>
            )
          )}
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
            className={`block w-5 h-px ${scrolled ? 'bg-cream/80' : 'bg-cream/60'}`}
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className={`block w-5 h-px ${scrolled ? 'bg-cream/80' : 'bg-cream/60'}`}
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className={`block w-5 h-px ${scrolled ? 'bg-cream/80' : 'bg-cream/60'}`}
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
              {links.map((link, i) =>
                link.type === 'page' ? (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block text-left py-3 text-sm uppercase tracking-[0.15em] transition-colors border-b border-cream/[0.04] last:border-0 ${
                        isActive(link) ? 'text-green' : 'text-cream/60 hover:text-green'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    onClick={() => handleClick(link)}
                    className="text-left py-3 text-sm text-cream/60 uppercase tracking-[0.15em] hover:text-green transition-colors border-b border-cream/[0.04] last:border-0"
                  >
                    {link.label}
                  </motion.button>
                )
              )}
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
