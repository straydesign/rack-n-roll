'use client'

import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false })

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80])
  const bgOpacity = useTransform(scrollYProgress, [0.3, 0.9], [1, 0])

  return (
    <section ref={ref} className="h-screen relative">
      {/* 3D Background */}
      <motion.div className="fixed inset-0 z-0" style={{ opacity: bgOpacity }}>
        <Scene3D />
      </motion.div>

      {/* Text Overlay */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="uppercase tracking-[0.3em] text-green text-xs sm:text-sm font-medium mb-8"
        >
          Karaoke Capitol of the Great Lakes
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="font-serif text-5xl sm:text-6xl md:text-8xl text-cream mb-6 leading-[1.05]"
        >
          Since &rsquo;89.
          <br />
          Come as you are.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl text-cream/60 mb-14 max-w-md"
        >
          Rack N Roll &mdash; Erie&rsquo;s living room.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 text-xs sm:text-sm text-cream/35 tracking-wide"
        >
          <span>2040 W 38th St, Erie, PA</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>Mon&ndash;Sat, 3pm&ndash;2am</span>
          <span className="hidden sm:inline">&middot;</span>
          <a
            href="tel:+18148643535"
            className="hover:text-green transition-colors pointer-events-auto"
          >
            (814) 864-3535
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="text-cream/25 text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: 'easeInOut',
            }}
            className="w-px h-10 bg-gradient-to-b from-green/60 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
