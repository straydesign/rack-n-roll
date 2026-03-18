'use client'

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

const HEADER_OFFSET = 64

interface SectionEntry {
  id: string
  label: string
  element: HTMLElement
  excludeFromScrollSpy?: boolean
}

interface SectionRegistryValue {
  register: (
    id: string,
    label: string,
    element: HTMLElement,
    opts?: { excludeFromScrollSpy?: boolean }
  ) => void
  unregister: (id: string) => void
  activeId: string | null
  setActiveId: (id: string) => void
  getSections: () => SectionEntry[]
  getScrollSpySections: () => SectionEntry[]
  goNext: () => void
  goPrev: () => void
  suppressScrollSpyUntilRef: React.MutableRefObject<number>
}

const SectionRegistryContext = createContext<SectionRegistryValue | null>(null)

function sortByDomOrder(entries: SectionEntry[]): SectionEntry[] {
  return [...entries].sort((a, b) => {
    const pos = a.element.compareDocumentPosition(b.element)
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
}

export function SectionRegistryProvider({ children }: { children: ReactNode }) {
  const entriesRef = useRef<Map<string, SectionEntry>>(new Map())
  const [activeId, setActiveId] = useState<string | null>(null)
  const suppressScrollSpyUntilRef = useRef(0)

  // Mouse/touch scrolling clears keyboard nav suppression
  useEffect(() => {
    const clearSuppress = () => {
      suppressScrollSpyUntilRef.current = 0
    }
    window.addEventListener('wheel', clearSuppress, { passive: true })
    window.addEventListener('touchstart', clearSuppress, { passive: true })
    return () => {
      window.removeEventListener('wheel', clearSuppress)
      window.removeEventListener('touchstart', clearSuppress)
    }
  }, [])

  const register = useCallback(
    (
      id: string,
      label: string,
      element: HTMLElement,
      opts?: { excludeFromScrollSpy?: boolean }
    ) => {
      entriesRef.current.set(id, {
        id,
        label,
        element,
        excludeFromScrollSpy: opts?.excludeFromScrollSpy,
      })
    },
    []
  )

  const unregister = useCallback((id: string) => {
    entriesRef.current.delete(id)
  }, [])

  const getSections = useCallback(
    () => sortByDomOrder(Array.from(entriesRef.current.values())),
    []
  )

  const getScrollSpySections = useCallback(
    () => getSections().filter((s) => !s.excludeFromScrollSpy),
    [getSections]
  )

  const goNext = useCallback(() => {
    const sections = getSections()
    if (sections.length === 0) return
    const currentIndex = sections.findIndex((s) => s.id === activeId)
    const nextIndex =
      currentIndex < sections.length - 1 ? currentIndex + 1 : currentIndex
    const target = sections[nextIndex]
    if (!target) return
    suppressScrollSpyUntilRef.current = Date.now() + 60_000
    setActiveId(target.id)
    const top =
      target.element.getBoundingClientRect().top +
      window.scrollY -
      HEADER_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
    target.element.focus({ preventScroll: true })
  }, [activeId, getSections])

  const goPrev = useCallback(() => {
    const sections = getSections()
    if (sections.length === 0) return
    const currentIndex = sections.findIndex((s) => s.id === activeId)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0
    const target = sections[prevIndex]
    if (!target) return
    suppressScrollSpyUntilRef.current = Date.now() + 60_000
    setActiveId(target.id)
    const top =
      target.element.getBoundingClientRect().top +
      window.scrollY -
      HEADER_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
    target.element.focus({ preventScroll: true })
  }, [activeId, getSections])

  return (
    <SectionRegistryContext.Provider
      value={{
        register,
        unregister,
        activeId,
        setActiveId,
        getSections,
        getScrollSpySections,
        goNext,
        goPrev,
        suppressScrollSpyUntilRef,
      }}
    >
      {children}
    </SectionRegistryContext.Provider>
  )
}

export function useSectionRegistry() {
  const ctx = useContext(SectionRegistryContext)
  if (!ctx) {
    throw new Error('useSectionRegistry must be used within SectionRegistryProvider')
  }
  return ctx
}
