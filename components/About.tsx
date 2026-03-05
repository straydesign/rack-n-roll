'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: 'Karaoke 7 Nights a Week',
    desc: '9:30pm to 1:30am. 20,000+ songs on KaraFun\u2009\u2014\u2009search, sing, repeat.',
  },
  {
    title: 'Cheap Drinks, Always',
    desc: '$2 pints on Wednesdays. Late night happy hour. No surprises on the tab.',
  },
  {
    title: 'Bar Food Done Right',
    desc: 'Wings, burgers, Philly cheesesteaks, fresh pizza. Kitchen until 11pm.',
  },
  {
    title: 'Open Since 1989',
    desc: '35+ years of good times. Still here. Still loud. Still your place.',
  },
]

const ease = [0.33, 1, 0.68, 1] as const

export default function About() {
  return (
    <section className="px-6 py-24 md:py-32 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease }}
        className="font-serif text-4xl md:text-6xl text-charcoal mb-6 text-center leading-tight"
      >
        The kind of bar
        <br />
        that feels like home.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="text-center text-charcoal/60 mb-16 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
      >
        No cover. No dress code. Just a neighborhood spot where everybody
        sings, the drinks are cheap, and the good times never stop.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease }}
            className="border border-charcoal/8 rounded-2xl p-7 hover:border-green/30 transition-all duration-500 hover:shadow-lg hover:shadow-green/5 group"
          >
            <h3 className="font-bold text-lg text-charcoal mb-2 group-hover:text-green transition-colors duration-500">
              {f.title}
            </h3>
            <p className="text-charcoal/55 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
