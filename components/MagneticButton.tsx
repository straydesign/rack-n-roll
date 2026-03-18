'use client'

import { useRef, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  href?: string
  strength?: number
  onClick?: () => void
}

const springConfig = { stiffness: 250, damping: 15, mass: 0.5 }

export default function MagneticButton({
  children,
  className = '',
  href,
  strength = 0.3,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, springConfig)
  const springY = useSpring(my, springConfig)

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    mx.set((e.clientX - left - width / 2) * strength)
    my.set((e.clientY - top - height / 2) * strength)
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={`magnetic ${className}`}
    >
      {children}
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {inner}
      </a>
    )
  }

  // Wrap in native <button> so it's focusable and keyboard-activatable
  return (
    <button type="button" onClick={onClick} className="appearance-none bg-transparent border-none p-0 cursor-pointer">
      {inner}
    </button>
  )
}
