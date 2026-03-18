'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menu as defaultMenu } from '@/data/events'
import type { MenuCategory } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const

interface MenuPageContentProps {
  menuData?: MenuCategory[]
}

export default function MenuPageContent({ menuData }: MenuPageContentProps) {
  const menu = menuData && menuData.length > 0 ? menuData : defaultMenu
  const [activeCategory, setActiveCategory] = useState(menu[0].category)

  const activeItems = menu.find((c) => c.category === activeCategory)?.items ?? []

  return (
    <section className="relative px-6 py-16 md:py-24 bg-charcoal text-cream overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {menu.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`relative px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${
                activeCategory === cat.category
                  ? 'text-charcoal'
                  : 'text-cream/50 hover:text-cream/80 border border-cream/10 hover:border-cream/20'
              }`}
            >
              {activeCategory === cat.category && (
                <motion.div
                  layoutId="menuTab"
                  className="absolute inset-0 bg-green rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.category}</span>
            </button>
          ))}
        </div>

        {/* Menu items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease }}
            className="space-y-1"
          >
            {activeItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease }}
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
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
