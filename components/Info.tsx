'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import MagneticButton from './MagneticButton'

const ease = [0.33, 1, 0.68, 1] as const

const details = [
  {
    label: 'Address',
    value: '2040 W 38th St\nErie, PA 16508',
    href: 'https://maps.google.com/?q=2040+W+38th+St,+Erie,+PA+16508',
  },
  {
    label: 'Phone',
    value: '(814) 864-3535',
    href: 'tel:+18148643535',
  },
  {
    label: 'Hours',
    value: 'Mon–Sat: 3pm–2am\nWed opens early at 12pm\nClosed Sundays',
  },
]

const extras = [
  'Non-smoking inside',
  'Smoke porch out front',
  'Kitchen until 11pm',
  'Credit cards accepted',
  'Darts',
  '12 TVs',
]

export default function Info() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20])

  return (
    <section ref={sectionRef} className="relative px-6 py-28 md:py-40 overflow-hidden bg-charcoal text-cream">
      {/* Background noise */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Glow orb */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-green/[0.04] blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Tag */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center"
        >
          Find Us
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="font-heading heading-text text-cream text-center mb-20"
        >
          Come as you are.
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: Contact info */}
          <motion.div style={{ y: contentY }} className="space-y-10">
            {details.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
              >
                <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-3">
                  {d.label}
                </span>
                {d.href ? (
                  <a
                    href={d.href}
                    target={d.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-cream/80 text-lg md:text-xl whitespace-pre-line hover:text-green transition-colors duration-300 leading-relaxed"
                  >
                    {d.value}
                  </a>
                ) : (
                  <p className="text-cream/80 text-lg md:text-xl whitespace-pre-line leading-relaxed">
                    {d.value}
                  </p>
                )}
              </motion.div>
            ))}

            {/* Extras grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <span className="text-green text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">
                Good to Know
              </span>
              <div className="flex flex-wrap gap-2">
                {extras.map((e) => (
                  <span
                    key={e}
                    className="px-3 py-1.5 rounded-full border border-cream/8 text-cream/40 text-xs tracking-wide hover:border-green/20 hover:text-cream/60 transition-all duration-300"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease }}
            >
              <MagneticButton
                href="https://www.facebook.com/profile.php?id=100053614732579"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-cream/10 text-cream/60 text-sm hover:border-green/30 hover:text-green transition-all duration-300"
                strength={0.2}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Follow us on Facebook
                <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right: Photo + Map */}
          <motion.div style={{ y: imageY }} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
              className="relative rounded-2xl overflow-hidden h-[280px] group"
            >
              <Image
                src="/building.webp"
                alt="Rack N Roll exterior"
                fill
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-charcoal/60 backdrop-blur text-cream/80 text-xs">
                  2040 W 38th St, Erie
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease }}
              className="rounded-2xl overflow-hidden h-[280px] border border-cream/5"
            >
              <iframe
                title="Rack N Roll location"
                src="https://maps.google.com/maps?q=2040+W+38th+St,+Erie,+PA+16508&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(0.92) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
