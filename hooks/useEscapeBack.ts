'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * On subpages, pressing Escape navigates back to home —
 * unless a dialog/modal is currently open.
 */
export function useEscapeBack() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/') return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return

      // Don't navigate back if a modal/dialog is open
      if (document.querySelector('[role="dialog"]')) return

      // Don't navigate back if mobile menu is open
      if (document.getElementById('mobile-menu')) return

      e.preventDefault()
      router.push('/')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pathname, router])
}
