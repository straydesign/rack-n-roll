'use client'

import { useState, useEffect } from 'react'
import { Phone, MapPin } from 'lucide-react'

export default function MobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {visible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-charcoal/95 backdrop-blur-lg border-t border-cream/10 px-4 py-3 safe-area-bottom">
            <div className="flex gap-3">
              <a
                href="tel:+18148643535"
                className="flex-1 flex items-center justify-center gap-2 bg-green text-cream font-bold text-sm py-3 rounded-xl active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href="https://maps.google.com/?q=2040+W+38th+St,+Erie,+PA+16508"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border border-cream/20 text-cream font-bold text-sm py-3 rounded-xl active:scale-95 transition-transform"
              >
                <MapPin className="w-4 h-4" />
                Directions
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
