'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.33, 1, 0.68, 1] as const

export default function Preloader() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1600)
    return () => clearTimeout(timer)
  }, [])

  // Lock scroll during preloader
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          className="fixed inset-0 z-[200] bg-charcoal flex items-center justify-center"
        >
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="font-heading text-4xl md:text-5xl tracking-tight varsity-brand"
            >
              Rack N Roll
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              className="h-[2px] w-24 bg-green mx-auto mt-4 origin-left"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-cream/30 text-xs uppercase tracking-[0.3em] mt-4"
            >
              Erie&apos;s Karaoke Bar Since &apos;89
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
