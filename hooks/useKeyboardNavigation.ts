'use client'

import { useEffect } from 'react'
import { useSectionRegistry } from '@/context/SectionRegistryContext'

const INTERACTIVE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

export function useKeyboardNavigation() {
  const { goNext, goPrev } = useSectionRegistry()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement

      // Don't hijack keyboard inside form fields or content-editable
      if (INTERACTIVE_TAGS.has(target.tagName) || target.isContentEditable) {
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev])
}
