'use client'

import { usePathname } from 'next/navigation'
import SmoothScroll from '@/components/SmoothScroll'
import ScrollProgress from '@/components/ScrollProgress'
import AudioPlayer from '@/components/AudioPlayer'
import Preloader from '@/components/Preloader'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <>
      <Preloader />
      <SmoothScroll>
        <ScrollProgress />
        {children}
      </SmoothScroll>
      <AudioPlayer />
    </>
  )
}
