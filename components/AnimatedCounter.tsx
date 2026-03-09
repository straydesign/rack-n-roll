'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 25,
    duration: duration * 1000,
  })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, motionValue, value])

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      const rounded = Math.round(latest)
      if (value >= 1000) {
        // Format as "20K" style
        const k = latest / 1000
        setDisplay(k >= 1 ? `${Math.round(k)}K` : `${rounded}`)
      } else {
        setDisplay(`${rounded}`)
      }
    })
    return unsubscribe
  }, [spring, value])

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}
