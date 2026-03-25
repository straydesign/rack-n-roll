'use client'

import { Star } from 'lucide-react'
import TextReveal from './TextReveal'
import { reviews, googleFiveStarCount } from '@/data/events'

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-charcoal/20'}`}
        />
      ))}
    </div>
  )
}

export default function Reviews() {
  return (
    <section className="relative px-6 py-28 md:py-40 bg-charcoal text-cream overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Floating orbs */}
      <div
        className="absolute top-20 right-[-100px] w-[350px] h-[350px] rounded-full bg-green/[0.04] blur-[100px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section tag */}
        <span
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8 text-center"
        >
          What People Say
        </span>

        <TextReveal
          text="Don't take our word for it."
          className="font-heading display-text text-cream text-center max-w-4xl mx-auto mb-6"
        />

        {/* Google rating badge */}
        <div
          className="flex items-center justify-center gap-3 mb-16"
        >
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-cream/60 text-sm">
            {googleFiveStarCount}+ five-star reviews on Google
          </span>
        </div>

        {/* Review cards — asymmetric grid: featured + two stacked */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5">
          {reviews.map((review, i) => (
            <div
              key={review.name}
              className={`glass rounded-2xl p-7 group hover:scale-[1.02] active:scale-[0.98] transition-transform duration-500 relative
                ${i === 0 ? 'md:row-span-2 md:flex md:flex-col md:justify-center' : ''}`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-green/5 via-transparent to-transparent" />

              <Stars count={review.rating} />
              <p className={`text-cream/70 leading-relaxed mt-4 mb-5 relative z-10
                ${i === 0 ? 'text-base md:text-lg' : 'text-sm'}`}>
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-cream font-medium text-sm">{review.name}</span>
                <span className="text-cream/30 text-xs">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
