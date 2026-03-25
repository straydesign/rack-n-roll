'use client'

import type { ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  href?: string
  strength?: number
  onClick?: () => void
}

export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
}: MagneticButtonProps) {
  const inner = (
    <div className={className}>
      {children}
    </div>
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
