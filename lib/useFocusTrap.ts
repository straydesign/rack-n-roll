import { useEffect, useRef, RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Traps Tab focus within a container while open.
 * Restores focus to the previously focused element on close.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, isOpen: boolean) {
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Store the element that had focus before the trap opened
    previousFocus.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Focus the first focusable element inside
    const focusableEls = container.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (focusableEls.length > 0) {
      focusableEls[0].focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus to the element that was focused before
      previousFocus.current?.focus()
    }
  }, [isOpen, containerRef])
}
