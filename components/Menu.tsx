'use client'

import Link from 'next/link'
import { menuPreview } from '@/data/events'
import TextReveal from './TextReveal'

export default function Menu() {
  return (
    <section className="relative px-6 py-28 md:py-40 overflow-hidden">
      <div
        className="absolute top-0 left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green/[0.03] blur-[120px] pointer-events-none"
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Tag */}
        <span
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center"
        >
          The Grub
        </span>

        <TextReveal
          text="Bar food. Done right."
          className="font-heading heading-text text-white text-center mb-4"
        />

        <p
          className="text-center text-white/40 mb-16 text-sm"
        >
          Kitchen opens at 4 PM &middot; Nothing fancy, everything good
        </p>

        {/* Preview items — no tabs, just the hits */}
        <div className="max-w-lg mx-auto space-y-1">
          {menuPreview.map((item) => (
            <div
              key={item.name}
              className="group flex items-start gap-4 p-5 rounded-xl hover:bg-charcoal/[0.03] transition-all duration-300"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-bold text-white text-base md:text-lg group-hover:text-green transition-colors duration-300 truncate">
                    {item.name}
                  </h4>
                  {item.price && (
                    <span className="text-green font-bold text-sm md:text-base flex-shrink-0">{item.price}</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-white/40 text-sm mt-1">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View Full Menu button */}
        <div
          className="text-center mt-12"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold text-white border border-charcoal/15 rounded-full hover:bg-charcoal hover:text-cream transition-all duration-300 uppercase tracking-wider group"
          >
            View Full Menu
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
