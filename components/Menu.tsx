'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { menu } from '@/data/events'
import TextReveal from './TextReveal'

const ease = [0.33, 1, 0.68, 1] as const

const categoryIcons: Record<string, string> = {
  Wings: '🍗',
  'From the Grill': '🔥',
  Pizza: '🍕',
}

export default function Menu() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeCategory, setActiveCategory] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={sectionRef} className="relative px-6 py-28 md:py-40 overflow-hidden">
      <motion.div
        style={{ y: parallaxY }}
        className="absolute top-0 left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green/[0.03] blur-[120px] pointer-events-none"
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Tag */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center"
        >
          The Grub
        </motion.span>

        <TextReveal
          text="Bar food. Done right."
          className="font-heading heading-text text-charcoal text-center mb-4"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center text-charcoal/40 mb-16 text-sm"
        >
          Kitchen cranking until 11pm &middot; Nothing fancy, everything good
        </motion.p>

        {/* Category tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {menu.map((cat, i) => (
            <motion.button
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              onClick={() => setActiveCategory(i)}
              className={`relative px-6 py-3 rounded-full text-sm font-bold tracking-wider transition-all duration-500
                ${activeCategory === i
                  ? 'bg-charcoal text-cream glow-green'
                  : 'bg-charcoal/[0.04] text-charcoal/50 hover:text-charcoal hover:bg-charcoal/[0.08]'
                }`}
            >
              <span className="mr-2">{categoryIcons[cat.category]}</span>
              {cat.category}
              {activeCategory === i && (
                <motion.div
                  layoutId="menu-tab"
                  className="absolute inset-0 bg-charcoal rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Menu items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease }}
            className="max-w-lg mx-auto"
          >
            <div className="space-y-1">
              {menu[activeCategory].items.map((item, ii) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: ii * 0.08, ease }}
                  className="group flex items-start gap-4 p-5 rounded-xl hover:bg-charcoal/[0.03] transition-all duration-300"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-charcoal text-lg group-hover:text-green transition-colors duration-300">
                      {item.name}
                    </h4>
                    {item.description && (
                      <p className="text-charcoal/40 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full border border-charcoal/5 flex items-center justify-center flex-shrink-0 mt-1 group-hover:border-green/30 group-hover:bg-green/5 transition-all duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-charcoal/15 group-hover:bg-green transition-colors duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom tag */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <span className="inline-block px-5 py-2 rounded-full border border-charcoal/8 text-charcoal/30 text-xs tracking-wider">
            $0.50 boneless wings on Wednesdays
          </span>
        </motion.div>
      </div>
    </section>
  )
}
