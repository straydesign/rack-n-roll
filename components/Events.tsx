'use client'

import { motion } from 'framer-motion'
import { events } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const

export default function Events() {
  return (
    <section className="px-6 py-24 md:py-32 bg-darkgreen text-cream overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="font-serif text-3xl md:text-5xl mb-4 text-center"
        >
          What&rsquo;s Happening
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center text-cream/40 mb-14 text-sm"
        >
          Karaoke every night 9:30pm&ndash;1:30am &middot; Kitchen open until
          11pm
        </motion.p>

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease }}
                className="border border-cream/10 rounded-2xl p-8 bg-cream/[0.03] backdrop-blur-sm hover:border-green/40 hover:bg-cream/[0.06] transition-all duration-500 group"
              >
                <span className="text-green text-xs font-bold uppercase tracking-[0.2em]">
                  {event.date}
                </span>
                <h3 className="text-xl font-bold mt-3 mb-3 group-hover:text-green transition-colors duration-500">
                  {event.title}
                </h3>
                <p className="text-cream/50 text-sm leading-relaxed">
                  {event.description}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-cream/60 text-lg">
            Every night&rsquo;s a good night. Karaoke starts at 9:30pm.
          </p>
        )}
      </div>
    </section>
  )
}
