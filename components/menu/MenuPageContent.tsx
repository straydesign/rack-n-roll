'use client'

import { useState, useRef, useCallback } from 'react'
import { menu as defaultMenu } from '@/data/events'
import type { MenuCategory } from '@/data/events'

interface MenuPageContentProps {
  menuData?: MenuCategory[]
}

export default function MenuPageContent({ menuData }: MenuPageContentProps) {
  const menu = menuData && menuData.length > 0 ? menuData : defaultMenu
  const [activeCategory, setActiveCategory] = useState(menu[0].category)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const activeIndex = menu.findIndex((c) => c.category === activeCategory)
  const activeItems = menu[activeIndex]?.items ?? []

  const focusTab = useCallback(
    (index: number) => {
      const clamped = ((index % menu.length) + menu.length) % menu.length
      setActiveCategory(menu[clamped].category)
      tabRefs.current[clamped]?.focus()
    },
    [menu]
  )

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        focusTab(index + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        focusTab(index - 1)
        break
      case 'Home':
        e.preventDefault()
        focusTab(0)
        break
      case 'End':
        e.preventDefault()
        focusTab(menu.length - 1)
        break
    }
  }

  return (
    <section className="relative px-6 py-16 md:py-24 bg-charcoal text-cream overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Category tabs — WAI-ARIA tablist */}
        <div role="tablist" aria-label="Menu categories" className="flex flex-wrap justify-center gap-3 mb-16">
          {menu.map((cat, i) => (
            <button
              key={cat.category}
              ref={(el) => { tabRefs.current[i] = el }}
              role="tab"
              id={`menu-tab-${i}`}
              aria-selected={activeCategory === cat.category}
              aria-controls={`menu-tabpanel-${i}`}
              tabIndex={activeCategory === cat.category ? 0 : -1}
              onClick={() => setActiveCategory(cat.category)}
              onKeyDown={(e) => handleTabKeyDown(e, i)}
              className={`relative px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${
                activeCategory === cat.category
                  ? 'text-charcoal bg-green'
                  : 'text-cream/50 hover:text-cream/80 border border-cream/10 hover:border-cream/20'
              }`}
            >
              <span className="relative z-10">{cat.category}</span>
            </button>
          ))}
        </div>

        {/* Menu items — tabpanel */}
        <div
          role="tabpanel"
          id={`menu-tabpanel-${activeIndex}`}
          aria-labelledby={`menu-tab-${activeIndex}`}
          className="space-y-1"
        >
          {activeItems.map((item) => (
            <div
              key={item.name}
              className="group flex items-start gap-4 p-5 rounded-xl hover:bg-cream/[0.03] transition-all duration-300"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-bold text-cream text-base md:text-lg group-hover:text-green transition-colors duration-300 truncate">
                    {item.name}
                  </h4>
                  {item.price && (
                    <span className="text-green font-bold text-sm md:text-base flex-shrink-0">
                      {item.price}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-cream/40 text-sm mt-1">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
