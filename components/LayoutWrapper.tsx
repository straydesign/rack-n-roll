'use client'

import { useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import SmoothScroll from '@/components/SmoothScroll'
import ScrollProgress from '@/components/ScrollProgress'
import AudioPlayer from '@/components/AudioPlayer'
import Preloader from '@/components/Preloader'
import { SectionRegistryProvider, useSectionRegistry } from '@/context/SectionRegistryContext'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useEscapeBack } from '@/hooks/useEscapeBack'

/** Orchestrates section navigation + announces changes to screen readers */
function SectionNavigationOrchestrator() {
  useScrollSpy()
  useKeyboardNavigation()
  useEscapeBack()

  const { activeId, getSections } = useSectionRegistry()
  const announcementRef = useRef<HTMLDivElement>(null)
  const prevActiveRef = useRef<string | null>(null)

  useEffect(() => {
    if (activeId && activeId !== prevActiveRef.current && announcementRef.current) {
      const sections = getSections()
      const section = sections.find((s) => s.id === activeId)
      if (section) {
        announcementRef.current.textContent = `Navigated to ${section.label}`
      }
    }
    prevActiveRef.current = activeId
  }, [activeId, getSections])

  return (
    <div
      ref={announcementRef}
      role="status"
      aria-live="polite"
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
    />
  )
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <SectionRegistryProvider>
      <Preloader />
      <SmoothScroll>
        <ScrollProgress />
        <SectionNavigationOrchestrator />
        {children}
      </SmoothScroll>
      <AudioPlayer />
    </SectionRegistryProvider>
  )
}
