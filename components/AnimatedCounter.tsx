'use client'

import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, motionValue, value])

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (!ref.current) return
      const rounded = Math.round(latest)
      if (value >= 1000) {
        const k = latest / 1000
        ref.current.textContent = `${prefix}${k >= 1 ? `${Math.round(k)}K` : `${rounded}`}${suffix}`
      } else {
        ref.current.textContent = `${prefix}${rounded}${suffix}`
      }
    })
    return unsubscribe
  }, [spring, value, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
