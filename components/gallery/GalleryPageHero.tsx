'use client'

export default function GalleryPageHero() {
  return (
    <section
      className="relative min-h-[50vh] flex items-center justify-center px-6 py-28 md:py-40 overflow-hidden bg-charcoal text-cream"
    >
      <div className="noise absolute inset-0 pointer-events-none" />

      <div
        className="absolute top-10 left-[20%] w-[400px] h-[400px] rounded-full bg-green/[0.05] blur-[100px] pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-[15%] w-[300px] h-[300px] rounded-full bg-green/[0.03] blur-[80px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8"
        >
          The Scene
        </span>

        <h1
          className="font-heading display-text text-cream mb-6"
        >
          Good Times on Film
        </h1>

        <p
          className="text-cream/30 text-sm max-w-lg mx-auto"
        >
          Karaoke nights, cold drinks, and the best crowd in Erie.
        </p>
      </div>
    </section>
  )
}
