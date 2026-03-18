'use client'

import { useEffect, useRef, useCallback, type ReactNode, type KeyboardEvent, type CSSProperties } from 'react'
import { useSectionRegistry } from '@/context/SectionRegistryContext'

interface NavigableSectionProps {
  id: string
  label?: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  excludeFromScrollSpy?: boolean
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void
}

export function NavigableSection({
  id,
  label,
  children,
  className,
  style,
  excludeFromScrollSpy,
  onKeyDown: customKeyDown,
}: NavigableSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { register, unregister, activeId } = useSectionRegistry()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    register(id, label ?? id, el, { excludeFromScrollSpy })
    return () => unregister(id)
  }, [id, label, register, unregister, excludeFromScrollSpy])

  const isActive = activeId === id

  // Enter/Space activates the first link or button inside
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (customKeyDown) {
        customKeyDown(e)
        if (e.defaultPrevented) return
      }
      if (e.key === 'Enter' || e.key === ' ') {
        const el = ref.current
        if (!el) return
        const target = el.querySelector(
          'a, button, [role="link"], [role="button"]'
        ) as HTMLElement | null
        if (target && target !== e.target) {
          e.preventDefault()
          target.click()
        }
      }
    },
    [customKeyDown]
  )

  return (
    <section
      ref={ref}
      id={id}
      tabIndex={-1}
      className={className}
      data-nav-active={isActive || undefined}
      style={style}
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {children}
    </section>
  )
}
