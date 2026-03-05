'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
}

export default function TextReveal({ text, className = '' }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.3'],
  })

  const words = text.split(' ')

  return (
    <div ref={containerRef}>
      <p className={className}>
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return (
            <Word key={`${word}-${i}`} range={[start, end]} progress={scrollYProgress}>
              {word}
            </Word>
          )
        })}
      </p>
    </div>
  )
}

function Word({
  children,
  range,
  progress,
}: {
  children: string
  range: [number, number]
  progress: MotionValue<number>
}) {
  const opacity = useTransform(progress, range, [0.15, 1])

  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.3em] will-change-[opacity]">
      {children}
    </motion.span>
  )
}
