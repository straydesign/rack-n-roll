'use client'

const words = [
  'KARAOKE',
  'DRINK SPECIALS',
  'GOOD TIMES',
  'SINCE \'89',
  '20,000+ SONGS',
  'ERIE PA',
  'NO COVER',
  'NO DRESS CODE',
]

export default function Marquee() {
  const text = words.map((w) => w + ' · ').join('')

  return (
    <div className="relative overflow-hidden bg-green">
      {/* Top line */}
      <div className="h-px bg-cream/10" />

      <div className="py-5 sm:py-6">
        {/* Row 1 — left (CSS animation) */}
        <div className="flex whitespace-nowrap mb-1 animate-marquee-left will-change-transform">
          {[...Array(6)].map((_, i) => (
            <span
              key={`a-${i}`}
              className="text-cream/90 text-sm sm:text-base md:text-lg font-bold tracking-[0.15em]"
            >
              {text}
            </span>
          ))}
        </div>

        {/* Row 2 — right (CSS animation) */}
        <div className="flex whitespace-nowrap animate-marquee-right will-change-transform">
          {[...Array(6)].map((_, i) => (
            <span
              key={`b-${i}`}
              className="text-cream/40 text-[10px] sm:text-xs tracking-[0.25em] uppercase"
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="h-px bg-cream/10" />
    </div>
  )
}
