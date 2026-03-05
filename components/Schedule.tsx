'use client'

import { motion } from 'framer-motion'
import { weeklySchedule } from '@/data/events'

const ease = [0.33, 1, 0.68, 1] as const

export default function Schedule() {
  return (
    <section className="px-6 py-20 md:py-28 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="font-serif text-3xl md:text-5xl text-charcoal mb-4 text-center"
      >
        Weekly Schedule
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-charcoal/50 mb-12 text-sm"
      >
        Karaoke every night &middot; DJ Paul Amann on the mic
      </motion.p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-charcoal/10">
              <th className="py-3 pr-4 font-bold text-charcoal">Day</th>
              <th className="py-3 pr-4 font-bold text-charcoal">Hours</th>
              <th className="py-3 pr-4 font-bold text-charcoal">Karaoke</th>
              <th className="py-3 font-bold text-charcoal">Specials</th>
            </tr>
          </thead>
          <tbody>
            {weeklySchedule.map((row, i) => (
              <motion.tr
                key={row.day}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                className="border-b border-charcoal/5"
              >
                <td className="py-4 pr-4 font-medium text-charcoal">
                  {row.day}
                </td>
                <td className="py-4 pr-4 text-charcoal/65">{row.hours}</td>
                <td className="py-4 pr-4 text-charcoal/65">{row.karaoke}</td>
                <td className="py-4 text-green font-semibold">
                  {row.special || '\u2014'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-charcoal/30 text-xs mt-6 text-center"
      >
        Closed Sundays
      </motion.p>
    </section>
  )
}
