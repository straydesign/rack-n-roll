'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type NavLink = {
  label: string
  href: string
  type: 'anchor' | 'page'
}

const links: NavLink[] = [
  { label: 'About', href: '#about', type: 'anchor' },
  { label: 'Events', href: '/events', type: 'page' },
  { label: 'Menu', href: '/menu', type: 'page' },
  { label: 'Gallery', href: '/gallery', type: 'page' },
  { label: 'Find Us', href: '#info', type: 'anchor' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileMenuFocusIndex, setMobileMenuFocusIndex] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'

  // Refs for desktop nav items (roving tabindex)
  const desktopNavRefs = useRef<(HTMLElement | null)[]>([])
  // Refs for mobile menu items
  const mobileNavRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const onScroll = () => {
      const shouldBeScrolled = window.scrollY > 60
      setScrolled((prev) => (prev === shouldBeScrolled ? prev : shouldBeScrolled))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape key closes mobile menu
  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  // Focus the active mobile menu item when index changes
  useEffect(() => {
    if (mobileOpen) {
      mobileNavRefs.current[mobileMenuFocusIndex]?.focus()
    }
  }, [mobileOpen, mobileMenuFocusIndex])

  const handleClick = useCallback(
    (link: NavLink) => {
      setMobileOpen(false)
      if (link.type === 'page') {
        router.push(link.href)
        return
      }
      if (isHome) {
        const el = document.querySelector(link.href)
        el?.scrollIntoView({ behavior: 'smooth' })
      } else {
        router.push('/' + link.href)
      }
    },
    [isHome, router]
  )

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

  // Desktop nav: Arrow Left/Right between items
  const handleDesktopNavKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      nextIndex = index < links.length - 1 ? index + 1 : 0
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      nextIndex = index > 0 ? index - 1 : links.length - 1
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = links.length - 1
    }
    if (nextIndex !== null) {
      desktopNavRefs.current[nextIndex]?.focus()
    }
  }

  // Mobile menu: Arrow Up/Down between items
  const handleMobileNavKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setMobileMenuFocusIndex(index < links.length - 1 ? index + 1 : 0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setMobileMenuFocusIndex(index > 0 ? index - 1 : links.length - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setMobileMenuFocusIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setMobileMenuFocusIndex(links.length - 1)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-charcoal/90 backdrop-blur-lg border-b border-cream/[0.06] shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14 md:h-12">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <Image
            src="/racknroll.svg"
            alt="Rack N Roll"
            width={150}
            height={150}
            className="h-[40px] w-auto md:h-[40px]"
          />
        </button>

        {/* Badge */}
        <span className="px-3 py-1 text-[9px] md:px-4 md:py-1.5 md:text-[12px] font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] text-white bg-green rounded-full whitespace-nowrap">
          Erie&rsquo;s Premier Karaoke Bar
        </span>

        {/* Desktop links — roving tabindex with Arrow Left/Right */}
        <div className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {links.map((link, i) =>
            link.type === 'page' ? (
              <Link
                key={link.label}
                ref={(el) => {
                  desktopNavRefs.current[i] = el
                }}
                href={link.href}
                onKeyDown={(e) => handleDesktopNavKeyDown(e, i)}
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
                ref={(el) => {
                  desktopNavRefs.current[i] = el
                }}
                onClick={() => handleClick(link)}
                onKeyDown={(e) => handleDesktopNavKeyDown(e, i)}
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
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => {
            setMobileOpen(!mobileOpen)
            if (!mobileOpen) setMobileMenuFocusIndex(0)
          }}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`block w-5 h-px transition-transform duration-300 ${scrolled ? 'bg-cream/80' : 'bg-cream/60'} ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`}
          />
          <span
            className={`block w-5 h-px transition-opacity duration-300 ${scrolled ? 'bg-cream/80' : 'bg-cream/60'} ${mobileOpen ? 'opacity-0' : 'opacity-100'}`}
          />
          <span
            className={`block w-5 h-px transition-transform duration-300 ${scrolled ? 'bg-cream/80' : 'bg-cream/60'} ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu — Arrow Up/Down navigation */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          className="md:hidden bg-charcoal/95 backdrop-blur-xl border-b border-cream/[0.06] overflow-hidden"
        >
          <div className="px-6 py-6 flex flex-col gap-1">
            {links.map((link, i) =>
              link.type === 'page' ? (
                <div key={link.label}>
                  <Link
                    ref={(el) => {
                      mobileNavRefs.current[i] = el
                    }}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    onKeyDown={(e) => handleMobileNavKeyDown(e, i)}
                    className={`block text-left py-3 text-sm uppercase tracking-[0.15em] transition-colors border-b border-cream/[0.04] last:border-0 ${
                      isActive(link) ? 'text-green' : 'text-cream/60 hover:text-green'
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              ) : (
                <div key={link.label}>
                  <button
                    ref={(el) => {
                      mobileNavRefs.current[i] = el
                    }}
                    onClick={() => handleClick(link)}
                    onKeyDown={(e) => handleMobileNavKeyDown(e, i)}
                    className="w-full text-left py-3 text-sm text-cream/60 uppercase tracking-[0.15em] hover:text-green transition-colors border-b border-cream/[0.04] last:border-0"
                  >
                    {link.label}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </header>
  )
}
