'use client'

import { useState, useEffect } from 'react'

export default function Preloader() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1600)
    return () => clearTimeout(timer)
  }, [])

  // Lock scroll during preloader
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-charcoal flex items-center justify-center"
    >
      <div className="text-center">
        <h1
          className="font-heading text-4xl md:text-5xl tracking-tight text-cream"
        >
          Rack N Roll
        </h1>
        <div
          className="h-[2px] w-24 bg-green mx-auto mt-4 origin-left"
        />
        <p
          className="text-cream/30 text-xs uppercase tracking-[0.3em] mt-4"
        >
          Erie&apos;s Karaoke Bar Since &apos;89
        </p>
      </div>
    </div>
  )
}
