'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { allEvents, type EventCategory } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const

const tabs: { label: string; value: EventCategory }[] = [
  { label: 'Weekly Specials', value: 'weekly' },
  { label: 'Events', value: 'special' },
]

export default function EventsPageContent() {
  const [activeTab, setActiveTab] = useState<EventCategory>('weekly')

  const filtered = allEvents.filter((e) => e.category === activeTab)

  const featured = filtered.find((e) => e.featured)
  const rest = featured ? filtered.filter((e) => e !== featured) : filtered

  return (
    <section className="relative px-6 py-16 md:py-24 bg-charcoal text-cream overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${
                activeTab === tab.value
                  ? 'text-charcoal'
                  : 'text-cream/50 hover:text-cream/80 border border-cream/10 hover:border-cream/20'
              }`}
            >
              {activeTab === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-green rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease }}
          >
            {/* Featured event card */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 60, rotateX: 5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, ease }}
                className="group relative mb-6"
              >
                <div className="glass rounded-2xl p-8 md:p-12 border border-green/10 hover:border-green/25 transition-all duration-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green/[0.06] to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                    <div className="md:w-48 flex-shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-green/60 block mb-1">Featured</span>
                      <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                        {featured.date}
                      </span>
                      {featured.time && (
                        <span className="text-cream/30 text-xs block">{featured.time}</span>
                      )}
                      <div className="hidden md:block w-12 h-px bg-green/20 mt-3" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-cream mb-3 group-hover:text-green transition-colors duration-500">
                        {featured.title}
                      </h3>
                      <p className="text-cream/40 text-sm md:text-base leading-relaxed max-w-xl">
                        {featured.longDescription ?? featured.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Event cards */}
            <div className="space-y-4">
              {rest.map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 60, rotateX: 5 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease }}
                  className="group relative"
                >
                  <div className="glass rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 hover:border-green/20 transition-all duration-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="md:w-48 flex-shrink-0 relative z-10">
                      <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                        {event.date}
                      </span>
                      {event.time && (
                        <span className="text-cream/30 text-xs block">{event.time}</span>
                      )}
                      <div className="hidden md:block w-12 h-px bg-green/20 mt-3" />
                    </div>

                    <div className="flex-1 relative z-10">
                      <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-cream mb-3 group-hover:text-green transition-colors duration-500">
                        {event.title}
                      </h3>
                      <p className="text-cream/40 text-sm md:text-base leading-relaxed max-w-xl">
                        {event.longDescription ?? event.description}
                      </p>
                    </div>

                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-cream/10 group-hover:border-green/30 group-hover:bg-green/10 transition-all duration-500 flex-shrink-0 relative z-10">
                      <svg className="w-5 h-5 text-cream/30 group-hover:text-green transition-colors duration-500 group-hover:translate-x-0.5 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-cream/40 text-lg py-20">
                No events in this category yet. Check back soon!
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
