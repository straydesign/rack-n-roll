'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import TextReveal from './TextReveal'
import AnimatedCounter from './AnimatedCounter'

const stats: { value: number; display: string; label: string; suffix: string; prefix: string; static?: boolean }[] = [
  { value: 35, display: '35+', label: 'Years Running', suffix: '+', prefix: '' },
  { value: 20000, display: '20K+', label: 'Songs on KaraFun', suffix: '+', prefix: '' },
  { value: 5, display: '5', label: 'Nights a Week', suffix: '', prefix: '' },
  { value: 1989, display: "'89", label: 'Since \'89', suffix: '', prefix: '', static: true },
]

const features = [
  {
    title: 'Karaoke 5 Nights a Week',
    desc: '9:30pm to 1:30am. 20,000+ songs on KaraFun — search on your phone, queue up, and bring the house down. DJ Paul Amann keeps it moving.',
    accent: true,
  },
  {
    title: 'Great Drink Specials',
    desc: '$0.50 boneless wings on Wednesdays. Busch Light bucket — 4 for $10 every day. Always a good deal.',
    accent: false,
  },
  {
    title: 'Open Since 1989',
    desc: 'No cover. No dress code. No pretense. Just a neighborhood spot where everybody sings and the good times never stop.',
    accent: true,
  },
]

const ease = [0.33, 1, 0.68, 1] as const

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60])
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section ref={sectionRef} className="relative px-6 py-28 md:py-40 overflow-hidden">
      {/* Floating accent circles */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-green/[0.04] blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -bottom-32 -left-32 w-[300px] h-[300px] rounded-full bg-green/[0.03] blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section tag */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center"
        >
          The Vibe
        </motion.span>

        {/* Big text reveal */}
        <TextReveal
          text="The kind of bar that feels like home."
          className="font-heading display-text text-white text-center max-w-4xl mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="text-center text-white/50 mb-20 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
        >
          No cover. No dress code. Just a neighborhood spot where everybody
          sings, the drinks are cold, and the good times never stop.
        </motion.p>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
              className="text-center group"
            >
              <span className="font-heading text-5xl md:text-6xl lg:text-7xl text-white block leading-none group-hover:text-green transition-colors duration-700">
                {stat.static ? stat.display : <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />}
              </span>
              <span className="text-white/40 text-xs uppercase tracking-[0.2em] mt-3 block">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Feature cards — all side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease }}
              className={`relative overflow-hidden rounded-2xl p-8 md:p-10 group cursor-default
                ${f.accent
                  ? 'bg-charcoal text-cream'
                  : 'glass-light'
                }
                hover:scale-[1.01] transition-transform duration-500`}
            >
              {/* Glow on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${f.accent ? 'bg-gradient-to-br from-green/10 via-transparent to-transparent' : 'bg-gradient-to-br from-green/5 via-transparent to-transparent'}`} />

              <h3 className={`font-bold text-lg md:text-xl mb-3 relative z-10 ${f.accent ? 'text-cream' : 'text-white'} group-hover:text-green transition-colors duration-500`}>
                {f.title}
              </h3>
              <p className={`text-sm md:text-base leading-relaxed relative z-10 ${f.accent ? 'text-cream/60' : 'text-white/50'}`}>
                {f.desc}
              </p>

              {/* Corner accent */}
              {f.accent && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-green/10 rounded-bl-full pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
