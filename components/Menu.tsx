'use client'

import { motion } from 'framer-motion'
import { menu } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const

export default function Menu() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="font-serif text-3xl md:text-5xl text-charcoal mb-4 text-center"
        >
          Grub
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center text-charcoal/50 mb-14 text-sm"
        >
          Bar food done right. Kitchen open until 11pm.
        </motion.p>

        <div className="grid gap-10 sm:grid-cols-3">
          {menu.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: ci * 0.1, ease }}
            >
              <h3 className="font-bold text-lg text-charcoal mb-5 pb-3 border-b-2 border-green/25">
                {cat.category}
              </h3>
              <ul className="space-y-4">
                {cat.items.map((item, ii) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: ci * 0.1 + ii * 0.08,
                      ease,
                    }}
                  >
                    <span className="font-medium text-charcoal">
                      {item.name}
                    </span>
                    {item.description && (
                      <p className="text-charcoal/45 text-sm mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
