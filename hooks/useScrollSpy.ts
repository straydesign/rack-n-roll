'use client'

import { useEffect, useRef } from 'react'
import { useSectionRegistry } from '@/context/SectionRegistryContext'

export function useScrollSpy() {
  const { getScrollSpySections, setActiveId, suppressScrollSpyUntilRef } =
    useSectionRegistry()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const ratiosRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const thresholds = Array.from({ length: 11 }, (_, i) => i / 10)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Don't override keyboard navigation
        if (suppressScrollSpyUntilRef.current > Date.now()) return

        for (const entry of entries) {
          ratiosRef.current.set(entry.target.id, entry.intersectionRatio)
        }

        let bestId: string | null = null
        let bestRatio = 0
        ratiosRef.current.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        })

        if (bestId && bestRatio > 0) {
          setActiveId(bestId)
        }
      },
      {
        rootMargin: '-64px 0px 0px 0px',
        threshold: thresholds,
      }
    )

    return () => {
      observerRef.current?.disconnect()
    }
  }, [setActiveId, suppressScrollSpyUntilRef])

  // Observe / re-observe sections when they mount
  useEffect(() => {
    const observer = observerRef.current
    if (!observer) return

    const sections = getScrollSpySections()
    for (const section of sections) {
      observer.observe(section.element)
    }

    // Re-observe periodically to catch dynamically loaded sections
    const interval = setInterval(() => {
      observer.disconnect()
      ratiosRef.current.clear()
      const current = getScrollSpySections()
      for (const section of current) {
        observer.observe(section.element)
      }
    }, 2000)

    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [getScrollSpySections])
}
