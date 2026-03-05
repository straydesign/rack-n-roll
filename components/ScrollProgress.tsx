'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed right-0 top-0 bottom-0 w-[3px] bg-green origin-top z-50"
      style={{ scaleY }}
    />
  )
}
