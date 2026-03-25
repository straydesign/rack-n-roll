'use client'

export default function EventsPageHero() {
  return (
    <section
      className="relative min-h-[50vh] flex items-center justify-center px-6 py-28 md:py-40 overflow-hidden bg-charcoal text-cream"
    >
      {/* Noise texture */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Floating green orbs */}
      <div
        className="absolute top-10 right-[20%] w-[400px] h-[400px] rounded-full bg-green/[0.05] blur-[100px] pointer-events-none"
      />
      <div
        className="absolute bottom-0 left-[15%] w-[300px] h-[300px] rounded-full bg-green/[0.03] blur-[80px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8"
        >
          What&rsquo;s Happening
        </span>

        <h1
          className="font-heading display-text text-cream mb-6"
        >
          Events & Specials
        </h1>

        <p
          className="text-cream/30 text-sm max-w-lg mx-auto"
        >
          Karaoke Tue&ndash;Sat starting 9:30 PM &middot; Trivia &middot; Darts &middot; Kitchen open at 4 PM
        </p>
      </div>
    </section>
  )
}
